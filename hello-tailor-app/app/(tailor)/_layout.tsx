// Stack shell for the whole Tailor role: the 5-tab bottom nav lives in the nested (tabs)
// group; everything else (booking/order detail, profile sub-screens, notifications, reviews,
// membership, advertise, featured) is a plain stack screen pushed on top of it.
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function TailorLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
