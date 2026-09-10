import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { bookingsAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';

interface Booking {
  id: number; room_id: number; room_name: string; image_url: string;
  check_in: string; check_out: string; adults: number;
  kids: number; total_price: string; status: string; special_requests: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'text-amber-700 bg-amber-50 border border-amber-200',
  confirmed: 'text-blue-700 bg-blue-50 border border-blue-200',
  completed: 'text-green-700 bg-green-50 border border-green-200',
  cancelled: 'text-red-600 bg-red-50 border border-red-200',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
function nights(ci: string, co: string) {
  return Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    bookingsAPI.myBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <section className="min-h-screen">
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className="bg-room h-[300px] relative flex justify-center items-center bg-cover bg-center">
        <div className="absolute w-full h-full bg-black/70" />
        <h1 className="text-5xl text-white z-20 font-primary text-center">My Bookings</h1>
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-6">Start your luxury experience today.</p>
            <Link to="/" className="btn btn-primary">Browse Rooms</Link>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-gray-500">{bookings.length} booking{bookings.length > 1 ? 's' : ''} found</p>
            {bookings.map(b => {
              const n = nights(b.check_in, b.check_out);
              return (
                <div key={b.id} className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col sm:flex-row gap-5">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-primary text-xl text-primary">{b.room_name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize shrink-0 ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check In</p>
                        <p className="font-medium text-gray-800">{fmt(b.check_in)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check Out</p>
                        <p className="font-medium text-gray-800">{fmt(b.check_out)}</p>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Duration</p>
                        <p className="font-medium text-gray-800">{n} night{n > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>👥 {b.adults} Adult{b.adults > 1 ? 's' : ''}{b.kids > 0 ? `, ${b.kids} Kid${b.kids > 1 ? 's' : ''}` : ''}</span>
                      <span className="font-semibold text-accent">Total: ₹{parseFloat(b.total_price).toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-xs">Booking #{b.id}</span>
                    </div>

                    {b.special_requests && (
                      <p className="text-xs text-gray-400 italic">"{b.special_requests}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                    {b.status === 'pending' && (
                      <button onClick={() => handleCancel(b.id)}
                        className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel
                      </button>
                    )}
                    <Link to={`/room/${b.room_id}`}
                      className="text-sm text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/5 transition-colors text-center">
                      View Room
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
