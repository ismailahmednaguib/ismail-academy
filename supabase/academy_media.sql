-- مساحة ملفات عامة للمحتوى الذي يرفعه المالك من لوحة الموقع.
-- استبدل owner@example.com ببريد حساب المالك الموجود لديك قبل التشغيل.

insert into storage.buckets (id, name, public)
values ('academy-media', 'academy-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can read academy media" on storage.objects;
create policy "public can read academy media"
on storage.objects for select
using (bucket_id = 'academy-media');

drop policy if exists "owner can upload academy media" on storage.objects;
create policy "owner can upload academy media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'academy-media'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
);

drop policy if exists "owner can update academy media" on storage.objects;
create policy "owner can update academy media"
on storage.objects for update to authenticated
using (
  bucket_id = 'academy-media'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
)
with check (
  bucket_id = 'academy-media'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
);

drop policy if exists "owner can delete academy media" on storage.objects;
create policy "owner can delete academy media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'academy-media'
  and lower(auth.jwt() ->> 'email') = lower('owner@example.com')
);
