import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-navy px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-navy-foreground hover:bg-navy/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-navy px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-navy-foreground hover:bg-navy/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    {
      title:
        "Advocate R. Thirumoorthy | Madras High Court Advocate Chennai | Constitutional & Human Rights Lawyer",
    },

    {
      name: "description",
      content:
        "Advocate R. Thirumoorthy is a practicing advocate before the Madras High Court with over 15 years of experience in Constitutional Law, Human Rights Litigation, Public Interest Litigation (PIL), Labour Disputes, Criminal and Civil Matters.",
    },

    {
      name: "keywords",
      content:
        "Advocate Chennai, Madras High Court Advocate, Human Rights Lawyer Chennai, Constitutional Lawyer Chennai, PIL Lawyer Chennai, Labour Lawyer Chennai, Writ Petition Advocate Chennai, Criminal Lawyer Chennai, Civil Lawyer Chennai",
    },

    {
      name: "author",
      content: "Advocate R. Thirumoorthy",
    },

    {
      property: "og:title",
      content:
        "Advocate R. Thirumoorthy | Madras High Court Advocate Chennai",
    },

    {
      property: "og:description",
      content:
        "15+ years of legal practice before the Madras High Court in Constitutional Law, Human Rights, Labour Rights, PILs, Criminal and Civil Litigation.",
    },

    {
      property: "og:type",
      content: "website",
    },

    {
      property: "og:site_name",
      content: "Advocate R. Thirumoorthy",
    },

    {
      property: "og:url",
      content: "https://your-render-app.onrender.com",
    },

    {
      property: "og:image",
      content:
        "https://your-render-app.onrender.com/images/advocate-thirumoorthy.jpg",
    },

    {
      name: "twitter:card",
      content: "summary_large_image",
    },

    {
      name: "twitter:title",
      content:
        "Advocate R. Thirumoorthy | Madras High Court Advocate Chennai",
    },

    {
      name: "twitter:description",
      content:
        "Constitutional Law, Human Rights Litigation, PIL, Labour Disputes and Civil Matters.",
    },

    {
      name: "robots",
      content: "index, follow",
    },
  ],

  links: [
    { rel: "stylesheet", href: appCss },

    { rel: "preconnect", href: "https://fonts.googleapis.com" },

    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },

    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
    },
  ],

  scripts: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Attorney",

        name: "Advocate R. Thirumoorthy",

        url: "https://your-render-app.onrender.com",

        image:
          "https://your-render-app.onrender.com/images/advocate-thirumoorthy.jpg",

        jobTitle: "Advocate",

        description:
          "Advocate practicing before the Madras High Court with more than 15 years of experience in Constitutional Law, Human Rights Litigation, Public Interest Litigation, Labour Rights, Criminal and Civil Matters.",

        areaServed: {
          "@type": "State",
          name: "Tamil Nadu",
        },

        address: {
          "@type": "PostalAddress",
          streetAddress:
          "No. 57, Old Law Chambers, Madras High Court Building, Chennai",
          addressLocality: "Chennai",
          addressRegion: "Tamil Nadu",
          postalCode: "600104",
          addressCountry: "IN",
          telephone: "+91XXXXXXXXXX",
        },

        knowsAbout: [
          "Constitutional Law",
          "Human Rights Litigation",
          "Public Interest Litigation",
          "Labour Law",
          "Civil Litigation",
          "Criminal Law",
          "RTI Matters",
        ],
      }),
    },
  ],
}),
