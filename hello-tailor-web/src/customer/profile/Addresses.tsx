import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

export default function Addresses() {
  const navigate = useNavigate();
  const addresses = useStore((s) => s.addresses);
  const setDefaultAddress = useStore((s) => s.setDefaultAddress);
  const removeAddress = useStore((s) => s.removeAddress);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      <ScreenHeader title="My Addresses" right={<button onClick={() => navigate('/customer/profile/addresses/add')} className="text-2xl text-ht-ocean">+</button>} />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {addresses.length ? addresses.map((item) => (
          <div key={item.id} className="rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span>{item.label === 'Home' ? '🏠' : item.label === 'Work' ? '💼' : '📍'}</span>
                <span className="text-[15px] font-semibold text-ht-text">{item.label}</span>
                {item.isDefault ? <Badge label="Default" tone="success" /> : null}
              </div>
              <button onClick={() => setDeleteId(item.id)} className="text-ht-error">🗑️</button>
            </div>
            <p className="mt-1.5 text-[14px] text-ht-text-secondary">{item.address}</p>
            <p className="text-[14px] text-ht-text-secondary">{item.landmark}</p>
            <p className="text-[14px] text-ht-text-secondary">{item.city}, {item.state} - {item.pincode}</p>
            {!item.isDefault ? (
              <button onClick={() => setDefaultAddress(item.id)} className="mt-2 text-[13px] font-semibold text-ht-ocean">Set as Default</button>
            ) : null}
          </div>
        )) : (
          <EmptyState icon="📍" title="No Addresses Saved" message="Add an address to speed up pickup and delivery." action={<Button label="Add Address" onClick={() => navigate('/customer/profile/addresses/add')} />} />
        )}
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Address?">
        <p className="text-[14px] text-ht-text-secondary">This address will be permanently removed from your account.</p>
        <div className="mt-5 flex gap-2.5">
          <Button label="Cancel" variant="secondary" onClick={() => setDeleteId(null)} />
          <Button label="Delete" variant="destructive" onClick={() => { if (deleteId) removeAddress(deleteId); setDeleteId(null); }} />
        </div>
      </Modal>
    </div>
  );
}
