import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { walletTransactions } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

const typeMeta: Record<string, { icon: string; color: string; sign: string }> = {
  credit: { icon: '⬇️', color: 'text-ht-success', sign: '+' },
  debit: { icon: '⬆️', color: 'text-ht-error', sign: '-' },
};

export default function Wallet() {
  const walletBalance = useStore((s) => s.walletBalance);
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState('');

  return (
    <div>
      <ScreenHeader title="Wallet" />
      <div className="m-4 flex flex-col items-center rounded-ht-premium bg-ht-navy p-6 sm:mx-6">
        <p className="text-[14px] text-white/75">Wallet Balance</p>
        <p className="mt-1 text-[32px] font-bold text-white">₹{walletBalance}</p>
        <Button label="Add Money" variant="secondary" className="mt-3 bg-white" onClick={() => setAddOpen(true)} />
      </div>
      <p className="mb-3 px-4 text-[16px] font-semibold text-ht-text sm:px-6">Transaction History</p>
      <div className="flex flex-col gap-2.5 px-4 pb-6 sm:px-6">
        {walletTransactions.map((item) => {
          const meta = typeMeta[item.type];
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
              <span className="text-xl">{meta.icon}</span>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-ht-text">{item.label}</p>
                <p className="text-[12px] text-ht-text-secondary">{new Date(item.date).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`text-[14px] font-bold ${meta.color}`}>{meta.sign}₹{item.amount}</span>
            </div>
          );
        })}
      </div>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setAmount(''); }} title="Add Money to Wallet">
        <Input label="Amount" inputMode="numeric" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} />
        <div className="flex gap-2.5">
          <Button label="Cancel" variant="secondary" onClick={() => { setAddOpen(false); setAmount(''); }} />
          <Button label="Add" disabled={!amount} onClick={() => { setAddOpen(false); setAmount(''); }} />
        </div>
      </Modal>
    </div>
  );
}
