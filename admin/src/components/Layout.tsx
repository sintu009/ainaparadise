import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Users, LogOut, MapPin } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/rooms': 'Rooms',
  '/locations': 'Locations',
  '/bookings': 'Bookings',
  '/users': 'Users',
};

function TopBar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Admin';
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h2>
        <p className="text-xs text-gray-400">{now}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e4a43e] to-[#b86e1f] flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
          <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
        </div>
      </div>
    </header>
  );
}

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/locations', label: 'Locations', icon: MapPin },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/users', label: 'Users', icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('admin_token'); navigate('/login'); };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a1a2e] text-white flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xl font-bold text-white tracking-tight">Aina Paradise</p>
          <p className="text-xs text-[#ecc06e] mt-0.5 tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#d4882a] text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        <TopBar />
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
