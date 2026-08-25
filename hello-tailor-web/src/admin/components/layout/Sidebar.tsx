import { NavLink } from 'react-router-dom';
import { navGroups } from './navConfig';
import logo from '@/assets/hello-tailor-logo.png';

// Pure nav content — rendered both inside the permanent desktop rail (AdminApp, md:+)
// and inside the slide-in mobile drawer, so the two stay in sync for free.
export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-ht-navy">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <img src={logo} alt="Hello Tailor" className="h-10 w-10 shrink-0 object-contain" />
        <div className="flex flex-col leading-tight overflow-hidden">
          <span className="text-white font-bold text-sm whitespace-nowrap">Hello Tailor</span>
          <span className="text-white/60 text-[11px] whitespace-nowrap">Admin Console</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-ht-ocean text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
