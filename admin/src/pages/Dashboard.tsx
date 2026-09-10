import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  BedDouble, CalendarCheck, TrendingUp, Users,
  ArrowUpRight, Clock, CheckCircle, XCircle, CalendarDays, MapPin, ChevronDown, X,
} from 'lucide-react';

interface Stats { totalBookings: number; totalRevenue: number; totalRooms: number; totalUsers: number; }
interface Booking {
  id: number; guest_name: string; guest_email: string; room_name: string;
  check_in: string; check_out: string; total_price: string; status: string; created_at: string;
  location_id: number | null; location_name: string | null; location_city: string | null;
}
interface Location { id: number; name: string; city: string; state: string; }

function HotelDropdown({ locations, value, onChange }: {
  locations: Location[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = locations.find(l => String(l.id) === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm hover:border-amber-400 transition-colors min-w-[160px]"
        style={{ borderColor: open ? '#e4a43e' : '' }}>
        <MapPin size={14} className="text-gray-400 shrink-0" />
        <span className={`flex-1 text-left text-sm truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {selected ? selected.name : 'All Hotels'}
        </span>
        {value
          ? <X size={13} className="text-gray-400 hover:text-gray-600 shrink-0" onClick={e => { e.stopPropagation(); onChange(''); }} />
          : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden min-w-[200px]">
          <button onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${!value ? 'font-semibold' : 'text-gray-600'}`}
            style={!value ? { color: '#d4882a' } : {}}>
            <MapPin size={14} style={{ color: !value ? '#d4882a' : '#9ca3af' }} />
            All Hotels
            {!value && <span className="ml-auto text-xs font-normal text-gray-400">selected</span>}
          </button>
          <div className="border-t border-gray-50" />
          {locations.map(l => {
            const active = String(l.id) === value;
            return (
              <button key={l.id} onClick={() => { onChange(String(l.id)); setOpen(false); }}
                className="w-full flex items-start gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-amber-50 transition-colors"
                style={active ? { background: '#faefd9' } : {}}>
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: active ? '#d4882a' : '#9ca3af' }} />
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: active ? '#b86e1f' : '#374151' }}>{l.name}</p>
                  <p className="text-xs text-gray-400">{l.city}, {l.state}</p>
                </div>
                {active && <span className="ml-auto text-xs text-amber-600 shrink-0 mt-0.5">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const STATUS_META = {
  pending:   { label: 'Pending',   dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-600 border border-amber-200',   icon: <Clock size={11} className="inline mr-1" /> },
  confirmed: { label: 'Confirmed', dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-600 border border-blue-200',       icon: <ArrowUpRight size={11} className="inline mr-1" /> },
  completed: { label: 'Completed', dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-600 border border-emerald-200', icon: <CheckCircle size={11} className="inline mr-1" /> },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400',     badge: 'bg-red-50 text-red-500 border border-red-200',          icon: <XCircle size={11} className="inline mr-1" /> },
} as const;

type StatusKey = keyof typeof STATUS_META;
const STATUSES = Object.keys(STATUS_META) as StatusKey[];

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function toMonthKey(d: string) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(toMonthKey(new Date().toISOString()));
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    api.get('/bookings/admin/stats').then(({ data }) => setStats(data));
    api.get('/bookings').then(({ data }) => setAllBookings(data));
    api.get('/locations').then(({ data }) => setLocations(data));
  }, []);

  const filtered = useMemo(() => {
    let b = selectedMonth === 'all' ? allBookings : allBookings.filter(b => toMonthKey(b.check_in) === selectedMonth);
    if (selectedLocation) b = b.filter(b => String(b.location_id) === selectedLocation);
    return b;
  }, [allBookings, selectedMonth, selectedLocation]);

  const statusCounts = useMemo(() =>
    filtered.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {}), [filtered]
  );

  const filteredRevenue = useMemo(() =>
    filtered
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.total_price), 0),
    [filtered]
  );

  // Always show only 5 on dashboard
  const recent5 = filtered.slice(0, 5);

  const statCards = [
    {
      label: 'Revenue', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50',
      value: (selectedMonth === 'all' && !selectedLocation) ? (stats ? `₹${Number(stats.totalRevenue).toLocaleString()}` : '—') : `₹${filteredRevenue.toLocaleString()}`,
      sub: 'Confirmed & completed',
    },
    {
      label: 'Bookings', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50',
      value: (selectedMonth === 'all' && !selectedLocation) ? (stats?.totalBookings ?? '—') : filtered.length,
      sub: selectedMonth === 'all' ? 'All time' : 'This month',
    },
    {
      label: 'Rooms', icon: BedDouble, color: 'text-violet-600', bg: 'bg-violet-50',
      value: stats?.totalRooms ?? '—', sub: 'Active listings',
    },
    {
      label: 'Guests', icon: Users, color: 'text-amber-700', bg: 'bg-amber-50',
      value: stats?.totalUsers ?? '—', sub: 'Registered accounts',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {selectedLocation
              ? `${locations.find(l => String(l.id) === selectedLocation)?.name} · Admin Dashboard`
              : 'Aina Paradise · Admin Dashboard'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <HotelDropdown locations={locations} value={selectedLocation} onChange={setSelectedLocation} />
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <CalendarDays size={15} className="text-gray-400 shrink-0" />
            <input
              type="month"
              value={selectedMonth === 'all' ? '' : selectedMonth}
              onChange={e => setSelectedMonth(e.target.value || 'all')}
              className="text-sm text-gray-700 focus:outline-none bg-transparent cursor-pointer"
            />
            {selectedMonth !== 'all' && (
              <button onClick={() => setSelectedMonth('all')} className="text-xs text-gray-400 hover:text-gray-600 ml-1">✕ All</button>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className={`${bg} ${color} p-2.5 rounded-xl shrink-0`}><Icon size={18} /></div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">

        {/* ── Booking Status (2 cols) ── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Booking Status</h2>
            <span className="text-xs text-gray-400">{filtered.length} total</span>
          </div>

          {/* Status rows */}
          <div className="p-4 space-y-3">
            {STATUSES.map(s => {
              const { label, dot, badge } = STATUS_META[s];
              const count = statusCounts[s] || 0;
              const total = filtered.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={s} className="flex items-center gap-3">
                  {/* Label */}
                  <div className="flex items-center gap-2 w-24 shrink-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    <span className="text-xs font-medium text-gray-600 capitalize">{label}</span>
                  </div>
                  {/* Bar */}
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${dot}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {/* Count */}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${badge}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer total */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            {STATUSES.map(s => {
              const { dot } = STATUS_META[s];
              const count = statusCounts[s] || 0;
              const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
              return (
                <div key={s} className="text-center">
                  <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-1 ${dot}`} />
                  <p className="text-xs font-bold text-gray-700">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent Bookings (3 cols) ── */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">Recent Bookings</h2>
              {/* Total count — always shows full total */}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {selectedLocation ? filtered.length : allBookings.length} total
              </span>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#d4882a' }}
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Table — only 5 rows */}
          {recent5.length === 0 ? (
            <p className="text-center text-gray-300 text-sm py-12">No bookings for this period</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-2.5 text-left font-semibold">Guest</th>
                  <th className="px-5 py-2.5 text-left font-semibold">Room</th>
                  <th className="px-5 py-2.5 text-left font-semibold">Check-in</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Amount</th>
                  <th className="px-5 py-2.5 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent5.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-800 text-xs truncate max-w-[110px]">{b.guest_name || '—'}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[110px]">{b.guest_email}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600 font-medium truncate max-w-[90px]">{b.room_name || '—'}</td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(b.check_in)}</td>
                    <td className="px-5 py-3 text-xs font-bold text-gray-800 text-right whitespace-nowrap">₹{parseFloat(b.total_price).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_META[b.status as StatusKey]?.badge ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_META[b.status as StatusKey]?.icon}{b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Footer */}
          {filtered.length > 5 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <Link
                to="/bookings"
                className="text-xs font-semibold flex items-center justify-center gap-1 hover:underline"
                style={{ color: '#d4882a' }}
              >
                View all {selectedLocation ? filtered.length : allBookings.length} bookings <ArrowUpRight size={12} />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
