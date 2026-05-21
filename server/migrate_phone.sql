alter table users add column if not exists phone varchar(30);
alter table users alter column email drop not null;
create unique index if not exists users_phone_unique_idx on users(phone) where phone is not null;
