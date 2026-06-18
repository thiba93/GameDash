"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { AuthUserResponse } from "@gamedash/contracts";

interface NavProps {
  user?: AuthUserResponse | null;
  onLogout?: () => void;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/progression", label: "Progression" },
  { href: "/store", label: "Store" },
  { href: "/community", label: "Community" },
  { href: "/account", label: "Account" },
];

export function Nav({ user, onLogout }: NavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "staff" || user?.role === "admin";

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <Link href="/dashboard" className="topnav-logo" onClick={() => setMobileOpen(false)}>
          GameDash
        </Link>
        <div className="topnav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`topnav-link${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`topnav-link topnav-link-admin${pathname === "/admin" ? " active" : ""}`}
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div className="topnav-badge">
          <span className="status-dot" />
          <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.profile?.pseudo ?? user?.email}
          </span>
          {user && <span className="tag tag-cyan">{user.role}</span>}
          {onLogout && (
            <button
              className="btn"
              style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
              onClick={onLogout}
            >
              Logout
            </button>
          )}
        </div>
        <button
          className="topnav-hamburger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile slide-down panel */}
      <div className={`topnav-mobile-panel${mobileOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`topnav-mobile-link${pathname === link.href ? " active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className={`topnav-mobile-link topnav-mobile-link-admin${pathname === "/admin" ? " active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </Link>
        )}
        {onLogout && (
          <button
            className="btn"
            style={{ marginTop: "0.75rem", width: "100%", fontSize: "0.85rem" }}
            onClick={() => { setMobileOpen(false); onLogout(); }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
