# Set Admin Password Procedure

**Date:** 2026-06-15  
**Project:** Advocate R. Thirumoorthy Portfolio  
**Target admin email:** `sanjaykumarharish123@gmail.com`

---

## Can a small script update an existing Supabase Auth user password?

Yes. The Supabase Admin API supports updating an existing user by ID using `supabase.auth.admin.updateUserById(...)`.

This operation requires the Supabase service role key and must run server-side or in a trusted environment.

---

## Exact JavaScript Code

Create a file called `scripts/set-admin-password.mjs` (or use this snippet directly).

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const targetEmail = process.argv[2];
const newPassword = process.argv[3];

if (!targetEmail || !newPassword) {
  console.error('Usage: node scripts/set-admin-password.mjs <email> <new-password>');
  process.exit(1);
}
if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserIdByEmail(email) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user) return user.id;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  const userId = await findUserIdByEmail(targetEmail);
  if (!userId) {
    console.error(`User not found: ${targetEmail}`);
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) {
    console.error('Failed to update password:', error.message || error);
    process.exit(1);
  }

  console.log('Password updated successfully for user:', targetEmail);
  console.log('User ID:', data.user.id);
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
```

### Key API Call

```js
const { data, error } = await supabase.auth.admin.updateUserById(userId, {
  password: 'NewSecurePassword123',
});
```

---

## Required Environment Variables

- `SUPABASE_URL` — project URL, e.g. `https://zsioevmvkptkmhldyxbl.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key

These are required for the admin client to call `auth.admin.updateUserById`.

---

## Exact Command to Set Password for sanjaykumarharish123@gmail.com

If you save the script as `scripts/set-admin-password.mjs`:

```bash
SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>" \
node scripts/set-admin-password.mjs sanjaykumarharish123@gmail.com "NewSecurePassword123"
```

On Windows PowerShell:

```powershell
$env:SUPABASE_URL="https://zsioevmvkptkmhldyxbl.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
node .\scripts\set-admin-password.mjs sanjaykumarharish123@gmail.com "NewSecurePassword123"
```

If you prefer not to create a separate script, you can also run an inline Node command with the same logic, but using a script file is clearer and safer.

---

## Verification Steps

1. Confirm the script completed successfully and printed:
   - `Password updated successfully for user: sanjaykumarharish123@gmail.com`
   - `User ID: <uuid>`

2. Sign in as `sanjaykumarharish123@gmail.com` using the new password at `/auth`.

3. If sign-in succeeds and `/admin` loads, the password update worked.

4. Optional database verification:
   - In Supabase SQL Editor, run:
     ```sql
     SELECT id, email, last_sign_in_at
     FROM auth.users
     WHERE lower(email) = 'sanjaykumarharish123@gmail.com';
     ```
   - Confirm the user exists and that `last_sign_in_at` updates after a successful login.

---

## Notes

- This approach updates an existing user only; the user must already exist in `auth.users`.
- You cannot update the password by email directly with `updateUserById` — the user ID is required.
- The script above finds the user ID by email using `admin.listUsers()` and then updates the password.
- This must run with a Supabase service role key and should never be exposed client-side.
