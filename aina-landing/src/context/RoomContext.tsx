import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RoomContextValue } from "../types";
import type { Location } from "../types/context";
import { roomsAPI, locationsAPI } from "../api";
import images from "../assets";
import { FaWifi, FaCoffee, FaBath, FaParking, FaSwimmingPool, FaHotdog, FaStopwatch, FaCocktail } from "react-icons/fa";

const RoomInfo = createContext<RoomContextValue | null>(null);

const FACILITY_ICONS: Record<string, React.ComponentType> = {
  Wifi: FaWifi, Coffee: FaCoffee, Bath: FaBath, "Parking Space": FaParking,
  "Swimming Pool": FaSwimmingPool, Breakfast: FaHotdog, GYM: FaStopwatch, Drinks: FaCocktail,
};

const ROOM_IMAGES = [
  [images.Room1Img, images.Room1ImgLg], [images.Room2Img, images.Room2ImgLg],
  [images.Room3Img, images.Room3ImgLg], [images.Room4Img, images.Room4ImgLg],
  [images.Room5Img, images.Room5ImgLg], [images.Room6Img, images.Room6ImgLg],
  [images.Room7Img, images.Room7ImgLg], [images.Room8Img, images.Room8ImgLg],
];

function mapRoom(r: any, i: number) {
  const imgIdx = i % ROOM_IMAGES.length;
  const galleryImages: string[] = r.images?.length
    ? r.images
    : [r.image_url || ROOM_IMAGES[imgIdx][0], r.image_lg_url || ROOM_IMAGES[imgIdx][1]].filter(Boolean);
  return {
    id: r.id,
    name: r.name,
    description: r.description || "",
    size: r.size || 0,
    maxPerson: r.max_person,
    price: parseFloat(r.price),
    image: r.image_url || r.images?.[0] || ROOM_IMAGES[imgIdx][0],
    imageLg: r.image_lg_url || r.images?.[0] || ROOM_IMAGES[imgIdx][1],
    images: galleryImages,
    location_id: r.location_id || null,
    location_name: r.location_name || null,
    location_city: r.location_city || null,
    facilities: (r.facilities || []).map((f: string) => ({
      name: f,
      icon: FACILITY_ICONS[f] || FaWifi,
    })),
  };
}

export function RoomContext({ children }: { children: ReactNode }) {
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState("1 Adult");
  const [kids, setKids] = useState("0 Kid");
  const [total, setTotal] = useState(0);
  const [selectedLocation, setSelectedLocationState] = useState<number | null>(null);

  useEffect(() => { setTotal(+adults[0] + +kids[0]); }, [adults, kids]);

  // Fetch locations once
  useEffect(() => {
    locationsAPI.getAll().then(({ data }) => setLocations(data)).catch(() => {});
  }, []);

  // Fetch rooms whenever selectedLocation changes
  useEffect(() => {
    setLoading(true);
    roomsAPI.getAll(selectedLocation ?? undefined)
      .then(({ data }) => {
        const mapped = data.map(mapRoom);
        setAllRooms(mapped);
        setRooms(mapped);
      })
      .catch(() => { setAllRooms([]); setRooms([]); })
      .finally(() => setLoading(false));
  }, [selectedLocation]);

  const setSelectedLocation = (id: number | null) => {
    setSelectedLocationState(id);
    setAdults("1 Adult");
    setKids("0 Kid");
  };

  const resetRoomFilterData = () => { setAdults("1 Adult"); setKids("0 Kid"); setRooms(allRooms); };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const filtered = allRooms.filter((room) => total <= room.maxPerson);
    setTimeout(() => { setLoading(false); setRooms(filtered); }, 1000);
  };

  return (
    <RoomInfo.Provider value={{
      rooms, loading, adults, setAdults, kids, setKids,
      handleCheck, resetRoomFilterData,
      locations, selectedLocation, setSelectedLocation,
    }}>
      {children}
    </RoomInfo.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useRoomContext(): RoomContextValue {
  const ctx = useContext(RoomInfo);
  if (!ctx) throw new Error("useRoomContext must be used within RoomContext");
  return ctx;
}
