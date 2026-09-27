import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Menu, Plus, BookOpen, Edit3, Trash2, Mic, FileText, Calendar, Sprout } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { DiaryNote } from '../../types';
import { getDiaryNotes, deleteDiaryNote, subscribeToDiary } from '../../services/diaryStorage';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { confirmAction, safeNavigate } from '../../utils';

interface DiaryItemProps {
  note: DiaryNote;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  formatCropName: (cropName: string) => string;
  editLabel: string;
  deleteLabel: string;
  cropLabel: string;
  voiceNoteLabel: string;
  textNoteLabel: string;
}

const DiaryItem = memo(
  ({
    note,
    onEdit,
    onDelete,
    formatCropName,
    editLabel,
    deleteLabel,
    cropLabel,
    voiceNoteLabel,
    textNoteLabel,
  }: DiaryItemProps) => {
    const firstLine = note.content.split('\n')[0];
    const summaryTitle =
      firstLine.length > 50 ? `${firstLine.substring(0, 50)}...` : firstLine;

    return (
      <View style={styles.noteCard}>
        {/* Card Header Row */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.dateGroup}>
            <Calendar size={18} color={colors.primaryGreen} />
            <Text style={styles.dateText}>{note.date}</Text>
          </View>

          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onEdit(note.id)}
              activeOpacity={0.7}
            >
              <Edit3 size={18} color={colors.primaryGreen} />
              <Text style={styles.editBtnText}>{editLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(note.id)}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color={colors.danger} />
              <Text style={styles.deleteBtnText}>{deleteLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary & Content */}
        <Text style={styles.noteTitle}>{summaryTitle}</Text>
        <Text style={styles.noteDescription}>{note.content}</Text>

        {/* Footer Badges Row */}
        <View style={styles.cardFooterRow}>
          <View style={styles.cropBadge}>
            <Sprout size={16} color={colors.primaryGreen} />
            <Text style={styles.cropBadgeText}>
              {cropLabel}: {formatCropName(note.crop)}
            </Text>
          </View>

          <View
            style={[
              styles.sourceBadge,
              note.source === 'voice' ? styles.voiceSourceBg : styles.textSourceBg,
            ]}
          >
            {note.source === 'voice' ? (
              <Mic size={16} color={colors.primaryGreen} />
            ) : (
              <FileText size={16} color={colors.secondaryText} />
            )}
            <Text
              style={[
                styles.sourceBadgeText,
                note.source === 'voice' ? styles.voiceSourceText : styles.textSourceText,
              ]}
            >
              {note.source === 'voice' ? voiceNoteLabel : textNoteLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

DiaryItem.displayName = 'DiaryItem';

export default function DiaryScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [notes, setNotes] = useState<DiaryNote[]>([]);

  // Load notes whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getDiaryNotes().then((data) => {
        if (isMounted) setNotes(data);
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Auto-refresh when crops are deleted or restored
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeToDiary(() => {
      getDiaryNotes().then((data) => {
        if (isMounted) setNotes(data);
      });
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleAddNote = useCallback(() => {
    safeNavigate(() => router.push('/add-diary-note'));
  }, [router]);

  const handleEditNote = useCallback(
    (noteId: string) => {
      safeNavigate(() =>
        router.push({
          pathname: '/add-diary-note',
          params: { noteId },
        })
      );
    },
    [router]
  );

  const handleDeleteNote = useCallback(
    (noteId: string) => {
      confirmAction(
        t('deleteNoteConfirmTitle'),
        t('deleteNoteConfirmMessage'),
        async () => {
          await deleteDiaryNote(noteId);
          const updated = await getDiaryNotes();
          setNotes(updated);
        },
        t('cancel'),
        t('delete')
      );
    },
    [t]
  );

  const formatCropName = useCallback(
    (cropName: string): string => {
      const key = cropName.toLowerCase() as TranslationKey;
      const translated = t(key);
      return translated !== key ? translated : cropName;
    },
    [t]
  );

  const renderDiaryItem = useCallback(
    ({ item }: { item: DiaryNote }) => (
      <DiaryItem
        note={item}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        formatCropName={formatCropName}
        editLabel={t('edit')}
        deleteLabel={t('delete')}
        cropLabel={t('cropLabel')}
        voiceNoteLabel={t('voiceNote')}
        textNoteLabel={t('textNote')}
      />
    ),
    [handleEditNote, handleDeleteNote, formatCropName, t]
  );

  const keyExtractor = useCallback((item: DiaryNote) => item.id, []);

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        title={t('noDiaryNotesYet')}
        description={t('diaryEmptyDescription')}
        actionTitle={`+ ${t('addNote')}`}
        onActionPress={handleAddNote}
        icon={<BookOpen size={48} color={colors.primaryGreen} />}
      />
    ),
    [t, handleAddNote]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={28} color={colors.primaryText} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('diary')}</Text>

        <TouchableOpacity style={styles.addNoteButton} onPress={handleAddNote} activeOpacity={0.8}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addNoteText}>+ {t('addNote')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={keyExtractor}
        renderItem={renderDiaryItem}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  addNoteButton: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  addNoteText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + 20,
  },
  listContainer: {
    gap: spacing.md + 2,
  },
  noteCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: spacing.lg + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  editBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  noteTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  noteDescription: {
    fontSize: fontSize.md,
    color: colors.secondaryText,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  cropBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  sourceBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  voiceSourceBg: {
    backgroundColor: '#DCFCE7',
  },
  textSourceBg: {
    backgroundColor: '#F3F4F6',
  },
  voiceSourceText: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  textSourceText: {
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
});
