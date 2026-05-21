# Sistem Booking Villa

Modern villa reservation platform with elegant UI, premium stay presentation, and streamlined booking flow.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Express.js
- Database: PostgreSQL
- UI: Tailwind CSS + komponen shadcn sederhana

## Fitur

- Public: Home, List Villa, Detail Villa, Login, Register
- User: Dashboard User, Booking Saya, Profile
- Admin: Dashboard Admin, Kelola Villa, Kelola Booking
- CRUD villa dengan upload gambar
- Booking villa dan update status booking

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Copy environment file

```bash
copy .env.example .env
```

3. Buat database PostgreSQL, lalu jalankan schema dan seed:

```sql
\i server/schema.sql
\i server/seed.sql
```

4. Jalankan backend

```bash
npm run dev:server
```

5. Jalankan frontend

```bash
npm run dev
```

Atau jalankan keduanya sekaligus:

```bash
npm run dev:full
```

## Catatan Admin

- Register akun biasa melalui aplikasi.
- Untuk menjadikan akun sebagai admin, ubah role langsung di PostgreSQL:

```sql
update users set role = 'admin' where email = 'admin@villa.local';
```

## Struktur Database

- `users`: id, name, email, password, role, created_at
- `villas`: id, nama_villa, lokasi, harga, deskripsi, gambar, status, created_at
- `bookings`: id, user_id, villa_id, tanggal_checkin, tanggal_checkout, jumlah_tamu, status_booking, created_at
