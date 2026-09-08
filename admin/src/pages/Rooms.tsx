import { useEffect, useRef, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, X, Upload, ImagePlus } from 'lucide-react';

interface Room {
  id: number; name: string; description: string; size: number;
  max_person: number; price: number; image_url: string; image_lg_url: string;
  images: string[]; facilities: string[]; is_available: boolean;
}

const empty: Omit<Room, 'id'> = {
  name: '', description: '', size: 0, max_person: 1, price: 0,
  image_url: '', image_lg_url: '', images: [], facilities: [], is_available: true,
};

/* ── Single image uploader (thumbnail / large) ── */
function SingleUploader({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(data.url); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setBusy(false); e.target.value = ''; }
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
      <div
        onClick={() => !busy && ref.current?.click()}
        className={`mt-1 border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden
          ${busy ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'}`}
      >
        {value ? (
          <div className="relative group">
            <img src={value} alt="preview" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs flex items-center gap-1"><Upload size={13} /> Change</span>
            </div>
          </div>
        ) : (
          <div className="h-24 flex flex-col items-center justify-center gap-1 text-gray-400">
            {busy ? <span className="text-indigo-500 text-sm animate-pulse">Uploading…</span> : (
              <><Upload size={20} /><span className="text-xs">Click to upload</span></>
            )}
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}

/* ── Multi-image uploader ── */
function MultiUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData(); fd.append('image', file);
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch { toast.error('Upload failed'); }
    finally { setBusy(false); e.target.value = ''; }
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase">Room Gallery Images</label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-100">
            <img src={url} alt={`room-${i}`} className="w-full h-24 object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                Main
              </span>
            )}
          </div>
        ))}

        {/* Add more button */}
        <div
          onClick={() => !busy && ref.current?.click()}
          className={`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
            ${busy ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 text-gray-400 hover:text-indigo-500'}`}
        >
          {busy
            ? <span className="text-indigo-500 text-xs animate-pulse">Uploading…</span>
            : <><ImagePlus size={20} /><span className="text-[11px] mt-1">Add Images</span></>
          }
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mt-1">First image is used as main thumbnail. Select multiple files at once.</p>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handle} />
    </div>
  );
}

/* ── Main component ── */
export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<Omit<Room, 'id'>>(empty);
  const [facilitiesStr, setFacilitiesStr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/rooms?all=true').then(({ data }) => setRooms(data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setFacilitiesStr(''); setModal(true); };
  const openEdit = (r: Room) => {
    setEditing(r);
    setForm({
      name: r.name, description: r.description, size: r.size, max_person: r.max_person,
      price: r.price, image_url: r.image_url || '', image_lg_url: r.image_lg_url || '',
      images: r.images || [], facilities: r.facilities || [], is_available: r.is_available,
    });
    setFacilitiesStr((r.facilities || []).join(', '));
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    // first gallery image auto-fills image_url / image_lg_url if empty
    const imgs = form.images;
    const payload = {
      ...form,
      image_url: form.image_url || imgs[0] || '',
      image_lg_url: form.image_lg_url || imgs[0] || '',
      facilities: facilitiesStr.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) { await api.put(`/rooms/${editing.id}`, payload); toast.success('Room updated'); }
      else { await api.post('/rooms', payload); toast.success('Room created'); }
      setModal(false); load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving room');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this room?')) return;
    try { await api.delete(`/rooms/${id}`); toast.success('Room deleted'); load(); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const thumb = (r: Room) => r.image_url || r.images?.[0] || '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rooms.length} total rooms</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} /> Add Room
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading rooms…</div>
        ) : rooms.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No rooms found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <tr>
                  {['Room', 'Size (m²)', 'Max Guests', 'Price / Night', 'Facilities', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rooms.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {thumb(r)
                          ? <img src={thumb(r)} alt={r.name} className="w-14 h-11 object-cover rounded-lg shrink-0 border border-gray-100" />
                          : <div className="w-14 h-11 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300"><ImagePlus size={16} /></div>
                        }
                        <div>
                          <p className="font-semibold text-gray-800">{r.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.description}</p>
                          {(r.images?.length > 0) && (
                            <p className="text-[11px] text-indigo-400 mt-0.5">{r.images.length} image{r.images.length > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{r.size ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600">{r.max_person}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">₹{Number(r.price).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(r.facilities || []).slice(0, 3).map(f => (
                          <span key={f} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                        {(r.facilities || []).length > 3 && <span className="text-xs text-gray-400">+{r.facilities.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {r.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(r)} className="text-indigo-500 hover:text-indigo-700"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-800">{editing ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Room Name *</label>
                <input required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500 resize-none"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['size', 'max_person', 'price'] as const).map(f => (
                  <div key={f}>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      {f === 'max_person' ? 'Max Guests' : f === 'size' ? 'Size m²' : 'Price ₹'}
                    </label>
                    <input type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500"
                      value={form[f]} onChange={e => setForm({ ...form, [f]: +e.target.value })} />
                  </div>
                ))}
              </div>

              {/* Multi-image gallery uploader */}
              <MultiUploader
                images={form.images}
                onChange={imgs => setForm(f => ({ ...f, images: imgs, image_url: imgs[0] || f.image_url, image_lg_url: imgs[0] || f.image_lg_url }))}
              />

              {/* Optional override for thumbnail / large */}
              <div className="grid grid-cols-2 gap-3">
                <SingleUploader label="Thumbnail Override" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
                <SingleUploader label="Large Image Override" value={form.image_lg_url} onChange={url => setForm(f => ({ ...f, image_lg_url: url }))} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Facilities (comma separated)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-indigo-500"
                  value={facilitiesStr} onChange={e => setFacilitiesStr(e.target.value)} placeholder="Wifi, Coffee, Bath, Pool…" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                <span className="text-sm text-gray-700">Available for booking</span>
              </label>
              <button type="submit" disabled={saving}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update Room' : 'Create Room'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
