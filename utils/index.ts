import { Platform, Alert } from 'react-native';
import { colors } from '../theme/colors';

export function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

export function getStatusColors(status: 'Growing' | 'Harvested') {
  if (status === 'Growing') {
    return {
      bg: colors.growingBadgeBg,
      text: colors.growingBadgeText,
    };
  }
  return {
    bg: colors.harvestedBadgeBg,
    text: colors.harvestedBadgeText,
  };
}

export function formatPercentage(value: number): string {
  const prefix = value > 0 ? '↑' : '↓';
  return `${prefix} ${Math.abs(value)}%`;
}

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void,
  cancelText = 'Cancel',
  confirmText = 'Delete'
) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) {
        onConfirm();
      }
    } else {
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel' },
        { text: confirmText, style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  }
}

let lastNavTime = 0;
export function safeNavigate(action: () => void, throttleMs = 500) {
  const now = Date.now();
  if (now - lastNavTime < throttleMs) return;
  lastNavTime = now;
  action();
}
