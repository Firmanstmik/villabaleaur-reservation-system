import { baleAurProperty, baleAurRoomTypes } from "@/data/baleAurContent";
import type { Booking, Villa } from "@/types/app";

export const demoVillas: Villa[] = [
  ...baleAurRoomTypes.map((room, index) => ({
    id: room.id,
    nama_villa: room.displayName,
    lokasi: room.location,
    harga: room.price,
    max_guest: Number(room.capacity.en.replace(/[^0-9]/g, "")) || 2,
    deskripsi: room.description.en,
    gambar: room.image,
    galeri: [room.image],
    status: "tersedia" as const,
    created_at: `2026-02-0${index + 1}T08:00:00.000Z`,
  })),
];

export const demoBookings: Booking[] = [
  {
    id: 1,
    user_id: 1,
    villa_id: 1,
    tanggal_checkin: "2026-06-10",
    tanggal_checkout: "2026-06-12",
    jumlah_tamu: 2,
    status_booking: "menunggu",
    created_at: "2026-05-01T08:00:00.000Z",
    villa_nama: baleAurRoomTypes[0].displayName,
    villa_lokasi: baleAurProperty.locationShort,
    villa_gambar: demoVillas[0].gambar,
    user_name: "Demo User",
    user_email: "guest@baleaur.local",
  },
];

export const fiturUtama = [
  "Single-property reservation flow for Bale Aur Sembalun",
  "Mountain stay experience with sunrise, balcony, and nature-forward comfort",
  "Clear reservation status for a calm and polished guest journey",
  "Official-property content focused on rooms, nearby nature, and stay details",
];
