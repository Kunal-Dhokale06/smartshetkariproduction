import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheetContainer, contentStyle]}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '80%',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  content: {
    paddingVertical: spacing.sm,
  },
});
