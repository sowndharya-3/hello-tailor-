import { useState } from 'react';
import { ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';

type Msg = { id: string; from: 'me' | 'agent'; text: string; time: string };

const INITIAL: Msg[] = [
  { id: '1', from: 'agent', text: `Hi ${ME_CUSTOMER.name.split(' ')[0]}! This is Priya from Hello Tailor support. How can I help you today?`, time: '10:02 AM' },
  { id: '2', from: 'me', text: 'Hi, I wanted to ask about my recent order.', time: '10:03 AM' },
  { id: '3', from: 'agent', text: 'Sure! Let me pull that up — your order is currently in progress with your tailor. I will share the latest status right away.', time: '10:04 AM' },
];

export default function SupportChat() {
  const [messages, setMessages] = useState(INITIAL);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `${Date.now()}`, from: 'me', text, time: 'Just now' }]);
    setText('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, from: 'agent', text: 'Got it, let me check that for you right away.', time: 'Just now' }]);
    }, 1000);
  };

  return (
    <div className="flex h-dvh flex-col sm:h-[calc(100dvh)]">
      <ScreenHeader title="Support Chat" subtitle="Ticket #HT-SUP-4821 • Online" />
      <div className="flex-1 overflow-y-auto p-4 sm:px-6">
        <div className="flex flex-col gap-2.5">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-ht-card p-3 ${m.from === 'me' ? 'rounded-br-[4px] bg-ht-ocean' : 'rounded-bl-[4px] border border-ht-border bg-ht-card'}`}>
                <p className={`text-[14px] ${m.from === 'me' ? 'text-white' : 'text-ht-text'}`}>{m.text}</p>
                <p className={`mt-1 text-[10px] ${m.from === 'me' ? 'text-white/70' : 'text-ht-text-secondary'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-ht-border bg-ht-card p-4 sm:px-6">
        <button className="flex h-10 w-10 items-center justify-center text-ht-text-secondary">📎</button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="h-11 flex-1 rounded-full border border-ht-border bg-ht-bg px-4 text-[14px] text-ht-text outline-none"
        />
        <button onClick={send} className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-ocean text-white">➤</button>
      </div>
    </div>
  );
}
