import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageHeader } from "./about";
import {
  FileText, Scale, Landmark, Gavel, Shield, Users, Briefcase, MapPin, Info, HandCoins, BookOpen, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/practice-areas")({
  head: () => ({
    meta: [
      { title: "Practice Areas — Advocate R. Thirumoorthy" },
      { name: "description", content: "Writ petitions, PIL, constitutional matters,civil, criminal litigation human rights, labour disputes, service matters, RTI and compensation." },
      { property: "og:title", content: "Practice Areas — Advocate R. Thirumoorthy" },
      { property: "og:description", content: "Comprehensive legal practice before the Madras High Court." },
      { property: "og:url", content: "/practice-areas" },
    ],
    links: [{ rel: "canonical", href: "/practice-areas" }],
  }),
  component: PracticeAreas,
});

const areas = [
  { icon: FileText, t: "Writ Petitions & Writ Appeals", d: "Article 226/227 jurisdiction before the Madras High Court — challenging executive and administrative action." },
  { icon: Landmark, t: "Public Interest Litigation (PIL)", d: "PILs advancing governmental accountability, transparency and social justice." },
  { icon: Scale, t: "Constitutional Law Matters", d: "Fundamental rights, constitutional interpretation and challenges to statutory provisions." },
  { icon: Gavel, t: "Criminal Cases", d: "Quashing petitions, bail, anticipatory bail and criminal appeals." },
  { icon: BookOpen, t: "Civil Litigation", d: "Civil suits, appeals and revisions across subordinate and high courts." },
  { icon: Shield, t: "Human Rights Litigation", d: "Representation in matters involving custodial violations, dignity and civil liberties." },
  { icon: Users, t: "Labour & Industrial Disputes", d: "Trade union matters, industrial disputes, retrenchment and wage claims." },
  { icon: Briefcase, t: "Service Matters", d: "Government service disputes, disciplinary proceedings and tribunal practice." },
  { icon: MapPin, t: "Land & Property Disputes", d: "Civil suits, acquisition challenges and property-related writs." },
  { icon: Info, t: "RTI Matters", d: "Right to Information proceedings, appeals and related writ petitions." },
  { icon: HandCoins, t: "Compensation Claims", d: "Statutory and constitutional compensation in human rights and accident cases." },
];

function PracticeAreas() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Areas of Practice"
        description="Effective representation across constitutional, civil, criminal, labour and public interest jurisdictions."
      />

      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {areas.map((a) => (
              <div key={a.t} className="group rounded-lg border border-border bg-white p-7 hover:border-navy hover:shadow-card transition-all">
                <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-navy-soft text-navy">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg text-foreground">{a.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-x">
          <SectionHeading
            eyebrow="Representation"
            title="Notable Areas of Representation"
            description="A selection of subject areas where the chamber regularly appears."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Human Rights Violations",
              "Compensation Claims",
              "Workers' Rights Litigation",
              "Trade Union Matters",
              "Public Interest Litigation",
              "Freedom of Speech Cases",
              "Social Justice Litigation",
              "RTI Proceedings",
              "Government Accountability Cases",
            ].map((t) => (
              <div key={t} className="bg-white border-l-4 border-navy px-5 py-4 rounded-r-md">
                <p className="font-medium text-sm text-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="container-x py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-navy-foreground">Have a matter to discuss?</h3>
            <p className="mt-1 text-navy-foreground/80">Send a brief summary and the chamber will revert.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-navy">
            Request Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
