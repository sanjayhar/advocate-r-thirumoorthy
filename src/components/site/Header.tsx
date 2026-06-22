import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Scale } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/practice-areas", label: "Practice Areas" },
  { to: "/notable-cases", label: "Notable Cases" },
  { to: "/articles", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "border-b border-border shadow-soft" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-18 md:h-20 items-center justify-between text-foreground">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-navy text-navy-foreground">
            <Scale className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg tracking-tight text-foreground">R. Thirumoorthy</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Advocate · Madras High Court</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-navy font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm text-muted-foreground hover:text-navy transition"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-navy font-medium hover:opacity-80">
              Admin
            </Link>
          )}
          <Link
            to="/contact"
            className="inline-flex items-center rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground hover:opacity-90 transition"
          >
            Book Consultation
          </Link>
        </nav>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="container-x py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-navy font-medium" }}
                activeOptions={{ exact: item.to === "/" }}
                className="py-3 text-sm text-muted-foreground hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="py-3 text-sm text-navy font-medium">
                Admin
              </Link>
            )}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-medium text-navy-foreground"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
