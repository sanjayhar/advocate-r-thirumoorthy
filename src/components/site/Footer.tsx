import { Link } from "@tanstack/react-router";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-soft border-t border-border text-foreground">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-navy text-navy-foreground">
              <Scale className="h-5 w-5" />
            </span>
            <span className="font-display text-lg">R. Thirumoorthy</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Advocate practicing before the Madras High Court — constitutional law, human rights, labour rights, and public interest litigation.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-navy mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-navy">About</Link></li>
            <li><Link to="/practice-areas" className="hover:text-navy">Practice Areas</Link></li>
            <li><Link to="/notable-cases" className="hover:text-navy">Notable Cases</Link></li>
            <li><Link to="/articles" className="hover:text-navy">Legal Insights</Link></li>
            <li><Link to="/contact" className="hover:text-navy">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-navy mb-4">Practice</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Constitutional Law</li>
            <li>Writ Petitions &amp; PIL</li>
            <li>Human Rights Litigation</li>
            <li>Labour &amp; Industrial Disputes</li>
            <li>Service &amp; Civil Matters</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-navy mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-navy" /><span>No. 57, Old Law Chambers, Madras High Court, Chennai</span></li>
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-navy" /><span>+91 — Available on request</span></li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-navy" /><span>lawmoorthyoffice@gmail.com</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Advocate R. Thirumoorthy. All rights reserved.</p>
          <p className="text-center md:text-right">
            Information on this site does not constitute legal advice or an advocate-client relationship.
          </p>
        </div>
      </div>
    </footer>
  );
}
