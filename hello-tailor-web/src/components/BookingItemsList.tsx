// Read-only itemised list of the garments in a booking (used by the customer review/summary
// steps, the tailor's request/order screens and the customer's order view). Every garment is an
// independent card with its own gender, garment, measurements, material, colour, quantity, notes.
import type { BookingItem } from '@/store/types';
import { colourLabel, itemTitle, materialLabel, validateItem } from '@/lib/bookingItems';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function BookingItemsList({
  items,
  onRemove,
  showCharges,
  personName,
}: {
  items: BookingItem[];
  onRemove?: (id: string) => void; // when given, each card shows a Remove button
  showCharges?: boolean; // show the tailor's per-item stitching/material charges when present
  personName?: (item: BookingItem) => string | undefined; // customer-side only: who the garment is for
}) {
  return (
    <ol className="flex flex-col gap-3" aria-label="Garments in this booking">
      {items.map((item, index) => {
        // Completeness warnings only make sense while the customer can still fix the item; read-only
        // views (tailor, submitted orders — incl. older bookings without material/colour data) skip them.
        const missing = onRemove ? validateItem(item) : [];
        const hasCharges = showCharges && (item.stitchingCharge !== undefined || item.materialCost !== undefined);
        return (
          <li key={item.id} className="rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ht-text-secondary">Item {index + 1}</p>
                <h3 className="mt-0.5 break-words text-[15px] font-semibold text-ht-text">{itemTitle(item)}</h3>
              </div>
              {onRemove && (
                <button type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${itemTitle(item)}`}
                  className="shrink-0 rounded-ht-input px-3 py-2 text-[13px] font-semibold text-ht-error hover:bg-ht-error/5">
                  Remove
                </button>
              )}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              {personName?.(item) && <Field label="For" value={personName(item)!} />}
              <Field label="Material" value={materialLabel(item) || '—'} />
              <Field label="Colour" value={colourLabel(item) || '—'} />
              <Field label="Quantity" value={String(item.quantity)} />
              <Field label="Measurements" value={item.measurement?.fields.length ? 'Completed' : 'Missing'} bad={!item.measurement?.fields.length} />
              <Field label="Cloth" value={item.customerProvidedCloth ? 'Customer provides' : 'Tailor provides'} />
              <Field label="Design photos" value={`${item.designPhotos.length} attached`} />
            </dl>
            {item.notes && <p className="mt-3 break-words rounded-ht-input bg-ht-bg p-2.5 text-[12px] text-ht-text-secondary">Note: {item.notes}</p>}
            {hasCharges && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-ht-border pt-3 text-[13px]">
                <span className="text-ht-text-secondary">Stitching <b className="text-ht-text">{inr(item.stitchingCharge ?? 0)}</b></span>
                <span className="text-ht-text-secondary">Material <b className="text-ht-text">{inr(item.materialCost ?? 0)}</b></span>
              </div>
            )}
            {missing.length > 0 && (
              <p role="alert" className="mt-3 text-[12px] font-medium text-ht-error">Missing: {missing.join(', ')}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-ht-text-secondary">{label}</dt>
      <dd className={`break-words font-medium ${bad ? 'text-ht-error' : 'text-ht-text'}`}>{value}</dd>
    </div>
  );
}
