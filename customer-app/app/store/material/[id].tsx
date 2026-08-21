import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { materials } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Button from '../../../components/ui/Button';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

export default function MaterialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = materials.find((m) => m.id === id) ?? materials[0];
  const { addToCart } = useApp();
  const [meters, setMeters] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Product Details" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Image source={{ uri: item.image }} style={styles.img} />
        <View style={{ padding: spacing.screenH }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category} Fabric</Text>
          <Text style={styles.price}>₹{item.price} <Text style={styles.unit}>{item.unit}</Text></Text>

          <View style={styles.qtyRow}>
            <Text style={styles.label}>Meters</Text>
            <View style={styles.qtyControls}>
              <Ionicons name="remove-circle-outline" size={26} color={colors.secondary} onPress={() => setMeters((m) => Math.max(1, m - 1))} />
              <Text style={styles.qtyValue}>{meters}</Text>
              <Ionicons name="add-circle-outline" size={26} color={colors.secondary} onPress={() => setMeters((m) => m + 1)} />
            </View>
          </View>

          <Text style={styles.desc}>Premium quality {item.category.toLowerCase()} fabric, ideal for tailoring. Pre-shrunk and colourfast. Sold by the meter — minimum order 1 meter.</Text>
        </View>
      </ScrollView>
      <StepFooter
        label={added ? 'Added to Cart ✓' : `Add to Cart • ₹${item.price * meters}`}
        onPress={() => {
          addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, qty: meters });
          setAdded(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  img: { width: '100%', height: 260 },
  name: { ...type.pageTitle, fontSize: 21, color: colors.text },
  category: { ...type.body, color: colors.textSecondary, marginTop: 2 },
  price: { ...type.price, color: colors.primary, marginTop: spacing.md },
  unit: { ...type.supporting, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyValue: { ...type.cardTitle, color: colors.text, minWidth: 24, textAlign: 'center' },
  desc: { ...type.body, color: colors.textSecondary, marginTop: spacing.lg, lineHeight: 21 },
});
