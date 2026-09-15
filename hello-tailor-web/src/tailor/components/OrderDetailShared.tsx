// Shared read-only cards used by both the booking-request detail screen and the order detail
// screen. Ported from hello-tailor-app/components/tailor/OrderDetailShared.tsx.
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import type { Booking } from '@/store/types';
import { formatCurrency, formatDate } from '../lib/status';
import ChatEntryButton from '@/chat/ChatEntryButton';

export function CustomerInfoCard({ order }: { order: Booking }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <Avatar src={order.customerAvatar} size={48} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ht-text">{order.customerName}</p>
          <p className="text-[12px] text-ht-text-secondary">{order.category}</p>
        </div>
        <p className="text-[11px] font-medium text-ht-text-secondary">{order.id}</p>
      </div>
      <div className="my-4 h-px bg-ht-border" />
      <div className="flex flex-col gap-2 text-[13px] text-ht-text">
        <p>📅 Booked {formatDate(order.bookingDate)}</p>
        <p>📦 Deliver by {formatDate(order.deliveryDate)}</p>
        <p>📍 {order.location}</p>
        <p>{order.pickupType === 'Home Delivery' || order.pickupType === 'Tailor Pickup' ? '🏠' : '🏬'} {order.pickupType}</p>
      </div>
      <ChatEntryButton role="tailor" booking={order} />
    </Card>
  );
}

export function CustomerNotesCard({ notes }: { notes?: string }) {
  if (!notes) return null;
  return (
    <Card className="border border-[#F0DDAE] bg-ht-gold-light">
      <p className="flex items-center gap-2 font-semibold text-[#9C7523]">💬 Customer Notes</p>
      <p className="mt-2 text-[13px] leading-relaxed text-ht-text">{notes}</p>
    </Card>
  );
}

export function FinancialSummaryCard({ order }: { order: Booking }) {
  const balance = order.amount - order.advanceAmount;
  return (
    <Card>
      <p className="mb-3 font-semibold text-ht-text">Financial Summary</p>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ht-text-secondary">Total Amount</p>
        <p className="text-[22px] font-bold text-ht-text">{formatCurrency(order.amount)}</p>
      </div>
      <div className="my-3 h-px bg-ht-border" />
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-ht-text-secondary">Advance Amount</p>
          <p className="font-semibold text-ht-text">{formatCurrency(order.advanceAmount)}</p>
        </div>
        <Badge label={order.advancePaid ? 'Paid' : 'Pending'} tone={order.advancePaid ? 'success' : 'warning'} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-ht-text-secondary">Balance Amount</p>
          <p className="font-semibold text-ht-text">{formatCurrency(balance)}</p>
        </div>
        <Badge label={order.balancePaid ? 'Paid' : 'Pending'} tone={order.balancePaid ? 'success' : 'warning'} />
      </div>
    </Card>
  );
}

export function MeasurementsPreviewCard({ order, onOpen }: { order: Booking; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="block w-full text-left">
      <Card>
        <div className="flex items-center gap-2">
          <span>📏</span>
          <p className="flex-1 font-semibold text-ht-text">Customer Measurements</p>
          <span className="text-ht-text-secondary">›</span>
        </div>
        <p className="mt-1 text-[12px] text-ht-text-secondary">
          {order.measurements.length} garment{order.measurements.length > 1 ? 's' : ''} · tap to view details
        </p>
      </Card>
    </button>
  );
}

export function DesignPhotosPreviewCard({ order, onOpen }: { order: Booking; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="block w-full text-left">
      <Card>
        <div className="flex items-center gap-2">
          <span>🖼️</span>
          <p className="flex-1 font-semibold text-ht-text">Design Reference Photos</p>
          <span className="text-ht-text-secondary">›</span>
        </div>
        <div className="mt-3 flex gap-2">
          {order.designPhotos.slice(0, 3).map((uri) => (
            <img key={uri} src={uri} alt="" className="h-14 w-14 rounded-[10px] object-cover" />
          ))}
        </div>
      </Card>
    </button>
  );
}
