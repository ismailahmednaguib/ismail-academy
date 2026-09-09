-- جدول المحتوى الرئيسي الذي تحفظ فيه لوحة المالك كل النصوص والعناصر.
-- استبدل owner@example.com ببريد حساب المالك الموجود لديك قبل التشغيل.

create table if not exists public.site_content (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id, payload)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content for select
to anon, authenticated
using (id = 'main');

drop policy if exists "owner can update site content" on public.site_content;
create policy "owner can update site content"
on public.site_content for update
to authenticated
using (
  id = 'main'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
)
with check (
  id = 'main'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
);
