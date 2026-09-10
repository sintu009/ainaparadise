import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Trash2, Search } from 'lucide-react';
import { confirmToast } from '../lib/confirmToast';

interface User { id: number; name: string; email: string; role: string; created_at: string; }

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, name: string) => {
    confirmToast(`Delete user "${name}"? This cannot be undone.`, async () => {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error deleting user');
      }
    });
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm w-64">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="text-sm text-gray-700 outline-none w-full placeholder-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                {['#', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#faefd9', color: '#b86e1f' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role !== 'admin' ? (
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
