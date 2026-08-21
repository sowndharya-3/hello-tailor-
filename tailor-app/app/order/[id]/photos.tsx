import { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { colors, font } from '@/theme';

const { width } = Dimensions.get('window');

export default function DesignPhotoViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const [index, setIndex] = useState(0);

  if (!order) return null;
  const photos = order.designPhotos;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={26} color={colors.white} />
        </Pressable>
        <Text style={styles.counter}>{index + 1} / {photos.length}</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={photos}
        keyExtractor={(uri) => uri}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <ScrollView
            style={{ width }}
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
          </ScrollView>
        )}
      />

      <View style={styles.dots}>
        {photos.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  counter: { fontFamily: font.medium, fontSize: 13, color: colors.white },
  image: { width, height: width },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 30, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: colors.white, width: 18 },
});
