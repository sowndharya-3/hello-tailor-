import { Image } from 'react-native';

// Preserves aspect ratio — never stretch. Source mark is circular (1:1).
const ASPECT = 1;

export function Logo({ height = 40 }: { height?: number }) {
  return (
    <Image
      source={require('@/assets/images/hello-tailor-logo.png')}
      style={{ height, width: height * ASPECT }}
      resizeMode="contain"
      accessibilityLabel="Hello Tailor"
    />
  );
}
