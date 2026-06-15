import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, MessageSquare, FileText, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) setChecking(false);
  }, [loading]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checking) {
    return <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md text-center bg-white border border-border rounded-lg p-8">
          <ShieldAlert className="h-10 w-10 text-navy mx-auto" />
          <h2 className="mt-4 font-display text-xl text-foreground">Admin access required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are signed in as <span className="font-medium">{user?.email}</span> but this account is not an admin.
            To grant admin access, an existing admin or the database operator must insert a row into <code className="rounded bg-secondary px-1.5 py-0.5">user_roles</code> with this user's id and the role <code className="rounded bg-secondary px-1.5 py-0.5">admin</code>.
          </p>
          <button onClick={signOut} className="mt-5 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const links = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/consultations", label: "Consultations", icon: MessageSquare },
    { to: "/admin/blog", label: "Blog", icon: FileText },
  ] as const;

  return (
    <div className="bg-secondary min-h-[calc(100vh-5rem)]">
      <div className="container-x py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-1">
          <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Admin</p>
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/admin" && pathname.startsWith(l.to));
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-navy text-navy-foreground" : "text-foreground hover:bg-white"}`}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
          <button onClick={signOut} className="w-full mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
