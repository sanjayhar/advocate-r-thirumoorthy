import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageHeader } from "./about";
import { UserRound } from "lucide-react";

export const Route = createFileRoute("/notable-cases")({
  head: () => ({
    meta: [
      { title: "Notable Cases & Representation — Advocate R. Thirumoorthy" },
      { name: "description", content: "A selection of subject areas and public representation — human rights, PIL, workers' rights, trade union matters and constitutional litigation." },
      { property: "og:title", content: "Notable Cases & Representation" },
      { property: "og:description", content: "Representations across human rights, PIL, labour and constitutional matters." },
      { property: "og:url", content: "/notable-cases" },
    ],
    links: [{ rel: "canonical", href: "/notable-cases" }],
  }),
  component: NotableCases,
});

const reps = [
  "P. Shanmugam", "Kolathur Mani", "Viduthalai Rajendran", "Vanni Arasu", "TK. Rangarajan",
  "G. Ramakrishnan", "K. Balakrishnan", "R. Mutharasan", "K. Kanagaraj", "CITU Kannan",
  "Kowsalya Shankar", "Athiyamaan", "Va. Pugazhenthi",
];

const areas = [
  { y: "Human Rights", t: "Human Rights Violations", d: "Representation in petitions concerning custodial violations, dignity and civil liberties." },
  { y: "Compensation", t: "Compensation Claims", d: "Statutory and constitutional compensation in human rights and accident matters." },
  { y: "Labour", t: "Workers' Rights Litigation", d: "Industrial disputes, wage claims, retrenchment and reinstatement proceedings." },
  { y: "Unions", t: "Trade Union Matters", d: "Recognition disputes, internal disputes, and union-led litigation." },
  { y: "PIL", t: "Public Interest Litigation", d: "PILs advancing governance, transparency and the rights of marginalised groups." },
  { y: "Speech", t: "Freedom of Speech Cases", d: "Petitions involving press freedom, assembly and constitutional speech rights." },
  { y: "Justice", t: "Social Justice Litigation", d: "Litigation advancing the rights of workers, women, Dalits and minorities." },
  { y: "RTI", t: "RTI Proceedings", d: "Right to Information appeals and connected writ petitions." },
  { y: "Accountability", t: "Government Accountability", d: "Challenging arbitrary executive action and seeking institutional accountability." },
];

function NotableCases() {
  return (
    <>
      <PageHeader
        eyebrow="Representation"
        title="Notable Cases & Representation"
        description="A non-exhaustive overview of subject areas in which the chamber has appeared, and the public figures and organisations represented."
      />

      <section className="section-pad bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Subject Areas" title="Notable Areas of Representation" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {areas.map((a) => (
              <div key={a.t} className="rounded-lg border border-border bg-white p-6 hover:border-navy hover:shadow-card transition-all">
                <span className="text-[11px] uppercase tracking-[0.18em] text-navy font-semibold">{a.y}</span>
                <h3 className="mt-2 font-display text-lg text-foreground">{a.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-x">
          <SectionHeading
            eyebrow="Distinguished"
            title="Notable Clients & Public Representation"
            description="A selection of individuals and public figures represented or appeared on behalf of. Listed for reference; no endorsement or outcome is implied."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reps.map((r) => (
              <div key={r} className="bg-white border border-border rounded-lg p-5 flex items-center gap-4 hover:border-navy transition">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-soft text-navy">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base text-foreground leading-tight">{r}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Represented or appeared on behalf of</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground max-w-3xl mx-auto">
            Disclaimer: This page is informational and does not constitute solicitation or advertisement. No outcome of any case is guaranteed.
          </p>
        </div>
      </section>
    </>
  );
}
