// Chat / Design-Approval domain types — backend-ready shapes (Phase 34).
// These mirror the eventual DB tables 1:1 (conversation_id, message_id, ...) so swapping the
// mock service layer (services/chatService.ts) for real API calls later is a drop-in change —
// no UI component or store consumer needs to change shape.

export type SenderType = 'customer' | 'tailor' | 'system';

export type MessageType =
  | 'text'
  | 'reference_design'
  | 'cloth_photo'
  | 'measurement_reference'
  | 'progress_photo'
  | 'design_preview' // tailor uploaded a design, not yet asking for approval
  | 'design_approval' // the special approval card (Phase 12)
  | 'change_request' // the special change-requested card (Phase 15)
  | 'voice' // voice note (one audio attachment)
  | 'system'; // "Customer approved Design V1." etc

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type PhotoType =
  | 'Reference Design'
  | 'Cloth Photo'
  | 'Measurement Reference'
  | 'Progress Photo'
  | 'Final Design'
  | 'Other';

export interface Attachment {
  id: string; // attachment_id
  messageId: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'document' | 'audio';
  fileSize?: number;
  durationSec?: number; // audio only
  mimeType?: string; // audio only
  photoType?: PhotoType;
}

export type ApprovalStatus = 'pending' | 'approved' | 'changes_requested' | 'revised';

export const CHANGE_REQUEST_OPTIONS = [
  'Neck Design',
  'Sleeve Design',
  'Length',
  'Fitting',
  'Pattern',
  'Colour / Material',
  'Other',
] as const;
export type ChangeRequestOption = (typeof CHANGE_REQUEST_OPTIONS)[number];

// One row per design iteration (Phase 16 — versioning, never overwritten).
export interface DesignVersion {
  id: string; // approval_id
  bookingId: string;
  conversationId: string;
  messageId: string; // the design_approval / design_preview message this version is attached to
  version: number; // 1, 2, 3...
  imageUrl: string;
  tailorNote?: string;
  status: ApprovalStatus;
  customerComment?: string; // set on approve or as part of a change request
  changeCategories?: ChangeRequestOption[]; // set when status = changes_requested
  changeReferenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string; // message_id
  conversationId: string;
  senderId: string; // customerId / tailorId / 'system'
  senderType: SenderType;
  receiverId?: string; // the other participant (customerId / tailorId)
  bookingId?: string;
  messageType: MessageType;
  text?: string;
  caption?: string; // caption on an attachment message
  attachments?: Attachment[];
  designVersionId?: string; // present on design_preview / design_approval / change_request messages
  status: MessageStatus;
  replyToMessageId?: string;
  createdAt: string; // ISO
  deliveredAt?: string;
  readAt?: string;
}

export type BookingChatStatus = 'Active Orders' | 'Awaiting Approval' | 'Changes Requested' | 'Completed';

export interface Conversation {
  id: string; // conversation_id
  customerId: string;
  customerName: string;
  customerAvatar: string;
  tailorId: string;
  tailorName: string;
  tailorShopName?: string;
  tailorAvatar: string;
  bookingId?: string;
  bookingCategory?: string;
  bookingChatStatus?: BookingChatStatus; // drives the tailor-side filter chips (Phase 3)
  lastMessage: string;
  lastMessageType: MessageType;
  lastMessageAt: string; // ISO
  unreadCountCustomer: number;
  unreadCountTailor: number;
  createdAt: string;
}

// Phase 25 — real-time event names, typed so the mock emitter and a future real socket
// client share one contract.
export type RealtimeEvent =
  | { type: 'message:new'; conversationId: string; message: Message }
  | { type: 'message:sent'; conversationId: string; messageId: string }
  | { type: 'message:delivered'; conversationId: string; messageId: string }
  | { type: 'message:read'; conversationId: string; messageId: string }
  | { type: 'typing:start'; conversationId: string; senderType: SenderType }
  | { type: 'typing:stop'; conversationId: string; senderType: SenderType }
  | { type: 'design:approval'; conversationId: string; designVersionId: string }
  | { type: 'design:changes_requested'; conversationId: string; designVersionId: string };
