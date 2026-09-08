import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Clock, ArrowUpRight, CheckCircle, XCircle, Plus, X } from 'lucide-react';

interface Booking {
  id: number; room_name: string; user_name: string; guest_name: string;
  guest_email: string; guest_phone: string; check_in: string; check_out: string;
  adults: number; kids: number; total_price: string; status: string; created_at: string;
}
interface Room { id: number; name: string; price: number; max_person: number; }

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};
const STATUS_ICON: Record<string, JSX.Element> = {
  pending: <Clock size={12} className="inline mr-1" />,
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

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
  }, []);

  // Live price preview
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
    if (nights(form.check_in, form.check_out) <= 0) { toast.error('Check-out must be after check-in'); return; }
    setSaving(true);
    try {
      await api.post('/bookings', { ...form, room_id: +form.room_id });
      toast.success('Booking created');
      setModal(false);
      setForm(emptyForm);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating booking');
    } finally { setSaving(false); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const counts = bookings.reduce<Record<string, number>>((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} total bookings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {['all', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {s} ({s === 'all' ? bookings.length : counts[s] || 0})
              </button>
            ))}
          </div>
          <button onClick={() => { setForm(emptyForm); setPreview(null); setModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

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
                  {['#', 'Guest', 'Room', 'Check In', 'Check Out', 'Nights', 'Guests', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">#{b.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-gray-800">{b.guest_name || b.user_name || '—'}</p>
                      <p className="text-xs text-gray-400">{b.guest_email}</p>
                      {b.guest_phone && <p className="text-xs text-gray-400">{b.guest_phone}</p>}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-700 whitespace-nowrap">{b.room_name || '—'}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{fmt(b.check_in)}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{fmt(b.check_out)}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-center">{nights(b.check_in, b.check_out)}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.adults}A / {b.kids}K</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">${parseFloat(b.total_price).toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                        {STATUS_ICON[b.status]}{b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select value={b.status} disabled={updating === b.id}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white disabled:opacity-50 cursor-pointer">
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
              {/* Room */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Room *</label>
                <select required value={form.room_id} onChange={e => setForm({ ...form, room_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500 bg-white">
                  <option value="">Select a room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} — ${Number(r.price).toLocaleString()}/night (max {r.max_person} guests)</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Check In *</label>
                  <input required type="date" value={form.check_in}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, check_in: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Check Out *</label>
                  <input required type="date" value={form.check_out}
                    min={form.check_in || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, check_out: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              {/* Price Preview */}
              {preview && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-indigo-700">{preview.nights} night{preview.nights > 1 ? 's' : ''}</span>
                  <span className="font-bold text-indigo-700 text-lg">${preview.total.toLocaleString()}</span>
                </div>
              )}

              {/* Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Adults</label>
                  <input type="number" min="1" max="10" value={form.adults}
                    onChange={e => setForm({ ...form, adults: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Kids</label>
                  <input type="number" min="0" max="10" value={form.kids}
                    onChange={e => setForm({ ...form, kids: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Guest Name *</label>
                <input required value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Guest Email *</label>
                <input required type="email" value={form.guest_email} onChange={e => setForm({ ...form, guest_email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" placeholder="guest@email.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                <input type="tel" value={form.guest_phone} onChange={e => setForm({ ...form, guest_phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Special Requests</label>
                <textarea rows={2} value={form.special_requests} onChange={e => setForm({ ...form, special_requests: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Any special requests..." />
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
