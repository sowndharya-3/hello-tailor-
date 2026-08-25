import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function MeasurementHistory() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const measurements = useStore((s) => s.measurements);
  const family = useStore((s) => s.family);
  const updateBooking = useStore((s) => s.updateBooking);
  const personName = (id: string) => (id === 'self' ? 'Myself' : family.find((f) => f.id === id)?.name ?? id);

  return (
    <div>
      <ScreenHeader title="Measurement History" />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {measurements.length ? measurements.map((item) => (
          <div key={item.id} className="rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex justify-between">
              <p className="text-[15px] font-semibold text-ht-text">{item.label}</p>
              <span className="text-[12px] text-ht-disabled-text">{item.date}</span>
            </div>
            <p className="mt-0.5 text-[12px] text-ht-text-secondary">{personName(item.personId)} • {item.category}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {Object.entries(item.fields).map(([k, v]) => (
                <span key={k} className="rounded-full bg-ht-info-bg px-2.5 py-1 text-[11px] text-ht-ocean">{k}: {v}</span>
              ))}
            </div>
            <div className="mt-2.5 flex gap-2.5">
              <button className="flex-1 rounded-ht-button border border-ht-ocean py-2.5 text-[13px] font-semibold text-ht-ocean">Edit</button>
              <button
                onClick={() => { updateBooking({ measurementId: item.id, personId: item.personId, category: item.category }); navigate(-1); }}
                className="flex-1 rounded-ht-button bg-ht-ocean py-2.5 text-[13px] font-semibold text-white"
              >
                Use for this Booking
              </button>
            </div>
          </div>
        )) : (
          <EmptyState icon="📏" title="No Measurements Saved" message="Add a measurement while booking to see it here." />
        )}
      </div>
    </div>
  );
}
