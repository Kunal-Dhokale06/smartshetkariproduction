import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { colors, fontSize, fontWeight } from '../../theme';

export interface AvatarProps {
  name?: string;
  sourceUri?: string;
  size?: number;
  badge?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  sourceUri,
  size = 44,
  badge = false,
  style,
}) => {
  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {sourceUri ? (
        <Image
          source={{ uri: sourceUri }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : name ? (
        <View
          style={[
            styles.initialsContainer,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.defaultContainer,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Sprout size={size * 0.5} color={colors.primaryGreen} />
        </View>
      )}

      {badge && (
        <View style={[styles.badgeDot, { bottom: 0, right: 0 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    backgroundColor: colors.border,
  },
  initialsContainer: {
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  defaultContainer: {
    backgroundColor: colors.lightGreen,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warning,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
