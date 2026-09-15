import type { Conversation, DesignVersion } from '@/store/chatTypes';
import type { Booking } from '@/store/types';

export type ChatRole = 'customer' | 'tailor';

export function chatPath(role: ChatRole, id: string, designId?: string) {
  return `/${role}/chat/${encodeURIComponent(id)}${designId ? `?design=${encodeURIComponent(designId)}` : ''}`;
}

export function belongsTo(conversation: Conversation, role: ChatRole, tailorId: string) {
  return role === 'customer' ? conversation.customerId === 'me' : conversation.tailorId === tailorId;
}

export function unreadCount(conversation: Conversation, role: ChatRole) {
  return role === 'customer' ? conversation.unreadCountCustomer : conversation.unreadCountTailor;
}

export function conversationStatus(conversation: Conversation, versions: DesignVersion[], bookings: Booking[]) {
  const booking = bookings.find((b) => b.id === conversation.bookingId);
  if (booking && ['Completed', 'Delivered', 'Cancelled', 'Rejected'].includes(booking.status)) return 'Completed';
  const latest = versions.filter((v) => v.conversationId === conversation.id).sort((a, b) => b.version - a.version)[0];
  if (latest?.status === 'pending') return 'Awaiting Approval';
  if (latest?.status === 'changes_requested') return 'Changes Requested';
  return latest || conversation.bookingId ? 'Active Orders' : conversation.bookingChatStatus;
}

export function readImageFile(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    return Promise.reject(new Error('Choose a JPG, PNG, WebP or GIF image.'));
  }
  if (file.size > 10 * 1024 * 1024) return Promise.reject(new Error('Choose an image smaller than 10 MB.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('This image could not be opened. Please choose another.'));
    reader.readAsDataURL(file);
  });
}
