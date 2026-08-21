import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, StyleSheet } from 'react-native';
import { colors, radius } from '../../constants/theme';

export function SkeletonBlock({ style }: { style?: ViewStyle }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.block, { opacity }, style]} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonBlock style={{ width: '100%', height: 110, borderRadius: radius.card }} />
      <SkeletonBlock style={{ width: '70%', height: 14, marginTop: 10 }} />
      <SkeletonBlock style={{ width: '45%', height: 12, marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.disabledBg, borderRadius: 8 },
  card: { width: 170, marginRight: 12 },
});
