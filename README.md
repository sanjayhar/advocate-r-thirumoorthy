# Advocate R. Thirumoorthy Portfolio

Production-ready advocate portfolio and chamber administration application. The public site includes practice information, legal insights, and consultation intake. The protected administrator area manages consultations and articles.

## Technology

- TanStack Start, React 19, TypeScript, Vite, Tailwind CSS
- PostgreSQL with Supabase-compatible Auth, REST, and row-level security
- Nitro Node server output for Render, Railway, a VM, or container hosts

The source does not require Lovable packages, APIs, asset hosting, or deployment infrastructure. The backend uses the open-source Supabase JavaScript client and PostgreSQL migrations; use hosted Supabase or a self-hosted Supabase stack.

## GitHub-ready structure

```text
.
├── public/
│   ├── assets/                         # Local images and static assets
│   └── robots.txt
├── scripts/
│   └── provision-admin.sql             # Grants the first admin role
├── src/
│   ├── components/                     # Public and admin React components
│   ├── hooks/                          # Client hooks
│   ├── integrations/supabase/          # Browser/server clients and generated types
│   ├── lib/                            # Authenticated server functions and utilities
│   ├── routes/                         # Public, auth, and protected admin routes
│   ├── router.tsx                      # TanStack Router setup
│   ├── server.ts                       # Server entry
│   ├── start.ts                        # Request/server-function middleware
│   └── styles.css                      # Design tokens and global styles
├── supabase/
│   ├── config.toml                     # Local backend configuration
│   └── migrations/                     # Complete schema, RLS, functions, policies
├── .env.example                        # Environment variable template
├── render.yaml                         # Render web-service blueprint
├── package.json
└── vite.config.ts                      # Portable Vite/TanStack/Nitro setup
```

## Local setup

### Prerequisites

- Node.js 22+
- npm 10+
- A hosted or self-hosted Supabase-compatible backend
- Supabase CLI only if running the backend locally

### Application

```bash
git clone <repository-url>
cd advocate-r-thirumoorthy-portfolio
cp .env.example .env
npm ci
npm run dev
```

Fill the public and server backend URL/key values in `.env`. Development runs at `http://localhost:8080`.

### Database and auth

Apply every migration in `supabase/migrations` in filename order. With the Supabase CLI linked to your backend:

```bash
npx supabase db push
```

For a completely local backend:

```bash
npx supabase start
npx supabase db reset
```

Create the administrator in the Auth user system, then grant the role:

```bash
psql "$DATABASE_URL" --set=admin_email="admin@example.com" --file=scripts/provision-admin.sql
```

Set the Auth site URL to the deployed origin, allow `/reset-password` as a redirect, and disable public registration. The app exposes sign-in only; registration must also be disabled in backend configuration.

## Build and run

```bash
npm run build
npm run start
```

The generated production entry is `.output/server/index.mjs`. Set `PORT` if the host does not inject one.

## Deploy to Render

1. Push this repository to GitHub.
2. Create a Render Blueprint from `render.yaml`, or create a Node Web Service manually.
3. Add the environment values listed in `.env.example` to Render. Never expose the service-role key as a `VITE_` variable.
4. Build command: `npm ci && npm run build`.
5. Start command: `npm run start`.
6. Set the backend Auth site URL and redirects to the final Render/custom-domain URL.
7. Apply database migrations separately before opening admin features.

The database is not declared as a plain Render PostgreSQL service because the app relies on Auth and REST/RLS services in addition to PostgreSQL. Use hosted or self-hosted Supabase-compatible infrastructure.

## Security model

- Public registration is absent from the UI and must remain disabled at the Auth provider.
- Admin identity is stored in `public.user_roles`, never browser storage or editable profile metadata.
- Protected server functions validate bearer tokens and query the database role on every request.
- Row-level security independently restricts consultations and article management.
- Public consultation fields are length-constrained by database policy.
- Secrets belong in deployment environment settings, never source control.

## Assets

Runtime images are under `public/assets`; there are no hosted asset pointers. UI icons come from the open-source `lucide-react` package and are bundled at build time.

## Portability statement

There are no Lovable runtime, build, auth, asset, or deployment dependencies in this application. The remaining backend API is the standard Supabase-compatible interface, which can be hosted or self-hosted. Google Fonts are loaded at runtime; replace the font links in `src/routes/__root.tsx` with local font files if fully offline operation is required.

## Contact Information

The website has been configured with the following contact details:

- **Office Email:** lawmoorthyoffice@gmail.com
- **Office Address:** Old No. 166, New No. 366, 3rd Floor, Old Shawalace Building, Thambu Chetty Street, Parrys, Chennai – 600001, Tamil Nadu, India
- **Telephone/WhatsApp:** Please update the placeholder number `+910000000000` with the actual contact number if needed. This appears in call/WhatsApp buttons on the home page and contact page.

## Before production launch

Replace the placeholder telephone/WhatsApp number `+910000000000` with the actual contact number if it is to be made public. The office email and address are now configured in the contact page and footer.