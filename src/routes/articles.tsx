import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "./about";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Legal Insights — Advocate R. Thirumoorthy" },
      { name: "description", content: "Articles and commentary on constitutional law, human rights, labour rights and public interest litigation." },
      { property: "og:title", content: "Legal Insights — Advocate R. Thirumoorthy" },
      { property: "og:description", content: "Commentary on constitutional law and rights jurisprudence." },
      { property: "og:url", content: "/articles" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  component: Articles,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  excerpt: string | null;
  read_time: string | null;
  cover_url: string | null;
  published_at: string | null;
};

function Articles() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, tag, excerpt, read_time, cover_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Articles & Legal Insights"
        description="Notes and commentary from the chamber on constitutional law, civil liberties, labour rights and public interest litigation."
      />

      <section className="section-pad bg-white">
        <div className="container-x">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 rounded-lg border border-border bg-secondary animate-pulse" />
              ))}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-secondary p-12 text-center">
              <FileText className="h-8 w-8 text-navy mx-auto" />
              <h2 className="mt-4 font-display text-xl text-foreground">No articles yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The chamber will publish constitutional law and rights commentary here soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.map((p) => (
                <article key={p.id} className="group rounded-lg border border-border bg-white p-6 flex flex-col hover:border-navy hover:shadow-card transition-all">
                  {p.tag && <span className="text-[11px] uppercase tracking-[0.18em] text-navy font-semibold">{p.tag}</span>}
                  <h2 className="mt-2 font-display text-lg text-foreground leading-snug">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{p.excerpt}</p>}
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {p.read_time ?? "—"}</span>
                    <span className="text-navy inline-flex items-center gap-1 font-medium">Read <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 bg-secondary border border-border rounded-lg p-10 text-center">
            <h2 className="font-display text-2xl text-foreground">Subscribe to chamber notes</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Occasional commentary on important judgments and constitutional developments.</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-medium text-navy-foreground hover:opacity-90">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
