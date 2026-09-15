import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import type { Booking } from '@/store/types';

export default function Processing() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const tailors = useStore((s) => s.tailors);
  const measurements = useStore((s) => s.measurements);
  const addresses = useStore((s) => s.addresses);
  const createBooking = useStore((s) => s.createBooking);
  const resetBooking = useStore((s) => s.resetBooking);

  useEffect(() => {
    const t = setTimeout(() => {
      const tailor = tailors.find((t) => t.id === tailorId);

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
        gender: booking.gender,
        service: booking.service,
        customerProvidedCloth: booking.customerProvidedCloth,
        materialPreference: booking.clothType,
        colourPreference: booking.colour,
        pickupSlot: booking.timeSlot,
        finalDeliveryMethod: booking.deliveryMethod,
        quoteStatus: 'Pending',
        city: tailor?.city ?? '',
        state: tailor?.state ?? '',
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString() : new Date().toISOString(),
        deliveryDate: booking.deliveryDate ? new Date(booking.deliveryDate).toISOString() : new Date().toISOString(),
        amount: 0,
        advanceAmount: 0,
        advancePaid: false,
        balancePaid: false,
        discount: 0,
        tax: 0,
        deliveryFee: 0,
        paymentMethod: '—',
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
  }, [tailorId]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ht-ocean border-t-transparent" />
      <p className="text-[17px] font-semibold text-ht-text">Submitting Request</p>
      <p className="text-[14px] text-ht-text-secondary">Sending your measurements and preferences to the tailor...</p>
    </div>
  );
}
