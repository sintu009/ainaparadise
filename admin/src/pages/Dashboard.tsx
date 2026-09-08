import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { BedDouble, CalendarCheck, TrendingUp, Users, ArrowUpRight, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

interface Stats { totalBookings: number; totalRevenue: number; totalRooms: number; totalUsers: number; }
interface Booking {
  id: number; guest_name: string; guest_email: string; room_name: string;
  check_in: string; check_out: string; total_price: string; status: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};
const STATUS_ICON: Record<string, JSX.Element> = {
  pending:   <Clock size={12} className="inline mr-1" />,
  confirmed: <ArrowUpRight size={12} className="inline mr-1" />,
  completed: <CheckCircle size={12} className="inline mr-1" />,
  cancelled: <XCircle size={12} className="inline mr-1" />,
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function nights(ci: string, co: string) {
  return Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get('/bookings/admin/stats').then(({ data }) => setStats(data));
    api.get('/bookings').then(({ data }) => setAllBookings(data));
  }, []);

  const recent = allBookings.slice(0, 8);

  const statusCounts = allBookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '—', icon: TrendingUp, bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', sub: 'Confirmed & completed' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? '—', icon: CalendarCheck, bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', sub: 'Excluding cancelled' },
    { label: 'Total Rooms', value: stats?.totalRooms ?? '—', icon: BedDouble, bg: 'bg-gradient-to-br from-violet-500 to-purple-600', sub: 'Active listings' },
    { label: 'Registered Users', value: stats?.totalUsers ?? '—', icon: Users, bg: 'bg-gradient-to-br from-orange-400 to-rose-500', sub: 'Guest accounts' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, Admin — here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          Aina Paradise
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, bg, sub }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${bg} text-white p-3.5 rounded-xl shadow-sm`}><Icon size={20} /></div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status + Recent Bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Booking Status</h2>
          {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
            <div key={s} className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[s]}`}>
                {STATUS_ICON[s]}{s}
              </span>
              <span className="text-sm font-semibold text-gray-700">{statusCounts[s] || 0}</span>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Bookings</h2>
            <Link to="/bookings" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  {['Guest', 'Room', 'Dates', 'Nights', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No bookings yet</td></tr>
                ) : recent.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{b.guest_name || '—'}</p>
                      <p className="text-xs text-gray-400">{b.guest_email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{b.room_name || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{fmt(b.check_in)} → {fmt(b.check_out)}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-center">{nights(b.check_in, b.check_out)}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">${parseFloat(b.total_price).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                        {STATUS_ICON[b.status]}{b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
