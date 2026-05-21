import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import pkg from "pg";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, "uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET || "villa-booking-secret";
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const storage = multer.diskStorage({
  destination: (_, __, callback) => callback(null, uploadsDirectory),
  filename: (_, file, callback) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, filename);
  },
});

const upload = multer({ storage });

await pool.query("alter table villas add column if not exists galeri text not null default '[]'");
await pool.query("alter table villas add column if not exists max_guest integer not null default 2");
await pool.query("alter table users add column if not exists phone varchar(30)");
await pool.query("alter table users alter column email drop not null");
await pool.query("create unique index if not exists users_phone_unique_idx on users(phone) where phone is not null");

async function ensureAdminUser() {
  const phone = normalizePhone(process.env.ADMIN_PHONE || "628111111111");
  const email = process.env.ADMIN_EMAIL ? String(process.env.ADMIN_EMAIL).trim().toLowerCase() : "admin@villa.local";
  const password = String(process.env.ADMIN_PASSWORD || "AdminBaleAur123!");
  const name = String(process.env.ADMIN_NAME || "Admin Bale Aur").trim() || "Admin Bale Aur";

  const existing = await query("select id from users where role = 'admin' limit 1");
  if (existing.length > 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await query(
    `
      insert into users (name, phone, email, password, role)
      values ($1, $2, $3, $4, 'admin')
    `,
    [name, phone, email, hashedPassword],
  );
}

async function ensureVillas() {
  const existing = await query("select count(*) as count from villas");
  if (existing[0].count > 0) {
    return;
  }

  const villas = [
    {
      nama_villa: "Bale Aur Sembalun - Standard Double Room",
      lokasi: "Sembalun Lawang, Lombok Timur",
      harga: 650000,
      max_guest: 2,
      deskripsi: "Warm double room with a seating area, private terrace, and Sembalun mountain panorama for a simple yet refined stay.",
      gambar: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/ab84baaf24de9f591f4630f6df1374a2~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=nTFgzEW71ylMT2raYgxC8ovMUgc%3D",
      galeri: JSON.stringify(["https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/ab84baaf24de9f591f4630f6df1374a2~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=nTFgzEW71ylMT2raYgxC8ovMUgc%3D"]),
      status: "tersedia",
    },
    {
      nama_villa: "Bale Aur Sembalun - Family Room",
      lokasi: "Sembalun Lawang, Lombok Timur",
      harga: 980000,
      max_guest: 4,
      deskripsi: "Family room designed for cool mountain air, natural timber ambience, and a comfortable stay in Bale Aur Sembalun.",
      gambar: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/01d4fc29595ecc9254802de4a56298bc~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=5oNrJ6TV3q8v9Py27BbGT0vmYMQ%3D",
      galeri: JSON.stringify(["https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/01d4fc29595ecc9254802de4a56298bc~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=5oNrJ6TV3q8v9Py27BbGT0vmYMQ%3D"]),
      status: "tersedia",
    },
    {
      nama_villa: "Bale Aur Sembalun - Double Room with Balcony",
      lokasi: "Sembalun Lawang, Lombok Timur",
      harga: 780000,
      max_guest: 2,
      deskripsi: "Room with a private balcony for enjoying Sembalun sunrise, cool morning air, and intimate slow-living moments.",
      gambar: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/e789321b54784ec3038e5dfd45cf0da3~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=BRdjLYXqWK8R2sK2iSLyLQ3EODI%3D",
      galeri: JSON.stringify(["https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/e789321b54784ec3038e5dfd45cf0da3~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=BRdjLYXqWK8R2sK2iSLyLQ3EODI%3D"]),
      status: "tersedia",
    },
    {
      nama_villa: "Bale Aur Sembalun - Studio with Mountain View",
      lokasi: "Sembalun Lawang, Lombok Timur",
      harga: 890000,
      max_guest: 4,
      deskripsi: "Mountain-view studio with a seating area and terrace facing the Sembalun landscape for a flexible and nature-led stay.",
      gambar: "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/40e2ef33cd2af5e0ef2953bf747c3b48~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=hEpK5crlLiUoXM2rcYeA49BdIkE%3D",
      galeri: JSON.stringify(["https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/40e2ef33cd2af5e0ef2953bf747c3b48~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=hEpK5crlLiUoXM2rcYeA49BdIkE%3D"]),
      status: "tersedia",
    },
  ];

  for (const villa of villas) {
    await query(
      `
        insert into villas (nama_villa, lokasi, harga, max_guest, deskripsi, gambar, galeri, status)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [villa.nama_villa, villa.lokasi, villa.harga, villa.max_guest, villa.deskripsi, villa.gambar, villa.galeri, villa.status],
    );
  }
}

function isHttpUrl(value) {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function getExtensionFromContentType(contentType) {
  if (!contentType) {
    return "";
  }

  const normalized = String(contentType).toLowerCase();
  if (normalized.includes("image/avif")) return ".avif";
  if (normalized.includes("image/webp")) return ".webp";
  if (normalized.includes("image/png")) return ".png";
  if (normalized.includes("image/jpeg")) return ".jpg";
  if (normalized.includes("image/jpg")) return ".jpg";
  if (normalized.includes("image/gif")) return ".gif";
  return "";
}

async function downloadImageToUploads(url, { timeoutMs = 15000 } = {}) {
  if (typeof fetch !== "function") {
    throw new Error("Runtime tidak mendukung fetch untuk download gambar.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Referer: "https://www.booking.com/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal download gambar (${response.status})`);
    }

    const contentType = response.headers.get("content-type") || "";
    const contentLength = Number(response.headers.get("content-length") || 0);
    const maxBytes = 12 * 1024 * 1024;
    if (contentLength && contentLength > maxBytes) {
      throw new Error("Ukuran gambar terlalu besar.");
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) {
      throw new Error("Ukuran gambar terlalu besar.");
    }

    const urlPathExtension = (() => {
      try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname);
        return ext && ext.length <= 6 ? ext : "";
      } catch (_) {
        return "";
      }
    })();

    const extension = getExtensionFromContentType(contentType) || urlPathExtension || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const filePath = path.join(uploadsDirectory, filename);
    await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));

    return `/uploads/${filename}`;
  } finally {
    clearTimeout(timer);
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isConfigured = configuredOrigins.includes(origin);
      const isLocalPreview = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (isConfigured || isLocalPreview) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin tidak diizinkan oleh CORS."));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email, phone: user.phone }, jwtSecret, { expiresIn: "7d" });
}

async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

async function syncCompletedBookings() {
  try {
    await query(
      `
        update bookings
        set status_booking = 'selesai'
        where status_booking = 'disetujui'
          and tanggal_checkout < current_date
      `,
    );
  } catch (_) {
    return;
  }
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? null,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
  };
}

function normalizePhone(raw) {
  if (typeof raw !== "string") {
    return "";
  }

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

function isEmailLike(value) {
  if (typeof value !== "string") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

await ensureAdminUser();
await ensureVillas();

function auth(requiredRole) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan." });
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      const users = await query("select id, name, phone, email, role, created_at from users where id = $1", [payload.id]);
      const user = users[0];

      if (!user) {
        return res.status(401).json({ message: "User tidak valid." });
      }

      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: "Akses ditolak." });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token tidak valid." });
    }
  };
}

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, password } = req.body;
  const rawPhone = typeof req.body?.phone === "string" ? req.body.phone : typeof req.body?.email === "string" ? req.body.email : "";
  const phone = normalizePhone(rawPhone);
  const email = isEmailLike(req.body?.email) ? String(req.body.email).trim().toLowerCase() : null;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (phone.length < 9 || phone.length > 15) {
    return res.status(400).json({ message: "Nomor WhatsApp tidak valid." });
  }

  try {
    const existingUser = await query("select id from users where phone = $1", [phone]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Nomor WhatsApp sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await query(
      `
        insert into users (name, phone, email, password, role)
        values ($1, $2, $3, $4, 'user')
        returning id, name, phone, email, role, created_at
      `,
      [name, phone, email, hashedPassword],
    );

    const user = users[0];
    res.status(201).json({ token: createToken(user), user: mapUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal register user." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { password } = req.body;
  const identifier = typeof req.body?.phone === "string" ? req.body.phone : typeof req.body?.email === "string" ? req.body.email : "";
  const normalizedPhone = normalizePhone(identifier);
  const normalizedEmail = isEmailLike(identifier) ? String(identifier).trim().toLowerCase() : null;

  try {
    const users = await query("select * from users where phone = $1 or email = $2", [normalizedPhone || null, normalizedEmail]);
    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: "Nomor WhatsApp atau password salah." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Nomor WhatsApp atau password salah." });
    }

    res.json({
      token: createToken(user),
      user: mapUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal login." });
  }
});

app.get("/api/auth/me", auth(), async (req, res) => {
  res.json({ user: mapUser(req.user) });
});

app.get("/api/villas", async (_, res) => {
  try {
    const villas = await query("select * from villas order by created_at desc");
    res.json({
      villas: villas.map((villa) => {
        let galeri = [];
        if (typeof villa.galeri === "string") {
          try {
            const parsed = JSON.parse(villa.galeri);
            galeri = Array.isArray(parsed) ? parsed : [];
          } catch (_) {
            galeri = [];
          }
        }

        return { ...villa, galeri };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data villa." });
  }
});

app.get("/api/villas/:id", async (req, res) => {
  try {
    const villas = await query("select * from villas where id = $1", [req.params.id]);
    const villa = villas[0];

    if (!villa) {
      return res.status(404).json({ message: "Villa tidak ditemukan." });
    }

    let galeri = [];
    if (villa && typeof villa.galeri === "string") {
      try {
        const parsed = JSON.parse(villa.galeri);
        galeri = Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        galeri = [];
      }
    }

    res.json({ villa: { ...villa, galeri } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail villa." });
  }
});

app.post("/api/villas", auth("admin"), upload.array("gambar", 20), async (req, res) => {
  const { nama_villa, lokasi, harga, deskripsi, status, max_guest } = req.body;
  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  const uploadedGallery = uploadedFiles.map((file) => `/uploads/${file.filename}`);
  const bodyGallery = (() => {
    const raw = req.body.galeri;
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch (_) {
      return [];
    }
  })();

  const galeri = uploadedGallery.length > 0 ? uploadedGallery : bodyGallery;
  const thumbnailIndexRaw = typeof req.body.thumbnail_index === "string" ? req.body.thumbnail_index : "";
  const thumbnailIndex = Number(thumbnailIndexRaw);
  const selectedByIndex =
    Number.isFinite(thumbnailIndex) && thumbnailIndex >= 0 && thumbnailIndex < galeri.length
      ? galeri[Math.floor(thumbnailIndex)]
      : null;
  const bodyThumbnail = typeof req.body.gambar === "string" && req.body.gambar.trim().length > 0 ? req.body.gambar.trim() : null;
  const gambar = bodyThumbnail ?? selectedByIndex ?? galeri[0] ?? "";
  const maxGuestValue = Number(max_guest);
  const resolvedMaxGuest = Number.isFinite(maxGuestValue) && maxGuestValue >= 1 ? Math.min(20, Math.floor(maxGuestValue)) : 2;

  try {
    const villas = await query(
      `
        insert into villas (nama_villa, lokasi, harga, max_guest, deskripsi, gambar, galeri, status)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        returning *
      `,
      [nama_villa, lokasi, harga, resolvedMaxGuest, deskripsi, gambar, JSON.stringify(galeri), status],
    );

    res.status(201).json({ villa: { ...villas[0], galeri } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan villa." });
  }
});

app.put("/api/villas/:id", auth("admin"), upload.array("gambar", 20), async (req, res) => {
  const { nama_villa, lokasi, harga, deskripsi, status, max_guest } = req.body;

  try {
    const existingRows = await query("select * from villas where id = $1", [req.params.id]);
    const existingVilla = existingRows[0];

    if (!existingVilla) {
      return res.status(404).json({ message: "Villa tidak ditemukan." });
    }

    let existingGaleri = [];
    if (existingVilla && typeof existingVilla.galeri === "string") {
      try {
        const parsed = JSON.parse(existingVilla.galeri);
        existingGaleri = Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        existingGaleri = [];
      }
    }

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const uploadedGallery = uploadedFiles.map((file) => `/uploads/${file.filename}`);
    const bodyGallery = (() => {
      const raw = req.body.galeri;
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
      } catch (_) {
        return [];
      }
    })();

    const galeri = uploadedGallery.length > 0 ? uploadedGallery : bodyGallery ?? existingGaleri;
    const thumbnailIndexRaw = typeof req.body.thumbnail_index === "string" ? req.body.thumbnail_index : "";
    const thumbnailIndex = Number(thumbnailIndexRaw);
    const selectedByIndex =
      Number.isFinite(thumbnailIndex) && thumbnailIndex >= 0 && thumbnailIndex < galeri.length
        ? galeri[Math.floor(thumbnailIndex)]
        : null;
    const bodyThumbnail =
      typeof req.body.gambar === "string" && req.body.gambar.trim().length > 0 ? req.body.gambar.trim() : null;
    const gambar = bodyThumbnail ?? selectedByIndex ?? galeri[0] ?? existingVilla.gambar;
    const maxGuestValue = Number(max_guest);
    const resolvedMaxGuest = Number.isFinite(maxGuestValue) && maxGuestValue >= 1
      ? Math.min(20, Math.floor(maxGuestValue))
      : Number(existingVilla.max_guest) || 2;
    const villas = await query(
      `
        update villas
        set nama_villa = $1,
            lokasi = $2,
            harga = $3,
            max_guest = $4,
            deskripsi = $5,
            gambar = $6,
            galeri = $7,
            status = $8
        where id = $9
        returning *
      `,
      [nama_villa, lokasi, harga, resolvedMaxGuest, deskripsi, gambar, JSON.stringify(galeri), status, req.params.id],
    );

    res.json({ villa: { ...villas[0], galeri } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui villa." });
  }
});

app.post("/api/villas/:id/import-gallery", auth("admin"), async (req, res) => {
  const rawUrls = req.body?.urls;
  const urls = Array.isArray(rawUrls) ? rawUrls.filter(isHttpUrl) : [];

  if (urls.length === 0) {
    return res.status(400).json({ message: "URL galeri tidak valid." });
  }

  if (urls.length > 20) {
    return res.status(400).json({ message: "Maksimal 20 gambar untuk galeri." });
  }

  try {
    const existingRows = await query("select * from villas where id = $1", [req.params.id]);
    const existingVilla = existingRows[0];

    if (!existingVilla) {
      return res.status(404).json({ message: "Villa tidak ditemukan." });
    }

    const downloaded = [];
    for (const url of urls) {
      const storedPath = await downloadImageToUploads(url);
      downloaded.push(storedPath);
    }

    const galeri = downloaded.filter(Boolean);
    if (galeri.length === 0) {
      return res.status(400).json({ message: "Tidak ada gambar yang berhasil didownload." });
    }

    const gambar = galeri[0] ?? existingVilla.gambar;
    const villas = await query(
      `
        update villas
        set gambar = $1,
            galeri = $2
        where id = $3
        returning *
      `,
      [gambar, JSON.stringify(galeri), req.params.id],
    );

    res.json({ villa: { ...villas[0], galeri } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal import gambar dari URL." });
  }
});

app.delete("/api/villas/:id", auth("admin"), async (req, res) => {
  try {
    await query("delete from villas where id = $1", [req.params.id]);
    res.json({ message: "Villa berhasil dihapus." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus villa." });
  }
});

app.post("/api/bookings", auth(), async (req, res) => {
  const { villa_id, tanggal_checkin, tanggal_checkout, jumlah_tamu } = req.body;

  try {
    await syncCompletedBookings();
    if (!villa_id || !tanggal_checkin || !tanggal_checkout || !jumlah_tamu) {
      return res.status(400).json({ message: "Semua data booking wajib diisi." });
    }

    const guestCount = Number(jumlah_tamu);
    const checkinDate = new Date(tanggal_checkin);
    const checkoutDate = new Date(tanggal_checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(checkinDate.getTime()) || Number.isNaN(checkoutDate.getTime())) {
      return res.status(400).json({ message: "Tanggal booking tidak valid." });
    }

    if (checkinDate < today) {
      return res.status(400).json({ message: "Tanggal check-in tidak boleh sebelum hari ini." });
    }

    if (checkoutDate <= checkinDate) {
      return res.status(400).json({ message: "Tanggal checkout harus lebih besar dari tanggal check-in." });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({ message: "Jumlah tamu minimal 1 orang." });
    }

    const villas = await query("select * from villas where id = $1", [villa_id]);
    const villa = villas[0];

    if (!villa) {
      return res.status(404).json({ message: "Villa tidak ditemukan." });
    }

    if (villa.status !== "tersedia") {
      return res.status(400).json({ message: "Villa ini sedang tidak tersedia untuk dibooking." });
    }

    const maxGuest = Number(villa.max_guest) || 2;
    if (guestCount > maxGuest) {
      return res.status(400).json({ message: "Jumlah tamu melebihi kapasitas kamar." });
    }

    const overlappingBookings = await query(
      `
        select id
        from bookings
        where villa_id = $1
          and status_booking in ('menunggu', 'disetujui')
          and daterange(tanggal_checkin, tanggal_checkout, '[)') && daterange($2::date, $3::date, '[)')
        limit 1
      `,
      [villa_id, tanggal_checkin, tanggal_checkout],
    );

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: "Villa sudah memiliki booking pada rentang tanggal tersebut." });
    }

    const bookings = await query(
      `
        insert into bookings (user_id, villa_id, tanggal_checkin, tanggal_checkout, jumlah_tamu, status_booking)
        values ($1, $2, $3, $4, $5, 'menunggu')
        returning *
      `,
      [req.user.id, villa_id, tanggal_checkin, tanggal_checkout, guestCount],
    );

    res.status(201).json({ booking: bookings[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat booking." });
  }
});

app.get("/api/bookings/my", auth(), async (req, res) => {
  try {
    await syncCompletedBookings();
    const bookings = await query(
      `
        select
          b.*,
          v.nama_villa as villa_nama,
          v.lokasi as villa_lokasi,
          v.gambar as villa_gambar
        from bookings b
        join villas v on v.id = b.villa_id
        where b.user_id = $1
        order by b.created_at desc
      `,
      [req.user.id],
    );

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil booking user." });
  }
});

app.get("/api/user/dashboard", auth(), async (req, res) => {
  try {
    await syncCompletedBookings();
    const bookings = await query(
      `
        select
          b.*,
          v.nama_villa as villa_nama,
          v.lokasi as villa_lokasi,
          v.gambar as villa_gambar
        from bookings b
        join villas v on v.id = b.villa_id
        where b.user_id = $1
        order by b.created_at desc
        limit 5
      `,
      [req.user.id],
    );

    const stats = await query(
      `
        select
          count(*)::int as total_booking,
          count(*) filter (where status_booking in ('menunggu', 'disetujui'))::int as booking_aktif,
          count(*) filter (where status_booking = 'selesai')::int as booking_selesai
        from bookings
        where user_id = $1
      `,
      [req.user.id],
    );

    const summary = stats[0] || {};
    res.json({
      summary: {
        totalBooking: summary.total_booking || 0,
        bookingAktif: summary.booking_aktif || 0,
        bookingSelesai: summary.booking_selesai || 0,
        bookingTerbaru: bookings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil dashboard user." });
  }
});

app.get("/api/admin/bookings", auth("admin"), async (_, res) => {
  try {
    await syncCompletedBookings();
    const bookings = await query(
      `
        select
          b.*,
          v.nama_villa as villa_nama,
          v.lokasi as villa_lokasi,
          v.gambar as villa_gambar,
          u.name as user_name,
          u.email as user_email
        from bookings b
        join villas v on v.id = b.villa_id
        join users u on u.id = b.user_id
        order by b.created_at desc
      `,
    );

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil booking admin." });
  }
});

app.patch("/api/admin/bookings/:id/status", auth("admin"), async (req, res) => {
  const { status_booking } = req.body;

  try {
    const bookings = await query(
      `
        update bookings
        set status_booking = $1
        where id = $2
        returning *
      `,
      [status_booking, req.params.id],
    );

    res.json({ booking: bookings[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui status booking." });
  }
});

app.get("/api/admin/dashboard", auth("admin"), async (_, res) => {
  try {
    await syncCompletedBookings();
    const stats = await query(
      `
        select
          (select count(*)::int from villas) as total_villa,
          (select count(*)::int from bookings) as total_booking,
          (select count(*)::int from bookings where status_booking = 'menunggu') as booking_menunggu,
          (select count(*)::int from users) as user_terdaftar
      `,
    );

    const summary = stats[0] || {};
    res.json({
      summary: {
        totalVilla: summary.total_villa || 0,
        totalBooking: summary.total_booking || 0,
        bookingMenunggu: summary.booking_menunggu || 0,
        userTerdaftar: summary.user_terdaftar || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil dashboard admin." });
  }
});

app.get("/api/admin/guests", auth("admin"), async (_, res) => {
  try {
    const guests = await query(
      `
        select
          u.id,
          u.name,
          u.phone,
          u.email,
          u.created_at,
          count(b.id)::int as total_booking
        from users u
        left join bookings b on b.user_id = u.id
        where u.role = 'user'
        group by u.id
        order by u.created_at desc
      `,
    );

    res.json({
      guests: guests.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone ?? null,
        email: row.email,
        created_at: row.created_at,
        totalBooking: row.total_booking || 0,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data tamu." });
  }
});

app.delete("/api/admin/guests/:id", auth("admin"), async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: "ID user tidak valid." });
  }

  try {
    const deleted = await query("delete from users where id = $1 and role = 'user' returning id", [id]);
    if (deleted.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json({ message: "User berhasil dihapus." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus user." });
  }
});

app.get("/api/admin/users", auth("admin"), async (req, res) => {
  const role = typeof req.query?.role === "string" ? req.query.role.trim().toLowerCase() : "";
  const supportedRoles = new Set(["user", "admin"]);
  const filterRole = supportedRoles.has(role) ? role : null;

  try {
    const users = await query(
      `
        select
          u.id,
          u.name,
          u.phone,
          u.email,
          u.role,
          u.created_at,
          count(b.id)::int as total_booking
        from users u
        left join bookings b on b.user_id = u.id
        ${filterRole ? "where u.role = $1" : ""}
        group by u.id
        order by u.created_at desc
      `,
      filterRole ? [filterRole] : [],
    );

    res.json({
      users: users.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone ?? null,
        email: row.email,
        role: row.role,
        created_at: row.created_at,
        totalBooking: row.total_booking || 0,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user." });
  }
});

app.post("/api/admin/users", auth("admin"), async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const phone = normalizePhone(typeof req.body?.phone === "string" ? req.body.phone : "");
  const email = isEmailLike(req.body?.email) ? String(req.body.email).trim().toLowerCase() : null;
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const role = typeof req.body?.role === "string" ? req.body.role.trim().toLowerCase() : "";

  if (!name || !phone || !password || (role !== "user" && role !== "admin")) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (phone.length < 9 || phone.length > 15) {
    return res.status(400).json({ message: "Nomor WhatsApp tidak valid." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter." });
  }

  try {
    const existingPhone = await query("select id from users where phone = $1", [phone]);
    if (existingPhone.length > 0) {
      return res.status(400).json({ message: "Nomor WhatsApp sudah terdaftar." });
    }

    if (email) {
      const existingEmail = await query("select id from users where email = $1", [email]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await query(
      `
        insert into users (name, phone, email, password, role)
        values ($1, $2, $3, $4, $5)
        returning id, name, phone, email, role, created_at
      `,
      [name, phone, email, hashedPassword, role],
    );

    res.status(201).json({ user: mapUser(users[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan user." });
  }
});

app.patch("/api/admin/users/:id", auth("admin"), async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: "ID user tidak valid." });
  }

  try {
    const existingRows = await query("select * from users where id = $1", [id]);
    const existingUser = existingRows[0];

    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const name = typeof req.body?.name === "string" ? req.body.name.trim() : null;
    const phoneRaw = typeof req.body?.phone === "string" ? req.body.phone : null;
    const phone = phoneRaw === null ? null : normalizePhone(phoneRaw);
    const emailRaw = typeof req.body?.email === "string" ? req.body.email.trim() : null;
    const email = emailRaw === null ? null : emailRaw.length === 0 ? null : isEmailLike(emailRaw) ? emailRaw.toLowerCase() : "__invalid__";
    const password = typeof req.body?.password === "string" ? req.body.password : null;
    const roleRaw = typeof req.body?.role === "string" ? req.body.role.trim().toLowerCase() : null;
    const role = roleRaw === null ? null : roleRaw;

    if (email === "__invalid__") {
      return res.status(400).json({ message: "Email tidak valid." });
    }

    if (phone !== null && (phone.length < 9 || phone.length > 15)) {
      return res.status(400).json({ message: "Nomor WhatsApp tidak valid." });
    }

    if (password !== null && password.length > 0 && password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter." });
    }

    if (role !== null && role !== "user" && role !== "admin") {
      return res.status(400).json({ message: "Role tidak valid." });
    }

    if (existingUser.role === "admin" && role === "user") {
      const otherAdmins = await query("select count(*)::int as count from users where role = 'admin' and id <> $1", [id]);
      if ((otherAdmins[0]?.count ?? 0) === 0) {
        return res.status(400).json({ message: "Minimal harus ada 1 admin." });
      }
    }

    if (phone !== null && phone !== existingUser.phone) {
      const existingPhone = await query("select id from users where phone = $1 and id <> $2", [phone, id]);
      if (existingPhone.length > 0) {
        return res.status(400).json({ message: "Nomor WhatsApp sudah terdaftar." });
      }
    }

    if (email !== null && email !== existingUser.email) {
      const existingEmail = await query("select id from users where email = $1 and id <> $2", [email, id]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar." });
      }
    }

    const nextName = name ?? existingUser.name;
    const nextPhone = phone ?? existingUser.phone;
    const nextEmail = emailRaw === null ? existingUser.email : email;
    const nextRole = role ?? existingUser.role;
    const nextPassword = password && password.length > 0 ? await bcrypt.hash(password, 10) : existingUser.password;

    const updated = await query(
      `
        update users
        set name = $1,
            phone = $2,
            email = $3,
            password = $4,
            role = $5
        where id = $6
        returning id, name, phone, email, role, created_at
      `,
      [nextName, nextPhone, nextEmail, nextPassword, nextRole, id],
    );

    res.json({ user: mapUser(updated[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui user." });
  }
});

app.listen(port, () => {
  console.log(`Villa Booking API berjalan di http://localhost:${port}`);
});
