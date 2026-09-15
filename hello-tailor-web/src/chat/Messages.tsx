import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, Search } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useStore } from '@/store/useStore';
import { getConversations } from '@/services/chatService';
import { belongsTo, chatPath, conversationStatus, unreadCount, type ChatRole } from './helpers';

export default function Messages({ role }: { role: ChatRole }) {
  const conversations = useChatStore((s) => s.conversations);
  const versions = useChatStore((s) => s.designVersions);
  const tailorId = useStore((s) => s.myTailorId);
  const bookings = useStore((s) => s.bookings);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    getConversations().then(() => { if (active) setState('ready'); }).catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, [attempt]);
  const filters = role === 'tailor' ? ['All', 'Unread', 'Active Orders', 'Awaiting Approval', 'Changes Requested', 'Completed'] : ['All', 'Unread'];
  const matches = conversations.filter((c) => belongsTo(c, role, tailorId))
    .filter((c) => filter === 'All' || (filter === 'Unread' ? unreadCount(c, role) > 0 : conversationStatus(c, versions, bookings) === filter))
    .filter((c) => `${role === 'customer' ? `${c.tailorName} ${c.tailorShopName}` : c.customerName} ${c.bookingId ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  return <section className="mx-auto max-w-3xl p-4 sm:p-6">
    <header className="mb-5 flex items-center justify-between">
      <div><h1 className="text-2xl font-semibold text-ht-navy">Messages</h1><p className="mt-1 text-sm text-ht-text-secondary">Designs, details and updates in one place.</p></div>
      <Link to={`/${role}/notifications`} aria-label="Notifications" className="rounded-full border border-ht-border bg-white p-3 text-ht-navy"><Bell size={20} /></Link>
    </header>
    <label className="mb-4 flex items-center gap-2 rounded-ht-input border border-ht-border bg-white px-3 text-ht-text-secondary">
      <Search size={18} /><input aria-label="Search conversations" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder={role === 'customer' ? 'Search tailor, shop or booking' : 'Search customer or booking'} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" />
    </label>
    <div className="mb-5 flex flex-wrap gap-2" aria-label="Conversation filters">{filters.map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}
      className={`rounded-full border px-4 py-2 text-xs font-medium ${filter === item ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-white text-ht-text-secondary'}`}>{item}</button>)}</div>
    {state === 'loading' ? <p role="status" className="rounded-ht-card bg-white p-8 text-center text-ht-text-secondary">Loading conversations…</p> : state === 'error' ? <div role="alert" className="p-8 text-center">
      <p>Unable to load conversations.</p><button className="mt-3 font-semibold text-ht-ocean" onClick={() => { setState('loading'); setAttempt((n) => n + 1); }}>Try again</button>
    </div> : matches.length ? <div className="overflow-hidden rounded-ht-card border border-ht-border bg-white">{matches.map((conversation) => {
      const unread = unreadCount(conversation, role);
      const name = role === 'customer' ? conversation.tailorName : conversation.customerName;
      return <Link key={conversation.id} to={chatPath(role, conversation.id)} className="flex gap-3 border-b border-ht-border p-4 last:border-0 hover:bg-ht-info-bg">
        <img src={role === 'customer' ? conversation.tailorAvatar : conversation.customerAvatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h2 className="truncate text-sm font-semibold text-ht-text">{name}</h2>
          <time className="shrink-0 text-[11px] text-ht-text-secondary" dateTime={conversation.lastMessageAt}>{new Date(conversation.lastMessageAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</time></div>
          {role === 'customer' && <p className="truncate text-xs text-ht-text-secondary">{conversation.tailorShopName}</p>}
          {conversation.bookingId && <p className="mt-1 text-xs font-medium text-ht-ocean">Booking #{conversation.bookingId} · {conversationStatus(conversation, versions, bookings)}</p>}
          <p className="mt-1 truncate text-sm text-ht-text-secondary">{conversation.lastMessage || 'Start your conversation'}</p>
        </div>{unread > 0 && <span aria-label={`${unread} unread messages`} className="my-auto rounded-full bg-ht-ocean px-2 py-0.5 text-xs text-white">{unread}</span>}
      </Link>;
    })}</div> : <div className="rounded-ht-card border border-ht-border bg-white p-10 text-center"><MessageCircle className="mx-auto mb-3 text-ht-ocean" size={36} />
      <h2 className="font-semibold text-ht-navy">{query ? 'No matching conversations' : filter === 'Unread' ? 'You’re all caught up' : filter !== 'All' ? 'No conversations in this filter' : 'No messages yet'}</h2>
      <p className="mt-2 text-sm text-ht-text-secondary">{query ? 'Try another name or booking number.' : filter !== 'All' ? 'Choose All to see your conversations.' : role === 'customer' ? 'Open a tailor profile or booking to start a chat.' : 'Open a booking to message your customer.'}</p>
    </div>}
  </section>;
}
