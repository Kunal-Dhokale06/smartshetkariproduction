import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  BackHandler,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Mic, MicOff, BookOpen } from 'lucide-react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { DateField } from '../components/ui/DateField';
import { CropDropdown } from '../components/ui/CropDropdown';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { saveDiaryNote, getDiaryNotes } from '../services/diaryStorage';
import { voiceNoteService } from '../services/voiceNoteService';
import { useCropsStore } from '../data/cropsStore';
import { useLanguage } from '../locales/languageContext';

function getFormattedTodayDate(): string {
  const today = new Date();
  const day = today.getDate();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  return `${day < 10 ? '0' + day : day} ${month} ${year}`;
}

export default function AddDiaryNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ noteId?: string }>();
  const { t } = useLanguage();
  const { crops } = useCropsStore();

  const [content, setContent] = useState('');
  const [crop, setCrop] = useState<string>(crops.length > 0 ? crops[0].name : '');
  const [date, setDate] = useState(getFormattedTodayDate());
  const [source, setSource] = useState<'voice' | 'text'>('text');
  const [isRecording, setIsRecording] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleClose = () => {
    if (isRecording) {
      voiceNoteService.stop();
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/diary');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isRecording]);

  useEffect(() => {
    if (params.noteId) {
      getDiaryNotes().then((notes) => {
        const found = notes.find((n) => n.id === params.noteId);
        if (found) {
          setContent(found.content);
          setCrop(found.crop);
          setDate(found.date);
          setSource(found.source);
        }
      });
    }
  }, [params.noteId]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isRecording]);

  const handleToggleVoice = () => {
    if (isRecording) {
      voiceNoteService.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setSource('voice');
      voiceNoteService.start({
        onStart: () => setIsRecording(true),
        onResult: (transcript) => {
          setContent((prev) => {
            if (!prev.trim()) return transcript;
            return `${prev}\n${transcript}`;
          });
        },
        onEnd: () => setIsRecording(false),
        onError: (err) => {
          setIsRecording(false);
          Alert.alert('Voice Note Error', err);
        },
      });
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert(t('validationError'), t('enterNoteError'));
      return;
    }

    await saveDiaryNote({
      id: params.noteId,
      content: content.trim(),
      crop,
      date: date.trim() || getFormattedTodayDate(),
      source,
    });

    if (isRecording) {
      voiceNoteService.stop();
    }

    handleClose();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title={params.noteId ? t('editDiaryNote') : t('addDiaryNote')}
        leftIcon={<X size={24} color={colors.primaryText} />}
        onLeftPress={handleClose}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formHeader}>
            <View style={styles.iconCircle}>
              <BookOpen size={32} color={colors.primaryGreen} />
            </View>
            <Text style={styles.formTitle}>
              {params.noteId ? t('editFarmNote') : t('recordActivity')}
            </Text>
            <Text style={styles.formSubtitle}>
              {t('logObservationsSubtitle')}
            </Text>
          </View>

          {/* Interactive Date Field Calendar Picker */}
          <DateField
            label={`${t('dateLabel')} *`}
            value={date}
            onChangeDate={setDate}
            helperText={t('dateCalendarHelper')}
          />

          {/* Crop Selector Dropdown */}
          <CropDropdown
            label={`${t('selectCrop')} *`}
            value={crop}
            onChange={setCrop}
            includeGeneral
          />

          {/* Voice Input Controls Bar */}
          <View style={styles.noteInputHeader}>
            <Text style={styles.fieldLabel}>{t('noteDescription')} *</Text>

            <TouchableOpacity
              style={[styles.voiceBtn, isRecording && styles.activeVoiceBtn]}
              onPress={handleToggleVoice}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                {isRecording ? (
                  <MicOff size={16} color={colors.white} />
                ) : (
                  <Mic size={16} color={colors.primaryGreen} />
                )}
              </Animated.View>
              <Text style={[styles.voiceBtnText, isRecording && styles.activeVoiceBtnText]}>
                {isRecording ? t('listening') : `🎤 ${t('voiceNote')}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Multiline Text Area */}
          <View style={[styles.textAreaWrapper, isRecording && styles.recordingTextAreaBorder]}>
            <TextInput
              style={styles.textArea}
              placeholder={t('writeFarmingActivity')}
              placeholderTextColor={colors.mutedText}
              multiline
              numberOfLines={6}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                if (source !== 'voice') setSource('text');
              }}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <SecondaryButton
              title={t('cancel')}
              onPress={() => router.back()}
              style={styles.actionCol}
            />
            <PrimaryButton
              title={t('save')}
              onPress={handleSave}
              style={styles.actionCol}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formHeader: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  formSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  noteInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    gap: spacing.xs,
  },
  activeVoiceBtn: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  voiceBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  activeVoiceBtnText: {
    color: colors.white,
  },
  textAreaWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 140,
  },
  recordingTextAreaBorder: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  textArea: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.primaryText,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionCol: {
    flex: 1,
  },
});
