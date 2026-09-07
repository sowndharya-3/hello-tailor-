// Phase 20/21/22 — push-notification-ready frontend. Real FCM wiring needs `expo-notifications`
// + native config (google-services.json, EAS build credentials) that don't exist in this
// prototype and can't be added without a real Firebase project to point at — so this file
// prepares everything a real integration would plug into: a typed payload shape matching every
// notification event in the brief, and the deep-link router that decides where a tap should
// land. When FCM is wired up, the only change needed is calling `handleNotificationTap` from the
// real `Notifications.addNotificationResponseReceivedListener` callback instead of the mock
// `simulateNotificationTap` below.
import { router } from 'expo-router';

export type ChatNotificationType =
  | 'new_message'
  | 'reference_design_received'
  | 'design_preview_uploaded'
  | 'approval_required'
  | 'design_approved'
  | 'changes_requested'
  | 'revised_design_uploaded';

export interface ChatNotificationPayload {
  type: ChatNotificationType;
  conversationId: string;
  bookingId?: string;
  designVersionId?: string; // present for approval_required / design_approved / changes_requested
  title: string;
  body: string;
}

// Phase 21 (customer-facing) / Phase 22 (tailor-facing) copy, built from a conversation + event —
// screens call this when they want to *demonstrate* what the OS notification would say (e.g. a
// "Simulate incoming notification" debug affordance), not part of the real send path.
export function buildNotificationCopy(
  type: ChatNotificationType,
  args: { otherPartyName: string; bookingId?: string; designVersion?: number },
): { title: string; body: string } {
  const { otherPartyName, bookingId, designVersion } = args;
  switch (type) {
    case 'new_message':
      return { title: 'HELLO TAILOR', body: `${otherPartyName} sent you a message.` };
    case 'reference_design_received':
      return { title: 'REFERENCE DESIGN RECEIVED', body: `${otherPartyName} uploaded a design reference${bookingId ? ` for Booking #${bookingId}` : ''}.` };
    case 'design_preview_uploaded':
      return { title: 'DESIGN UPDATE ✂️', body: `${otherPartyName} uploaded a new design${bookingId ? ` for Booking #${bookingId}` : ''}.` };
    case 'approval_required':
      return { title: 'APPROVAL REQUIRED', body: 'Your tailor shared a design. Please review and approve it.' };
    case 'design_approved':
      return { title: 'DESIGN APPROVED ✅', body: `${otherPartyName} approved Design V${designVersion ?? ''} ${bookingId ? `for Booking #${bookingId}` : ''}.` };
    case 'changes_requested':
      return { title: 'CHANGES REQUESTED', body: `${otherPartyName} requested changes to Design V${designVersion ?? ''}.` };
    case 'revised_design_uploaded':
      return { title: 'REVISED DESIGN', body: `${otherPartyName} uploaded a revised design${bookingId ? ` for Booking #${bookingId}` : ''}.` };
  }
}

// The actual deep-link logic (Phase 21/22 "tap notification -> open exact chat / approval card").
// role tells us which route group ((customer) vs (tailor)) to push into.
export function handleNotificationTap(payload: ChatNotificationPayload, role: 'customer' | 'tailor') {
  const base = role === 'customer' ? '/(customer)/chat' : '/(tailor)/chat';
  if (payload.type === 'approval_required' && payload.designVersionId) {
    router.push({ pathname: `${base}/[conversationId]` as any, params: { conversationId: payload.conversationId, scrollToDesignVersionId: payload.designVersionId } });
    return;
  }
  router.push({ pathname: `${base}/[conversationId]` as any, params: { conversationId: payload.conversationId } });
}

// No-op registration stub — a real implementation calls `Notifications.getExpoPushTokenAsync()`
// here and posts the token to the backend. Kept as an async function with the real signature so
// call sites (e.g. app startup) don't need to change when this is implemented for real.
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  return null;
}
