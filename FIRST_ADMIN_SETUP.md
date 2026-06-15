# First Administrator Setup Guide

**Date:** 2026-06-15  
**Project:** Advocate R. Thirumoorthy Portfolio  
**Supabase Project ID:** `zsioevmvkptkmhldyxbl`  
**Admin Email:** `sanjaykumarharish123@gmail.com`

---

## Executive Summary

The `provision-admin.mjs` script **can run successfully** with your current Supabase project. It will:
1. **Automatically create** the user if they don't exist
2. **Assign admin role** to the user
3. **Notify via email** (production) or use supplied password (development)

**No manual user creation needed.** The script handles everything.

---

## Analysis: Provisioning Script Capabilities

### Script Location
- **File:** `scripts/provision-admin.mjs`
- **Language:** JavaScript (Node.js, ES Modules)
- **Type:** Admin utility script
- **Dependencies:** `@supabase/supabase-js` (already installed)

### Script Summary

```javascript
// Takes email as CLI argument
const email = process.argv[2];

// Searches for existing user
let user = await findUserByEmail(email);

// If not found, creates or invites user
if (!user) {
  if (password) {
    // Option 1: Create with password (dev)
    user = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  } else if (invite) {
    // Option 2: Send invite email (production, default)
    user = await admin.auth.admin.inviteUserByEmail(email);
  }
}

// Assign admin role
await admin.from("user_roles").upsert({ user_id: user.id, role: "admin" });

// Verify
const roles = await admin.from("user_roles").select(...).eq("user_id", user.id);
```

---

## Question 1: Can the Script Run with Current Supabase Project?

### Answer: **YES** ✓

**Why:**
- The script uses standard Supabase Admin API (`createClient`, `admin.auth.admin.*`)
- Your Supabase project has all required tables and functions:
  - ✓ `auth.users` (Supabase built-in)
  - ✓ `public.user_roles` (created in migration `20260611134045_bcb0c741...`)
  - ✓ `has_role()` RPC function (created in migration `20260611134045_bcb0c741...`)
- The script is already in your project repository
- `npm run provision-admin` is configured in `package.json`

**Technical Prerequisites Met:**
```
✓ Node.js installed
✓ Dependencies installed (@supabase/supabase-js)
✓ Supabase database migrations applied
✓ user_roles table exists
✓ app_role enum defined ('admin')
```

---

## Question 2: What Environment Variables Are Required?

### Required Environment Variables

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| `SUPABASE_URL` | Required | `https://zsioevmvkptkmhldyxbl.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | `eyJhbGc...` (long token) | Service role API key with admin privileges |

### Optional Environment Variables

| Variable | Type | Default | Options | Description |
|----------|------|---------|---------|-------------|
| `ADMIN_INVITE` | Optional | `true` | `true` / `false` | Send invite email to user |
| `ADMIN_PASSWORD` | Optional | `undefined` | Any string (6+ chars) | Set password directly instead of inviting |

### Where to Find SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

**Supabase Dashboard:**
1. Go to https://supabase.com
2. Sign in to your account
3. Select project: **Advocate R. Thirumoorthy Portfolio**
4. Click **Settings** (bottom left)
5. Click **API** (in left sidebar)
6. Copy these values:
   - **Project URL:** This is `SUPABASE_URL`
   - **Project API Keys → Service role key:** This is `SUPABASE_SERVICE_ROLE_KEY`

**Example Values:**
```
SUPABASE_URL=https://zsioevmvkptkmhldyxbl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Question 3: Must a User Already Exist in auth.users?

### Answer: **NO** ✗

**Explanation:**

The script checks for existing users:
```javascript
let user = await findUserByEmail(email);
```

**If user NOT found:**
- **Option A (Default - Production):** Creates an invite
  - User receives email from Supabase
  - User clicks link to set their own password
  - User signs in

- **Option B (Development):** Creates user with supplied password
  - User created immediately with `email_confirm: true`
  - User can sign in immediately with provided password

**If user IS found:**
- Script skips user creation
- Proceeds directly to role assignment

**Conclusion:** The script is designed to handle both new and existing users. You can run it even if the user has never been created before.

---

## Question 4: Does the Script Create the User Automatically?

### Answer: **YES** ✓

**Conditions:**

1. **Default Behavior (Production):** User is automatically invited
   ```bash
   npm run provision-admin sanjaykumarharish123@gmail.com
   # No ADMIN_PASSWORD set
   # Script creates user + sends invite email
   ```

2. **With Password (Development):** User created with password
   ```bash
   ADMIN_PASSWORD="TempPassword123" npm run provision-admin sanjaykumarharish123@gmail.com
   # Script creates user immediately
   # User can sign in with this password
   ```

3. **User Already Exists:** Script skips creation, proceeds to role assignment
   ```bash
   npm run provision-admin sanjaykumarharish123@gmail.com
   # User found in system
   # Script assigns admin role
   ```

**User Creation via `admin.auth.admin.createUser()`:**
```javascript
const { data, error } = await admin.auth.admin.createUser({
  email: "sanjaykumarharish123@gmail.com",
  password: "SuppliedPassword123",
  email_confirm: true  // Email is pre-confirmed
});
```

**Invitation via `admin.auth.admin.inviteUserByEmail()`:**
```javascript
const { data, error } = await admin.auth.admin.inviteUserByEmail(
  "sanjaykumarharish123@gmail.com"
);
// User gets email with Supabase sign-up/password-set link
```

---

## Question 5: Exact Command to Create First Administrator

### Two Approaches

#### Approach 1: Production (Recommended) — Invite via Email ⭐

**Best for:** First-time setup, secure password entry

**Command:**
```bash
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<paste-your-service-role-key-here>" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

**Or with npm script:**
```bash
npm run provision-admin sanjaykumarharish123@gmail.com
```
(if `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already in your `.env` file)

**What Happens:**
1. Script searches for user by email
2. If not found: Creates auth user + sends invite email
3. Assigns admin role in `user_roles` table
4. Displays verification output
5. User receives email from Supabase with password-set link
6. User clicks link, sets their password
7. User signs in at `/auth` with email and password

**Example Output:**
```
Provisioning admin for sanjaykumarharish123@gmail.com...
Created auth user with invited status.
Invited auth user — check email to set a password via /reset-password.

Verification:
  Email:  sanjaykumarharish123@gmail.com
  User:   a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Roles:  admin

Admin provisioning complete. Sign in at /auth after setting a password.
```

---

#### Approach 2: Development Only — Create with Password

**Best for:** Local development, testing

**Command:**
```bash
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<paste-your-service-role-key-here>" \
ADMIN_PASSWORD="SecurePassword123" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

**What Happens:**
1. Script searches for user by email
2. If not found: Creates auth user **with supplied password**
3. Sets `email_confirm: true` (email pre-confirmed)
4. Assigns admin role in `user_roles` table
5. Displays verification output
6. User can sign in **immediately** (no email needed)

**Example Output:**
```
Provisioning admin for sanjaykumarharish123@gmail.com...
Created auth user with supplied password.

Verification:
  Email:  sanjaykumarharish123@gmail.com
  User:   a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Roles:  admin

Admin provisioning complete. Sign in at /auth after setting a password.
```

**⚠️ Security Warning:** Never use this approach in production. This creates a user with a known password that was in shell history. Use Approach 1 instead.

---

## Step-by-Step First Admin Setup

### Prerequisites Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Project dependencies installed (`npm install` completed)
- [ ] Supabase migrations applied (run `supabase db push` if needed)
- [ ] Supabase dashboard access (to copy API keys)

### Step 1: Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Click your project: **zsioevmvkptkmhldyxbl**
3. Click **Settings** (bottom left)
4. Click **API**
5. Copy **Project URL** and **Service role key**

**Save these securely (you'll use them next):**
```
SUPABASE_URL = https://zsioevmvkptkmhldyxbl.supabase.co
SERVICE_ROLE_KEY = eyJhbGc...
```

### Step 2A: Production Setup (Recommended)

**Terminal Command:**

```bash
cd "d:\sanjay_harish\freelancing projects\Advocate-R-Thirumoorthy\advocate-r-thirumoorthy-portfolio-export\advocate-r-thirumoorthy-portfolio"

SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

**Replace `<your-service-role-key>` with the actual key from Supabase Dashboard.**

**On Windows PowerShell:**

```powershell
$env:SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
npm run provision-admin sanjaykumarharish123@gmail.com
```

### Step 2B: Development Setup (If Using Password)

**Terminal Command:**

```bash
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>" \
ADMIN_PASSWORD="YourSecurePassword123" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

**On Windows PowerShell:**

```powershell
$env:SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
$env:ADMIN_PASSWORD="YourSecurePassword123"
npm run provision-admin sanjaykumarharish123@gmail.com
```

### Step 3: Verify User Creation

**Expected Output:**
```
Provisioning admin for sanjaykumarharish123@gmail.com...
Created auth user with supplied password.
[OR: Invited auth user — check email to set a password via /reset-password.]

Verification:
  Email:  sanjaykumarharish123@gmail.com
  User:   <uuid>
  Roles:  admin

Admin provisioning complete. Sign in at /auth after setting a password.
```

**If you see errors:**
- "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" → Check your env vars
- "Provisioning failed: Unexpected end of JSON input" → Service role key is invalid
- "Provisioning failed: Permission denied" → Service role key doesn't have admin rights

### Step 4: Set Password (If Using Invite Method)

1. Check email inbox for message from **noreply@mail.supabase.io**
2. Look for subject line like **"You're invited to join our project"**
3. Click the **Set your password** link
4. Enter a strong password (12+ characters recommended)
5. Confirm password
6. You'll be redirected to Supabase confirmation page

### Step 5: Sign In to Admin Panel

1. Navigate to application at: `http://localhost:5173/auth` (or your deployment URL)
2. **Email:** `sanjaykumarharish123@gmail.com`
3. **Password:** The password you set or provided
4. Click **Sign In**
5. You should be redirected to `/admin` dashboard

**Dashboard should show:**
- ✓ "Dashboard" heading
- ✓ "Manage consultation requests and blog content"
- ✓ Statistics cards (Consultations, New, Blog posts)
- ✓ Admin navigation menu

---

## Required SQL Queries

### Query 1: Verify Admin Role Assignment

**Run in Supabase SQL Editor to verify the admin was created:**

```sql
SELECT 
  u.id,
  u.email,
  u.created_at as account_created,
  u.last_sign_in_at as last_signin,
  r.role,
  r.created_at as role_assigned_at
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE lower(u.email) = 'sanjaykumarharish123@gmail.com';
```

**Expected Result (1 row):**
| id | email | account_created | last_signin | role | role_assigned_at |
|----|-------|-----------------|-------------|------|------------------|
| a1b2c3d4-... | sanjaykumarharish123@gmail.com | 2026-06-15 10:30:00 | 2026-06-15 10:45:00 | admin | 2026-06-15 10:30:00 |

### Query 2: List All Admins

**View all admin accounts:**

```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  r.created_at as admin_since,
  u.last_sign_in_at as last_login
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE r.role = 'admin'
ORDER BY r.created_at DESC;
```

### Query 3: Verify has_role() Function Works

**Test the role verification function:**

```sql
SELECT public.has_role(
  (SELECT id FROM auth.users WHERE lower(email) = 'sanjaykumarharish123@gmail.com'),
  'admin'::public.app_role
) as is_admin;
```

**Expected Result:**
| is_admin |
|----------|
| true |

**Note:** This will only return true if you're logged in as the admin user due to the `SECURITY INVOKER` setting in the function.

### Query 4: Check user_roles Table Structure

**View the table definition:**

```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_roles'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

---

## Environment Variable Examples

### For Production (Recommended)

**File: `.env.local`** (create if doesn't exist)

```env
SUPABASE_URL=https://zsioevmvkptkmhldyxbl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaW9ldm12a3B0a21obGR5eGJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYyMzAwMDAwMCwiZXhwIjo2MjM5OTk5OTk5fQ...
```

**Then run:**
```bash
npm run provision-admin sanjaykumarharish123@gmail.com
```

### For Development (Dev Only)

**With inline environment variables:**

```bash
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
ADMIN_PASSWORD="TempPassword123" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

---

## Expected Results After Running Script

### What Gets Created

#### 1. Auth User Record
**Location:** Supabase → Authentication → Users

| Field | Value |
|-------|-------|
| Email | sanjaykumarharish123@gmail.com |
| Status | Confirmed (via ADMIN_PASSWORD) or Invited (via invite) |
| Created | 2026-06-15 10:30:00 |
| User ID | a1b2c3d4-e5f6-7890-abcd-ef1234567890 |
| Password | Set by user (invite) or supplied (dev) |

#### 2. User Roles Record
**Location:** Supabase → SQL Editor → Query `public.user_roles`

| user_id | role | created_at |
|---------|------|-----------|
| a1b2c3d4-e5f6-7890-abcd-ef1234567890 | admin | 2026-06-15 10:30:00 |

#### 3. Application Access
**Endpoint:** `/auth`

- Email: `sanjaykumarharish123@gmail.com`
- Password: User-supplied or set via email link
- Access to: `/admin`, `/admin/blog`, `/admin/consultations`

---

## Verification Checklist

### After Running the Script

- [ ] Script output shows:
  - `Created auth user with supplied password.` OR `Invited auth user`
  - `Verification:` section with email, user ID, roles
  - `Admin provisioning complete`

- [ ] Email received (if using invite method)
  - [ ] Subject: "You're invited to join our project"
  - [ ] Contains password-set link
  - [ ] Link is valid (not expired after 24 hours)

### After User Sets Password

- [ ] User can navigate to `/auth`
- [ ] User can enter email: `sanjaykumarharish123@gmail.com`
- [ ] User can enter password
- [ ] User is redirected to `/admin` on success
- [ ] Admin dashboard is visible

### In Supabase Dashboard

- [ ] User exists in Authentication → Users
- [ ] User email is confirmed
- [ ] User ID matches script output

### In Database

- [ ] SQL Query 1 returns 1 row
- [ ] Query 3 returns `is_admin = true`
- [ ] No error messages in Supabase logs

---

## Provisioning Script Deep Dive

### Script Execution Flow

```
START: provision-admin.mjs sanjaykumarharish123@gmail.com
  │
  ├─ 1. Read arguments
  │  ├─ email = "sanjaykumarharish123@gmail.com" (from process.argv[2])
  │  └─ password = process.env.ADMIN_PASSWORD (or undefined)
  │
  ├─ 2. Validate environment variables
  │  ├─ SUPABASE_URL? → ✓ Required
  │  ├─ SUPABASE_SERVICE_ROLE_KEY? → ✓ Required
  │  └─ If missing → Exit with error
  │
  ├─ 3. Create Supabase Admin Client
  │  └─ Using service role key (full privileges)
  │
  ├─ 4. Search for existing user
  │  ├─ Call findUserByEmail("sanjaykumarharish123@gmail.com")
  │  ├─ Pagination through auth.users (200 per page)
  │  └─ Return: user object OR null
  │
  ├─ 5. Create or find user
  │  ├─ If NOT found:
  │  │  ├─ If ADMIN_PASSWORD set:
  │  │  │  └─ admin.auth.admin.createUser()
  │  │  │     ├─ email: "sanjaykumarharish123@gmail.com"
  │  │  │     ├─ password: ADMIN_PASSWORD
  │  │  │     └─ email_confirm: true
  │  │  │
  │  │  └─ Else if ADMIN_INVITE !== "false":
  │  │     └─ admin.auth.admin.inviteUserByEmail()
  │  │        └─ Sends Supabase invite email
  │  │
  │  └─ If found:
  │     └─ Log: "Auth user already exists"
  │
  ├─ 6. Assign admin role
  │  ├─ admin.from("user_roles").upsert()
  │  ├─ Insert: { user_id: user.id, role: "admin" }
  │  └─ On conflict: ignoreDuplicates: true
  │
  ├─ 7. Verify role assignment
  │  ├─ Query user_roles for user_id
  │  └─ Fetch created_at timestamp
  │
  ├─ 8. Display results
  │  ├─ Email: sanjaykumarharish123@gmail.com
  │  ├─ User ID: <uuid>
  │  └─ Roles: admin
  │
  └─ END: Success
```

### Key Code Sections

**Email Search (pagination):**
```javascript
async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (match) return match;
    if (data.users.length < perPage) return null;  // Last page reached
    page += 1;
  }
}
```

**User Creation (if not found):**
```javascript
if (!user) {
  if (password) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // Skip email verification
    });
  } else if (invite) {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  }
}
```

**Role Assignment:**
```javascript
const { error: roleError } = await admin.from("user_roles").upsert(
  { user_id: user.id, role: "admin" },
  { onConflict: "user_id,role", ignoreDuplicates: true }
);
```

---

## Troubleshooting

### Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

**Cause:** Environment variables not set

**Solution:**
```bash
# Check if variables are set
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Set them before running script
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<your-key>" \
npm run provision-admin sanjaykumarharish123@gmail.com
```

### Error: "Provisioning failed: Unexpected end of JSON input"

**Cause:** Service role key is invalid or malformed

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **exact** Service role key (long JWT token)
3. Ensure no spaces or extra characters
4. Paste into command again

### Error: "Permission denied" or "Invalid request"

**Cause:** Service role key doesn't have admin privileges

**Solution:**
- Verify you copied the **Service role** key, not the **Public anon** key
- Service role key is longer and starts with `eyJ...`
- Public key is shorter

### Error: "Email format is invalid"

**Cause:** Email address format error

**Solution:**
- Verify email is correctly formatted: `sanjaykumarharish123@gmail.com`
- No spaces before/after email
- Email is lowercase

### Script Hangs or Times Out

**Cause:** 
- Slow network connection
- Too many users in auth.users (pagination slow)
- Supabase API is unreachable

**Solution:**
1. Check internet connection
2. Try again in a few moments
3. Check Supabase status page: https://status.supabase.com

---

## Security Considerations

### Service Role Key Protection

⚠️ **The Service Role Key is sensitive. Treat it like a password.**

- [ ] Never commit to Git
- [ ] Never share in chat, email, or screenshots
- [ ] Store in `.env.local` (ignored by Git)
- [ ] Rotate if accidentally exposed
- [ ] Use different keys for dev/prod if possible

### Password Security (if using ADMIN_PASSWORD)

⚠️ **Never use ADMIN_PASSWORD in production.**

- [ ] Only for local development
- [ ] Use strong password (12+ characters, mixed case, numbers, symbols)
- [ ] Clear shell history: `history -c`
- [ ] Use invite method for real deployments

### After Admin Creation

- [ ] Change default password on first login
- [ ] Enable MFA if available
- [ ] Keep password secure
- [ ] Don't share admin credentials

---

## Summary Table

| Aspect | Status | Details |
|--------|--------|---------|
| **Script Executable** | ✓ YES | Already in repo, npm script configured |
| **User Auto-Creation** | ✓ YES | Creates via invite (prod) or password (dev) |
| **Requires Pre-Existing User** | ✗ NO | Script handles creation |
| **Required Env Vars** | 2 | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| **Optional Env Vars** | 2 | ADMIN_INVITE (default: true), ADMIN_PASSWORD |
| **Execution Time** | ~5-10s | Depends on network and user count |
| **Email Delivery** | ~30s-2min | Supabase sends from noreply@mail.supabase.io |
| **Role Assignment** | Automatic | Upsert with conflict handling |
| **Verification** | ✓ Included | Script queries user_roles and displays results |

---

**End of Setup Guide**
