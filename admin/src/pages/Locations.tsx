import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { confirmToast } from '../lib/confirmToast';

interface Location {
  id: number; name: string; city: string; state: string;
  description: string; is_active: boolean;
}

const empty = { name: '', city: '', state: '', description: '', is_active: true };

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/locations?all=true').then(({ data }) => setLocations(data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (l: Location) => {
    setEditing(l);
    setForm({ name: l.name, city: l.city, state: l.state, description: l.description || '', is_active: l.is_active });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/locations/${editing.id}`, form); toast.success('Location updated'); }
      else { await api.post('/locations', form); toast.success('Location created'); }
      setModal(false); load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving location');
    } finally { setSaving(false); }
  };

  const handleDelete = (id: number) => {
    confirmToast('Delete this location? Rooms assigned to it will become unassigned.', async () => {
      try { await api.delete(`/locations/${id}`); toast.success('Location deleted'); load(); }
      catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{locations.length} total locations</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ background: '#d4882a' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#b86e1f')}
          onMouseLeave={e => (e.currentTarget.style.background = '#d4882a')}>
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
        ) : locations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No locations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <tr>
                  {['Location Name', 'City', 'State', 'Description', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {locations.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-400 shrink-0" />
                        <span className="font-semibold text-gray-800">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{l.city}</td>
                    <td className="px-5 py-4 text-gray-600">{l.state}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{l.description || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${l.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {l.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(l)} className="text-amber-500 hover:text-amber-700"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-800">{editing ? 'Edit Location' : 'Add Location'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Location Name *</label>
                <input required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Naal, Belsar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">City *</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Bikaner" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">State *</label>
                  <input required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Rajasthan" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-amber-400 resize-none"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" style={{ accentColor: '#d4882a' }} />
                <span className="text-sm text-gray-700">Active (visible to users)</span>
              </label>
              <button type="submit" disabled={saving}
                className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50" style={{ background: '#d4882a' }}>
                {saving ? 'Saving…' : editing ? 'Update Location' : 'Create Location'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
