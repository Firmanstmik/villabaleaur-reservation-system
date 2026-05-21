export type UserRole = "user" | "admin";

export type VillaStatus = "tersedia" | "maintenance" | "nonaktif";

export type BookingStatus = "menunggu" | "disetujui" | "ditolak" | "selesai";

export interface AuthUser {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Villa {
  id: number;
  nama_villa: string;
  lokasi: string;
  harga: number;
  max_guest: number;
  deskripsi: string;
  gambar: string;
  galeri: string[];
  status: VillaStatus;
  created_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  villa_id: number;
  tanggal_checkin: string;
  tanggal_checkout: string;
  jumlah_tamu: number;
  status_booking: BookingStatus;
  created_at: string;
  villa_nama?: string;
  villa_lokasi?: string;
  villa_gambar?: string;
  user_name?: string;
  user_email?: string;
}

export interface ApiAuthResponse {
  token: string;
  user: AuthUser;
}

export interface UserDashboardSummary {
  totalBooking: number;
  bookingAktif: number;
  bookingSelesai: number;
  bookingTerbaru: Booking[];
}

export interface AdminDashboardSummary {
  totalVilla: number;
  totalBooking: number;
  bookingMenunggu: number;
  userTerdaftar: number;
}

export interface AdminGuest {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  created_at: string;
  totalBooking: number;
}

export interface AdminUser {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  role: UserRole;
  created_at: string;
  totalBooking: number;
}
