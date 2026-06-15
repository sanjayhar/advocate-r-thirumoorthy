import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set Admin Password — Advocate Chamber" }, { name: "robots", content: "noindex" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery") || hash.includes("type=invite");
    const session = await supabase.auth.getSession();
    if (!isRecovery && !session.data.session) return toast.error("This password setup link is invalid or expired.");
    if (password.length < 12) return toast.error("Use at least 12 characters.");
    if (password !== confirmation) return toast.error("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password set successfully.");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] grid place-items-center bg-secondary px-4 py-12">
      <Toaster richColors position="top-right" />
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8 shadow-soft">
        <h1 className="font-display text-2xl text-foreground">Set administrator password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a unique password with at least 12 characters.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-medium text-foreground">New password
            <input name="password" type="password" minLength={12} required autoComplete="new-password" className="mt-1.5 w-full rounded-md border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </label>
          <label className="block text-xs font-medium text-foreground">Confirm password
            <input name="confirmation" type="password" minLength={12} required autoComplete="new-password" className="mt-1.5 w-full rounded-md border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </label>
          <button disabled={busy} className="w-full rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-navy-foreground disabled:opacity-60">
            {busy ? "Saving…" : "Set password"}
          </button>
        </form>
      </div>
    </section>
  );
}