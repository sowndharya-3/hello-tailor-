// Ported from customer-app/app/store/readymade/[id].tsx — addToCart wired to the shared store.
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { readymade } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useStore } from '@/store/useStore';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ReadymadeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = readymade.find((m) => m.id === id) ?? readymade[0];
  const addToCart = useStore((s) => s.addToCart);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Product Details" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Image source={{ uri: item.image }} style={styles.img} />
        <View style={{ padding: spacing.screenH }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}'s Wear</Text>
          <Text style={styles.price}>₹{item.price}</Text>

          <Text style={styles.label}>Select Size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => (
              <Pressable key={s} style={[styles.sizeChip, size === s && styles.sizeChipActive]} onPress={() => setSize(s)}>
                <Text style={[styles.sizeText, size === s && { color: colors.white }]}>{s}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.desc}>Ready-to-wear garment, no stitching wait. Standard fit, machine washable. Exchange available within 7 days for size issues.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.footerBtn}
          onPress={() => {
            addToCart({ id: item.id, name: `${item.name} (${size})`, price: item.price, image: item.image, qty: 1 });
            setAdded(true);
          }}
        >
          <Text style={styles.footerBtnText}>{added ? 'Added to Cart ✓' : `Add to Cart • ₹${item.price}`}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  img: { width: '100%', height: 280 },
  name: { ...type.pageTitle, fontSize: 21, color: colors.text },
  category: { ...type.body, color: colors.textSecondary, marginTop: 2 },
  price: { ...type.price, color: colors.primary, marginTop: spacing.md },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginTop: spacing.lg, marginBottom: 8 },
  sizeRow: { flexDirection: 'row', gap: 8 },
  sizeChip: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  sizeChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  sizeText: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.text },
  desc: { ...type.body, color: colors.textSecondary, marginTop: spacing.lg, lineHeight: 21 },
  footer: { padding: spacing.screenH, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  footerBtn: { minHeight: 52, borderRadius: radius.button, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  footerBtnText: { ...type.button, color: colors.white },
});
