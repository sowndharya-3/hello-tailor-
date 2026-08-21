// Ported from customer-app/app/store/material/[id].tsx — addToCart now wired to the shared store.
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '@/theme';
import { materials } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useStore } from '@/store/useStore';

export default function MaterialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = materials.find((m) => m.id === id) ?? materials[0];
  const addToCart = useStore((s) => s.addToCart);
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
      <View style={styles.footer}>
        <Pressable
          style={styles.footerBtn}
          onPress={() => {
            addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, qty: meters });
            setAdded(true);
          }}
        >
          <Text style={styles.footerBtnText}>{added ? 'Added to Cart ✓' : `Add to Cart • ₹${item.price * meters}`}</Text>
        </Pressable>
      </View>
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
  footer: { padding: spacing.screenH, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  footerBtn: { minHeight: 52, borderRadius: radius.button, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  footerBtnText: { ...type.button, color: colors.white },
});
