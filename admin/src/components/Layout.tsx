import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Users, LogOut, Bell, Search, ChevronDown } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/rooms': 'Rooms',
  '/bookings': 'Bookings',
  '/users': 'Users',
};

function TopBar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Admin';
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
      {/* Left */}
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-400">{now}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 w-48">
          <Search size={14} />
          <span>Search...</span>
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-none">Admin</p>
            <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}


const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/users', label: 'Users', icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('admin_token'); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-gray-900 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700/60">
          <p className="text-lg font-bold tracking-tight text-white">Aina Paradise</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-700/60">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">
        <TopBar />
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
