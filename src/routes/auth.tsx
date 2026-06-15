import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Scale } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Advocate Chamber Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/admin", replace: true });
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <section className="min-h-[calc(100vh-5rem)] grid place-items-center bg-secondary px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-navy text-navy-foreground">
              <Scale className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-2xl text-foreground">
              Chamber Admin Sign In
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Restricted area for chamber staff.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="mt-1.5 w-full rounded-md border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={6} className="mt-1.5 w-full rounded-md border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
            </div>
            <button disabled={busy} className="w-full rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-navy-foreground hover:opacity-90 disabled:opacity-60">
              {busy ? "Please wait…" : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">Account access is provisioned privately. Public registration is disabled.</p>
        </div>
      </section>
    </>
  );
}
