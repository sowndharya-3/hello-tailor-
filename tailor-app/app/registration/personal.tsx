import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function PersonalDetails() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const isShop = profile.tailorType === 'shop';
  const [name, setName] = useState(profile.name === 'Ramesh Kumar' ? '' : profile.name);
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<{ name?: string; experience?: string }>({});

  const onNext = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Full name is required';
    if (!experience.trim()) next.experience = 'Experience is required';
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProfile({ name, experience, about });
    router.push(isShop ? '/registration/shop' : '/registration/location');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Personal Details" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StepProgress step={1} total={isShop ? 7 : 6} label="Personal Details" />
        <Input label="Full Name" placeholder="e.g. Ramesh Kumar" value={name} onChangeText={setName} error={errors.name} />
        <Input label="Years of Experience" placeholder="e.g. 8" keyboardType="number-pad" value={experience} onChangeText={setExperience} error={errors.experience} />
        <Input
          label="About You"
          placeholder="Tell customers about your tailoring specialty..."
          value={about}
          onChangeText={setAbout}
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
          optional
        />
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
