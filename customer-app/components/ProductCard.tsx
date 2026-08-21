import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../constants/theme';
import Card from './ui/Card';

export default function ProductCard({ name, price, unit, image, onPress }: { name: string; price: number; unit?: string; image: string; onPress: () => void }) {
  return (
    <Card noPadding onPress={onPress} style={{ flex: 1, overflow: 'hidden' }}>
      <Image source={{ uri: image }} style={styles.img} />
      <View style={{ padding: spacing.md }}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>₹{price}{unit ? <Text style={styles.unit}> {unit}</Text> : null}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', height: 130 },
  name: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text, minHeight: 32 },
  price: { ...type.body, fontFamily: 'Inter_700Bold', color: colors.primary, marginTop: 4 },
  unit: { ...type.supporting, fontFamily: 'Inter_400Regular', color: colors.textSecondary },
});
