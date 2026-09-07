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
  messageId?: string; // the message this notification is about, when known
  designVersionId?: string; // present for approval_required / design_approved / changes_requested / revised_design_uploaded
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

// The actual deep-link logic (Step 21/22 "tap notification -> open exact chat / approval card").
// role tells us which route group ((customer) vs (tailor)) to push into. Every notification type
// that carries a designVersionId (approval_required, changes_requested, design_approved,
// revised_design_uploaded) scrolls straight to that message's card instead of just opening the
// chat at the top — both chat rooms read `scrollToDesignVersionId` from the route params and
// scroll to the matching message once the list has rendered.
const DESIGN_CONTEXT_TYPES: ChatNotificationType[] = ['approval_required', 'changes_requested', 'design_approved', 'revised_design_uploaded'];

export function handleNotificationTap(payload: ChatNotificationPayload, role: 'customer' | 'tailor') {
  const base = role === 'customer' ? '/(customer)/chat' : '/(tailor)/chat';
  if (DESIGN_CONTEXT_TYPES.includes(payload.type) && payload.designVersionId) {
    router.push({ pathname: `${base}/[conversationId]` as any, params: { conversationId: payload.conversationId, scrollToDesignVersionId: payload.designVersionId } });
    return;
  }
  router.push({ pathname: `${base}/[conversationId]` as any, params: { conversationId: payload.conversationId } });
}

// ---- Where real FCM plugs in (Step 22 — do not pretend this is wired up; native config for
// this doesn't exist in this prototype) ----
//
// 1. DEVICE TOKEN REGISTRATION: replace the body of `registerForPushNotificationsAsync` below
//    with `Notifications.getExpoPushTokenAsync()` (from `expo-notifications`), then POST the
//    token to the backend so it can address this device. Requires `google-services.json` /
//    `GoogleService-Info.plist` and the corresponding `app.json` plugin config, none of which
//    exist yet.
// 2. NATIVE FCM LISTENER: call `Notifications.addNotificationReceivedListener` (foreground) and
//    `Notifications.addNotificationResponseReceivedListener` (tapped) once at app startup (e.g.
//    in the root layout). The response listener's callback receives the same payload shape as
//    `ChatNotificationPayload` above (the backend controls the `data` field it sends) and should
//    call `handleNotificationTap(payload, currentRole)` directly — no screen changes needed.
// 3. BACKGROUND NOTIFICATION HANDLING: a background/killed-state tap is delivered via
//    `Notifications.getLastNotificationResponseAsync()` checked once on cold start; route it
//    through the same `handleNotificationTap` call.
//
// No-op registration stub — kept as an async function with the real signature so call sites
// (e.g. app startup) don't need to change shape when this is implemented for real.
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  return null;
}
