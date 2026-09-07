// Attachment preview/send step for the tailor chat room. Key tailor-specific behavior: a
// Progress Photo or Final Design attached to a booking-linked conversation goes through
// uploadDesignForApproval (creates the "DESIGN PREVIEW — V{n}" approval card the customer
// approves), everything else is a plain sendAttachment.
import { useState } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import ImagePreview from '@/components/chat/ImagePreview';
import { useConversationById } from '@/store/chatStore';
import { sendAttachment, uploadDesignForApproval } from '@/services/chatService';
import { ME_TAILOR_ID } from '@/data/seed';
import type { PhotoType } from '@/store/chatTypes';

// ponytail: small enough to duplicate rather than import across a dynamic-route file boundary
// (fragile with Metro's resolution of "[conversationId]" as both a file and a sibling directory).
const PHOTO_TYPE_TO_MESSAGE_TYPE: Record<PhotoType, 'reference_design' | 'cloth_photo' | 'measurement_reference' | 'progress_photo'> = {
  'Reference Design': 'reference_design',
  'Cloth Photo': 'cloth_photo',
  'Measurement Reference': 'measurement_reference',
  'Progress Photo': 'progress_photo',
  'Final Design': 'progress_photo',
  Other: 'progress_photo',
};

export default function TailorChatAttachmentPreview() {
  const { conversationId, uri, suggestedType } = useLocalSearchParams<{
    conversationId: string;
    uri: string;
    suggestedType?: string;
  }>();
  const conversation = useConversationById(conversationId);
  const [currentUri, setCurrentUri] = useState(uri);

  const handleReplace = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets?.[0]?.uri) setCurrentUri(result.assets[0].uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImagePreview
        uri={currentUri}
        initialPhotoType={(suggestedType || undefined) as PhotoType | undefined}
        onReplace={handleReplace}
        onRemove={() => router.back()}
        onSend={(caption, photoType) => {
          const isDesignPhoto = photoType === 'Progress Photo' || photoType === 'Final Design';
          if (isDesignPhoto && conversation?.bookingId) {
            uploadDesignForApproval(conversationId, conversation.bookingId, ME_TAILOR_ID, currentUri, caption);
          } else {
            sendAttachment(conversationId, 'tailor', ME_TAILOR_ID, PHOTO_TYPE_TO_MESSAGE_TYPE[photoType], currentUri, photoType, caption);
          }
          router.back();
        }}
      />
    </View>
  );
}
