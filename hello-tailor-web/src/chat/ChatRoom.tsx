import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCheck, Clock, Plus, Send } from 'lucide-react';
import { useChatStore, useConversationById, useMessages, useIsTyping, simulateTypingPulse } from '@/store/chatStore';
import { useStore } from '@/store/useStore';
import { getMessages, markMessageRead, retryMessage, sendAttachment, sendMessage, sendVoiceMessage, uploadDesignForApproval } from '@/services/chatService';
import type { DesignVersion, Message, PhotoType } from '@/store/chatTypes';
import AttachmentDialog from './AttachmentDialog';
import DesignReviewDialog from './DesignReviewDialog';
import ChatDialog from './ChatDialog';
import VoiceMessage from './VoiceMessage';
import VoiceRecorder from './VoiceRecorder';
import { belongsTo, unreadCount, type ChatRole } from './helpers';

const STATUS_LABELS = { pending: 'Waiting for Approval', approved: 'Design Approved', changes_requested: 'Changes Requested', revised: 'Revised' };

export default function ChatRoute({ role }: { role: ChatRole }) {
  const { conversationId = '' } = useParams();
  return <ChatRoom key={`${role}:${conversationId}`} role={role} conversationId={conversationId} />;
}

function ChatRoom({ role, conversationId }: { role: ChatRole; conversationId: string }) {
  const conversation = useConversationById(conversationId);
  const messages = useMessages(conversationId);
  const versions = useChatStore((s) => s.designVersions);
  const myTailorId = useStore((s) => s.myTailorId);
  const isTyping = useIsTyping(conversationId, role === 'customer' ? 'tailor' : 'customer');
  const [params] = useSearchParams();
  const designTarget = params.get('design');
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState<PhotoType | null>(null);
  const [review, setReview] = useState<{ version: DesignVersion; mode: 'approve' | 'changes' } | null>(null);
  const [image, setImage] = useState<{ url: string; label: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollTarget = useRef<string | null>(null);
  const allowed = conversation && belongsTo(conversation, role, myTailorId);
  const hasUnread = Boolean(conversation && unreadCount(conversation, role)) || messages.some((m) => m.senderType !== role && m.senderType !== 'system' && m.status !== 'read');
  useEffect(() => {
    let active = true;
    getMessages(conversationId).then(() => { if (active) setLoadState('ready'); }).catch(() => { if (active) setLoadState('error'); });
    return () => { active = false; };
  }, [conversationId, attempt]);
  useEffect(() => {
    if (allowed && loadState === 'ready' && hasUnread) void markMessageRead(conversationId, role);
  }, [allowed, conversationId, hasUnread, loadState, role]);
  useEffect(() => {
    if (loadState !== 'ready') return;
    const list = listRef.current;
    if (designTarget && lastScrollTarget.current !== designTarget) {
      const card = document.getElementById(`design-${designTarget}`);
      if (card) { card.scrollIntoView({ block: 'center' }); lastScrollTarget.current = designTarget; return; }
    }
    if (list) list.scrollTop = list.scrollHeight;
  }, [designTarget, loadState, messages.length]);

  if (!allowed) return <div className="p-8 text-center"><h1 className="text-xl font-semibold">Conversation not found</h1><p className="mt-2 text-sm text-ht-text-secondary">This conversation is not available for your current role.</p><Link to={`/${role}/messages`} className="mt-4 inline-block font-medium text-ht-ocean">Back to Messages</Link></div>;
  const otherName = role === 'customer' ? conversation.tailorShopName || conversation.tailorName : conversation.customerName;
  const senderId = role === 'customer' ? conversation.customerId : conversation.tailorId;
  const latestVersion = versions.filter((v) => v.conversationId === conversationId).sort((a, b) => b.version - a.version)[0];

  async function sendText() {
    if (!text.trim() || sending) return;
    setSending(true); setError('');
    try { await sendMessage(conversationId, role, senderId, text.trim()); setText(''); simulateTypingPulse(conversationId, role === 'customer' ? 'tailor' : 'customer'); }
    catch { setError('Your message could not be sent. Please try again.'); }
    finally { setSending(false); }
  }

  async function sendVoice(dataUrl: string, durationSec: number, mimeType: string) {
    setSending(true); setError('');
    try { await sendVoiceMessage(conversationId, role, senderId, dataUrl, durationSec, mimeType); simulateTypingPulse(conversationId, role === 'customer' ? 'tailor' : 'customer'); }
    finally { setSending(false); }
  }

  function photoButton(url: string, label: string) {
    return <button type="button" aria-label={`View ${label}`} onClick={() => setImage({ url, label })} className="block w-full overflow-hidden rounded-xl bg-ht-bg">
      <img src={url} alt={label} loading="lazy" className="max-h-72 w-full object-cover" />
    </button>;
  }

  function renderMessage(message: Message) {
    if (message.messageType === 'system') return <p className="mx-auto my-2 max-w-[90%] rounded-full bg-ht-disabled-bg px-4 py-1.5 text-center text-xs text-ht-text-secondary">{message.text}</p>;
    const mine = message.senderType === role;
    const version = versions.find((v) => v.id === message.designVersionId);
    return <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <article aria-label={`${mine ? 'You' : otherName}: ${message.messageType.replaceAll('_', ' ')}`} className={`max-w-[88%] rounded-2xl border p-3 text-sm sm:max-w-[75%] ${version ? 'w-80 border-ht-border bg-white text-ht-text' : mine ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-white text-ht-text'}`}>
        {version && message.messageType === 'change_request' ? <>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ht-error">Change requested · Design V{version.version}</p>
          <div className="mb-2 flex flex-wrap gap-1">{version.changeCategories?.map((category) => <span key={category} className="rounded-full bg-ht-bg px-2 py-1 text-xs">{category}</span>)}</div>
          <p className="whitespace-pre-wrap break-words">{version.customerComment}</p>
          {version.changeReferenceImageUrl && photoButton(version.changeReferenceImageUrl, `Change reference V${version.version}`)}
          {role === 'tailor' && latestVersion?.id === version.id && version.status === 'changes_requested' && <button type="button" onClick={() => setAttachment('Final Design')} className="mt-3 w-full rounded-ht-button bg-ht-ocean p-3 font-semibold text-white">Upload revised design</button>}
        </> : version ? <div id={`design-${version.id}`} className="scroll-mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ht-gold">Design Preview — V{version.version}</p>
          {photoButton(version.imageUrl, `Design V${version.version}`)}
          <Link to={`/${role}/order/${encodeURIComponent(version.bookingId)}`} className="mt-2 inline-block text-xs font-medium text-ht-ocean">Booking #{version.bookingId}</Link>
          {version.tailorNote && <p className="mt-2 whitespace-pre-wrap break-words">{version.tailorNote}</p>}
          <p className={`mt-3 text-xs font-semibold ${version.status === 'approved' ? 'text-ht-success' : version.status === 'changes_requested' ? 'text-ht-error' : 'text-ht-ocean'}`}>{STATUS_LABELS[version.status]}</p>
          {role === 'customer' && version.status === 'pending' && latestVersion?.id === version.id && <div className="mt-3 flex flex-col gap-2">
            <button type="button" className="rounded-ht-button bg-ht-ocean p-3 font-semibold text-white" onClick={() => setReview({ version, mode: 'approve' })}>Approve Design</button>
            <button type="button" className="rounded-ht-button border border-ht-ocean p-3 font-semibold text-ht-ocean" onClick={() => setReview({ version, mode: 'changes' })}>Request Changes</button>
          </div>}
        </div> : <>
          {message.messageType === 'voice' && message.attachments?.[0] ? <VoiceMessage id={message.id} src={message.attachments[0].fileUrl} durationSec={message.attachments[0].durationSec ?? 0} mine={mine} /> : message.attachments?.map((file) => <div key={file.id} className="mb-2"><p className="mb-2 text-xs font-semibold uppercase tracking-wide">{file.photoType ?? 'Photo'}</p>{photoButton(file.fileUrl, file.photoType ?? 'Photo')}</div>)}
          {(message.text || message.caption) && <p className="whitespace-pre-wrap break-words">{message.text || message.caption}</p>}
        </>}
        <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] opacity-80"><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>
          {mine && <span aria-label={message.status} title={message.status}>{message.status === 'sending' ? <Clock size={13} /> : message.status === 'sent' ? <Check size={13} /> : message.status === 'failed' ? 'Failed to send' : <CheckCheck size={13} />}</span>}
        </div>
        {mine && message.status === 'failed' && <button type="button" aria-label="Retry message" className="mt-2 text-xs font-semibold underline" onClick={() => { void retryMessage(conversationId, message.id).catch(() => setError('Retry failed. Please try again.')); }}>Retry</button>}
      </article>
    </div>;
  }

  return <section className="mx-auto flex h-dvh max-w-4xl flex-col bg-ht-bg">
    <header className="flex shrink-0 items-center gap-3 bg-ht-navy px-4 py-4 text-white">
      <Link to={`/${role}/messages`} aria-label="Back to Messages" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft size={20} /></Link>
      <img src={role === 'customer' ? conversation.tailorAvatar : conversation.customerAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0 flex-1"><h1 className="truncate text-base font-semibold">{otherName}</h1><p className="truncate text-xs text-white/80">{conversation.bookingId ? `Booking #${conversation.bookingId} · ${conversation.bookingCategory ?? ''}` : 'Talk about your next perfect fit'}</p></div>
    </header>
    <div ref={listRef} aria-label="Conversation messages" className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
      {loadState === 'loading' ? <p role="status" className="p-8 text-center text-sm text-ht-text-secondary">Loading messages…</p> : loadState === 'error' ? <div role="alert" className="p-8 text-center"><p>Unable to load messages.</p><button className="mt-2 font-semibold text-ht-ocean" onClick={() => { setLoadState('loading'); setAttempt((n) => n + 1); }}>Try again</button></div> : messages.length === 0 ? <div className="p-10 text-center"><h2 className="font-semibold text-ht-navy">Start the conversation</h2><p className="mt-2 text-sm text-ht-text-secondary">Send a message or share a design reference.</p></div> : messages.map((message, index) => <div key={message.id}>
        {(index === 0 || new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString()) && <p className="mb-4 text-center text-[11px] text-ht-text-secondary">{new Date(message.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
        {renderMessage(message)}
      </div>)}
    </div>
    <div className="shrink-0 border-t border-ht-border bg-white px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {isTyping && <p role="status" className="mb-2 px-2 text-xs text-ht-text-secondary">{otherName} is typing<span className="animate-pulse">…</span></p>}
      {error && <p role="alert" className="mb-2 px-2 text-sm text-ht-error">{error}</p>}
      <VoiceRecorder disabled={sending} showMic={!text.trim()} onSend={sendVoice} form={(mic, notice) => <>
{notice}
      <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void sendText(); }}>
        <button type="button" aria-label="Add attachment" onClick={() => setAttachment(role === 'customer' ? 'Reference Design' : 'Progress Photo')} className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-info-bg text-ht-ocean"><Plus size={20} /></button>
        <textarea aria-label="Message" value={text} maxLength={4000} disabled={sending} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" rows={2}
          onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void sendText(); } }}
          className="min-w-0 flex-1 resize-none rounded-2xl bg-ht-bg p-3 text-sm outline-ht-ocean" />
        {text.trim() ? <button type="submit" aria-label="Send message" disabled={sending} className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-ocean text-white disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text"><Send size={20} /></button> : mic}
      </form>
      </>} />
    </div>
    {attachment && <AttachmentDialog role={role} hasBooking={Boolean(conversation.bookingId)} initialType={attachment} onClose={() => setAttachment(null)} onSend={async (url, photoType, caption) => {
      if (role === 'tailor' && photoType === 'Final Design' && conversation.bookingId) await uploadDesignForApproval(conversationId, conversation.bookingId, senderId, url, caption);
      else {
        const messageType = photoType === 'Cloth Photo' ? 'cloth_photo' : photoType === 'Measurement Reference' ? 'measurement_reference' : photoType === 'Progress Photo' ? 'progress_photo' : 'reference_design';
        await sendAttachment(conversationId, role, senderId, messageType, url, photoType, caption);
      }
      simulateTypingPulse(conversationId, role === 'customer' ? 'tailor' : 'customer');
    }} />}
    {review && <DesignReviewDialog key={`${review.version.id}:${review.mode}`} {...review} onClose={() => setReview(null)} />}
    {image && <ChatDialog title={image.label} onClose={() => setImage(null)}><img src={image.url} alt={image.label} className="max-h-[70dvh] w-full object-contain" /></ChatDialog>}
  </section>;
}
