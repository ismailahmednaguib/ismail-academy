-- صلاحيات لوحة المالك والمسودات والحفظ المرحلي.
-- شغّل هذا الملف بعد member_accounts_notifications.sql وsite_content.sql.
-- استبدل owner@example.com ببريد حساب المالك الحقيقي قبل التشغيل.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;

insert into public.site_admins (user_id, role)
select id, 'owner'
from auth.users
where lower(email) = lower('owner@example.com')
on conflict (user_id) do update set role = 'owner', active = true, updated_at = now();

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_site_owner()
    or exists (
      select 1 from public.site_admins sa
      where sa.user_id = auth.uid()
        and sa.active = true
        and sa.role in ('owner', 'editor')
    );
$$;

create or replace function public.site_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_site_owner() then 'owner'
    else coalesce((select sa.role from public.site_admins sa where sa.user_id = auth.uid() and sa.active = true limit 1), '')
  end;
$$;

grant execute on function public.is_site_admin() to anon, authenticated;
grant execute on function public.site_admin_role() to anon, authenticated;

create or replace function public.list_site_admins()
returns table(user_id uuid, email text, role text, active boolean, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select sa.user_id, coalesce(au.email, ''), sa.role, sa.active, sa.created_at
  from public.site_admins sa
  left join auth.users au on au.id = sa.user_id
  where public.is_site_owner()
  order by sa.created_at asc;
$$;

create or replace function public.set_site_admin_role(target_email text, target_role text, target_active boolean default true)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target_id uuid;
begin
  if not public.is_site_owner() or target_role not in ('editor', 'viewer') then return false; end if;
  select id into target_id from auth.users where lower(email) = lower(trim(target_email)) limit 1;
  if target_id is null then return false; end if;
  insert into public.site_admins (user_id, role, active)
  values (target_id, target_role, target_active)
  on conflict (user_id) do update set role = excluded.role, active = excluded.active, updated_at = now();
  return true;
end;
$$;

create or replace function public.remove_site_admin(target_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_site_owner() then return false; end if;
  delete from public.site_admins where user_id = target_id and role <> 'owner';
  return true;
end;
$$;

grant execute on function public.list_site_admins() to authenticated;
grant execute on function public.set_site_admin_role(text, text, boolean) to authenticated;
grant execute on function public.remove_site_admin(uuid) to authenticated;

drop policy if exists "owner can manage site admins" on public.site_admins;
create policy "owner can manage site admins"
on public.site_admins for all
to authenticated
using (public.is_site_owner())
with check (public.is_site_owner());

drop policy if exists "admins can read site admins" on public.site_admins;
create policy "admins can read site admins"
on public.site_admins for select
to authenticated
using (public.is_site_admin());

drop policy if exists "owner can update site content" on public.site_content;
drop policy if exists "admins can update site content" on public.site_content;
create policy "admins can update site content"
on public.site_content for update
to authenticated
using (id = 'main' and public.is_site_admin())
with check (id = 'main' and public.is_site_admin());

create table if not exists public.site_content_drafts (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.site_content_drafts enable row level security;

drop policy if exists "admins can manage drafts" on public.site_content_drafts;
create policy "admins can manage drafts"
on public.site_content_drafts for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "owner can read site members" on public.site_members;
drop policy if exists "admins can read site members" on public.site_members;
create policy "admins can read site members"
on public.site_members for select
to authenticated
using (public.is_site_admin() or id = auth.uid());

drop policy if exists "owner can read notifications" on public.site_notifications;
drop policy if exists "admins can read notifications" on public.site_notifications;
create policy "admins can read notifications"
on public.site_notifications for select
to authenticated
using (public.is_site_admin());

drop policy if exists "owner can update notifications" on public.site_notifications;
drop policy if exists "admins can update notifications" on public.site_notifications;
create policy "admins can update notifications"
on public.site_notifications for update
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "owner can delete notifications" on public.site_notifications;
drop policy if exists "admins can delete notifications" on public.site_notifications;
create policy "admins can delete notifications"
on public.site_notifications for delete
to authenticated
using (public.is_site_admin());

drop policy if exists "admins can read member learning" on public.member_learning;
create policy "admins can read member learning"
on public.member_learning for select
to authenticated
using (public.is_site_admin() or user_id = auth.uid());

drop policy if exists "owner can upload academy media" on storage.objects;
drop policy if exists "admins can upload academy media" on storage.objects;
create policy "admins can upload academy media"
on storage.objects for insert to authenticated
with check (bucket_id = 'academy-media' and public.is_site_admin());

drop policy if exists "owner can update academy media" on storage.objects;
drop policy if exists "admins can update academy media" on storage.objects;
create policy "admins can update academy media"
on storage.objects for update to authenticated
using (bucket_id = 'academy-media' and public.is_site_admin())
with check (bucket_id = 'academy-media' and public.is_site_admin());

drop policy if exists "owner can delete academy media" on storage.objects;
drop policy if exists "admins can delete academy media" on storage.objects;
create policy "admins can delete academy media"
on storage.objects for delete to authenticated
using (bucket_id = 'academy-media' and public.is_site_admin());
