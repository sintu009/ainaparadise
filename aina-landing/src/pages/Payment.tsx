import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { bookingsAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle, FaCreditCard, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

type PaymentMethod = 'card' | 'upi' | 'netbanking';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bank, setBank] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  // If no state, redirect home
  if (!state?.room_id) {
    navigate('/');
    return null;
  }

  const {
    room_id, room_name, location, check_in, check_out,
    nights, adults, kids, price_per_night, total_price,
    guest_name, guest_email, guest_phone,
  } = state;

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handlePay = async () => {
    if (method === 'upi' && !upiId.trim()) { toast.error('Enter UPI ID'); return; }
    if (method === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) { toast.error('Fill all card details'); return; }
    }
    if (method === 'netbanking' && !bank) { toast.error('Select a bank'); return; }

    setProcessing(true);
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 2000));

    try {
      await bookingsAPI.create({
        room_id, check_in, check_out, adults, kids,
        guest_name, guest_email, guest_phone,
      });
      setPaid(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
      setProcessing(false);
    }
  };

  if (paid) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Toaster position="top-right" />
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="font-primary text-3xl text-primary mb-2">Payment Successful!</h2>
          <p className="font-tertiary text-gray-500 mb-1">Your booking for <strong>{room_name}</strong> is confirmed.</p>
          <p className="font-tertiary text-gray-400 text-sm mb-6">{fmt(check_in)} → {fmt(check_out)} · {nights} night{nights > 1 ? 's' : ''}</p>
          <p className="font-tertiary text-accent text-xl font-semibold mb-8">₹{Number(total_price).toLocaleString('en-IN')} paid</p>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-primary w-full">
            View My Bookings
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <ScrollToTop />

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-primary text-4xl text-primary mb-8 text-center">Complete Your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Payment form */}
          <div className="flex-1 space-y-5">

            {/* Method selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-primary text-lg text-primary mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['upi', 'card', 'netbanking'] as PaymentMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-3 rounded-lg border text-sm font-tertiary font-medium transition-all capitalize
                      ${method === m ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200 text-gray-500 hover:border-accent/50'}`}
                  >
                    {m === 'upi' ? 'UPI' : m === 'card' ? 'Card' : 'Net Banking'}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI */}
            {method === 'upi' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
                <h3 className="font-primary text-lg text-primary">UPI Payment</h3>
                <p className="text-xs text-gray-400 font-tertiary">Enter your UPI ID (e.g. name@upi, phone@paytm)</p>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-tertiary focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Card */}
            {method === 'card' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
                <h3 className="font-primary text-lg text-primary flex items-center gap-2">
                  <FaCreditCard className="text-accent" /> Card Details
                </h3>
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-tertiary focus:outline-none focus:border-accent tracking-widest"
                />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-tertiary focus:outline-none focus:border-accent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '');
                      setCardExpiry(v.length >= 3 ? `${v.slice(0,2)}/${v.slice(2)}` : v);
                    }}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-tertiary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={3}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-tertiary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'netbanking' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
                <h3 className="font-primary text-lg text-primary">Net Banking</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Other'].map(b => (
                    <button
                      key={b}
                      onClick={() => setBank(b)}
                      className={`py-3 rounded-lg border text-sm font-tertiary transition-all
                        ${bank === b ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200 text-gray-600 hover:border-accent/50'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="btn btn-primary w-full text-base flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? (
                <><span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> Processing Payment…</>
              ) : (
                <><FaLock className="text-sm" /> Pay ₹{Number(total_price).toLocaleString('en-IN')}</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 font-tertiary flex items-center justify-center gap-1">
              <FaLock /> Secured dummy payment — no real transaction
            </p>
          </div>

          {/* Right — Order summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
              <h3 className="font-primary text-lg text-primary mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm font-tertiary">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Room</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{room_name}</p>
                </div>
                {location && (
                  <div className="flex items-center gap-1.5 text-accent text-xs">
                    <FaMapMarkerAlt /> {location}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check In</p>
                    <p className="font-medium text-gray-800 text-xs">{fmt(check_in)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check Out</p>
                    <p className="font-medium text-gray-800 text-xs">{fmt(check_out)}</p>
                  </div>
                </div>
                <div className="text-gray-600">
                  <span>👥 {adults} Adult{adults > 1 ? 's' : ''}{kids > 0 ? `, ${kids} Kid${kids > 1 ? 's' : ''}` : ''}</span>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-gray-500">
                    <span>₹{Number(price_per_night).toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{Number(total_price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxes & fees</span>
                    <span className="text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span className="text-accent">₹{Number(total_price).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-1 text-gray-500">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Guest</p>
                  <p>{guest_name}</p>
                  <p className="text-xs">{guest_email}</p>
                  {guest_phone && <p className="text-xs">{guest_phone}</p>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
