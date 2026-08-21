import React from 'react';
import { Image, View, Text } from 'react-native';
import { colors } from '@/theme';

export default function Avatar({ uri, name, size = 44 }: { uri?: string; name?: string; size?: number }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initials = (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.white, fontFamily: 'Inter_600SemiBold', fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  );
}

