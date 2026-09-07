// Chat / Design-Approval store. Separate from store/useStore.ts on purpose — this module is a
// self-contained add-on (per the brief: "do not break any existing screen/flow"), so it does not
// touch the existing store file at all. Screens read both stores where they need booking data
// (useStore) and chat data (this store) side by side.
//
// PHASE 28 SAFETY NOTES (the app previously shipped a real "Maximum update depth exceeded" bug
// from selectors that returned a fresh array/object every call — see useShallow usage below):
//   - Every selector that derives an array (filter/map) MUST be wrapped in useShallow by the
//     calling component, exactly like useMyBookings()/useCustomerBookings() in store/useStore.ts.
//     This file exports pre-built, already-wrapped selector hooks for the common cases so screens
//     don't have to remember to do it themselves.
//   - markMessagesRead is intentionally NOT auto-invoked by any selector or by this store — it is
//     a plain action a screen calls once from a `useEffect(() => { markMessagesRead(...) }, [conversationId])`.
//     Calling it during render, or from an effect with unstable deps, would re-trigger on every
//     store update and re-loop. Screens ported from this foundation must follow that pattern.
//   - The mock "sending -> sent -> delivered" progression uses setTimeout, not effects tied to
//     component state, so it can't create a render loop no matter how many components subscribe.
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type {
  Attachment,
  ChangeRequestOption,
  Conversation,
  DesignVersion,
  Message,
  MessageType,
  PhotoType,
  SenderType,
} from './chatTypes';
import { initialConversations, initialDesignVersions, initialMessages } from '@/data/chatSeed';
import { emitRealtimeEvent, subscribeToRealtime } from '@/services/realtime';

let seq = 1000;
const nextId = (prefix: string) => `${prefix}-${(++seq).toString().padStart(5, '0')}`;

interface ChatState {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  designVersions: DesignVersion[];
  typingByConversation: Record<string, Partial<Record<SenderType, boolean>>>;

  // ---- Phase 26 service-layer actions (thin wrappers live in services/chatService.ts) ----
  findOrCreateConversation: (args: {
    customerId: string;
    customerName: string;
    customerAvatar: string;
    tailorId: string;
    tailorName: string;
    tailorShopName?: string;
    tailorAvatar: string;
    bookingId?: string;
    bookingCategory?: string;
  }) => Conversation;
  sendTextMessage: (conversationId: string, senderType: SenderType, senderId: string, text: string) => Message;
  sendAttachmentMessage: (
    conversationId: string,
    senderType: SenderType,
    senderId: string,
    messageType: Extract<MessageType, 'reference_design' | 'cloth_photo' | 'measurement_reference' | 'progress_photo'>,
    fileUri: string,
    photoType: PhotoType,
    caption?: string,
  ) => Message;
  uploadDesignForApproval: (
    conversationId: string,
    bookingId: string,
    tailorId: string,
    imageUri: string,
    tailorNote: string,
  ) => { message: Message; version: DesignVersion };
  approveDesign: (designVersionId: string) => void;
  requestDesignChanges: (
    designVersionId: string,
    categories: ChangeRequestOption[],
    instructions: string,
    referenceImageUri?: string,
  ) => void;
  retryFailedMessage: (conversationId: string, messageId: string) => void;
  markMessagesRead: (conversationId: string, readerRole: 'customer' | 'tailor') => void;
  setTyping: (conversationId: string, senderType: SenderType, typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: initialConversations,
  messagesByConversation: initialMessages,
  designVersions: initialDesignVersions,
  typingByConversation: {},

  findOrCreateConversation: (args) => {
    const existing = get().conversations.find(
      (c) => c.customerId === args.customerId && c.tailorId === args.tailorId && (!args.bookingId || c.bookingId === args.bookingId),
    );
    if (existing) return existing;

    const conversation: Conversation = {
      id: nextId('CONV'),
      customerId: args.customerId,
      customerName: args.customerName,
      customerAvatar: args.customerAvatar,
      tailorId: args.tailorId,
      tailorName: args.tailorName,
      tailorShopName: args.tailorShopName,
      tailorAvatar: args.tailorAvatar,
      bookingId: args.bookingId,
      bookingCategory: args.bookingCategory,
      bookingChatStatus: args.bookingId ? 'Active Orders' : undefined,
      lastMessage: '',
      lastMessageType: 'text',
      lastMessageAt: new Date().toISOString(),
      unreadCountCustomer: 0,
      unreadCountTailor: 0,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      conversations: [conversation, ...s.conversations],
      messagesByConversation: { ...s.messagesByConversation, [conversation.id]: [] },
    }));
    return conversation;
  },

  sendTextMessage: (conversationId, senderType, senderId, text) => {
    const message: Message = {
      id: nextId('MSG'),
      conversationId,
      senderId,
      senderType,
      messageType: 'text',
      text,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };
    appendMessage(set, message);
    progressMessageDelivery(set, get, message);
    return message;
  },

  sendAttachmentMessage: (conversationId, senderType, senderId, messageType, fileUri, photoType, caption) => {
    const messageId = nextId('MSG');
    const attachment: Attachment = {
      id: nextId('ATT'),
      messageId,
      fileUrl: fileUri,
      thumbnailUrl: fileUri,
      fileType: 'image',
      photoType,
    };
    const message: Message = {
      id: messageId,
      conversationId,
      senderId,
      senderType,
      messageType,
      caption,
      attachments: [attachment],
      status: 'sending',
      createdAt: new Date().toISOString(),
    };
    appendMessage(set, message);
    progressMessageDelivery(set, get, message);
    return message;
  },

  uploadDesignForApproval: (conversationId, bookingId, tailorId, imageUri, tailorNote) => {
    const existingVersions = get().designVersions.filter((v) => v.conversationId === conversationId);
    const version = existingVersions.length + 1;
    const messageId = nextId('MSG');
    const designVersionId = nextId('DSN');

    const designVersion: DesignVersion = {
      id: designVersionId,
      bookingId,
      conversationId,
      messageId,
      version,
      imageUrl: imageUri,
      tailorNote,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const message: Message = {
      id: messageId,
      conversationId,
      senderId: tailorId,
      senderType: 'tailor',
      messageType: 'design_approval',
      designVersionId,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ designVersions: [...s.designVersions, designVersion] }));
    appendMessage(set, message);
    progressMessageDelivery(set, get, message);
    emitRealtimeEvent({ type: 'design:approval', conversationId, designVersionId });
    return { message, version: designVersion };
  },

  approveDesign: (designVersionId) => {
    const version = get().designVersions.find((v) => v.id === designVersionId);
    if (!version || version.status === 'approved') return;

    set((s) => ({
      designVersions: s.designVersions.map((v) => (v.id === designVersionId ? { ...v, status: 'approved', updatedAt: new Date().toISOString() } : v)),
    }));
    appendMessage(set, {
      id: nextId('MSG'),
      conversationId: version.conversationId,
      senderId: 'system',
      senderType: 'system',
      messageType: 'system',
      text: `Customer approved Design V${version.version}.`,
      status: 'read',
      createdAt: new Date().toISOString(),
    });
  },

  requestDesignChanges: (designVersionId, categories, instructions, referenceImageUri) => {
    const version = get().designVersions.find((v) => v.id === designVersionId);
    if (!version) return;

    set((s) => ({
      designVersions: s.designVersions.map((v) =>
        v.id === designVersionId
          ? {
              ...v,
              status: 'changes_requested',
              customerComment: instructions,
              changeCategories: categories,
              changeReferenceImageUrl: referenceImageUri,
              updatedAt: new Date().toISOString(),
            }
          : v,
      ),
    }));

    appendMessage(set, {
      id: nextId('MSG'),
      conversationId: version.conversationId,
      senderId: version.bookingId ? 'me' : 'me',
      senderType: 'customer',
      messageType: 'change_request',
      designVersionId,
      status: 'sent',
      createdAt: new Date().toISOString(),
    });
    appendMessage(set, {
      id: nextId('MSG'),
      conversationId: version.conversationId,
      senderId: 'system',
      senderType: 'system',
      messageType: 'system',
      text: `Customer requested changes to Design V${version.version}.`,
      status: 'read',
      createdAt: new Date().toISOString(),
    });
    emitRealtimeEvent({ type: 'design:changes_requested', conversationId: version.conversationId, designVersionId });
  },

  retryFailedMessage: (conversationId, messageId) => {
    set((s) => ({
      messagesByConversation: {
        ...s.messagesByConversation,
        [conversationId]: (s.messagesByConversation[conversationId] ?? []).map((m) =>
          m.id === messageId ? { ...m, status: 'sending' } : m,
        ),
      },
    }));
    const msg = get().messagesByConversation[conversationId]?.find((m) => m.id === messageId);
    if (msg) progressMessageDelivery(set, get, msg, /* forceSucceed */ true);
  },

  markMessagesRead: (conversationId, readerRole) => {
    set((s) => {
      const messages = s.messagesByConversation[conversationId];
      if (!messages) return s;
      const otherRole: SenderType = readerRole === 'customer' ? 'tailor' : 'customer';
      let changed = false;
      const updated = messages.map((m) => {
        if (m.senderType === otherRole && m.status !== 'read') {
          changed = true;
          return { ...m, status: 'read' as const, readAt: new Date().toISOString() };
        }
        return m;
      });
      if (!changed && (s.conversations.find((c) => c.id === conversationId)?.[readerRole === 'customer' ? 'unreadCountCustomer' : 'unreadCountTailor'] ?? 0) === 0) {
        return s;
      }
      return {
        messagesByConversation: { ...s.messagesByConversation, [conversationId]: updated },
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, [readerRole === 'customer' ? 'unreadCountCustomer' : 'unreadCountTailor']: 0 }
            : c,
        ),
      };
    });
  },

  setTyping: (conversationId, senderType, typing) => {
    set((s) => ({
      typingByConversation: {
        ...s.typingByConversation,
        [conversationId]: { ...s.typingByConversation[conversationId], [senderType]: typing },
      },
    }));
  },
}));

function appendMessage(set: (fn: (s: ChatState) => Partial<ChatState>) => void, message: Message) {
  set((s) => {
    const list = s.messagesByConversation[message.conversationId] ?? [];
    return {
      messagesByConversation: { ...s.messagesByConversation, [message.conversationId]: [...list, message] },
      conversations: s.conversations.map((c) => {
        if (c.id !== message.conversationId) return c;
        const preview =
          message.messageType === 'text'
            ? message.text ?? ''
            : message.messageType === 'design_approval'
              ? 'Sent a design for your approval'
              : message.messageType === 'change_request'
                ? 'Requested changes to the design'
                : message.caption || 'Sent an attachment';
        return {
          ...c,
          lastMessage: preview,
          lastMessageType: message.messageType,
          lastMessageAt: message.createdAt,
          unreadCountCustomer: message.senderType === 'tailor' ? c.unreadCountCustomer + 1 : c.unreadCountCustomer,
          unreadCountTailor: message.senderType === 'customer' ? c.unreadCountTailor + 1 : c.unreadCountTailor,
        };
      }),
    };
  });
  emitRealtimeEvent({ type: 'message:new', conversationId: message.conversationId, message });
}

// Simulated network round-trip: sending -> sent -> delivered. A message can be made to "fail"
// by the demo composer (see MessageComposer) setting text to start with "@@failtest" — kept out
// of the store's own logic so this file has no special-cased business rule baked in.
function progressMessageDelivery(
  set: (fn: (s: ChatState) => Partial<ChatState>) => void,
  get: () => ChatState,
  message: Message,
  forceSucceed = false,
) {
  const shouldFail = !forceSucceed && message.text?.trim().toLowerCase() === 'fail test';
  const conversationId = message.conversationId;

  setTimeout(() => {
    updateMessageStatus(set, conversationId, message.id, shouldFail ? 'failed' : 'sent');
    if (!shouldFail) emitRealtimeEvent({ type: 'message:sent', conversationId, messageId: message.id });
  }, 500);

  if (!shouldFail) {
    setTimeout(() => {
      updateMessageStatus(set, conversationId, message.id, 'delivered');
      emitRealtimeEvent({ type: 'message:delivered', conversationId, messageId: message.id });
    }, 1200);
  }
  void get;
}

function updateMessageStatus(
  set: (fn: (s: ChatState) => Partial<ChatState>) => void,
  conversationId: string,
  messageId: string,
  status: Message['status'],
) {
  set((s) => ({
    messagesByConversation: {
      ...s.messagesByConversation,
      [conversationId]: (s.messagesByConversation[conversationId] ?? []).map((m) => (m.id === messageId ? { ...m, status } : m)),
    },
  }));
}

// ---- Pre-wrapped selectors (Phase 28 safety — see file header) ----
export const useConversations = () => useChatStore((s) => s.conversations);
export const useMessages = (conversationId: string) =>
  useChatStore(useShallow((s) => s.messagesByConversation[conversationId] ?? []));
export const useDesignVersionsFor = (conversationId: string) =>
  useChatStore(useShallow((s) => s.designVersions.filter((v) => v.conversationId === conversationId)));
export const useDesignVersion = (designVersionId: string | undefined) =>
  useChatStore((s) => (designVersionId ? s.designVersions.find((v) => v.id === designVersionId) : undefined));
export const useConversationById = (conversationId: string | undefined) =>
  useChatStore((s) => (conversationId ? s.conversations.find((c) => c.id === conversationId) : undefined));
export const useTotalUnread = (role: 'customer' | 'tailor') =>
  useChatStore((s) =>
    s.conversations.reduce((sum, c) => sum + (role === 'customer' ? c.unreadCountCustomer : c.unreadCountTailor), 0),
  );
export const useIsTyping = (conversationId: string, watchSenderType: SenderType) =>
  useChatStore((s) => Boolean(s.typingByConversation[conversationId]?.[watchSenderType]));

// Bridge for the mock realtime emitter -> zustand: nothing needs to subscribe today since every
// store action already updates state synchronously (mock delivery just uses setTimeout inside
// the same store). This export exists so services/chatService.ts's subscribeToConversation has
// a real thing to hand back, matching the Phase 26 API real screens will call.
export { subscribeToRealtime };
