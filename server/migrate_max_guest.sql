alter table villas
add column if not exists max_guest integer not null default 2;

update villas
set max_guest = 2
where max_guest is null;
