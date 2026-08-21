import React from 'react';
import { View, StyleProp, ViewStyle, Pressable } from 'react-native';
import { colors, radius, spacing, shadow } from '@/theme';

export default function Card({
  children,
  style,
  onPress,
  noPadding,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  noPadding?: boolean;
}) {
  const content = (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.card,
          padding: noPadding ? 0 : spacing.cardInner,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
        {content}
      </Pressable>
    );
  }
  return content;
}

