import { useState } from 'react';
import { useRoomContext } from '../context/RoomContext';
import { SpinnerDotted } from 'spinners-react';
import Room from './Room';

export default function Rooms() {
  const { rooms, loading, locations, selectedLocation, setSelectedLocation } = useRoomContext();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? rooms : rooms.slice(0, 6);
  const selectedLoc = locations.find(l => l.id === selectedLocation);

  return (
    <section id="rooms" className="py-24">
      {loading && (
        <div className="h-screen w-full fixed bottom-0 top-0 bg-black/80 z-50 grid place-items-center">
          <SpinnerDotted />
        </div>
      )}
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">
        <div className="text-center">
          <p className="font-tertiary uppercase text-[15px] tracking-[6px]">Aina Paradise Hotel</p>
          <h2 className="font-primary text-[45px] mb-2">Rooms &amp; Suites</h2>
          {selectedLoc && (
            <p className="font-tertiary text-accent text-sm tracking-widest uppercase mb-6">
              {selectedLoc.name} — {selectedLoc.city}, {selectedLoc.state}
            </p>
          )}
        </div>
        {!loading && rooms.length === 0 && (
          <div className="text-center py-16">
            <p className="font-tertiary text-gray-500 text-lg mb-4">No rooms available for this location.</p>
            <button onClick={() => setSelectedLocation(null)} className="btn btn-secondary btn-sm px-8">
              View All Locations
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0">
          {visible.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        {rooms.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll((p) => !p)}
              className="btn btn-secondary btn-sm px-10"
            >
              {showAll ? 'Show Less' : `Show More Rooms (${rooms.length - 6} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
