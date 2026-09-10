import type { Room } from './room';

export interface Location { id: number; name: string; city: string; state: string; description: string; }

/** Room context state and actions exposed to consumers via useRoomContext(). */
export interface RoomContextValue {
  rooms: Room[];
  loading: boolean;
  adults: string;
  setAdults: (value: string) => void;
  kids: string;
  setKids: (value: string) => void;
  handleCheck: (e: React.FormEvent) => void;
  resetRoomFilterData: () => void;
  locations: Location[];
  selectedLocation: number | null;
  setSelectedLocation: (id: number | null) => void;
}
