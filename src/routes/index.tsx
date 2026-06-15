import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Scale,
  Gavel,
  Shield,
  Users,
  FileText,
  Landmark,
  HandHelping,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { PhotoPlaceholder } from "@/components/site/PhotoPlaceholder";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Advocate R. Thirumoorthy — Madras High Court | Constitutional & Human Rights Law" },
      {
        name: "description",
        content:
          "15+ years before the Madras High Court. Constitutional law, writ petitions, PIL, human rights and labour rights. Book a consultation with Advocate R. Thirumoorthy.",
      },
      { property: "og:title", content: "Advocate R. Thirumoorthy — Madras High Court" },
      { property: "og:description", content: "Constitutional, human rights and public interest litigation practice." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const stats = [
  { v: "15+", l: "Years at the Bar" },
  { v: "1000+", l: "Matters Handled" },
  { v: "High Court", l: "Madras Practice" },
  { v: "PIL", l: "Constitutional & Rights" },
];

const focusAreas = [
  "Constitutional Law",
  "Public Interest Litigation",
  "Human Rights",
  "Labour & Industrial Disputes",
  "Social Justice",
];

const practiceTeasers = [
  { icon: Scale, t: "Constitutional Law", d: "Writ petitions and appeals before the Madras High Court." },
  { icon: Shield, t: "Human Rights", d: "Representation in human rights and civil liberties matters." },
  { icon: Users, t: "Labour & Industrial", d: "Trade union, workers' rights and industrial disputes." },
  { icon: Landmark, t: "Public Interest", d: "PILs advancing accountability and social justice." },
  { icon: FileText, t: "Service Matters", d: "Government service and disciplinary proceedings." },
  { icon: Gavel, t: "Civil & Criminal", d: "Civil litigation and criminal defence representation." },
];

const commitments = [
  { icon: Scale, t: "Constitutional Rights", d: "Protecting fundamental rights and constitutional guarantees." },
  { icon: HandHelping, t: "Access to Justice", d: "Effective representation regardless of station." },
  { icon: Shield, t: "Human Rights", d: "Standing for dignity, liberty and due process." },
  { icon: Users, t: "Labour Welfare", d: "Advancing the cause of working people and their unions." },
  { icon: Landmark, t: "Rule of Law", d: "Independence of the judiciary and constitutional supremacy." },
  { icon: BookOpen, t: "Social Justice", d: "Representation of marginalised communities and causes." },
];

const faqs = [
  { q: "How can I schedule a consultation?", a: "Use the consultation form on the Contact page, or call/WhatsApp the chamber. Appointments are confirmed by the office." },
  { q: "Do you handle writ petitions?", a: "Yes — writ petitions and writ appeals before the Madras High Court are a core area of practice." },
  { q: "Do you appear before the Madras High Court?", a: "Yes. Practice is primarily before the Madras High Court at Chennai, including the Madurai Bench when required." },
  { q: "Do you handle labour disputes?", a: "Yes — industrial disputes, trade union matters, workers' rights and related writ proceedings." },
  { q: "Can consultations be conducted online?", a: "Yes. Online consultations are available by prior appointment for clients outside Chennai." },
];

function Home() {
  return (
    <>
      {/* HERO — bright, photo right, info left */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--navy-soft)_0%,_transparent_60%)]" aria-hidden />
        <div className="container-x grid lg:grid-cols-12 gap-12 items-center py-16 md:py-24 lg:py-28">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-soft px-4 py-1.5 text-xs font-medium text-navy">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" /> Practicing at the Madras High Court
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Advocate <span className="text-navy">R. Thirumoorthy</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
              15+ years of practice in constitutional law, public interest litigation, human rights, labour rights and social justice.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {focusAreas.map((f) => (
                <li key={f} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-navy" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-medium text-navy-foreground hover:opacity-90 transition"
              >
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+910000000000"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-6 py-3 text-sm font-medium text-foreground hover:border-navy hover:text-navy transition"
              >
                <Phone className="h-4 w-4" /> Call Chamber
              </a>
              <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-6 py-3 text-sm font-medium text-foreground hover:border-navy hover:text-navy transition"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm md:max-w-md">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-md border border-navy/30" aria-hidden />
              <div className="absolute -right-3 -bottom-3 h-24 w-24 rounded-md bg-navy/10" aria-hidden />
              <PhotoPlaceholder className="relative shadow-card" />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-border bg-white">
          <div className="container-x grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {stats.map((s) => (
              <div key={s.l} className="py-6 px-4 text-center">
                <div className="font-display text-2xl md:text-3xl text-navy">{s.v}</div>
                <div className="mt-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-pad bg-secondary">
        <div className="container-x grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <PhotoPlaceholder label="Advocate R. Thirumoorthy in his chamber" />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading
              align="left"
              eyebrow="About the Chamber"
              title="A practice rooted in constitutional rights and social justice."
            />
            <div className="mt-5 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                Advocate R. Thirumoorthy is a practicing advocate with more than 15 years of experience before the Madras High Court and various subordinate courts and tribunals across Tamil Nadu.
              </p>
              <p>
                He has represented individuals, social activists, labour organisations, marginalised communities and public-interest causes in constitutional, civil, criminal, labour and human rights matters.
              </p>
            </div>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-navy hover:underline"
            >
              Read full biography <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Practice"
            title="Areas of Practice"
            description="Comprehensive representation across constitutional, civil, criminal and labour jurisdictions."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {practiceTeasers.map((p) => (
              <div
                key={p.t}
                className="group relative rounded-lg border border-border bg-white p-7 hover:border-navy hover:shadow-card transition-all"
              >
                <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-navy-soft text-navy">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg text-foreground">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/practice-areas" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:underline">
              View all practice areas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="section-pad bg-secondary">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Commitment"
            title="Commitment to Justice"
            description="The chamber is committed to the protection of constitutional rights, access to justice and effective legal representation."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {commitments.map((c) => (
              <div key={c.t} className="rounded-lg bg-white border border-border p-6">
                <c.icon className="h-7 w-7 text-navy" />
                <h3 className="mt-4 font-display text-base text-foreground">{c.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy">
        <div className="container-x py-14 md:py-16 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-navy-foreground">Need legal guidance on a constitutional matter?</h2>
            <p className="mt-2 text-navy-foreground/80">Share a brief summary of your case. The chamber will respond promptly.</p>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-navy hover:opacity-95">
              Request Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/practice-areas" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-navy-foreground hover:bg-white/10">
              Explore Practice
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-10 max-w-3xl mx-auto divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-base md:text-lg text-foreground">
                  {f.q}
                  <span className="mt-1 text-navy transition group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
