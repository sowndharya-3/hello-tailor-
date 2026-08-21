import { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { complaints } from '../../data/mockData';

export default function Topbar() {
  const { adminName, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const openComplaints = complaints.filter((c) => c.status === 'Open').slice(0, 5);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-3.5">
      <div className="relative w-full max-w-md">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          placeholder="Search customers, tailors, orders..."
          className="w-full rounded-[14px] border border-border bg-bg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-slate-50"
          >
            <Bell size={18} />
            {openComplaints.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {openComplaints.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-80 rounded-xl border border-border bg-white py-2 shadow-lg">
                <div className="px-4 py-2 text-xs font-bold uppercase text-text-secondary">Open Complaints</div>
                {openComplaints.length === 0 && <div className="px-4 py-3 text-sm text-text-secondary">No open complaints</div>}
                {openComplaints.map((c) => (
                  <button
                    key={c.ticketId}
                    onClick={() => { navigate('/complaints'); setNotifOpen(false); }}
                    className="block w-full px-4 py-2.5 text-left hover:bg-slate-50"
                  >
                    <div className="text-sm font-medium text-text-primary">{c.category}</div>
                    <div className="text-xs text-text-secondary">{c.customerName} · {c.ticketId}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false); }} className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 hover:bg-slate-50">
            <img src="https://picsum.photos/seed/adminavatar/64" alt="Admin avatar" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-sm font-semibold text-text-primary capitalize">{adminName}</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-border bg-white py-1.5 shadow-lg">
                <button onClick={() => { navigate('/settings'); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-slate-50">
                  <UserCircle size={16} /> Settings
                </button>
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-slate-50">
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
