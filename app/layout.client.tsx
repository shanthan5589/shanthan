"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="site-shell">
      <Nav />
      <section className="site-content">{children}</section>
    </main>
  );
}

function Nav() {
  return (
    <header className="site-header">
      <p className="site-name">
        <Link href="/" className="site-title">
          Shanthan
        </Link>
      </p>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <NavLink href="/projects">Projects</NavLink>
          </li>
          <li>
            <NavLink href="/blog">Blog</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className="site-nav-link"
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
