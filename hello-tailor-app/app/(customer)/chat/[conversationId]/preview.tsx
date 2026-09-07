// Attachment preview screen — pushed from the chat room after AttachmentBottomSheet.onPicked.
// The picked file:// uri is a plain string so it travels as a router param with no extra
// plumbing (ponytail: no module-level id/ref indirection needed for a local file path).
import { useState } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme';
import ImagePreview from '@/components/chat/ImagePreview';
import { sendAttachment } from '@/services/chatService';
import type { PhotoType } from '@/store/chatTypes';

type AttachmentMessageType = 'reference_design' | 'cloth_photo' | 'measurement_reference';

// Customer-sent attachments only cover these three intents in this app's booking flow — a
// customer-side "progress photo" isn't a real use case, so anything else (e.g. "Other"/"Final
// Design") falls back to 'reference_design' as the sane default per the brief.
const PHOTO_TYPE_TO_MESSAGE_TYPE: Partial<Record<PhotoType, AttachmentMessageType>> = {
  'Reference Design': 'reference_design',
  'Cloth Photo': 'cloth_photo',
  'Measurement Reference': 'measurement_reference',
};

export default function ChatAttachmentPreview() {
  const { conversationId, uri, suggestedType } = useLocalSearchParams<{
    conversationId: string;
    uri: string;
    suggestedType?: string;
  }>();
  const [currentUri, setCurrentUri] = useState(uri);

  const initialPhotoType = (suggestedType || undefined) as PhotoType | undefined;

  const handleReplace = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets?.[0]?.uri) setCurrentUri(result.assets[0].uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.text }}>
      <ImagePreview
        uri={currentUri}
        initialPhotoType={initialPhotoType}
        onReplace={handleReplace}
        onRemove={() => router.back()}
        onSend={async (caption, photoType) => {
          const messageType: AttachmentMessageType = PHOTO_TYPE_TO_MESSAGE_TYPE[photoType] ?? 'reference_design';
          await sendAttachment(conversationId, 'customer', 'me', messageType, currentUri, photoType, caption || undefined);
          router.back();
        }}
      />
    </View>
  );
}
