import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useApp } from '../../../store/AppState';

const RELATIONSHIPS = ['Spouse', 'Son', 'Daughter', 'Mother', 'Father', 'Sibling', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function AddFamilyMember() {
  const { addFamilyMember } = useApp();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [gender, setGender] = useState(GENDERS[0]);
  const [dob, setDob] = useState('');

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Add Family Member" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <Input label="Full Name" placeholder="Enter name" value={name} onChangeText={setName} />

        <Text style={styles.label}>Relationship</Text>
        <View style={styles.chipsWrap}>
          {RELATIONSHIPS.map((r) => (
            <Pressable key={r} style={[styles.chip, relationship === r && styles.chipActive]} onPress={() => setRelationship(r)}>
              <Text style={[styles.chipText, relationship === r && styles.chipTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Gender</Text>
        <View style={styles.chipsWrap}>
          {GENDERS.map((g) => (
            <Pressable key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </View>

        <Input label="Date of Birth" placeholder="DD MMM YYYY" value={dob} onChangeText={setDob} style={{ marginTop: spacing.md }} />

        <Button
          label="Save Family Member"
          disabled={!name.trim()}
          onPress={() => {
            addFamilyMember({ id: `f-${Date.now()}`, name, relationship, gender, dob, avatar: `https://picsum.photos/seed/${Date.now()}/200/200` });
            router.back();
          }}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
});
