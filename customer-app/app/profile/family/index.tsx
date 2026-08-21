import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Avatar from '../../../components/ui/Avatar';
import EmptyState from '../../../components/ui/EmptyState';
import { useApp } from '../../../store/AppState';

export default function Family() {
  const { family, measurements } = useApp();

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Family Members"
        right={
          <Pressable onPress={() => router.push('/profile/family/add')}>
            <Ionicons name="add-circle-outline" size={26} color={colors.secondary} />
          </Pressable>
        }
      />
      <FlatList
        data={family}
        keyExtractor={(f) => f.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => {
          const m = measurements.filter((x) => x.personId === item.id);
          return (
            <View style={styles.card}>
              <Avatar uri={item.avatar} name={item.name} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.relationship} • {item.gender} • DOB {item.dob}</Text>
                <Text style={styles.sub}>{m.length} saved measurement(s)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon="people-outline" title="No Family Members" message="Add family members to book for them and save their measurements." ctaLabel="Add Family Member" onPress={() => router.push('/profile/family/add')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  name: { ...type.cardTitle, fontSize: 15, color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
});
