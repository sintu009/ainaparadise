import { useEffect, useRef, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Clock, ArrowUpRight, CheckCircle, XCircle, Plus, X, ChevronDown, BedDouble, MapPin } from 'lucide-react';

interface Booking {
  id: number; room_name: string; user_name: string; guest_name: string;
  guest_email: string; guest_phone: string; check_in: string; check_out: string;
  adults: number; kids: number; total_price: string; status: string; created_at: string;
  room_id?: number; location_id?: number | null; location_name?: string | null; location_city?: string | null;
}
interface Room { id: number; name: string; price: number; max_person: number; location_id?: number | null; }
interface Location { id: number; name: string; city: string; state: string; }

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
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function nights(ci: string, co: string) {
  return Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
}

const emptyForm = {
  room_id: '', check_in: '', check_out: '',
  guest_name: '', guest_email: '', guest_phone: '',
  adults: 1, kids: 0, special_requests: '',
};

/* ── Generic Dropdown ── */
function Dropdown<T extends { id: number }>({ items, value, onChange, icon: Icon, allLabel, renderItem, renderTrigger }: {
  items: T[]; value: string; onChange: (v: string) => void;
  icon: React.ElementType; allLabel: string;
  renderItem: (item: T, active: boolean) => React.ReactNode;
  renderTrigger: (selected: T | undefined) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = items.find(i => String(i.id) === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm hover:border-amber-400 transition-colors min-w-[160px]"
        style={{ borderColor: open ? '#e4a43e' : '' }}>
        <Icon size={14} className="text-gray-400 shrink-0" />
        <span className={`flex-1 text-left truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {renderTrigger(selected)}
        </span>
        {value
          ? <X size={13} className="text-gray-400 hover:text-gray-600 shrink-0" onClick={e => { e.stopPropagation(); onChange(''); }} />
          : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden min-w-[220px]">
          <button onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 ${!value ? 'font-semibold' : 'text-gray-600'}`}
            style={!value ? { color: '#d4882a' } : {}}>
            <Icon size={14} className="shrink-0" style={{ color: !value ? '#d4882a' : '#9ca3af' } as React.CSSProperties} />
            {allLabel}
            {!value && <span className="ml-auto text-xs font-normal text-gray-400">selected</span>}
          </button>
          <div className="border-t border-gray-50" />
          <div className="max-h-56 overflow-y-auto">
            {items.map(item => {
              const active = String(item.id) === value;
              return (
                <button key={item.id} onClick={() => { onChange(String(item.id)); setOpen(false); }}
                  className="w-full flex items-start gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-amber-50"
                  style={active ? { background: '#faefd9' } : {}}>
                  {renderItem(item, active)}
                  {active && <span className="ml-auto text-xs text-amber-600 shrink-0 mt-0.5">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<{ nights: number; total: number } | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/bookings').then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/rooms?all=true').then(({ data }) => setRooms(data));
    api.get('/locations').then(({ data }) => setLocations(data));
  }, []);

  useEffect(() => {
    if (!form.room_id || !form.check_in || !form.check_out) { setPreview(null); return; }
    const n = nights(form.check_in, form.check_out);
    if (n <= 0) { setPreview(null); return; }
    const room = rooms.find(r => r.id === +form.room_id);
    if (room) setPreview({ nights: n, total: n * Number(room.price) });
  }, [form.room_id, form.check_in, form.check_out, rooms]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setUpdating(null); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.room_id) { toast.error('Select a room'); return; }
    if (!form.check_in || !form.check_out) { toast.error('Select check-in and check-out dates'); return; }
    if (nights(form.check_in, form.check_out) <= 0) { toast.error('Check-out must be after check-in'); return; }
    setSaving(true);
    try {
      await api.post('/bookings', { ...form, room_id: +form.room_id });
      toast.success('Booking created');
      setModal(false); setForm(emptyForm); load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating booking');
    } finally { setSaving(false); }
  };

  // Apply all filters
  const filtered = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => !hotelFilter || String(b.location_id) === hotelFilter)
    .filter(b => !roomFilter || String(b.room_id) === roomFilter);

  const selectedRoom = rooms.find(r => String(r.id) === roomFilter);
  const selectedHotel = locations.find(l => String(l.id) === hotelFilter);

  // Rooms belonging to selected hotel (for modal dropdown)
  const filteredRooms = hotelFilter
    ? rooms.filter(r => String(r.location_id) === hotelFilter)
    : rooms;

  const revenue = filtered
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((s, b) => s + parseFloat(b.total_price), 0);

  const statusCounts = filtered.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1; return acc;
  }, {});

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {selectedHotel ? `${selectedHotel.name}` : 'All Hotels'}
            {selectedRoom ? ` · ${selectedRoom.name}` : ''}
            {' · '}{filtered.length} bookings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          {/* Hotel dropdown */}
          <Dropdown<Location>
            items={locations}
            value={hotelFilter}
            onChange={v => { setHotelFilter(v); setRoomFilter(''); setStatusFilter('all'); }}
            icon={MapPin}
            allLabel="All Hotels"
            renderTrigger={sel => sel ? sel.name : 'All Hotels'}
            renderItem={(l, active) => (
              <div className="min-w-0">
                <p className="font-medium truncate" style={{ color: active ? '#b86e1f' : '#374151' }}>{l.name}</p>
                <p className="text-xs text-gray-400">{l.city}, {l.state}</p>
              </div>
            )}
          />

          {/* Room dropdown */}
          <Dropdown<Room>
            items={filteredRooms}
            value={roomFilter}
            onChange={v => { setRoomFilter(v); setStatusFilter('all'); }}
            icon={BedDouble}
            allLabel="All Rooms"
            renderTrigger={sel => sel ? sel.name : 'All Rooms'}
            renderItem={(r, active) => (
              <div className="min-w-0">
                <p className="font-medium truncate" style={{ color: active ? '#b86e1f' : '#374151' }}>{r.name}</p>
                <p className="text-xs text-gray-400">₹{Number(r.price).toLocaleString()}/night · max {r.max_person}</p>
              </div>
            )}
          />

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {(['all', ...STATUSES] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                style={statusFilter === s ? { background: '#d4882a' } : {}}>
                {s} ({s === 'all' ? filtered.length : (statusCounts[s] || 0)})
              </button>
            ))}
          </div>

          <button
            onClick={() => { setForm(emptyForm); setPreview(null); setModal(true); }}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
            style={{ background: '#d4882a' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#b86e1f')}
            onMouseLeave={e => (e.currentTarget.style.background = '#d4882a')}
          >
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

      {/* Summary strip — hotel or room selected */}
      {(selectedHotel || selectedRoom) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: filtered.length },
            { label: 'Revenue', value: `₹${revenue.toLocaleString()}` },
            { label: selectedRoom ? 'Price / Night' : 'Location', value: selectedRoom ? `₹${Number(selectedRoom.price).toLocaleString()}` : `${selectedHotel!.city}, ${selectedHotel!.state}` },
            { label: selectedRoom ? 'Max Guests' : 'Rooms at Hotel', value: selectedRoom ? selectedRoom.max_person : rooms.filter(r => String(r.location_id) === hotelFilter).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <tr>
                  {['#', 'Guest', 'Hotel', 'Room', 'Check In', 'Check Out', 'Nights', 'Guests', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">#{b.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-800">{b.guest_name || b.user_name || '—'}</p>
                      <p className="text-xs text-gray-400">{b.guest_email}</p>
                      {b.guest_phone && <p className="text-xs text-gray-400">{b.guest_phone}</p>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {b.location_name
                        ? <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><MapPin size={10} />{b.location_name}</span>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{b.room_name || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{fmt(b.check_in)}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{fmt(b.check_out)}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-center">{nights(b.check_in, b.check_out)}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.adults}A / {b.kids}K</td>
                    <td className="px-4 py-3.5 font-bold text-gray-800 whitespace-nowrap">₹{parseFloat(b.total_price).toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                        {STATUS_ICON[b.status]}{b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select value={b.status} disabled={updating === b.id}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-amber-400 bg-white disabled:opacity-50 cursor-pointer">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-800">New Booking</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Room *</label>
                <select required value={form.room_id} onChange={e => setForm({ ...form, room_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400 bg-white">
                  <option value="">Select a room</option>
                  {filteredRooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} — ₹{Number(r.price).toLocaleString()}/night (max {r.max_person} guests)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Check In *</label>
                  <input required type="date" value={form.check_in}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, check_in: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Check Out *</label>
                  <input required type="date" value={form.check_out}
                    min={form.check_in || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, check_out: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              {preview && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-amber-700">{preview.nights} night{preview.nights > 1 ? 's' : ''}</span>
                  <span className="font-bold text-amber-700 text-lg">₹{preview.total.toLocaleString()}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Adults</label>
                  <input type="number" min="1" max="10" value={form.adults}
                    onChange={e => setForm({ ...form, adults: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Kids</label>
                  <input type="number" min="0" max="10" value={form.kids}
                    onChange={e => setForm({ ...form, kids: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Guest Name *</label>
                <input required value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Guest Email *</label>
                <input required type="email" value={form.guest_email} onChange={e => setForm({ ...form, guest_email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" placeholder="guest@email.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                <input type="tel" value={form.guest_phone} onChange={e => setForm({ ...form, guest_phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Special Requests</label>
                <textarea rows={2} value={form.special_requests} onChange={e => setForm({ ...form, special_requests: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Any special requests..." />
              </div>

              <button type="submit" disabled={saving}
                className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: '#d4882a' }}>
                {saving ? 'Creating...' : 'Create Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
