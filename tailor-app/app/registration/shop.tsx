import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function ShopDetails() {
  const updateProfile = useStore((s) => s.updateProfile);
  const [shopName, setShopName] = useState('');
  const [gst, setGst] = useState('');
  const [error, setError] = useState('');

  const onNext = () => {
    if (!shopName.trim()) { setError('Shop name is required'); return; }
    updateProfile({ shopName });
    router.push('/registration/location');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Shop Details" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StepProgress step={2} total={7} label="Shop Details" />
        <Input label="Shop Name" placeholder="e.g. Kumar Tailoring House" value={shopName} onChangeText={setShopName} error={error} />
        <Input label="GST Number" placeholder="22AAAAA0000A1Z5" value={gst} onChangeText={setGst} optional autoCapitalize="characters" />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continue" onPress={onNext} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
