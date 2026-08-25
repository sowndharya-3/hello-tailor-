// Ported from hello-tailor-app/app/(tailor)/order/[id]/measurements.tsx.
import { useParams } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';

export default function OrderMeasurements() {
  const { id } = useParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));

  if (!order) return null;

  return (
    <div>
      <ScreenHeader title="Measurements" />
      <p className="px-4 pt-2 text-[13px] text-ht-text-secondary sm:px-6">{order.customerName}</p>
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
        {order.measurements.map((m) => (
          <Card key={m.garment}>
            <p className="font-semibold text-ht-text">{m.garment}</p>
            <div className="my-3 h-px bg-ht-border" />
            {m.fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between border-b border-ht-border py-2 last:border-b-0">
                <span className="text-[13px] text-ht-text-secondary">{f.label}</span>
                <span className="text-[13px] font-semibold text-ht-text">{f.value}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
