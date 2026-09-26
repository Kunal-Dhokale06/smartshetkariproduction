import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { DatePickerModal } from './DatePickerModal';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { useLanguage } from '../../locales/languageContext';

interface DateFieldProps {
  label: string;
  value: string;
  onChangeDate: (newDate: string) => void;
  error?: string;
  helperText?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChangeDate,
  error,
  helperText,
}) => {
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.fieldWrapper, error ? styles.fieldError : null]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.leftContent}>
          <View style={styles.iconBox}>
            <Calendar size={18} color={colors.primaryGreen} />
          </View>
          <Text style={[styles.dateText, !value && styles.placeholderText]}>
            {value || t('selectDate')}
          </Text>
        </View>

        <View style={styles.calendarPill}>
          <Text style={styles.calendarPillText}>{t('change')}</Text>
        </View>
      </TouchableOpacity>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      {/* Interactive Calendar Modal */}
      <DatePickerModal
        visible={modalVisible}
        value={value}
        onClose={() => setModalVisible(false)}
        onSelectDate={onChangeDate}
        title={label.replace('*', '').trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fieldError: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  placeholderText: {
    color: colors.mutedText,
  },
  calendarPill: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarPillText: {
    fontSize: 11,
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },
});
