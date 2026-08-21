// Thin wrapper over the shared DayTimeRow ui component — ported from
// tailor-app/components/WorkingHoursEditor.tsx unchanged (logic-only, no styling of its own).
import { View } from 'react-native';
import { DayTimeRow } from '@/components/ui/DayTimeRow';
import type { DayHours } from '@/store/useStore';

export function WorkingHoursEditor({ hours, onChange }: { hours: DayHours[]; onChange: (h: DayHours[]) => void }) {
  const updateDay = (idx: number, row: DayHours) => {
    const next = [...hours];
    next[idx] = row;
    onChange(next);
  };

  const applyToAll = (idx: number) => {
    const source = hours[idx];
    onChange(hours.map((h) => (h.open ? { ...h, from: source.from, to: source.to } : h)));
  };

  return (
    <View>
      {hours.map((row, idx) => (
        <DayTimeRow key={row.day} row={row} onChange={(r) => updateDay(idx, r)} onApplyToAll={() => applyToAll(idx)} />
      ))}
    </View>
  );
}
