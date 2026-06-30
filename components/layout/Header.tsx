"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { TerrainLink, isTerrainInternal } from "@/components/navigation";
import { SearchDialog } from "@/components/search/SearchDialog";
import { cn } from "@/lib/utils";
import { roomForPath } from "@/lib/rooms";

const primaryNav = [
  { href: "/", label: "Explore" },
  { href: "/inquiry", label: "Read" },
  { href: "/questions", label: "Questions" },
  { href: "/essays", label: "Essays" },
  { href: "/library", label: "Library" },
  { href: "/field-notes", label: "Field Notes" },
];

const secondaryNav = [
  { href: "/structure-beneath-reality", label: "The Structure Beneath Reality" },
  { href: "/observatory", label: "Observatory" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const room = roomForPath(pathname);
  const immersive = isHome || room !== null;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ethereal = immersive && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color] duration-700",
        ethereal
          ? "border-b border-transparent bg-ivory/0"
          : "border-b border-rule bg-ivory/95",
      )}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between sm:h-20">
          <TerrainLink
            href="/"
            className={cn(
              "font-heading text-[1.125rem] tracking-tight transition-colors duration-[600ms]",
              pathname === "/"
                ? "text-forest"
                : "text-charcoal hover:text-forest",
              "sm:text-xl",
            )}
          >
            Living Terrain
          </TerrainLink>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <SearchDialog />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex min-h-11 min-w-11 items-center justify-center type-meta text-charcoal-muted transition-colors duration-[600ms] hover:text-charcoal active:text-charcoal md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen && (
        <div
          className="fixed inset-0 top-[4.5rem] z-50 bg-ivory md:hidden"
          role="dialog"
          aria-label="Navigation"
        >
          <Container className="flex h-full flex-col py-12">
            <nav className="flex flex-col gap-8" aria-label="Primary">
              {primaryNav.map((item) => (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  active={
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                  }
                  onNavigate={() => setMobileOpen(false)}
                >
                  {item.label}
                </MobileLink>
              ))}
            </nav>

            <div className="hairline-fade my-12" />

            <nav className="flex flex-col gap-6" aria-label="Secondary">
              {secondaryNav.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <TerrainLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "font-body text-sm transition-colors duration-[600ms]",
                      active
                        ? "text-forest"
                        : "text-charcoal-muted hover:text-charcoal",
                    )}
                  >
                    {item.label}
                  </TerrainLink>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  const LinkComponent = isTerrainInternal(href) ? TerrainLink : Link;
  return (
    <LinkComponent
      href={href}
      className={cn(
        "font-body text-sm transition-colors duration-[600ms]",
        active
          ? "text-forest"
          : "text-charcoal-muted hover:text-forest",
      )}
    >
      {children}
    </LinkComponent>
  );
}

function MobileLink({
  href,
  children,
  active,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onNavigate: () => void;
}) {
  const LinkComponent = isTerrainInternal(href) ? TerrainLink : Link;
  return (
    <LinkComponent
      href={href}
      onClick={onNavigate}
      className={cn(
        "font-heading text-2xl transition-colors duration-[600ms]",
        active ? "text-forest" : "text-charcoal-muted hover:text-charcoal",
      )}
    >
      {children}
    </LinkComponent>
  );
}
