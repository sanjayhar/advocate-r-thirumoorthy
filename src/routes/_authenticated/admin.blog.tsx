import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { deleteAdminPost, listAdminPosts, saveAdminPost } from "@/lib/admin.functions";
import { Trash2, Pencil, Plus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: () => (
    <AdminShell>
      <Toaster richColors position="top-right" />
      <Blog />
    </AdminShell>
  ),
});

type Post = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  read_time: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function Blog() {
  const qc = useQueryClient();
  const fetchPosts = useServerFn(listAdminPosts);
  const savePost = useServerFn(saveAdminPost);
  const removePost = useServerFn(deleteAdminPost);
  const [editing, setEditing] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts-admin"],
    queryFn: async () => await fetchPosts() as Post[],
  });

  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(p: Post) {
    setEditing(p);
    setOpen(true);
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await removePost({ data: { id } });
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Unable to delete post");
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["blog-posts-admin"] });
    qc.invalidateQueries({ queryKey: ["posts", "published"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function togglePublish(p: Post) {
    const next = !p.published;
    try {
      await savePost({ data: {
        id: p.id, title: p.title, slug: p.slug, tag: p.tag, excerpt: p.excerpt,
        content: p.content, cover_url: p.cover_url, read_time: p.read_time, published: next,
      } });
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Unable to update post");
    }
    toast.success(next ? "Published" : "Unpublished");
    qc.invalidateQueries({ queryKey: ["blog-posts-admin"] });
    qc.invalidateQueries({ queryKey: ["posts", "published"] });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return toast.error("Title required");
    const content = String(fd.get("content") ?? "");
    if (!content.trim()) return toast.error("Content required");
    const published = fd.get("published") === "on";
    const payload = {
      title,
      slug: String(fd.get("slug") || slugify(title)),
      tag: (String(fd.get("tag") ?? "") || null) as string | null,
      excerpt: (String(fd.get("excerpt") ?? "") || null) as string | null,
      content,
      cover_url: (String(fd.get("cover_url") ?? "") || null) as string | null,
      read_time: (String(fd.get("read_time") ?? "") || null) as string | null,
      published,
      published_at: published ? new Date().toISOString() : null,
    };

    try {
      await savePost({ data: { ...payload, id: editing?.id } });
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Unable to save post");
    }
    toast.success(editing ? "Saved" : "Post created");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["blog-posts-admin"] });
    qc.invalidateQueries({ queryKey: ["posts", "published"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-foreground">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage legal insight articles.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-navy-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && data && data.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">No posts yet. Create one to get started.</div>
        )}
        {data?.map((p) => (
          <div key={p.id} className="rounded-lg border border-border bg-white p-5 flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg text-foreground">{p.title}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${p.published ? "bg-navy text-navy-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
                {p.tag && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">{p.tag}</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">/{p.slug}</p>
              {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => togglePublish(p)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-navy">
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => openEdit(p)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-navy inline-flex items-center gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => remove(p.id)} className="rounded-md bg-destructive/10 text-destructive px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-destructive/15">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg bg-white border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl">{editing ? "Edit post" : "New post"}</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <Field name="title" label="Title" defaultValue={editing?.title} required />
              <Field name="slug" label="Slug" defaultValue={editing?.slug} placeholder="auto from title" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="tag" label="Tag" defaultValue={editing?.tag ?? ""} placeholder="Constitutional Law" />
                <Field name="read_time" label="Read time" defaultValue={editing?.read_time ?? ""} placeholder="5 min read" />
              </div>
              <Field name="cover_url" label="Cover image URL" defaultValue={editing?.cover_url ?? ""} placeholder="https://…" />
              <Area name="excerpt" label="Excerpt" defaultValue={editing?.excerpt ?? ""} rows={2} />
              <Area name="content" label="Content (Markdown or plain text)" defaultValue={editing?.content} rows={10} required />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={editing?.published} className="h-4 w-4" /> Publish immediately
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground hover:opacity-90">{editing ? "Save changes" : "Create post"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field(props: { name: string; label: string; defaultValue?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={props.name} className="text-xs font-medium text-foreground">{props.label}{props.required && " *"}</label>
      <input id={props.name} name={props.name} defaultValue={props.defaultValue} required={props.required} placeholder={props.placeholder} className="mt-1.5 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
    </div>
  );
}
function Area(props: { name: string; label: string; defaultValue?: string; required?: boolean; rows?: number }) {
  return (
    <div>
      <label htmlFor={props.name} className="text-xs font-medium text-foreground">{props.label}{props.required && " *"}</label>
      <textarea id={props.name} name={props.name} defaultValue={props.defaultValue} required={props.required} rows={props.rows ?? 4} className="mt-1.5 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 resize-none" />
    </div>
  );
}
