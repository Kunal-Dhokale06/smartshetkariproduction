import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, contentStyle]}>
              <View style={styles.header}>
                {title ? <Text style={styles.title}>{title}</Text> : <View />}
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>

              <View style={styles.body}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  body: {
    paddingVertical: spacing.xs,
  },
});
