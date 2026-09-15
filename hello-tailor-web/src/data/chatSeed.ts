// Mock data for the Chat / Design-Approval module. Follows the same conventions as data/seed.ts
// (picsum seed images, ISO dates relative to "now") so it drops into the existing demo dataset
// without looking out of place.
import type { Attachment, Conversation, DesignVersion, Message } from '@/store/chatTypes';
import { ME_CUSTOMER, ME_TAILOR_ID, tailors } from './seed';

const seedImg = (s: string, w = 600, h = 600) => `https://picsum.photos/seed/${s}/${w}/${h}`;
const now = Date.now();
const minsAgo = (n: number) => new Date(now - n * 60_000).toISOString();
const daysAgo = (n: number) => new Date(now - n * 24 * 3600_000).toISOString();

const T1 = tailors[0]; // Rajendran Kumar · Master Stitch Tailoring — matches ME_TAILOR_ID

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${(++seq).toString().padStart(4, '0')}`;

function mkAttachment(messageId: string, photoType: Attachment['photoType'], seed: string): Attachment {
  return {
    id: nextId('ATT'),
    messageId,
    fileUrl: seedImg(seed),
    thumbnailUrl: seedImg(seed, 200, 200),
    fileType: 'image',
    fileSize: 240_000,
    photoType,
  };
}

// ---- Conversation 1: rich, fully-populated demo tied to booking HT-1005 (customer 'me' <-> t1) ----
const CONV_1 = 'CONV-1001';
const conv1Messages: Message[] = [];
const conv1Designs: DesignVersion[] = [];

function push(m: Omit<Message, 'id' | 'conversationId' | 'status'> & Partial<Pick<Message, 'status'>>) {
  const msg: Message = { id: nextId('MSG'), conversationId: CONV_1, status: 'read', ...m };
  conv1Messages.push(msg);
  return msg;
}

push({
  senderId: 'me',
  senderType: 'customer',
  messageType: 'text',
  text: 'Hi! I booked a blouse stitching, sharing my reference design.',
  createdAt: daysAgo(6),
  deliveredAt: daysAgo(6),
  readAt: daysAgo(6),
});
{
  const refMsg = push({
    senderId: 'me',
    senderType: 'customer',
    messageType: 'reference_design',
    caption: 'I need this same sleeve pattern, but slightly shorter.',
    createdAt: daysAgo(6),
    deliveredAt: daysAgo(6),
    readAt: daysAgo(6),
  });
  refMsg.attachments = [mkAttachment(refMsg.id, 'Reference Design', 'refdesign1')];
}
{
  const clothMsg = push({
    senderId: 'me',
    senderType: 'customer',
    messageType: 'cloth_photo',
    caption: 'Here is the fabric I want to use.',
    createdAt: daysAgo(6),
    deliveredAt: daysAgo(6),
    readAt: daysAgo(6),
  });
  clothMsg.attachments = [mkAttachment(clothMsg.id, 'Cloth Photo', 'clothphoto1')];
}
push({
  senderId: ME_TAILOR_ID,
  senderType: 'tailor',
  messageType: 'text',
  text: 'Got it! Fabric and reference look great. Starting the cut today.',
  createdAt: daysAgo(5),
  deliveredAt: daysAgo(5),
  readAt: daysAgo(5),
});
{
  const progressMsg = push({
    senderId: ME_TAILOR_ID,
    senderType: 'tailor',
    messageType: 'progress_photo',
    caption: 'Cutting done, stitching in progress.',
    createdAt: daysAgo(3),
    deliveredAt: daysAgo(3),
    readAt: daysAgo(3),
  });
  progressMsg.attachments = [mkAttachment(progressMsg.id, 'Progress Photo', 'progress1')];
}

// Design V1 — tailor asks for approval, customer requests changes
{
  const v1Id = nextId('DSN');
  const v1: DesignVersion = {
    id: v1Id,
    bookingId: 'HT-1005',
    conversationId: CONV_1,
    messageId: '',
    version: 1,
    imageUrl: seedImg('designv1'),
    tailorNote: 'Please review the sleeve and neckline.',
    status: 'changes_requested',
    customerComment: 'Please reduce the sleeve length and use this pattern.',
    changeCategories: ['Sleeve Design'],
    changeReferenceImageUrl: seedImg('sleeveref'),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  };
  const approvalMsg = push({
    senderId: ME_TAILOR_ID,
    senderType: 'tailor',
    messageType: 'design_approval',
    designVersionId: v1Id,
    createdAt: daysAgo(2),
    deliveredAt: daysAgo(2),
    readAt: daysAgo(2),
  });
  v1.messageId = approvalMsg.id;
  approvalMsg.designVersionId = v1Id;
  conv1Designs.push(v1);

  const changeMsg = push({
    senderId: 'me',
    senderType: 'customer',
    messageType: 'change_request',
    designVersionId: v1Id,
    createdAt: daysAgo(1.8),
    deliveredAt: daysAgo(1.8),
    readAt: daysAgo(1.8),
  });
  void changeMsg;

  push({
    senderId: 'system',
    senderType: 'system',
    messageType: 'system',
    text: 'Customer requested changes to Design V1.',
    createdAt: daysAgo(1.8),
    deliveredAt: daysAgo(1.8),
    readAt: daysAgo(1.8),
  });
}

// Design V2 — currently pending approval (this is the live, actionable card)
{
  const v2Id = nextId('DSN');
  const v2: DesignVersion = {
    id: v2Id,
    bookingId: 'HT-1005',
    conversationId: CONV_1,
    messageId: '',
    version: 2,
    imageUrl: seedImg('designv2'),
    tailorNote: 'Updated the sleeve length as requested — please take a look.',
    status: 'pending',
    createdAt: daysAgo(0.3),
    updatedAt: daysAgo(0.3),
  };
  const approvalMsg2 = push({
    senderId: ME_TAILOR_ID,
    senderType: 'tailor',
    messageType: 'design_approval',
    designVersionId: v2Id,
    status: 'delivered',
    createdAt: minsAgo(20),
    deliveredAt: minsAgo(20),
  });
  v2.messageId = approvalMsg2.id;
  approvalMsg2.designVersionId = v2Id;
  conv1Designs.push(v2);
}

push({
  senderId: ME_TAILOR_ID,
  senderType: 'tailor',
  messageType: 'text',
  text: 'Your design is ready for review',
  status: 'delivered',
  createdAt: minsAgo(15),
  deliveredAt: minsAgo(15),
});

export const initialMessages: Record<string, Message[]> = {
  [CONV_1]: conv1Messages,
};

export const initialDesignVersions: DesignVersion[] = [...conv1Designs];

// ---- A couple more lightweight conversations so the list screens don't look empty ----
const CONV_2 = 'CONV-1002';
const CONV_3 = 'CONV-1003';

const t2 = tailors[1];
const t3 = tailors[2];

initialMessages[CONV_2] = [
  {
    id: nextId('MSG'),
    conversationId: CONV_2,
    senderId: t2.id,
    senderType: 'tailor',
    messageType: 'text',
    text: 'Sure, we can start once you confirm the measurements.',
    status: 'delivered',
    createdAt: daysAgo(1),
    deliveredAt: daysAgo(1),
  },
];

initialMessages[CONV_3] = [
  {
    id: nextId('MSG'),
    conversationId: CONV_3,
    senderId: 'me',
    senderType: 'customer',
    messageType: 'text',
    text: 'Hi, do you stitch kids wear too?',
    status: 'read',
    createdAt: daysAgo(4),
    deliveredAt: daysAgo(4),
    readAt: daysAgo(4),
  },
  {
    id: nextId('MSG'),
    conversationId: CONV_3,
    senderId: t3.id,
    senderType: 'tailor',
    messageType: 'text',
    text: 'Yes we do! Feel free to book anytime.',
    status: 'read',
    createdAt: daysAgo(4),
    deliveredAt: daysAgo(4),
    readAt: daysAgo(4),
  },
];

export const initialConversations: Conversation[] = [
  {
    id: CONV_1,
    customerId: 'me',
    customerName: ME_CUSTOMER.name,
    customerAvatar: ME_CUSTOMER.avatar,
    tailorId: T1.id,
    tailorName: T1.name,
    tailorShopName: T1.shopName,
    tailorAvatar: T1.image,
    bookingId: 'HT-1005',
    bookingCategory: 'Blouse Stitching',
    bookingChatStatus: 'Awaiting Approval',
    lastMessage: 'Your design is ready for review',
    lastMessageType: 'text',
    lastMessageAt: minsAgo(15),
    unreadCountCustomer: 2,
    unreadCountTailor: 0,
    createdAt: daysAgo(6),
  },
  {
    id: CONV_2,
    customerId: 'me',
    customerName: ME_CUSTOMER.name,
    customerAvatar: ME_CUSTOMER.avatar,
    tailorId: t2.id,
    tailorName: t2.name,
    tailorShopName: t2.shopName,
    tailorAvatar: t2.image,
    bookingChatStatus: 'Active Orders',
    lastMessage: 'Sure, we can start once you confirm the measurements.',
    lastMessageType: 'text',
    lastMessageAt: daysAgo(1),
    unreadCountCustomer: 1,
    unreadCountTailor: 0,
    createdAt: daysAgo(2),
  },
  {
    id: CONV_3,
    customerId: 'me',
    customerName: ME_CUSTOMER.name,
    customerAvatar: ME_CUSTOMER.avatar,
    tailorId: t3.id,
    tailorName: t3.name,
    tailorShopName: t3.shopName,
    tailorAvatar: t3.image,
    lastMessage: 'Yes we do! Feel free to book anytime.',
    lastMessageType: 'text',
    lastMessageAt: daysAgo(4),
    unreadCountCustomer: 0,
    unreadCountTailor: 0,
    createdAt: daysAgo(5),
  },
];
