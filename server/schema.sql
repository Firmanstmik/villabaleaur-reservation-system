drop table if exists bookings;
drop table if exists villas;
drop table if exists users;

create table users (
  id serial primary key,
  name varchar(100) not null,
  phone varchar(30) unique,
  email varchar(100) unique,
  password text not null,
  role varchar(20) not null default 'user',
  created_at timestamp not null default now()
);

create table villas (
  id serial primary key,
  nama_villa varchar(150) not null,
  lokasi varchar(150) not null,
  harga integer not null,
  max_guest integer not null default 2,
  deskripsi text not null,
  gambar text not null,
  galeri text not null default '[]',
  status varchar(20) not null default 'tersedia',
  created_at timestamp not null default now()
);

create table bookings (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  villa_id integer not null references villas(id) on delete cascade,
  tanggal_checkin date not null,
  tanggal_checkout date not null,
  jumlah_tamu integer not null,
  status_booking varchar(20) not null default 'menunggu',
  created_at timestamp not null default now()
);
