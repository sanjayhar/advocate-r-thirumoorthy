import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStats } from "@/lib/admin.functions";
import { MessageSquare, FileText, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: () => <AdminShell><Overview /></AdminShell>,
});

function Overview() {
  const fetchStats = useServerFn(getAdminStats);
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchStats(),
  });

  const cards = [
    { label: "Consultations", value: stats.data?.total ?? "—", icon: MessageSquare, to: "/admin/consultations" },
    { label: "New (unread)", value: stats.data?.newCount ?? "—", icon: Clock, to: "/admin/consultations" },
    { label: "Blog posts", value: stats.data?.posts ?? "—", icon: FileText, to: "/admin/blog" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage consultation requests and blog content.</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-lg border border-border bg-white p-5 hover:border-navy transition">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-navy" />
            </div>
            <p className="mt-3 font-display text-3xl text-foreground">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
