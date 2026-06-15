import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["new", "in_progress", "contacted", "closed"]);
const nullableText = z.string().trim().max(5000).nullable();
const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tag: z.string().trim().max(100).nullable(),
  excerpt: z.string().trim().max(500).nullable(),
  content: z.string().trim().min(1).max(100000),
  cover_url: z.string().url().max(2000).nullable(),
  read_time: z.string().trim().max(50).nullable(),
  published: z.boolean(),
});

async function requireAdmin(context: {
  supabase: SupabaseClient<Database>;
  userId: string;
}) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Response("Unable to verify administrator permissions", { status: 500 });
  if (!data) throw new Response("Administrator access required", { status: 403 });
}

export const verifyAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    return { authorized: true };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const [consultations, fresh, posts] = await Promise.all([
      context.supabase.from("consultations").select("id", { count: "exact", head: true }),
      context.supabase.from("consultations").select("id", { count: "exact", head: true }).eq("status", "new"),
      context.supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    ]);
    if (consultations.error || fresh.error || posts.error) throw new Error("Unable to load dashboard statistics");
    return { total: consultations.count ?? 0, newCount: fresh.count ?? 0, posts: posts.count ?? 0 };
  });

export const listConsultations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { status?: string }) => z.object({ status: statusSchema.optional() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    let query = context.supabase.from("consultations").select("*").order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    const result = await query;
    if (result.error) throw result.error;
    return result.data;
  });

export const updateConsultationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => z.object({ id: idSchema, status: statusSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const result = await context.supabase.from("consultations").update({ status: data.status }).eq("id", data.id);
    if (result.error) throw result.error;
    return { success: true };
  });

export const deleteConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: idSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const result = await context.supabase.from("consultations").delete().eq("id", data.id);
    if (result.error) throw result.error;
    return { success: true };
  });

export const listAdminPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const result = await context.supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (result.error) throw result.error;
    return result.data;
  });

export const saveAdminPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.infer<typeof postSchema>) => postSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { id, ...post } = data;
    const payload = { ...post, author_id: context.userId, published_at: post.published ? new Date().toISOString() : null };
    const result = id
      ? await context.supabase.from("blog_posts").update(payload).eq("id", id)
      : await context.supabase.from("blog_posts").insert(payload);
    if (result.error) throw result.error;
    return { success: true };
  });

export const deleteAdminPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: idSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const result = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (result.error) throw result.error;
    return { success: true };
  });