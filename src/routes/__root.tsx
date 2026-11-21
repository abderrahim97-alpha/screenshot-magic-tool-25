import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { lazy, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ArrowRight } from "lucide-react";

import { FloatingContact, MobileDock } from "@/components/site/FloatingActions";
import { Header } from "@/components/site/Header";
import { LouseOnStrand, ScrollingLouse } from "@/components/site/Louse";
import { Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/assets";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <section className="relative isolate flex min-h-[75vh] items-center overflow-hidden py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 size-[30rem] rounded-full bg-accent blur-3xl" />
        <div className="absolute right-0 bottom-0 size-[26rem] rounded-full bg-mint-soft blur-3xl" />
      </div>
      <div className="section-x grid items-center gap-10 md:grid-cols-[1fr_0.9fr]">
        <div className="text-center md:text-left">
          <p className="font-display text-[clamp(5rem,18vw,9rem)] leading-none font-extrabold tracking-[-0.06em] text-primary/15">
            404
          </p>
          <h1 className="mt-2 text-display-lg text-navy">
            Oups, cette page s'est <Highlight tone="red">échappée</Highlight>
          </h1>
          <div className="mt-8 flex justify-center md:justify-start">
            <Button asChild variant="cta" size="lg">
              <Link to="/">
                Retour à l'accueil
                <ArrowRight data-arrow />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-br from-mint-soft to-accent">
          {images.illustration404 ? (
            <img
              src={images.illustration404}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <LouseOnStrand className="h-[80%] w-auto" />
          )}
        </div>
      </div>
    </section>
  );
}

function ErrorScreen({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const ErrorComponent = lazy(() => Promise.resolve({ default: ErrorScreen }));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Poux Chrono 31 — Traitement des poux à domicile à Toulouse" },
      {
        name: "description",
        content:
          "Traitement des poux à domicile à Toulouse et en Haute-Garonne. Rapide, sûr, efficace : intervention souvent le jour même, produits naturels.",
      },
      { name: "author", content: "Poux Chrono 31" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Nunito+Sans:wght@400;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col pb-24 sm:pb-0">
        <Header />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <FloatingContact />
        <ScrollingLouse />
        <MobileDock />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
