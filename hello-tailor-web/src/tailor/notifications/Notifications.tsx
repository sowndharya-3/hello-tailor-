// Ported from hello-tailor-app/app/(tailor)/notifications.tsx.
import { useShallow } from 'zustand/react/shallow';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';
import { timeAgo } from '../lib/status';
import ChatUpdates from '@/chat/ChatUpdates';

const ICONS: Record<string, string> = {
  booking: '📅',
  cancelled: '❌',
  payment: '💰',
  order_reminder: '⏰',
  delivery_reminder: '📦',
  review: '⭐',
  membership: '💎',
  advertisement: '📣',
  system: 'ℹ️',
};

export default function Notifications() {
  const notifications = useStore(useShallow((s) => s.notifications.filter((n) => n.audience === 'tailor')));
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);

  const groups = [
    { title: 'New', items: notifications.filter((n) => !n.read) },
    { title: 'Earlier', items: notifications.filter((n) => n.read) },
  ];

  return (
    <div>
      <ScreenHeader title="Notifications" right={<button onClick={() => markAllRead('tailor')} className="text-[12px] font-medium text-ht-ocean">Mark all read</button>} />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <ChatUpdates role="tailor" />
        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No Notifications" message="You're all caught up. New alerts will show up here." />
        ) : (
          groups.map((g) => g.items.length > 0 && (
            <div key={g.title}>
              <p className="mb-2 mt-4 text-[13px] font-semibold uppercase text-ht-text-secondary first:mt-0">{g.title}</p>
              <div className="flex flex-col gap-2">
                {g.items.map((n) => (
                  <button key={n.id} onClick={() => markRead(n.id)} className="block w-full text-left">
                    <Card className={clsx(!n.read && 'border-[#CDE8F9] bg-ht-info-bg')}>
                      <div className="flex items-start gap-3">
                        <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', !n.read ? 'bg-white' : 'bg-ht-disabled-bg')}>
                          {ICONS[n.type] ?? '🔔'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ht-text">{n.title}</p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-ht-text-secondary">{n.body}</p>
                          <p className="mt-1 text-[11px] text-ht-text-secondary">{timeAgo(n.time)}</p>
                        </div>
                        {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ht-ocean" />}
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
