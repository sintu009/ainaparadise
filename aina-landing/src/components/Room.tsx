import { BsPeople } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { Room as RoomType } from '../types';

interface RoomProps {
  room: RoomType;
}

export default function Room({ room }: RoomProps) {
  const { id, name, image, maxPerson, description, price } = room;
  const locationName = (room as any).location_name;
  const locationCity = (room as any).location_city;

  return (
    <div className="group bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-[240px]">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-accent text-white font-tertiary text-sm font-semibold px-3 py-1">
          From ₹{price.toLocaleString()}
        </div>
        {/* Location badge */}
        {locationName && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 text-white font-tertiary text-xs px-2 py-1">
            <FaMapMarkerAlt className="text-accent" />
            {locationName}, {locationCity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/room/${id}`}>
          <h3 className="font-primary text-[22px] text-primary hover:text-accent transition-colors duration-200 mb-2">
            {name}
          </h3>
        </Link>

        <p className="font-tertiary text-gray-500 text-[14px] leading-relaxed mb-4 flex-1">
          {description.slice(0, 90)}...
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-x-1.5 text-gray-400 font-tertiary text-[13px]">
            <BsPeople className="text-accent text-[16px]" />
            <span>Up to {maxPerson} guests</span>
          </div>
          <Link
            to={`/room/${id}`}
            className="inline-flex items-center gap-x-1 font-tertiary text-[11px] uppercase tracking-[2px] text-white bg-primary hover:bg-accent transition-colors duration-200 px-4 py-2"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
