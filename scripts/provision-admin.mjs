/**
 * Creates (or finds) a Supabase Auth user and grants the admin role.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-admin.mjs admin@example.com
 *
 * Optional:
 *   ADMIN_INVITE=true   — send a Supabase invite email (default when user is new)
 *   ADMIN_PASSWORD=...  — set password directly instead of inviting (dev only)
 */

import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const invite = process.env.ADMIN_INVITE !== "false";
const password = process.env.ADMIN_PASSWORD;

if (!email) {
  console.error("Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-admin.mjs <email>");
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  console.log(`Provisioning admin for ${email}...`);

  let user = await findUserByEmail(email);

  if (!user) {
    if (password) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      user = data.user;
      console.log("Created auth user with supplied password.");
    } else if (invite) {
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
      if (error) throw error;
      user = data.user;
      console.log("Invited auth user — check email to set a password via /reset-password.");
    } else {
      throw new Error("User not found. Set ADMIN_PASSWORD or allow invite (default).");
    }
  } else {
    console.log(`Auth user already exists (${user.id}).`);
  }

  const { error: roleError } = await admin.from("user_roles").upsert(
    { user_id: user.id, role: "admin" },
    { onConflict: "user_id,role", ignoreDuplicates: true },
  );
  if (roleError) throw roleError;

  const { data: roles, error: verifyError } = await admin
    .from("user_roles")
    .select("role, created_at")
    .eq("user_id", user.id);
  if (verifyError) throw verifyError;

  console.log("\nVerification:");
  console.log(`  Email:  ${email}`);
  console.log(`  User:   ${user.id}`);
  console.log(`  Roles:  ${roles.map((r) => r.role).join(", ") || "(none)"}`);
  console.log("\nAdmin provisioning complete. Sign in at /auth after setting a password.");
}

main().catch((err) => {
  console.error("Provisioning failed:", err.message ?? err);
  process.exit(1);
});
