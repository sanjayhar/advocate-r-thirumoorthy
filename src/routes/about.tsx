import { createFileRoute, Link } from "@tanstack/react-router";
import { PhotoPlaceholder } from "@/components/site/PhotoPlaceholder";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Advocate R. Thirumoorthy — Madras High Court" },
      { name: "description", content: "Biography of Advocate R. Thirumoorthy — 15+ years of practice in constitutional law, human rights and labour rights before the Madras High Court." },
      { property: "og:title", content: "About Advocate R. Thirumoorthy" },
      { property: "og:description", content: "15+ years of practice before the Madras High Court." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const highlights = [
  "Regular appearance before the Madras High Court",
  "Writ petitions, writ appeals and PILs",
  "Constitutional and fundamental rights litigation",
  "Labour and industrial disputes representation",
  "Human rights and civil liberties matters",
  "Service, criminal and civil litigation",
];

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="bg-secondary border-b border-border">
      <div className="container-x py-14 md:py-20">
        <p className="text-[11px] uppercase tracking-[0.25em] text-navy font-semibold mb-3">{eyebrow}</p>
        <h1 className="font-display text-3xl md:text-5xl text-foreground max-w-4xl leading-[1.1]">{title}</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </section>
  );
}

export { PageHeader };

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Advocate R. Thirumoorthy"
        description="More than fifteen years at the Bar, representing individuals, activists, unions and public-interest causes before the Madras High Court."
      />

      <section className="section-pad bg-white">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <PhotoPlaceholder label="Portrait of Advocate R. Thirumoorthy" />
          </div>
          <div className="lg:col-span-7 space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">Biography</h2>
            <span className="navy-rule" />
            <p>
              Advocate R. Thirumoorthy is a practicing advocate with more than 15 years of experience before the Madras High Court and various subordinate courts and tribunals across Tamil Nadu.
            </p>
            <p>
              He has represented individuals, social activists, labour organisations, marginalised communities, and public-interest causes in constitutional, civil, criminal, labour and human rights matters.
            </p>
            <p>
              His practice focuses on constitutional rights, social justice, labour welfare, transparency and governmental accountability — anchored in a deep commitment to the rule of law.
            </p>

            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-foreground text-sm">
                  <CheckCircle2 className="h-5 w-5 text-navy mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-x">
          <SectionHeading eyebrow="Practice" title="Court Practice Highlights" description="A sustained appellate and writ-side practice at the Madras High Court." />
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { t: "Madras High Court", d: "Regular appearance in the Principal Seat at Chennai and the Madurai Bench when required." },
              { t: "Tribunals", d: "Practice before Labour Courts, Industrial Tribunals and other specialised forums." },
              { t: "Subordinate Courts", d: "Representation across District and Subordinate Courts in Tamil Nadu." },
            ].map((c) => (
              <div key={c.t} className="rounded-lg border border-border bg-white p-7 hover:border-navy transition">
                <h3 className="font-display text-lg text-foreground">{c.t}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="container-x py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-navy-foreground">Schedule a consultation</h3>
            <p className="mt-1 text-navy-foreground/80">Discuss your matter confidentially with the chamber.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-navy">
            Book Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
