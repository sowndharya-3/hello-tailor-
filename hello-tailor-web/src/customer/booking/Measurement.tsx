import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { measurementFieldsByCategory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { clsx } from '@/components/ui/clsx';

export default function MeasurementStep() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const measurements = useStore((s) => s.measurements);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const savedForPerson = measurements.filter((m) => m.personId === booking.personId && m.category === booking.category);

  const [mode, setMode] = useState<'Use Saved' | 'New Measurement'>(savedForPerson.length ? 'Use Saved' : 'New Measurement');
  const [selectedSaved, setSelectedSaved] = useState(savedForPerson[0]?.id);
  const fields = measurementFieldsByCategory[booking.category ?? 'Men'] ?? ['Length'];
  const [values, setValues] = useState<Record<string, string>>({});
  const [label, setLabel] = useState(`${booking.category ?? ''} Measurement`);

  const canContinue = mode === 'Use Saved' ? !!selectedSaved : fields.every((f) => values[f]?.trim());

  const submit = () => {
    if (mode === 'Use Saved') {
      updateBooking({ measurementId: selectedSaved });
    } else {
      const id = `m-local-${Date.now()}`;
      addMeasurement({ id, label, personId: booking.personId ?? 'self', category: booking.category ?? '', date: 'Today', fields: values });
      updateBooking({ measurementId: id });
    }
    navigate(`/customer/booking/${tailorId}/date`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader
        title="Measurement"
        subtitle={booking.category}
        right={<button onClick={() => navigate(`/customer/booking/${tailorId}/measurement-history`)} className="text-ht-ocean">🕐</button>}
      />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={5} total={11} label="Measurement" /></div>
      <div className="flex flex-col gap-5 p-4 sm:px-6">
        <SegmentedControl options={[{ label: 'Use Saved', value: 'Use Saved' }, { label: 'New Measurement', value: 'New Measurement' }]} value={mode} onChange={setMode} />

        {mode === 'Use Saved' ? (
          savedForPerson.length ? (
            <div className="flex flex-col gap-2.5">
              {savedForPerson.map((m) => (
                <button key={m.id} onClick={() => setSelectedSaved(m.id)} className={clsx('flex items-center gap-3 rounded-ht-card border-[1.5px] p-4 text-left', selectedSaved === m.id ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card')}>
                  <span className="text-xl">📏</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-ht-text">{m.label}</p>
                    <p className="text-[12px] text-ht-text-secondary">Saved on {m.date} • {Object.keys(m.fields).length} fields</p>
                  </div>
                  <span>{selectedSaved === m.id ? '🔵' : '⚪'}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-ht-text-secondary">No saved measurements for this person & category yet. Add a new one below.</p>
          )
        ) : (
          <div>
            <p className="mb-2 text-[14px] font-medium text-ht-text">Measurement Name</p>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="mb-4 h-12.5 w-full rounded-ht-input border-[1.5px] border-ht-border px-3.5 text-[14px] text-ht-text outline-none" style={{ height: 50 }} />
            <div className="mb-4 flex flex-col items-center gap-2 rounded-ht-card bg-ht-info-bg py-6 text-center">
              <span className="text-3xl">📏</span>
              <p className="px-6 text-[13px] text-ht-ocean">Enter measurements in inches based on your {booking.category?.toLowerCase()} garment</p>
            </div>
            {fields.map((f) => (
              <div key={f} className="mb-3">
                <p className="mb-2 text-[14px] font-medium text-ht-text">{f} (in)</p>
                <input
                  value={values[f] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f]: e.target.value }))}
                  placeholder="e.g. 38"
                  className="w-full rounded-ht-input border-[1.5px] border-ht-border px-3.5 text-[14px] text-ht-text outline-none"
                  style={{ height: 50 }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} disabled={!canContinue} />
      </div>
    </div>
  );
}
