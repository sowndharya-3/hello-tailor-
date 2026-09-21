// Helpers for bookings that contain one or more garments (BookingItem). Shared by the customer
// booking flow, the tailor quotation screen and the order views so every place reads material /
// colour / title / validity the same way.
import type { Booking, BookingItem } from '@/store/types';

export const OTHER = 'Other';

export function materialLabel(item: Pick<BookingItem, 'material' | 'customMaterial'>): string {
  return item.material === OTHER ? item.customMaterial?.trim() ?? '' : item.material;
}

export function colourLabel(item: Pick<BookingItem, 'colour' | 'customColour'>): string {
  return item.colour === OTHER ? item.customColour?.trim() ?? '' : item.colour;
}

export function itemTitle(item: Pick<BookingItem, 'gender' | 'category'>): string {
  const owner = item.gender === 'Men' ? "Men's" : item.gender === 'Women' ? "Women's" : "Kids'";
  return `${owner} ${item.category}`;
}

// Per-item mandatory-field check. Returns a human-readable list of what is missing (empty = valid).
export function validateItem(item: BookingItem): string[] {
  const missing: string[] = [];
  if (!item.gender) missing.push('Gender');
  if (!item.category) missing.push('Garment');
  if (!item.measurement || item.measurement.fields.length === 0) missing.push('Measurements');
  if (!item.material) missing.push('Material');
  else if (item.material === OTHER && !item.customMaterial?.trim()) missing.push('Material type (you chose Other)');
  if (!item.colour) missing.push('Colour');
  else if (item.colour === OTHER && !item.customColour?.trim()) missing.push('Colour (you chose Other)');
  if (!Number.isFinite(item.quantity) || item.quantity < 1) missing.push('Quantity');
  return missing;
}

export function categorySummary(items: Pick<BookingItem, 'category'>[]): string {
  return [...new Set(items.map((i) => i.category))].join(', ');
}

// Every booking is read as a list of items. Bookings created before multi-garment support (and the
// seeded demo data) only carry the flat category/gender/materialPreference/... fields, so those are
// presented as a single-item list — a one-garment booking behaves exactly as it always did.
export function bookingItemsOf(booking: Booking): BookingItem[] {
  if (booking.items?.length) return booking.items;
  return [
    {
      id: `legacy-${booking.id}`,
      gender: booking.gender ?? 'Men',
      category: booking.category,
      service: booking.service,
      measurement: booking.measurements[0],
      material: booking.materialPreference ?? '',
      colour: booking.colourPreference ?? '',
      quantity: 1,
      customerProvidedCloth: booking.customerProvidedCloth ?? true,
      designPhotos: booking.designPhotos,
      stitchingCharge: booking.stitchingCharge,
      materialCost: booking.materialCost,
    },
  ];
}

// Who a garment is for, from the customer's own family list (customer-side screens only).
export function personNameFor(item: Pick<BookingItem, 'personId'>, family: { id: string; name: string }[], selfName: string): string | undefined {
  if (!item.personId) return undefined;
  if (item.personId === 'self') return 'Myself';
  return family.find((f) => f.id === item.personId)?.name ?? selfName;
}
