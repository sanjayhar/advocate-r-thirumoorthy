# Admin Setup & Authentication Flow Report

**Generated:** 2026-06-15  
**Project:** Advocate R. Thirumoorthy Portfolio  
**Supabase Project ID:** `zsioevmvkptkmhldyxbl`

---

## 1. Authentication Flow

### Sign-In Process at `/auth`

**Route:** [/auth](src/routes/auth.tsx)

#### Flow:
1. User navigates to `/auth` (non-SSR, client-side only)
2. Page checks for existing session on mount:
   - If session exists → redirect to `/admin`
   - If no session → show sign-in form
3. User enters email and password (6+ character minimum)
4. Form submission calls `supabase.auth.signInWithPassword({ email, password })`
5. On success → redirect to `/admin`
6. On error → display toast notification

**Key Code:**
```typescript
async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return toast.error(error.message);
  navigate({ to: "/admin", replace: true });
}
```

#### Authentication Method:
- **Type:** Email/Password (Supabase Auth)
- **No OAuth** currently configured
- **No Multi-factor Authentication (MFA)** configured
- **Password minimum:** 6 characters
- **Session management:** Browser-side via Supabase JS SDK

---

## 2. User Registration Status

### Public Registration: **DISABLED** ✗

**UI Message:**
```
"Account access is provisioned privately. Public registration is disabled."
```

**Technical Details:**
- No registration form exists in the application
- No signup endpoint exposed
- User creation is **admin-only** via:
  - Supabase Dashboard (manual)
  - `provision-admin.mjs` script (programmatic)

**Impact:** Only users created by administrators can sign in.

---

## 3. Admin Role Assignment

### Role Management System

**Table:** `public.user_roles`

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
```

**Supported Roles:**
- `admin` (currently the only role defined in the `app_role` enum)

### Role Verification Function

**Function:** `public.has_role(uuid, app_role) → boolean`

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$$;
```

**Key Points:**
- Uses `SECURITY INVOKER` (checks the current user, not escalated privileges)
- Verifies **both** conditions:
  1. The querying user's ID matches `_user_id` (prevents checking other users' roles)
  2. The user has the requested role in `user_roles` table
- Granted to: `authenticated, service_role` users only

### How Admin Roles Are Currently Assigned

#### Method 1: `provision-admin.mjs` Script (Recommended for First Admin)

**File:** [scripts/provision-admin.mjs](scripts/provision-admin.mjs)

**Command:**
```bash
SUPABASE_URL=<your-url> \
SUPABASE_SERVICE_ROLE_KEY=<your-key> \
node scripts/provision-admin.mjs admin@example.com
```

**What it does:**
1. Accepts email address as argument
2. Searches for existing user by email
3. If user doesn't exist:
   - **Option A (default):** Sends invite email → user sets password via `/reset-password` link
   - **Option B (dev):** Creates user with supplied password via `ADMIN_PASSWORD` env var
4. Inserts/upserts role into `user_roles` table
5. Verifies admin role was assigned

**Optional Environment Variables:**
- `ADMIN_INVITE=true` (default) — Send Supabase invite email
- `ADMIN_INVITE=false` — Fail if user doesn't exist
- `ADMIN_PASSWORD=...` — Set password directly (dev only, bypasses email invite)

#### Method 2: Direct SQL via Supabase Dashboard

**File:** [scripts/provision-admin.sql](scripts/provision-admin.sql)

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower(:'admin_email')
ON CONFLICT (user_id, role) DO NOTHING;
```

**Usage in Supabase SQL Editor:**
```sql
SET admin_email = 'admin@example.com';
-- Run the provision-admin.sql file
```

**Prerequisite:** User must already exist in `auth.users` table.

#### Method 3: Supabase Dashboard UI (Manual)

1. Navigate to Supabase Dashboard → Authentication → Users
2. Create or select user
3. Switch to SQL Editor
4. Run the SQL snippet above

---

## 4. Admin Access Protection (`/admin`)

### Route Protection: `/_authenticated` Wrapper

**File:** [src/routes/_authenticated/route.tsx](src/routes/_authenticated/route.tsx)

```typescript
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Step 1: Verify user is authenticated
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    // Step 2: Verify user has 'admin' role
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw redirect({ to: "/auth" });

    return { user: data.user };
  },
  component: () => <Outlet />,
});
```

### Access Control Chain

```
User requests /admin
  ↓
beforeLoad checks authentication
  ├─ No session? → Redirect to /auth
  └─ Session exists
       ↓
       Call has_role('admin')
       ├─ User not in user_roles? → Redirect to /auth
       ├─ User has admin role? → Continue to /admin
       └─ RPC error? → Redirect to /auth
```

### Protected Routes

All routes under `/_authenticated/` are protected:
- `/admin` — Dashboard overview
- `/admin/blog` — Blog management
- `/admin/consultations` — Consultation requests management

---

## 5. User Roles Table Usage

### `user_roles` Table Architecture

**Status:** ✓ Actively used

**Current Usage:**
- Stores admin role assignments
- Referenced in all admin access checks
- RLS (Row Level Security) policies enforce access control

**RLS Policies:**

```sql
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
```

**Effect:** Users can only read their own roles, not other users' roles.

### Data-Level Access Control

**Blog Posts:**
```sql
-- Anyone reads published posts
CREATE POLICY "Anyone reads published posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));

-- Only admins can manage posts
CREATE POLICY "Admins insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

**Consultations:**
```sql
-- Anyone can submit
CREATE POLICY "Anyone can submit consultations" ON public.consultations
  FOR INSERT TO anon, authenticated WITH CHECK (...);

-- Only admins can view/update/delete
CREATE POLICY "Admins view consultations" ON public.consultations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
```

---

## 6. Can a Newly Registered User Access `/admin`?

### Answer: **NO** ✗

**Why:**

1. **Public registration is disabled** — users cannot self-register
2. **Even if registration were enabled**, newly created users would:
   - Have no entry in `user_roles` table
   - Fail the `has_role('admin')` check
   - Be redirected to `/auth`

3. **Only path to admin access:**
   - Administrator must explicitly create the user and assign admin role
   - Both steps required

### User Journey (If Registration Were Enabled)

```
Scenario: New user creates account
  ↓
User created in auth.users
  ↓
No entry in user_roles table
  ↓
User tries to access /admin
  ↓
beforeLoad calls has_role(user_id, 'admin')
  ↓
Query finds NO row in user_roles
  ↓
has_role returns FALSE
  ↓
User redirected to /auth ✗
```

---

## 7. Steps to Create First Administrator Account

### Scenario: Fresh Supabase Project, No Admin Users Yet

### Option A: Using `provision-admin.mjs` Script (Recommended) ⭐

**Prerequisites:**
- Node.js installed locally
- Environment access to:
  - Supabase URL
  - Supabase Service Role Key (from Supabase Dashboard → Settings → API)

**Steps:**

```bash
# 1. Copy your Supabase credentials from Settings → API
export SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# 2. Run the provision script with admin email
npm run provision-admin admin@example.com

# OR with custom password (dev only):
export ADMIN_PASSWORD="SecurePassword123"
npm run provision-admin admin@example.com

# 3. Follow prompts:
# - If invite method: Check email for Supabase invite
#   - Click link
#   - Set password via /reset-password route
# - If password method: Use provided password immediately
```

**Output:**
```
Provisioning admin for admin@example.com...
Created auth user with supplied password.

Verification:
  Email:  admin@example.com
  User:   a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Roles:  admin

Admin provisioning complete. Sign in at /auth after setting a password.
```

**Next Steps:**
1. Navigate to `/auth`
2. Enter `admin@example.com`
3. Enter the password you set or received via email
4. Redirected to `/admin` dashboard

---

### Option B: Using Supabase Dashboard SQL Editor (Manual)

**Prerequisites:**
- Access to Supabase Dashboard
- User already created in Auth → Users section

**Steps:**

1. **Create the auth user:**
   - Go to Supabase Dashboard
   - Navigate to Authentication → Users
   - Click "Create user"
   - Enter email: `admin@example.com`
   - Auto-generate password or set custom
   - Note the user ID (UUID)

2. **Assign admin role via SQL:**
   - Navigate to SQL Editor
   - Run this query:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin'::public.app_role);
   ```

3. **Verify:**
   ```sql
   SELECT u.email, r.role, r.created_at
   FROM public.user_roles r
   JOIN auth.users u ON u.id = r.user_id
   WHERE lower(u.email) = 'admin@example.com';
   ```

4. **User sets password:**
   - If not auto-generated: User clicks "Reset password" link in Supabase email
   - User navigates to `/reset-password` route
   - User sets new password

5. **Sign in:**
   - Navigate to `/auth`
   - Enter email and password
   - Access `/admin`

---

### Option C: Using Supabase Dashboard + Invite (Recommended for Production)

**Steps:**

1. **Invite user via Supabase Dashboard:**
   - Auth → Users
   - Click "Invite user"
   - Enter email: `admin@example.com`
   - User receives Supabase invite email

2. **User accepts invite:**
   - User checks email
   - Clicks link in Supabase invite
   - Sets password on Supabase-hosted page
   - Returns to application

3. **Assign admin role:**
   - Use Supabase SQL Editor:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::public.app_role
   FROM auth.users
   WHERE lower(email) = 'admin@example.com';
   ```

4. **User signs in:**
   - Navigate to `/auth`
   - Enter email and password set via invite link
   - Access `/admin`

---

## Current Blockers & Limitations

### 1. No Self-Service Admin Creation

**Blocker:** New admins cannot be created without:
- Access to `provision-admin.mjs` script + Service Role Key, OR
- Access to Supabase Dashboard

**Mitigation:** Consider implementing:
- Admin invitation page (requires existing admin)
- Audit trail for role changes

### 2. Single Role Enum

**Current:** Only `admin` role defined

**Impact:**
- Cannot create granular roles (e.g., `editor`, `moderator`)
- All authenticated admins have same permissions

**Mitigation:** Extend enum if more roles needed:
```sql
ALTER TYPE public.app_role ADD VALUE 'editor';
ALTER TYPE public.app_role ADD VALUE 'moderator';
```

### 3. No Session Timeout Configured

**Current:** Sessions persist indefinitely

**Risk:** Long-lived sessions could be security risk

**Mitigation:** Add Supabase session management:
- Set token expiry in Supabase Auth settings
- Implement auto-refresh or logout timeout in UI

### 4. Password Requirements: Minimum 6 Characters

**Current:** Very weak password requirement

**Recommendation:** Increase to 12+ characters + complexity requirements in Supabase Auth settings

### 5. No Audit Logging

**Current:** No tracking of:
- Who created/modified roles
- When admin actions occurred
- What data was accessed

**Mitigation:** Add audit triggers to `user_roles` table

### 6. SECURITY INVOKER on has_role()

**Current:** Function uses `SECURITY INVOKER`

**Implication:**
- User can only check their own role
- Cannot administratively query other users' roles
- Cannot revoke roles through this function

**Impact:** Role revocation requires direct table access (Supabase Dashboard or service role key)

---

## Required SQL for Manual Role Assignment

### Create First Admin User (User Exists in auth.users)

```sql
-- Assign admin role to user by email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT u.email, r.role, r.created_at
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE lower(u.email) = 'admin@example.com';
```

### Assign Admin Role by User ID

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;
```

### Revoke Admin Role

```sql
DELETE FROM public.user_roles
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND role = 'admin';
```

### List All Admins

```sql
SELECT u.id, u.email, u.created_at, r.created_at as admin_since
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE r.role = 'admin'
ORDER BY r.created_at DESC;
```

### Check User's Roles

```sql
SELECT u.email, r.role, r.created_at
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE lower(u.email) = 'admin@example.com';
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    Navigate to /auth
                         │
        ┌────────────────▼─────────────────┐
        │   Sign In Page (/auth)           │
        │   - Email input                  │
        │   - Password input (6+ chars)    │
        │   - Submit button                │
        └────────────────┬─────────────────┘
                         │
                   POST signInWithPassword
                         │
        ┌────────────────▼──────────────────────────┐
        │   Supabase Auth Service                   │
        │   ├─ Verify credentials                   │
        │   ├─ Create session token                 │
        │   └─ Return access_token                  │
        └────────────────┬──────────────────────────┘
                         │
                   Session established
                         │
        ┌────────────────▼──────────────────────────┐
        │   Browser Storage (localStorage)          │
        │   ├─ Session token                        │
        │   ├─ User profile                         │
        │   └─ Auth state                           │
        └────────────────┬──────────────────────────┘
                         │
                Navigate to /admin
                         │
        ┌────────────────▼────────────────────────────────┐
        │   Route: /_authenticated/admin (beforeLoad)     │
        │   1. Get session from browser storage           │
        │   2. Verify token valid                         │
        │   3. Extract user ID                            │
        └─────────────┬────────────────┬──────────────────┘
                      │                │
              Session valid?      No session?
                      │                │
                      │         Redirect to /auth
                   Yes│
                      │
        ┌─────────────▼─────────────────────────────────┐
        │   Call RPC: has_role(user_id, 'admin')       │
        │   ├─ Server-side SQL execution                │
        │   └─ Return boolean                           │
        └─────────────┬──────────────────┬──────────────┘
                      │                  │
            has admin role?         No admin role?
                      │                  │
                   Yes│          Redirect to /auth
                      │
        ┌─────────────▼────────────────────┐
        │   Render /admin Dashboard        │
        │   ├─ Admin Shell component       │
        │   ├─ Navigation                  │
        │   └─ Content panels              │
        └────────────────────────────────┘
```

---

## Implementation Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| User Sign-In | ✓ Implemented | Email/password via Supabase Auth |
| Public Registration | ✗ Disabled | Users created by admins only |
| Admin Roles | ✓ Implemented | Role-based access via `user_roles` table |
| Admin Access Protection | ✓ Implemented | `/_authenticated` route wrapper + RPC check |
| First Admin Creation | ✓ Supported | Via script or manual SQL |
| Session Management | ✓ Basic | Browser-side, no timeout configured |
| Audit Logging | ✗ Missing | No tracking of role changes |
| Granular Roles | ✗ Not Supported | Only `admin` role defined |

---

## Security Recommendations

1. **Increase password requirements:** Configure in Supabase Auth settings (12+ chars, complexity)
2. **Add MFA:** Enable optional or required MFA in Supabase Auth
3. **Audit logging:** Add trigger-based audit table for `user_roles` changes
4. **Session timeout:** Configure token expiry (e.g., 24 hours)
5. **Admin invitation flow:** Implement in-app admin invitation (requires existing admin)
6. **Role-based access control:** Extend enum for `editor`, `moderator` if needed
7. **IP whitelist:** Consider IP restrictions for admin panel access
8. **Backup admin:** Always maintain at least 2 admin accounts

---

**End of Report**
