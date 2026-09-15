import { useChatStore } from '@/store/chatStore';
import { useStore } from '@/store/useStore';
import { belongsTo, unreadCount, type ChatRole } from './helpers';

export function useUnreadCount(role: ChatRole) {
  const tailorId = useStore((s) => s.myTailorId);
  return useChatStore((s) => s.conversations.reduce((sum, conversation) => sum + (belongsTo(conversation, role, tailorId) ? unreadCount(conversation, role) : 0), 0));
}
