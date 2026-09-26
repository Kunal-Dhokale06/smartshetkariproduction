import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Search size={18} color={colors.secondaryText} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearBtn}
        >
          <X size={16} color={colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: fontSize.sm,
    color: colors.primaryText,
  },
  clearBtn: {
    padding: spacing.xs,
  },
});
