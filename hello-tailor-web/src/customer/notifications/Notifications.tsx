import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import EmptyState from '@/components/ui/EmptyState';

const typeMeta: Record<string, { icon: string; label: string }> = {
  booking: { icon: '📅', label: 'Booking' },
  payment: { icon: '💳', label: 'Payment' },
  progress: { icon: '🛠️', label: 'Progress' },
  offers: { icon: '🏷️', label: 'Offers' },
  membership: { icon: '🎖️', label: 'Membership' },
  delivery: { icon: '🚲', label: 'Delivery' },
  system: { icon: '⚙️', label: 'System' },
};
const fallbackMeta = { icon: '🔔', label: 'Other' };
const metaFor = (t: string) => typeMeta[t] ?? fallbackMeta;

export default function Notifications() {
  const notifications = useStore(useShallow((s) => s.notifications.filter((n) => n.audience === 'customer')));
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  const types = Array.from(new Set(notifications.map((n) => n.type)));
  const groups = types.map((t) => ({ title: metaFor(t).label, data: notifications.filter((n) => n.type === t) })).filter((g) => g.data.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sm:px-6">
        <h1 className="text-[21px] font-semibold text-ht-text">Notifications</h1>
        <button onClick={() => markAllNotificationsRead('customer')} className="text-[13px] font-semibold text-ht-ocean">Mark all read</button>
      </div>
      <div className="px-4 pb-6 sm:px-6">
        {groups.length ? groups.map((g) => (
          <div key={g.title} className="mb-4">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary">{g.title}</p>
            <div className="flex flex-col gap-2.5">
              {g.data.map((item) => (
                <button key={item.id} onClick={() => markNotificationRead(item.id)} className={`flex items-start gap-3 rounded-ht-card border p-4 text-left ${!item.read ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card'}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">{metaFor(item.type).icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ht-text">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[13px] text-ht-text-secondary">{item.body}</p>
                    <p className="mt-1 text-[11px] text-ht-disabled-text">{new Date(item.time).toLocaleString('en-IN')}</p>
                  </div>
                  {!item.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ht-ocean" /> : null}
                </button>
              ))}
            </div>
          </div>
        )) : (
          <EmptyState icon="🔕" title="No Notifications" message="You're all caught up. New updates will show up here." />
        )}
      </div>
    </div>
  );
}
