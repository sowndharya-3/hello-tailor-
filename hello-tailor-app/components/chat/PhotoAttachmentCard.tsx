// Phase 9/10/11 — labeled photo cards inside chat. One component covers Reference Design /
// Cloth Photo / Measurement Reference / Progress Photo / Final Design so each attachment type
// isn't a hand-duplicated near-identical component — the label + accent colour is the only thing
// that changes per type. Exported names below match the spec's component list 1:1 as thin
// wrappers, so anything reaching for "ReferenceDesignCard" finds exactly that.
import type { ComponentProps } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import type { Attachment, PhotoType } from '@/store/chatTypes';

const LABELS: Record<PhotoType, string> = {
  'Reference Design': 'REFERENCE DESIGN',
  'Cloth Photo': 'CLOTH PHOTO',
  'Measurement Reference': 'MEASUREMENT REFERENCE',
  'Progress Photo': 'PROGRESS UPDATE',
  'Final Design': 'FINAL DESIGN',
  Other: 'ATTACHMENT',
};

const ACCENTS: Partial<Record<PhotoType, string>> = {
  'Reference Design': colors.gold,
  'Final Design': colors.gold,
  'Progress Photo': colors.secondary,
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function PhotoAttachmentCard({
  attachment,
  caption,
  timestamp,
  align = 'left',
  onPress,
}: {
  attachment: Attachment;
  caption?: string;
  timestamp: string;
  align?: 'left' | 'right';
  onPress: () => void;
}) {
  const type = attachment.photoType ?? 'Other';
  const accent = ACCENTS[type] ?? colors.secondary;

  return (
    <View style={[styles.wrap, align === 'right' && styles.wrapRight]}>
      <View style={[styles.label, { backgroundColor: `${accent}1A` }]}>
        <Text style={[styles.labelText, { color: accent }]}>{LABELS[type]}</Text>
      </View>
      <Pressable onPress={onPress} accessibilityRole="imagebutton" accessibilityLabel={`View ${LABELS[type].toLowerCase()} fullscreen`}>
        <Image source={{ uri: attachment.thumbnailUrl ?? attachment.fileUrl }} style={styles.image} resizeMode="cover" accessibilityLabel={LABELS[type]} />
      </Pressable>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <Text style={styles.time}>{formatTime(timestamp)}</Text>
    </View>
  );
}

// Named per-type wrappers (Phase 27 component list) — same component, fixed intent.
export function ReferenceDesignCard(props: Omit<ComponentProps<typeof PhotoAttachmentCard>, 'attachment'> & { attachment: Attachment }) {
  return <PhotoAttachmentCard {...props} attachment={{ ...props.attachment, photoType: 'Reference Design' }} />;
}
export function ClothPhotoCard(props: Omit<ComponentProps<typeof PhotoAttachmentCard>, 'attachment'> & { attachment: Attachment }) {
  return <PhotoAttachmentCard {...props} attachment={{ ...props.attachment, photoType: 'Cloth Photo' }} />;
}
export function MeasurementReferenceCard(props: Omit<ComponentProps<typeof PhotoAttachmentCard>, 'attachment'> & { attachment: Attachment }) {
  return <PhotoAttachmentCard {...props} attachment={{ ...props.attachment, photoType: 'Measurement Reference' }} />;
}

const styles = StyleSheet.create({
  wrap: { maxWidth: '78%', alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.sm, marginBottom: spacing.sm },
  wrapRight: { alignSelf: 'flex-end' },
  label: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  labelText: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 0.4 },
  image: { width: 220, height: 220, borderRadius: 12, backgroundColor: colors.disabledBg },
  caption: { fontFamily: font.regular, fontSize: 13, color: colors.text, marginTop: 8, lineHeight: 18 },
  time: { fontFamily: font.regular, fontSize: 10, color: colors.textSecondary, marginTop: 6, alignSelf: 'flex-end' },
});
