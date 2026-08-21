import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type } from '@/theme';

export default function StarRating({
  rating,
  size = 14,
  showValue = true,
  reviewCount,
  editable = false,
  onChange,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  editable?: boolean;
  onChange?: (v: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ flexDirection: 'row' }}>
        {stars.map((s) => {
          const filled = s <= Math.round(rating);
          const Star = (
            <Ionicons
              key={s}
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={colors.gold}
              onPress={editable ? () => onChange?.(s) : undefined}
            />
          );
          return Star;
        })}
      </View>
      {showValue ? (
        <Text style={[type.supporting, { color: colors.textSecondary, fontFamily: 'Inter_500Medium' }]}>
          {rating.toFixed(1)}
          {reviewCount !== undefined ? ` (${reviewCount})` : ''}
        </Text>
      ) : null}
    </View>
  );
}

