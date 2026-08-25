import { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, UserCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const logout = useStore((s) => s.logout);
  const complaints = useStore((s) => s.complaints);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const openComplaints = complaints.filter((c) => c.status === 'Open').slice(0, 5);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-ht-border bg-ht-card px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-3 w-full max-w-md">
        <button onClick={onMenuClick} className="md:hidden rounded-lg p-1.5 text-ht-navy hover:bg-slate-100">
          <Menu size={22} />
        </button>
        <div className="relative w-full hidden sm:block">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ht-text-secondary" />
          <input
            placeholder="Search customers, tailors, orders..."
            className="w-full rounded-[14px] border border-ht-border bg-ht-bg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ht-border text-ht-text-secondary hover:bg-slate-50"
          >
            <Bell size={18} />
            {openComplaints.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ht-error text-[10px] font-bold text-white">
                {openComplaints.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-72 sm:w-80 rounded-xl border border-ht-border bg-white py-2 shadow-lg">
                <div className="px-4 py-2 text-xs font-bold uppercase text-ht-text-secondary">Open Complaints</div>
                {openComplaints.length === 0 && <div className="px-4 py-3 text-sm text-ht-text-secondary">No open complaints</div>}
                {openComplaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { navigate('/admin/complaints'); setNotifOpen(false); }}
                    className="block w-full px-4 py-2.5 text-left hover:bg-slate-50"
                  >
                    <div className="text-sm font-medium text-ht-text">{c.category}</div>
                    <div className="text-xs text-ht-text-secondary">{c.customerName} · {c.id}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false); }} className="flex items-center gap-2 rounded-full border border-ht-border py-1 pl-1 pr-2.5 hover:bg-slate-50">
            <img src="https://picsum.photos/seed/adminavatar/64" alt="Admin avatar" className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden sm:inline text-sm font-semibold text-ht-text capitalize">Admin</span>
            <ChevronDown size={14} className="text-ht-text-secondary" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-ht-border bg-white py-1.5 shadow-lg">
                <button onClick={() => { navigate('/admin/settings'); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ht-text hover:bg-slate-50">
                  <UserCircle size={16} /> Settings
                </button>
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ht-error hover:bg-slate-50">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
