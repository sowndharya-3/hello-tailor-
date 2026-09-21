// Phase 26 — frontend service layer. Screens call these functions, never useChatStore's setters
// directly for mutations that would eventually be network calls — that's what makes swapping the
// mock implementation below for real `fetch`/`axios` calls to a backend a change confined to this
// one file. (Reads that are naturally "live" — the message list while a chat is open — still go
// through the useChatStore selector hooks directly, same as the rest of the app's zustand usage.)
import { useChatStore } from '@/store/chatStore';
import { subscribeToRealtime } from '@/services/realtime';
import type { ChangeRequestOption, Conversation, DesignVersion, Message, PhotoType, RealtimeEvent, SenderType } from '@/store/chatTypes';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getConversations(): Promise<Conversation[]> {
  await delay();
  return useChatStore.getState().conversations;
}

export async function getConversationById(conversationId: string): Promise<Conversation | undefined> {
  await delay();
  return useChatStore.getState().conversations.find((c) => c.id === conversationId);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  return useChatStore.getState().messagesByConversation[conversationId] ?? [];
}

export async function createConversation(args: {
  customerId: string;
  customerName: string;
  customerAvatar: string;
  tailorId: string;
  tailorName: string;
  tailorShopName?: string;
  tailorAvatar: string;
  bookingId?: string;
  bookingCategory?: string;
}): Promise<Conversation> {
  await delay();
  return useChatStore.getState().findOrCreateConversation(args);
}

export async function sendMessage(conversationId: string, senderType: SenderType, senderId: string, text: string): Promise<Message> {
  return useChatStore.getState().sendTextMessage(conversationId, senderType, senderId, text);
}

export async function sendAttachment(
  conversationId: string,
  senderType: SenderType,
  senderId: string,
  messageType: 'reference_design' | 'cloth_photo' | 'measurement_reference' | 'progress_photo',
  fileUri: string,
  photoType: PhotoType,
  caption?: string,
): Promise<Message> {
  return useChatStore.getState().sendAttachmentMessage(conversationId, senderType, senderId, messageType, fileUri, photoType, caption);
}

export async function sendVoiceMessage(
  conversationId: string,
  senderType: SenderType,
  senderId: string,
  audioDataUrl: string,
  durationSec: number,
  mimeType: string,
): Promise<Message> {
  return useChatStore.getState().sendVoiceMessage(conversationId, senderType, senderId, audioDataUrl, durationSec, mimeType);
}

export async function uploadDesignForApproval(
  conversationId: string,
  bookingId: string,
  tailorId: string,
  imageUri: string,
  tailorNote: string,
): Promise<{ message: Message; version: DesignVersion }> {
  return useChatStore.getState().uploadDesignForApproval(conversationId, bookingId, tailorId, imageUri, tailorNote);
}

export async function markMessageRead(conversationId: string, readerRole: 'customer' | 'tailor'): Promise<void> {
  useChatStore.getState().markMessagesRead(conversationId, readerRole);
}

export async function approveDesign(designVersionId: string): Promise<void> {
  await delay();
  useChatStore.getState().approveDesign(designVersionId);
}

export async function requestDesignChanges(
  designVersionId: string,
  categories: ChangeRequestOption[],
  instructions: string,
  referenceImageUri?: string,
): Promise<void> {
  await delay();
  useChatStore.getState().requestDesignChanges(designVersionId, categories, instructions, referenceImageUri);
}

export async function retryMessage(conversationId: string, messageId: string): Promise<void> {
  useChatStore.getState().retryFailedMessage(conversationId, messageId);
}

export async function getDesignVersions(conversationId: string): Promise<DesignVersion[]> {
  await delay();
  return useChatStore.getState().designVersions.filter((v) => v.conversationId === conversationId);
}

// subscribeToConversation/unsubscribeFromConversation — Phase 25/26. Today this just forwards
// the mock realtime emitter's events filtered to one conversation; a real implementation would
// join a socket room here instead. Screens call this from a useEffect and MUST call the returned
// unsubscribe function on cleanup (Phase 28 — "clean up WebSocket subscriptions when components
// unmount").
export function subscribeToConversation(conversationId: string, onEvent: (event: RealtimeEvent) => void): () => void {
  return subscribeToRealtime((event) => {
    if (event.conversationId === conversationId) onEvent(event);
  });
}

export function unsubscribeFromConversation(unsubscribe: () => void): void {
  unsubscribe();
}
