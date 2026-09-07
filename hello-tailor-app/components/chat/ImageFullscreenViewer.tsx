// Phase 24 — tap any chat image to open here. Supports pinch-zoom (native ScrollView zoom) and,
// when given multiple images, horizontal swipe between them.
import { useState } from 'react';
import { Modal, View, Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';

export default function ImageFullscreenViewer({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close fullscreen image">
          <Ionicons name="close" size={28} color={colors.white} />
        </Pressable>
        {images.length > 1 ? (
          <Text style={styles.counter}>
            {index + 1} / {images.length}
          </Text>
        ) : null}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {images.map((uri, i) => (
            <ScrollView
              key={i}
              style={{ width, height }}
              maximumZoomScale={3}
              minimumZoomScale={1}
              centerContent
              contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Image source={{ uri }} style={{ width, height: height * 0.8 }} resizeMode="contain" />
            </ScrollView>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  closeBtn: { position: 'absolute', top: 54, right: spacing.lg, zIndex: 10, padding: 6 },
  counter: { position: 'absolute', top: 58, alignSelf: 'center', color: colors.white, fontSize: 13, zIndex: 10 },
});
