import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PageHeader } from "./about";
import { MapPin, Phone, Mail, MessageCircle, Building2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Advocate R. Thirumoorthy | Madras High Court" },
      { name: "description", content: "Contact Advocate R. Thirumoorthy. Chamber at Madras High Court and office at Parrys, Chennai. Book a consultation." },
      { property: "og:title", content: "Contact — Advocate R. Thirumoorthy" },
      { property: "og:description", content: "Book a consultation with the chamber." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  phone: z.string().trim().min(5, "Valid phone required").max(30),
  email: z.string().trim().email("Valid email required").max(255),
  case_type: z.string().trim().min(2, "Select a matter").max(100),
  message: z.string().trim().min(10, "Briefly describe your matter").max(5000),
});

const caseTypes = [
  "Writ Petition / Writ Appeal",
  "Public Interest Litigation",
  "Constitutional Matter",
  "Criminal Case",
  "Human Rights Matter",
  "Labour / Industrial Dispute",
  "Service Matter",
  "Land / Property Dispute",
  "RTI Matter",
  "Other",
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("consultations").insert({
      ...parsed.data,
      status: "new",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again or call the chamber.");
      return;
    }
    toast.success("Request received. The chamber will revert shortly.");
    form.reset();
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <PageHeader
        eyebrow="Contact"
        title="Request a Consultation"
        description="Share a brief summary of your matter. Consultations are by prior appointment."
      />

      <section className="section-pad bg-white">
        <div className="container-x grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-7 rounded-lg bg-white border border-border p-7 md:p-9 shadow-soft">
            <h2 className="font-display text-2xl text-foreground">Consultation Form</h2>
            <span className="navy-rule mt-3" />
            <div className="mt-7 grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" required />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Email" name="email" type="email" required />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="case_type" className="text-xs font-medium text-foreground">Case Type *</label>
                <select id="case_type" name="case_type" required className="rounded-md border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30">
                  <option value="">Select a matter…</option>
                  {caseTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-medium text-foreground">Message *</label>
              <textarea id="message" name="message" rows={6} required maxLength={5000} className="rounded-md border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 resize-none" placeholder="Briefly describe your matter (no confidential details)." />
            </div>
            <button disabled={submitting} className="mt-7 inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-medium text-navy-foreground hover:opacity-90 disabled:opacity-60">
              {submitting ? "Sending…" : "Request Consultation"} <Send className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Submitting this form does not create an advocate-client relationship.</p>
          </form>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-lg bg-navy text-navy-foreground p-7">
              <h3 className="font-display text-lg flex items-center gap-2"><Building2 className="h-5 w-5" /> Chamber</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-foreground/85">
                No. 57, Old Law Chambers<br />
                Madras High Court Building<br />
                Chennai
              </p>
            </div>
            <div className="rounded-lg bg-secondary border border-border p-7">
              <h3 className="font-display text-lg text-foreground flex items-center gap-2"><Building2 className="h-5 w-5 text-navy" /> Office</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Old No. 166, New No. 366, 3rd Floor<br />
                Old Shawalace Building<br />
                Thambu Chetty Street, Parrys<br />
                Chennai – 600001<br />
                Tamil Nadu, India
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <a href="tel:+910000000000" className="flex flex-col items-center gap-2 bg-white border border-border rounded-lg py-4 hover:border-navy transition">
                <Phone className="h-5 w-5 text-navy" />
                <span className="text-xs text-foreground">Call</span>
              </a>
              <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 bg-white border border-border rounded-lg py-4 hover:border-navy transition">
                <MessageCircle className="h-5 w-5 text-navy" />
                <span className="text-xs text-foreground">WhatsApp</span>
              </a>
              <a href="mailto:lawmoorthyoffice@gmail.com" className="flex flex-col items-center gap-2 bg-white border border-border rounded-lg py-4 hover:border-navy transition">
                <Mail className="h-5 w-5 text-navy" />
                <span className="text-xs text-foreground">Email</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-secondary border-t border-border">
        <div className="container-x py-14">
          <SectionHeading eyebrow="Location" title="Find the Chamber" description="Madras High Court, Chennai — Tamil Nadu, India." />
          <div className="mt-8 aspect-[16/7] w-full overflow-hidden rounded-lg border border-border bg-white">
            <iframe
              title="Madras High Court Map"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Madras+High+Court+Chennai&output=embed"
            />
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-navy" /> Madras High Court Building, Chennai 600104
          </p>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-foreground">
        {label}{required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="rounded-md border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
      />
    </div>
  );
}
