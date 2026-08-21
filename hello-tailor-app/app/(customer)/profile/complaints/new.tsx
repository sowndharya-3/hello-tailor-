// Ported from customer-app/app/profile/complaints/new.tsx — order chips now come from the
// shared store's customer bookings instead of a local `orders` mock.
// ponytail: the shared store has no `addComplaint` mutator (complaints is a static seeded
// admin-facing array). Submitting just shows a local success state, nothing is persisted.
// Add a real create path if customer-side complaint creation becomes a requirement.
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCustomerBookings } from '@/store/useStore';

const CATEGORIES = ['Stitching Quality', 'Delivery Delay', 'Wrong Measurement', 'Damaged Item', 'Payment Issue', 'Other'];

export default function NewComplaint() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const bookings = useCustomerBookings();
  const [orderId, setOrderId] = useState(params.orderId ?? bookings[0]?.id ?? '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  if (submitted) {
    return (
      <View style={styles.successWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        <Text style={styles.successTitle}>Ticket Raised</Text>
        <Text style={styles.successSub}>Our support team will get back to you within 48 hours.</Text>
        <Button label="View My Complaints" style={{ marginTop: spacing.lg, width: '100%' }} onPress={() => router.replace('/(customer)/profile/complaints')} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Raise a Ticket" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <Text style={styles.label}>Order</Text>
        <View style={styles.chipsWrap}>
          {bookings.map((o) => (
            <Pressable key={o.id} style={[styles.chip, orderId === o.id && styles.chipActive]} onPress={() => setOrderId(o.id)}>
              <Text style={[styles.chipText, orderId === o.id && styles.chipTextActive]}>{o.id}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Category</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => (
            <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue in detail..."
          placeholderTextColor={colors.disabledText}
          multiline
          style={styles.textArea}
        />

        <Text style={[styles.label, { marginTop: spacing.md }]}>Attach Photo <Text style={styles.hint}>(optional)</Text></Text>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Pressable style={styles.attachBtn} onPress={pickImage}>
            <Ionicons name="camera-outline" size={22} color={colors.secondary} />
            <Text style={styles.attachText}>Add Photo</Text>
          </Pressable>
        )}

        <Button label="Submit Ticket" disabled={!description.trim()} onPress={() => setSubmitted(true)} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  hint: { ...type.supporting, color: colors.textSecondary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  textArea: { minHeight: 110, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, textAlignVertical: 'top', ...type.body, color: colors.text, backgroundColor: colors.white },
  attachBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', justifyContent: 'center' },
  attachText: { ...type.body, color: colors.secondary, fontFamily: 'Inter_500Medium' },
  imagePreview: { width: 100, height: 100, borderRadius: radius.input },
  successWrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.section },
  successTitle: { ...type.sectionHeading, color: colors.text, marginTop: spacing.lg },
  successSub: { ...type.body, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
});
