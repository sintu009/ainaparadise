import { FaMapMarkerAlt } from 'react-icons/fa';
import { BsChevronDown } from 'react-icons/bs';
import { Menu } from '@headlessui/react';
import { useRoomContext } from '../context/RoomContext';

export default function LocationSelector() {
  const { locations, selectedLocation, setSelectedLocation } = useRoomContext();

  if (!locations.length) return null;

  const grouped = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    (acc[loc.state] = acc[loc.state] || []).push(loc);
    return acc;
  }, {});

  const selectedLabel = selectedLocation
    ? locations.find(l => l.id === selectedLocation)?.name ?? 'All Locations'
    : 'All Locations';

  return (
    <Menu as="div" className="w-full h-full bg-white relative">
      <Menu.Button className="dropdown-trigger w-full h-full flex items-center justify-between px-8 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 focus:border-0">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1.5 mb-0.5">
            <FaMapMarkerAlt className="text-accent text-xs" />
            <span className="text-xs font-tertiary uppercase tracking-widest text-gray-400">Location</span>
          </div>
          <span className="text-sm font-tertiary text-gray-700">{selectedLabel}</span>
        </div>
        <BsChevronDown className="dropdown-chevron text-base text-accent-hover transition-transform duration-200 ease-out" />
      </Menu.Button>

      <Menu.Items
        as="ul"
        transition
        className="dropdown-panel bg-white absolute w-full flex flex-col z-40 border border-accent/20 shadow-md transition ease-out duration-200 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0"
        modal={false}
      >
        {/* All Locations option */}
        <Menu.Item
          as="li"
          onClick={() => setSelectedLocation(null)}
          className="h-10 hover:bg-accent hover:text-white w-full flex items-center justify-center cursor-pointer border-b border-gray-200 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 text-sm font-tertiary"
        >
          All Locations
        </Menu.Item>

        {Object.entries(grouped).map(([state, locs]) => (
          <li key={state}>
            <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 font-tertiary">
              {state}
            </p>
            <ul>
              {locs.map(l => (
                <Menu.Item
                  as="li"
                  key={l.id}
                  onClick={() => setSelectedLocation(l.id)}
                  className="h-10 hover:bg-accent hover:text-white w-full flex items-center px-6 cursor-pointer border-b border-gray-200 last:border-b-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 text-sm font-tertiary"
                >
                  {l.name} — {l.city}
                </Menu.Item>
              ))}
            </ul>
          </li>
        ))}
      </Menu.Items>
    </Menu>
  );
}
