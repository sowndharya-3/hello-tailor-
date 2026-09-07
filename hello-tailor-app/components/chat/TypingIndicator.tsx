import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

function Dot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 380, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);
  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

// Phase 25 — driven by typing:start/typing:stop realtime events (see useIsTyping in chatStore).
export default function TypingIndicator() {
  return (
    <View style={styles.bubble}>
      <Dot delay={0} />
      <Dot delay={120} />
      <Dot delay={240} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: spacing.screenH,
    marginBottom: spacing.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary },
});
