-- The Offer Blueprint — database schema (PRD §7, §8)
-- Run in the Supabase SQL editor. Postgres is encrypted at rest by Supabase.
--
-- Security model:
--  * The public site writes via the SERVICE-ROLE key from a trusted server
--    route only (never the browser). Service role bypasses RLS.
--  * RLS is ENABLED with NO public policies, so the anon key cannot read or
--    write the table. The admin dashboard reads via the service role too.
--  * Authenticated admins are managed in Supabase Auth (Dashboard → Auth).

create extension if not exists "pgcrypto";

create table if not exists public.submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  first_name            text not null,
  last_name             text not null,
  email                 text not null,
  phone                 text,

  consent               boolean not null default false,
  consent_at            timestamptz,

  answer_expertise      text not null,
  answer_audience       text not null,
  answer_transformation text not null,
  answer_vision         text[] not null default '{}',
  answer_shape          text not null,
  answer_stage          text not null,

  generated_offers      jsonb,

  email_status          text not null default 'queued'
                          check (email_status in ('queued','sent','failed')),
  synced_to_crm         boolean not null default false,
  booked_call           boolean not null default false,

  source                text
);

create index if not exists submissions_email_idx       on public.submissions (email);
create index if not exists submissions_created_at_idx   on public.submissions (created_at desc);
create index if not exists submissions_answer_stage_idx on public.submissions (answer_stage);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_touch_updated_at on public.submissions;
create trigger submissions_touch_updated_at
  before update on public.submissions
  for each row execute function public.touch_updated_at();

-- Lock the table down. No anon/auth policies => only service role can touch it.
alter table public.submissions enable row level security;
