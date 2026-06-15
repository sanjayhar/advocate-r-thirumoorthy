import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { deleteConsultation, listConsultations, updateConsultationStatus } from "@/lib/admin.functions";
import { Trash2, Mail, Phone, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/consultations")({
  component: () => (
    <AdminShell>
      <Toaster richColors position="top-right" />
      <Consultations />
    </AdminShell>
  ),
});

type Consult = {
  id: string;
  name: string;
  phone: string;
  email: string;
  case_type: string;
  message: string;
  status: string;
  created_at: string;
};

const statuses = ["new", "in_progress", "contacted", "closed"] as const;

function Consultations() {
  const qc = useQueryClient();
  const fetchConsultations = useServerFn(listConsultations);
  const setConsultationStatus = useServerFn(updateConsultationStatus);
  const removeConsultation = useServerFn(deleteConsultation);
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["consultations", filter],
    queryFn: async () => await fetchConsultations({ data: filter === "all" ? {} : { status: filter } }) as Consult[],
  });

  async function updateStatus(id: string, status: string) {
    try {
      await setConsultationStatus({ data: { id, status } });
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Unable to update status");
    }
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["consultations"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this consultation request?")) return;
    try {
      await removeConsultation({ data: { id } });
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Unable to delete request");
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["consultations"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-foreground">Consultations</h1>
          <p className="mt-1 text-sm text-muted-foreground">All consultation requests submitted through the website.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-input bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && data && data.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">No requests in this view.</div>
        )}
        {data?.map((c) => (
          <details key={c.id} className="group rounded-lg border border-border bg-white">
            <summary className="cursor-pointer list-none p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-base text-foreground">{c.name}</span>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.case_type}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {c.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {c.phone}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-5 space-y-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{c.message}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-xs text-muted-foreground">Status:</label>
                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                  className="rounded-md border border-input bg-white px-3 py-1.5 text-sm"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
                <a href={`mailto:${c.email}`} className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs hover:border-navy">Email</a>
                <a href={`tel:${c.phone}`} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-navy">Call</a>
                <button onClick={() => remove(c.id)} className="rounded-md bg-destructive/10 text-destructive px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-destructive/15">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-navy text-navy-foreground",
    in_progress: "bg-amber-100 text-amber-900",
    contacted: "bg-blue-100 text-blue-900",
    closed: "bg-secondary text-muted-foreground",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${map[status] ?? "bg-secondary"}`}>{status.replace("_", " ")}</span>;
}
