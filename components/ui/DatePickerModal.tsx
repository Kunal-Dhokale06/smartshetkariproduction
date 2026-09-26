import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { useLanguage } from '../../locales/languageContext';

const MONTH_NAMES_MAP: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  mr: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
};

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_NAMES_MAP: Record<string, string[]> = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

export function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  const parts = dateStr.trim().split(/[\s-]+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_SHORT.findIndex(
      (m) => m.toLowerCase() === parts[1].toLowerCase() || parts[1].toLowerCase().startsWith(m.toLowerCase())
    );
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDateToDisplay(date: Date): string {
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day} ${month} ${year}`;
}

interface DatePickerModalProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSelectDate: (formattedDate: string) => void;
  title?: string;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  value,
  onClose,
  onSelectDate,
  title,
}) => {
  const { t, language } = useLanguage();
  const initialDate = parseDateString(value);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = MONTH_NAMES_MAP[language] || MONTH_NAMES_MAP.en;
  const dayNames = DAY_NAMES_MAP[language] || DAY_NAMES_MAP.en;

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonthDate(today);
  };

  const handleConfirm = () => {
    onSelectDate(formatDateToDisplay(selectedDate));
    onClose();
  };

  // Generate days matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { dayNumber: number; isCurrentMonth: boolean; dateObj: Date }[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    days.push({
      dayNumber: dayNum,
      isCurrentMonth: false,
      dateObj: new Date(year, month - 1, dayNum),
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateObj: new Date(year, month, i),
    });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateObj: new Date(year, month + 1, i),
      });
    }
  }

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (d: Date) => {
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.calendarCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <CalendarIcon size={20} color={colors.primaryGreen} />
              <Text style={styles.title}>{title || t('selectDate')}</Text>
            </View>
            <TouchableOpacity style={styles.closeIconBtn} onPress={onClose}>
              <X size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Selected Date Banner */}
          <View style={styles.selectedBanner}>
            <Text style={styles.selectedBannerLabel}>{t('selectedDate')}</Text>
            <Text style={styles.selectedBannerValue}>{formatDateToDisplay(selectedDate)}</Text>
          </View>

          {/* Month & Year Navigation */}
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth} activeOpacity={0.7}>
              <ChevronLeft size={20} color={colors.primaryText} />
            </TouchableOpacity>

            <Text style={styles.monthYearText}>
              {monthNames[month]} {year}
            </Text>

            <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth} activeOpacity={0.7}>
              <ChevronRight size={20} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Day Names Header Row */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((d, index) => (
              <Text
                key={d}
                style={[
                  styles.dayNameText,
                  index === 0 && { color: colors.danger },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {days.map((item, idx) => {
              const selected = isSelected(item.dateObj);
              const today = isToday(item.dateObj);

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                    today && !selected && styles.dayCellToday,
                  ]}
                  onPress={() => {
                    setSelectedDate(item.dateObj);
                    if (!item.isCurrentMonth) {
                      setCurrentMonthDate(item.dateObj);
                    }
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      !item.isCurrentMonth && styles.dayCellOtherMonth,
                      today && !selected && styles.dayCellTodayText,
                      selected && styles.dayCellSelectedText,
                    ]}
                  >
                    {item.dayNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Action Today Button */}
          <View style={styles.todayRow}>
            <TouchableOpacity style={styles.todayBtn} onPress={handleSelectToday} activeOpacity={0.8}>
              <Text style={styles.todayBtnText}>{t('today')} ({formatDateToDisplay(new Date())})</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
              <Check size={16} color={colors.white} />
              <Text style={styles.confirmBtnText}>{t('setDate')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  closeIconBtn: {
    padding: 4,
  },
  selectedBanner: {
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  selectedBannerLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  selectedBannerValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthYearText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayNameText: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.secondaryText,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 6,
    marginBottom: spacing.sm,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellText: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  dayCellOtherMonth: {
    color: '#D1D5DB',
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    backgroundColor: colors.lightGreen,
  },
  dayCellTodayText: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  dayCellSelected: {
    backgroundColor: colors.primaryGreen,
    ...shadows.sm,
  },
  dayCellSelectedText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  todayRow: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  todayBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayBtnText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.primaryGreen,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  confirmBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
});
