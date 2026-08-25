import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import type { Booking } from '@/store/types';
import { computePricing } from './pricing';

const PAYMENT_METHOD_MAP: Record<string, Booking['paymentMethod']> = {
  UPI: 'UPI', Card: 'Card', NetBanking: 'Net Banking', Wallet: 'Wallet',
};

export default function Processing() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const amount = params.get('amount') ?? '0';
  const method = params.get('method') ?? '';
  const booking = useStore((s) => s.booking);
  const tailors = useStore((s) => s.tailors);
  const measurements = useStore((s) => s.measurements);
  const coupons = useStore((s) => s.coupons);
  const addresses = useStore((s) => s.addresses);
  const createBooking = useStore((s) => s.createBooking);
  const resetBooking = useStore((s) => s.resetBooking);

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount === '000') {
        navigate(`/customer/booking/${tailorId}/success?failed=1`, { replace: true });
        return;
      }

      const tailor = tailors.find((t) => t.id === tailorId);
      const pricing = computePricing(booking, tailor, coupons);

      const savedMeasurement = measurements.find((m) => m.id === booking.measurementId);
      const bookingMeasurements = savedMeasurement
        ? [{ garment: booking.category ?? 'Garment', fields: Object.entries(savedMeasurement.fields).map(([label, value]) => ({ label, value })) }]
        : [];

      const address = booking.addressId ? addresses.find((a) => a.id === booking.addressId) : undefined;
      const location = address ? `${address.address}, ${address.city}` : `${tailor?.locality ?? tailor?.city ?? ''}, ${tailor?.city ?? ''}`;

      const id = `HT-${Date.now()}`;
      const newBooking: Booking = {
        id,
        customerId: 'me',
        customerName: ME_CUSTOMER.name,
        customerAvatar: ME_CUSTOMER.avatar,
        tailorId: tailorId ?? '',
        tailorName: tailor?.shopName ?? '—',
        category: booking.category ?? '',
        city: tailor?.city ?? '',
        state: tailor?.state ?? '',
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString() : new Date().toISOString(),
        deliveryDate: booking.deliveryDate ? new Date(booking.deliveryDate).toISOString() : new Date().toISOString(),
        amount: pricing.orderAmount,
        advanceAmount: pricing.advance,
        advancePaid: true,
        balancePaid: false,
        discount: pricing.discount,
        tax: pricing.tax,
        deliveryFee: pricing.deliveryFee,
        paymentMethod: PAYMENT_METHOD_MAP[method] ?? '—',
        location,
        pickupType: booking.method ?? 'Self Drop',
        status: 'Requested',
        notes: booking.notes,
        measurements: bookingMeasurements,
        designPhotos: booking.designPhotos ?? [],
        requestedAt: new Date().toISOString(),
        history: [{ stage: 'Requested', at: new Date().toISOString() }],
      };

      createBooking(newBooking);
      resetBooking();
      navigate(`/customer/booking/${tailorId}/success?id=${id}`, { replace: true });
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, tailorId, method]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ht-ocean border-t-transparent" />
      <p className="text-[17px] font-semibold text-ht-text">Processing Payment</p>
      <p className="text-[14px] text-ht-text-secondary">Please wait while we securely confirm your payment of ₹{amount}...</p>
    </div>
  );
}
