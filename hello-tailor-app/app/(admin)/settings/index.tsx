import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Settings() {
  const gstRate = useStore((s) => s.gstRate);
  const gstNumber = useStore((s) => s.gstNumber);
  const setGstConfig = useStore((s) => s.setGstConfig);
  const [rate, setRate] = useState(String(gstRate));
  const [number, setNumber] = useState(gstNumber);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Settings" description="Platform-level configuration" />
      <Card style={{ maxWidth: 480 }}>
        <Text style={styles.cardTitle}>GST Configuration</Text>
        <Input label="GST Rate (%)" keyboardType="numeric" value={rate} onChangeText={setRate} />
        <Input label="GST Number" value={number} onChangeText={setNumber} />
        <Button label="Save Settings" onPress={() => setGstConfig({ gstRate: Number(rate) || gstRate, gstNumber: number })} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
});
