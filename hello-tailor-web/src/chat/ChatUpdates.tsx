import { Link } from 'react-router-dom';
import { Bell, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useStore } from '@/store/useStore';
import { belongsTo, chatPath, unreadCount, type ChatRole } from './helpers';

export default function ChatUpdates({ role }: { role: ChatRole }) {
  const conversations = useChatStore((s) => s.conversations);
  const designs = useChatStore((s) => s.designVersions);
  const tailorId = useStore((s) => s.myTailorId);
  const mine = conversations.filter((c) => belongsTo(c, role, tailorId));
  const designUpdates = designs.filter((d) => mine.some((c) => c.id === d.conversationId)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return <section className="mb-6" aria-label="Chat and design updates">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-ht-navy">Chat & Design Updates</h2><Link to={`/${role}/messages`} className="text-xs font-semibold text-ht-ocean">View Messages</Link></div>
    <div className="space-y-2">
      {mine.filter((c) => unreadCount(c, role) > 0).map((c) => <Link key={c.id} to={chatPath(role, c.id)} className="flex gap-3 rounded-ht-card border border-ht-ocean bg-ht-info-bg p-4">
        <MessageCircle size={20} className="shrink-0 text-ht-ocean" /><div className="min-w-0"><h3 className="text-sm font-semibold">{unreadCount(c, role)} new message{unreadCount(c, role) === 1 ? '' : 's'} from {role === 'customer' ? c.tailorName : c.customerName}</h3><p className="mt-1 truncate text-xs text-ht-text-secondary">{c.lastMessage}</p></div>
      </Link>)}
      {designUpdates.map((design) => <Link key={design.id} to={chatPath(role, design.conversationId, design.id)} className="flex gap-3 rounded-ht-card border border-ht-border bg-white p-4">
        <Bell size={20} className="shrink-0 text-ht-gold" /><div><h3 className="text-sm font-semibold">{design.status === 'approved' ? 'Design approved' : design.status === 'changes_requested' ? 'Changes requested' : design.status === 'revised' ? 'Design revised' : role === 'customer' ? 'Approval required' : 'Waiting for customer approval'} · V{design.version}</h3>
          <p className="mt-1 text-xs text-ht-text-secondary">Booking #{design.bookingId} · {design.customerComment || design.tailorNote || 'Open the design in your conversation.'}</p></div>
      </Link>)}
      {!designUpdates.length && !mine.some((c) => unreadCount(c, role) > 0) && <p className="rounded-ht-card bg-white p-4 text-sm text-ht-text-secondary">You’re all caught up on messages and designs.</p>}
    </div>
  </section>;
}
