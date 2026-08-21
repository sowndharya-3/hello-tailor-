import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { navGroups } from './navConfig';
import logo from '../../assets/hello-tailor-logo.png';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col bg-navy transition-all duration-200 ${collapsed ? 'w-[76px]' : 'w-64'}`}
    >
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <img
          src={logo}
          alt="Hello Tailor"
          className={`shrink-0 object-contain ${collapsed ? 'h-9 w-9' : 'h-10'}`}
        />
        {!collapsed && (
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="text-white font-bold text-sm whitespace-nowrap">Hello Tailor</span>
            <span className="text-white/60 text-[11px] whitespace-nowrap">Admin Console</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                {group.title}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-ocean text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-white/60 hover:text-white text-sm"
      >
        {collapsed ? <ChevronsRight size={18} /> : <><ChevronsLeft size={18} /> Collapse</>}
      </button>
    </aside>
  );
}
