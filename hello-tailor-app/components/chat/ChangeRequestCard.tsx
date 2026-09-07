// Phase 15 — the "CHANGE REQUESTED" card that appears in the chat right after a customer
// submits the Request Changes sheet. Reads straight off the same DesignVersion record
// DesignApprovalCard uses (status/customerComment/changeCategories/changeReferenceImageUrl),
// so there's exactly one source of truth per version, never a second copy of the change text.
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import type { DesignVersion } from '@/store/chatTypes';

export default function ChangeRequestCard({ version, onImagePress }: { version: DesignVersion; onImagePress: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>CHANGE REQUESTED</Text>
      <Text style={styles.versionLine}>Design V{version.version}</Text>

      {version.changeCategories?.length ? (
        <View style={styles.chipsRow}>
          {version.changeCategories.map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {version.customerComment ? <Text style={styles.comment}>“{version.customerComment}”</Text> : null}

      {version.changeReferenceImageUrl ? (
        <Pressable onPress={onImagePress}>
          <Image source={{ uri: version.changeReferenceImageUrl }} style={styles.image} resizeMode="cover" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.goldLightBg, borderRadius: radius.card, padding: spacing.md, maxWidth: '85%', marginBottom: spacing.sm, borderWidth: 1, borderColor: `${colors.gold}55` },
  title: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 0.5, color: '#8A6420' },
  versionLine: { fontFamily: font.medium, fontSize: 12, color: colors.text, marginTop: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontFamily: font.medium, fontSize: 11, color: colors.text },
  comment: { fontFamily: font.regular, fontSize: 13, color: colors.text, marginTop: 10, lineHeight: 18 },
  image: { width: '100%', height: 160, borderRadius: 10, marginTop: 10, backgroundColor: colors.disabledBg },
});
