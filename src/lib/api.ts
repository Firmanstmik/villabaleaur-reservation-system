import { demoBookings, demoVillas } from "@/data/demoData";
import type {
  AdminDashboardSummary,
  AdminGuest,
  AdminUser,
  ApiAuthResponse,
  AuthUser,
  Booking,
  BookingStatus,
  UserDashboardSummary,
  Villa,
} from "@/types/app";

function resolveApiBaseUrl() {
  const configuredUrl = (import.meta.env.VITE_API_URL || "").trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname, port } = window.location;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalhost && port !== "3001") {
      return "http://localhost:3001";
    }
  }

  return "";
}

const API_BASE_URL = resolveApiBaseUrl();
const TOKEN_KEY = "villa_booking_token";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function getUrl(path: string) {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUploadUrl(path: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/assets/") || path.startsWith("assets/")) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, init: RequestInit = {}, fallback?: T): Promise<T> {
  const headers = new Headers(init.headers || {});
  const token = getStoredToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(getUrl(path), {
      ...init,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload && "message" in payload
          ? String(payload.message)
          : "Terjadi kesalahan pada server.";
      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    if (!token && fallback !== undefined) {
      return fallback;
    }

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError("Tidak dapat terhubung ke server.", 0, "NETWORK_ERROR");
    }

    throw error;
  }
}

export const authApi = {
  register(payload: { name: string; phone: string; password: string }) {
    return request<ApiAuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload: { phone: string; password: string }) {
    return request<ApiAuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  me() {
    return request<{ user: AuthUser }>("/api/auth/me");
  },
};

export const villaApi = {
  list() {
    return request<{ villas: Villa[] }>("/api/villas", {}, { villas: demoVillas });
  },
  detail(id: string | number) {
    const fallback = demoVillas.find((villa) => String(villa.id) === String(id));
    return request<{ villa: Villa }>(`/api/villas/${id}`, {}, { villa: fallback || demoVillas[0] });
  },
  importGallery(id: number, urls: string[]) {
    return request<{ villa: Villa }>(`/api/villas/${id}/import-gallery`, {
      method: "POST",
      body: JSON.stringify({ urls }),
    });
  },
  create(formData: FormData) {
    return request<{ villa: Villa }>("/api/villas", {
      method: "POST",
      body: formData,
    });
  },
  update(id: number, formData: FormData) {
    return request<{ villa: Villa }>(`/api/villas/${id}`, {
      method: "PUT",
      body: formData,
    });
  },
  remove(id: number) {
    return request<{ message: string }>(`/api/villas/${id}`, {
      method: "DELETE",
    });
  },
};

export const bookingApi = {
  create(payload: {
    villa_id: number;
    tanggal_checkin: string;
    tanggal_checkout: string;
    jumlah_tamu: number;
  }) {
    return request<{ booking: Booking }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  myBookings() {
    return request<{ bookings: Booking[] }>("/api/bookings/my", {}, { bookings: demoBookings });
  },
  userDashboard() {
    const fallback: { summary: UserDashboardSummary } = {
      summary: {
        totalBooking: demoBookings.length,
        bookingAktif: demoBookings.filter((item) => item.status_booking === "menunggu").length,
        bookingSelesai: demoBookings.filter((item) => item.status_booking === "selesai").length,
        bookingTerbaru: demoBookings,
      },
    };

    return request<{ summary: UserDashboardSummary }>("/api/user/dashboard", {}, fallback);
  },
  adminBookings() {
    return request<{ bookings: Booking[] }>("/api/admin/bookings", {}, { bookings: demoBookings });
  },
  updateStatus(id: number, status_booking: BookingStatus) {
    return request<{ booking: Booking }>(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status_booking }),
    });
  },
  adminSummary() {
    const fallback: { summary: AdminDashboardSummary } = {
      summary: {
        totalVilla: demoVillas.length,
        totalBooking: demoBookings.length,
        bookingMenunggu: demoBookings.filter((item) => item.status_booking === "menunggu").length,
        userTerdaftar: 1,
      },
    };

    return request<{ summary: AdminDashboardSummary }>("/api/admin/dashboard", {}, fallback);
  },
};

export const adminApi = {
  guests() {
    return request<{ guests: AdminGuest[] }>("/api/admin/guests", {}, { guests: [] });
  },
  deleteGuest(id: number) {
    return request<{ message: string }>(`/api/admin/guests/${id}`, { method: "DELETE" });
  },
  users(role?: "user" | "admin") {
    const query = role ? `?role=${encodeURIComponent(role)}` : "";
    return request<{ users: AdminUser[] }>(`/api/admin/users${query}`, {}, { users: [] });
  },
  createUser(payload: { name: string; phone: string; email?: string | null; password: string; role: "user" | "admin" }) {
    return request<{ user: AuthUser }>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateUser(id: number, payload: { name?: string; phone?: string; email?: string | null; password?: string; role?: "user" | "admin" }) {
    return request<{ user: AuthUser }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
