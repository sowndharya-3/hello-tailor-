// Phase 5 — sent/delivered/read/failed ticks, shown on the customer's own outgoing bubbles
// (mirrors WhatsApp-style conventions so it reads instantly without a legend).
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/theme';
import type { MessageStatus as Status } from '@/store/chatTypes';

export default function MessageStatus({ status, size = 14 }: { status: Status; size?: number }) {
  if (status === 'sending') return <ActivityIndicator size="small" color={colors.disabledText} />;
  if (status === 'failed') return <Ionicons name="alert-circle" size={size} color={colors.error} />;
  if (status === 'read') {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="checkmark-done" size={size} color={colors.secondary} />
      </View>
    );
  }
  if (status === 'delivered') return <Ionicons name="checkmark-done" size={size} color={colors.disabledText} />;
  return <Ionicons name="checkmark" size={size} color={colors.disabledText} />; // sent
}
