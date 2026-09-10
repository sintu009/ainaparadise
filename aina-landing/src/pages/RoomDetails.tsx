import { useState } from 'react';
import { AdultsDropdown, CheckIn, CheckOut, KidsDropdown, ScrollToTop } from '../components';
import { useRoomContext } from '../context/RoomContext';
import { hotelRules } from '../data';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import type { Facility } from '../types';
import toast, { Toaster } from 'react-hot-toast';

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const { rooms, adults, kids } = useRoomContext();
  const room = rooms.find((r) => r.id === Number(id));
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!room) {
    return (
      <section>
        <ScrollToTop />
        <div className="container mx-auto max-w-7xl py-24 text-center"><p>Room not found.</p></div>
      </section>
    );
  }

  const { name, description, facilities, price, images = [] } = room;
  const locationName = (room as any).location_name;
  const locationCity = (room as any).location_city;
  const locationState = (room as any).location_state;
  const gallery: string[] = images.length ? images : [room.imageLg || room.image].filter(Boolean);

  const numAdults = parseInt(adults[0]) || 1;
  const numKids = parseInt(kids[0]) || 0;
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights > 0 ? nights * price : price;

  const prev = () => setActiveImg(i => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActiveImg(i => (i + 1) % gallery.length);
  const lbPrev = () => setLightbox(i => ((i ?? 0) - 1 + gallery.length) % gallery.length);
  const lbNext = () => setLightbox(i => ((i ?? 0) + 1) % gallery.length);

  const handleBook = async () => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    if (!guestName || !guestEmail) { toast.error('Please fill in your name and email'); return; }
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    navigate('/payment', {
      state: {
        room_id: room.id,
        room_name: name,
        location: locationName ? `${locationName}, ${locationCity}` : null,
        check_in: fmt(checkIn),
        check_out: fmt(checkOut),
        nights,
        adults: numAdults,
        kids: numKids,
        price_per_night: price,
        total_price: totalPrice,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
      }
    });
  };

  return (
    <section>
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className="bg-room h-[560px] relative flex justify-center items-center bg-cover bg-center">
        <div className="absolute w-full h-full bg-black/70" />
        <h1 className="text-6xl text-white z-20 font-primary text-center">{name}</h1>
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-x-8 h-full py-24">

          {/* Left: info + gallery */}
          <div className="w-full h-full text-justify">
            <h2 className="h2">{name}</h2>
            {locationName && (
              <div className="flex items-center gap-1.5 text-accent font-tertiary text-sm mb-4">
                <FaMapMarkerAlt />
                <span>{locationName} — {locationCity}, {locationState}</span>
              </div>
            )}
            <p className="mb-8">{description}</p>

            {/* Main image with arrows */}
            {gallery.length > 0 && (
              <div className="mb-4 relative group">
                <img
                  src={gallery[activeImg]}
                  alt={`${name} ${activeImg + 1}`}
                  className="w-full h-[420px] object-cover cursor-pointer"
                  onClick={() => setLightbox(activeImg)}
                />
                {gallery.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100">
                      <FaChevronLeft />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100">
                      <FaChevronRight />
                    </button>
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {activeImg + 1} / {gallery.length}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`thumb-${i}`}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-16 object-cover cursor-pointer rounded shrink-0 transition-all
                      ${i === activeImg ? 'ring-2 ring-accent opacity-100' : 'opacity-60 hover:opacity-90'}`}
                  />
                ))}
              </div>
            )}

            {/* Facilities */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
              {facilities.map((item: Facility, index: number) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-x-3 flex-1">
                    <div className="text-3xl text-accent"><Icon /></div>
                    <div className="text-base">{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: booking form */}
          <div className="w-full lg:max-w-xs h-full">
            <div className="py-8 px-6 bg-accent/20 mb-12 w-full">
              <div className="flex flex-col space-y-4 mb-4 w-full">
                <h3>Your Reservation</h3>
                <div className="h-[60px] w-full"><CheckIn popperPlacement="bottom-end" popperFullWidth onDateChange={setCheckIn} /></div>
                <div className="h-[60px] w-full"><CheckOut popperPlacement="bottom-end" popperFullWidth onDateChange={setCheckOut} /></div>
                <div className="h-[60px] w-full"><AdultsDropdown /></div>
                <div className="h-[60px] w-full"><KidsDropdown /></div>
                <input type="text" placeholder="Your Name" value={guestName} onChange={e => setGuestName(e.target.value)}
                  className="border border-primary/20 px-3 py-2 text-sm outline-none focus:border-accent w-full" />
                <input type="email" placeholder="Your Email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                  className="border border-primary/20 px-3 py-2 text-sm outline-none focus:border-accent w-full" />
                <input type="tel" placeholder="Phone (optional)" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                  className="border border-primary/20 px-3 py-2 text-sm outline-none focus:border-accent w-full" />
              </div>
              {nights > 0 && (
                <div className="bg-white/60 rounded p-3 text-sm font-tertiary space-y-1 mb-2">
                  <div className="flex justify-between">
                    <span>₹{price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{(price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span>{numAdults} adult{numAdults > 1 ? 's' : ''}{numKids > 0 ? `, ${numKids} kid${numKids > 1 ? 's' : ''}` : ''}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-primary/20 pt-1">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <button type="button" onClick={handleBook}
                className="btn btn-lg btn-primary w-full">
                {nights > 0 ? `Proceed to Pay — ₹${totalPrice.toLocaleString('en-IN')}` : `Book Now — ₹${price.toLocaleString('en-IN')}/night`}
              </button>
            </div>
            <div>
              <h3 className="h3">Hotel Rules</h3>
              <p className="mb-6 text-justify">Please follow our hotel guidelines to ensure a pleasant stay for all guests.</p>
              <ul className="flex flex-col gap-y-4">
                {hotelRules.map(({ rules }, idx) => (
                  <li key={idx} className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />{rules}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); setLightbox(null); }} className="absolute top-4 right-4 text-white text-2xl"><FaTimes /></button>
          <button onClick={e => { e.stopPropagation(); lbPrev(); }} className="absolute left-4 text-white bg-black/50 p-3 rounded-full"><FaChevronLeft /></button>
          <img
            src={gallery[lightbox]}
            alt="lightbox"
            className="max-h-[85vh] max-w-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={e => { e.stopPropagation(); lbNext(); }} className="absolute right-4 text-white bg-black/50 p-3 rounded-full"><FaChevronRight /></button>
          <span className="absolute bottom-4 text-white text-sm">{lightbox + 1} / {gallery.length}</span>
        </div>
      )}
    </section>
  );
}
