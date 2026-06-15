\if :{?admin_email}
\else
  \echo 'Usage: psql "$DATABASE_URL" --set=admin_email="admin@example.com" --file=scripts/provision-admin.sql'
  \quit
\endif

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower(:'admin_email')
ON CONFLICT (user_id, role) DO NOTHING;

SELECT u.email, r.role, r.created_at
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE lower(u.email) = lower(:'admin_email');