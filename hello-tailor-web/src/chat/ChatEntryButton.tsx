import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ME_CUSTOMER, useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';
import { createConversation } from '@/services/chatService';
import { chatPath, type ChatRole } from './helpers';

export default function ChatEntryButton({ role, tailorId, booking }: { role: ChatRole; tailorId?: string; booking?: Booking }) {
  const navigate = useNavigate();
  const tailors = useStore((s) => s.tailors);
  const myTailorId = useStore((s) => s.myTailorId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const tailor = tailors.find((t) => t.id === (booking?.tailorId ?? tailorId));
  const allowed = tailor && (role === 'tailor' ? tailor.id === myTailorId : !booking || booking.customerId === 'me');
  if (!allowed) return null;
  async function openChat() {
    if (!tailor || busy) return;
    setBusy(true);
    setError('');
    try {
      const conversation = await createConversation({
        customerId: booking?.customerId ?? 'me', customerName: booking?.customerName ?? ME_CUSTOMER.name,
        customerAvatar: booking?.customerAvatar ?? ME_CUSTOMER.avatar,
        tailorId: tailor.id, tailorName: tailor.name, tailorShopName: tailor.shopName, tailorAvatar: tailor.image,
        bookingId: booking?.id, bookingCategory: booking?.category,
      });
      navigate(chatPath(role, conversation.id));
    } catch { setError('Unable to open chat. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className="my-3">
    <Button type="button" variant="secondary" icon={<MessageCircle size={18} />} disabled={busy} onClick={openChat}
      label={busy ? 'Opening chat…' : role === 'customer' ? 'Chat with Tailor' : 'Chat with Customer'} />
    {error && <p role="alert" className="mt-2 text-sm text-ht-error">{error}</p>}
  </div>;
}
