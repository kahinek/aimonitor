"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/compare", label: "Compare" },
  { href: "/method", label: "How it works" },
  { href: "/sources", label: "Sources" },
] as const;

function currentHref(path: string): string {
  if (path.startsWith("/compare")) return "/compare";
  if (path.startsWith("/method")) return "/method";
  if (path.startsWith("/sources")) return "/sources";
  return "/";
}

export function SiteHeader() {
  const path = usePathname();
  const current = currentHref(path);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="mast">
      <div className="wrap mast-inner">
        <Link className="logo" href="/">
          <Image
            src="/inflect-wordmark.svg"
            alt="Inflect"
            width={489}
            height={162}
            priority
            unoptimized
            className="logo-img"
          />
        </Link>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {open ? "Close" : "Menu"}
        </button>
        <nav className={open ? "nav open" : "nav"} id="site-nav" aria-label="Main">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>
          An independent prototype showing what the UK can and cannot yet measure about AI use and
          its impact. It is not an official statistic and is not affiliated with any government body.
        </p>
        <p>
          Figures compiled <time dateTime="2026-10-20">20 October 2026</time> from the public sources
          listed on the <Link href="/sources">sources page</Link>. Some are derived or reported second-hand,
          as noted against each one; check the original before reuse.
        </p>
      </div>
    </footer>
  );
}
