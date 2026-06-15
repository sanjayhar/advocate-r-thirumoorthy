# Project Setup

Setup and deployment reference for the Advocate R. Thirumoorthy portfolio and chamber administration application.

**Stack:** TanStack Start, React 19, TypeScript, Vite, Nitro (Node), Tailwind CSS, Supabase (Auth + PostgreSQL + RLS)

**Linked Supabase project ID** (from `supabase/config.toml`): `zsioevmvkptkmhldyxbl`

---

## Required environment variables

### Application runtime (required)

These must be set for the app to start and for admin features to work.

| Variable | Scope | Required | Description |
|----------|-------|----------|-------------|
| `VITE_SUPABASE_URL` | Client (build-time) | **Yes** | Supabase project URL, e.g. `https://zsioevmvkptkmhldyxbl.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client (build-time) | **Yes** | Supabase anon/publishable key (safe to expose in the browser) |
| `SUPABASE_URL` | Server | **Yes** | Same URL as above; used by server auth middleware |
| `SUPABASE_PUBLISHABLE_KEY` | Server | **Yes** | Same publishable/anon key; used to validate bearer tokens in server functions |

> **Security:** Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `VITE_`. Service-role keys must never be bundled into client code.

### Application runtime (optional / host-provided)

| Variable | Scope | Required | Description |
|----------|-------|----------|-------------|
| `NODE_ENV` | Server | No | `development` locally; `production` on Render |
| `NITRO_PRESET` | Build | No | Nitro deployment preset; defaults to `node` (used in `vite.config.ts`) |
| `PORT` | Server | No | HTTP port for production (`npm run start`). Render injects this automatically |

### Privileged operations (not required at runtime)

| Variable | Scope | Required | Description |
|----------|-------|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts / future server maintenance | No* | Bypasses RLS. Used by `scripts/provision-admin.mjs` and `src/integrations/supabase/client.server.ts` (admin client exists but is not imported by live routes today) |
| `DATABASE_URL` | Provisioning only | No | PostgreSQL connection string for `scripts/provision-admin.sql` via `psql` |
| `ADMIN_PASSWORD` | Provisioning only | No | Optional dev password when running `scripts/provision-admin.mjs` |
| `ADMIN_INVITE` | Provisioning only | No | Set to `false` to skip invite email for new users (default: invite) |

\* Required to run the Node admin provisioning script; optional for normal app operation.

### Environment file template

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

Minimum `.env` for local development:

```env
VITE_SUPABASE_URL=https://zsioevmvkptkmhldyxbl.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_URL=https://zsioevmvkptkmhldyxbl.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NITRO_PRESET=node
NODE_ENV=development
```

---

## Supabase tables used

The application reads and writes these `public` schema objects. User authentication is handled by Supabase Auth (`auth.users`); roles are stored separately in `public.user_roles`.

### Tables

| Table | Purpose |
|-------|---------|
| `public.user_roles` | Maps `auth.users.id` to application roles (`admin`). Source of truth for administrator access |
| `public.consultations` | Public contact/consultation form submissions; admin list/update/delete |
| `public.blog_posts` | Legal articles and blog content; public read of published posts; admin CRUD |

### Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `public.app_role` | `admin` | Role assigned in `user_roles` |

### Database functions

| Function | Purpose |
|----------|---------|
| `public.has_role(_user_id, _role)` | RBAC check used by route guards, server functions, and RLS policies. Requires `_user_id = auth.uid()` |
| `public.set_updated_at()` | Trigger function that sets `updated_at` on `consultations` and `blog_posts` |

### Indirect Supabase Auth dependency

| Resource | Purpose |
|----------|---------|
| `auth.users` | Administrator sign-in (`/auth`). Users are created via Supabase Dashboard, Admin API, or provisioning scripts — not via in-app registration |

### Row-level security summary

| Table | Anonymous | Authenticated (non-admin) | Admin |
|-------|-----------|---------------------------|-------|
| `consultations` | INSERT (public form) | INSERT | SELECT, UPDATE, DELETE |
| `blog_posts` | SELECT published only | SELECT published only | SELECT all, INSERT, UPDATE, DELETE |
| `user_roles` | — | SELECT own row only | SELECT own row only |

Role grants (`INSERT` into `user_roles`) require `service_role` or direct database access.

---

## Database migrations that must be applied

Apply **all** files in `supabase/migrations/` in filename order before using admin or data features. With the Supabase CLI linked to the project:

```bash
npx supabase db push
```

For a fully local Supabase stack:

```bash
npx supabase start
npx supabase db reset
```

### Migration list (apply in this order)

| # | File | What it does |
|---|------|--------------|
| 1 | `20260611134045_bcb0c741-b9ee-4331-be12-e9e63afae8e0.sql` | Creates `app_role` enum, `user_roles`, `consultations`, `blog_posts`, `has_role()`, `set_updated_at()`, indexes, triggers, and initial RLS policies |
| 2 | `20260611134133_e91610f9-34ce-4a01-9e23-7488e85cff17.sql` | Tightens consultation INSERT policy (field length limits, `status = 'new'`); revokes `has_role` from `PUBLIC` and `anon` |
| 3 | `20260614161549_db5b100a-a725-4987-a816-ac6f19639c15.sql` | Hardens `has_role` with `auth.uid()` check; restricts `set_updated_at` execute grants |
| 4 | `20260614161610_3099ae96-5b48-4a1d-9fbd-d1e28c110542.sql` | Final `has_role` definition (`SECURITY INVOKER`, `auth.uid()` guard); grants execute to `authenticated` and `service_role` only |

Skipping or reordering migrations will break RBAC, RLS, or schema expectations in the application.

---

## Local development setup

### Prerequisites

- **Node.js 22+**
- **npm 10+**
- A Supabase project (hosted or local via Supabase CLI)
- Supabase CLI (optional but recommended for migrations)

### Step-by-step

**1. Clone and install dependencies**

```bash
git clone <repository-url>
cd advocate-r-thirumoorthy-portfolio
npm ci
```

**2. Configure environment**

```bash
cp .env.example .env
```

Edit `.env` with your Supabase URL and keys from **Supabase Dashboard → Project Settings → API**.

**3. Apply database migrations**

Against hosted Supabase (project linked via CLI):

```bash
npx supabase link --project-ref zsioevmvkptkmhldyxbl
npx supabase db push
```

**4. Configure Supabase Auth (dashboard)**

In **Supabase Dashboard → Authentication**:

- **Disable public sign-ups** (“Enable email signups” off). The app has no registration UI; sign-ups must stay disabled at the provider.
- **Site URL:** `http://localhost:8080` for local dev
- **Redirect URLs:** add `http://localhost:8080/reset-password` (required for admin invite/recovery password setup)

**5. Provision the first administrator**

Option A — Node script (creates Auth user + grants `admin` role):

```bash
# PowerShell
$env:SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
npm run provision-admin -- admin@example.com
```

Option B — SQL (user must already exist in `auth.users`):

```bash
psql "$DATABASE_URL" --set=admin_email="admin@example.com" --file=scripts/provision-admin.sql
```

After provisioning, set a password via the invite link (`/reset-password`, minimum 12 characters) or sign in if a password was set directly.

**6. Start the development server**

```bash
npm run dev
```

The app runs at **http://localhost:8080** (configured in `vite.config.ts`).

**7. Verify admin access**

| URL | Expected behavior |
|-----|-------------------|
| `/auth` | Sign-in page only (no registration) |
| `/admin` | Redirects to `/auth` when unauthenticated; dashboard when signed in as admin |
| `/admin/consultations` | Consultation management (admin only) |
| `/admin/blog` | Blog/content management (admin only) |

### Local build and production preview

```bash
npm run build
npm run start
```

Production entry point: `.output/server/index.mjs`

---

## Render deployment requirements

The repository includes a Render Blueprint at `render.yaml`.

### Render service configuration

| Setting | Value |
|---------|-------|
| Service type | Web service (Node) |
| Plan | `starter` (per blueprint) |
| Build command | `npm ci && npm run build` |
| Start command | `npm run start` |
| Health check path | `/` |

### Environment variables on Render

Set these in the Render dashboard (all marked `sync: false` in the blueprint — you must enter values manually):

| Variable | Required on Render |
|----------|-------------------|
| `NODE_VERSION` | Yes — `22` |
| `NODE_ENV` | Yes — `production` |
| `NITRO_PRESET` | Yes — `node` |
| `VITE_SUPABASE_URL` | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes |
| `SUPABASE_URL` | Yes |
| `SUPABASE_PUBLISHABLE_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended (provisioning/maintenance; not required for normal HTTP serving) |

> `VITE_*` variables are embedded at **build time**. After changing them on Render, trigger a new deploy.

### Pre-deploy checklist

1. **Push code to GitHub** and connect the repository to Render (Blueprint or manual Web Service).
2. **Apply all database migrations** to the production Supabase project (`npx supabase db push` or SQL Editor).
3. **Provision at least one admin user** using `scripts/provision-admin.mjs` or `scripts/provision-admin.sql` with production credentials.
4. **Configure Supabase Auth for production:**
   - Site URL: `https://<your-render-domain>.onrender.com` (or custom domain)
   - Redirect URLs: `https://<your-domain>/reset-password`
   - Disable public email sign-ups
5. **Set all Render environment variables** before the first successful build.
6. **Deploy** and confirm `/` loads, `/auth` works, and `/admin` requires authentication.

### Render limitations noted in the project

- The database is **not** declared as a Render PostgreSQL instance in `render.yaml`. The app depends on Supabase Auth, PostgREST, and RLS — use hosted Supabase (or a self-hosted Supabase-compatible stack).
- `PORT` is injected by Render; no manual configuration needed.

### Post-deploy verification

| Check | How to verify |
|-------|---------------|
| Public site | Home, articles, contact form load |
| Consultation intake | Submit via `/contact`; row appears in `consultations` |
| Auth gate | Visiting `/admin` unauthenticated redirects to `/auth` |
| Admin APIs | Non-admin or missing bearer token receives 401/403 from server functions |
| Registration disabled | No signup UI; Supabase Auth sign-ups disabled in dashboard |

---

## Quick reference

| Task | Command |
|------|---------|
| Install | `npm ci` |
| Dev server | `npm run dev` → http://localhost:8080 |
| Build | `npm run build` |
| Production start | `npm run start` |
| Apply migrations | `npx supabase db push` |
| Provision admin | `npm run provision-admin -- <email>` |
| Lint | `npm run lint` |
