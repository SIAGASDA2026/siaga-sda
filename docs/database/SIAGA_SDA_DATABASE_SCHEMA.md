<!--
SIAGA-SDA DOCUMENT CONTROL
Project aktif: SIAGA-SDA
Dokumen ini adalah acuan pengembangan bertahap. Jangan melakukan penggantian nama aplikasi, jangan mengubah role/workflow/database/routing/auth tanpa instruksi eksplisit.
Codex wajib audit dan mapping sistem aktual sebelum coding.
-->

# SIAGA-SDA Database Schema

> Draft schema konseptual untuk Supabase/PostgreSQL. Codex wajib menyesuaikan dengan schema existing SIAGA-SDA melalui migration bertahap.

## Core Tables

```sql
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  username text unique,
  email text unique,
  nip text,
  full_name text not null,
  phone text,
  position_title text,
  unit_name text,
  status text not null default 'AKTIF',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  role_code text unique not null,
  role_name text not null,
  description text,
  is_active boolean default true
);

create table if not exists user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id),
  role_id uuid references roles(id),
  scope_type text,
  scope_id uuid,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'AKTIF',
  assigned_by uuid references app_users(id),
  created_at timestamptz default now()
);
```

## Program/Kegiatan/Paket

```sql
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  fiscal_year int not null,
  program_code text,
  program_name text not null,
  status text default 'AKTIF',
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id),
  fiscal_year int not null,
  activity_code text,
  activity_name text not null,
  admin_kegiatan_user_id uuid references app_users(id),
  status text default 'AKTIF',
  created_at timestamptz default now()
);

create table if not exists sub_activities (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references activities(id),
  sub_activity_code text,
  sub_activity_name text not null,
  status text default 'AKTIF',
  created_at timestamptz default now()
);

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  sub_activity_id uuid references sub_activities(id),
  package_name text not null,
  package_type text not null, -- FISIK / KONSULTAN / RUTIN
  consultant_subtype text, -- KONSULTAN_PERENCANAAN / KONSULTAN_PENGAWASAN
  procurement_method text, -- PENGADAAN_LANGSUNG / LELANG
  fiscal_year int not null,
  contract_value numeric,
  physical_progress numeric default 0,
  deviation numeric default 0,
  status text default 'DRAFT',
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Survey, Surat, Peil, Asset

```sql
create table if not exists surveys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  urgency_level text,
  location_text text,
  latitude numeric,
  longitude numeric,
  recommendation text,
  follow_up_type text,
  follow_up_status text,
  linked_package_id uuid references packages(id),
  linked_letter_id uuid,
  status text default 'DRAFT',
  created_by uuid references app_users(id),
  created_at timestamptz default now()
);

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  letter_type text not null, -- MASUK / KELUAR
  category text,
  letter_number text,
  letter_date date,
  subject text not null,
  sender_name text,
  receiver_name text,
  linked_survey_id uuid references surveys(id),
  linked_package_id uuid references packages(id),
  linked_peil_id uuid,
  status text default 'DRAFT',
  created_at timestamptz default now()
);

create table if not exists peil_requests (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  company_name text,
  contact_phone text,
  location_text text,
  latitude numeric,
  longitude numeric,
  planned_elevation numeric,
  existing_elevation numeric,
  historical_flood_elevation numeric,
  technical_recommendation text,
  status text default 'DRAFT',
  created_at timestamptz default now()
);

create table if not exists sda_assets (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  asset_type text not null,
  condition_status text,
  operational_status text,
  latitude numeric,
  longitude numeric,
  status text default 'AKTIF',
  created_at timestamptz default now()
);
```

## Approval, Audit, File

```sql
create table if not exists approval_items (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  approval_step text,
  requested_by uuid references app_users(id),
  assigned_role_code text,
  assigned_user_id uuid references app_users(id),
  status text default 'MENUNGGU_APPROVAL',
  note text,
  created_at timestamptz default now(),
  decided_at timestamptz
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor_user_id uuid references app_users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists file_objects (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  bucket_name text not null,
  file_path text not null,
  file_category text,
  original_size bigint,
  compressed_size bigint,
  compression_ratio numeric,
  thumbnail_url text,
  uploaded_by uuid references app_users(id),
  uploaded_at timestamptz default now()
);
```

## Operasional SDA

```sql
create table if not exists field_workers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  worker_type text,
  team_name text,
  status text default 'AKTIF',
  created_by uuid references app_users(id),
  created_at timestamptz default now()
);

create table if not exists shift_logs (
  id uuid primary key default gen_random_uuid(),
  work_date date not null,
  shift_name text not null,
  asset_id uuid references sda_assets(id),
  location_text text,
  mandor_user_id uuid references app_users(id),
  gps_latitude numeric,
  gps_longitude numeric,
  report_note text,
  created_at timestamptz default now()
);

create table if not exists shift_log_workers (
  id uuid primary key default gen_random_uuid(),
  shift_log_id uuid references shift_logs(id),
  worker_id uuid references field_workers(id),
  attendance_status text not null,
  note text
);
```

---

# UPDATE FINAL DATABASE MAPPING

Schema dalam dokumen ini bersifat blueprint konseptual.

Codex wajib audit schema aktual sebelum membuat tabel/field baru.
Jangan membuat tabel ganda.
Jangan menghapus tabel lama tanpa instruksi.

Role ADMIN_KEGIATAN tidak digunakan lagi. Mapping bertahap ke ADMIN_SUB_KEGIATAN jika masih ditemukan pada schema/seed lama.
