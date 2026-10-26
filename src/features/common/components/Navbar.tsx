"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary border-b border-border-color transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold text-accent-cyan no-underline">
          <span className="text-accent-cyan">&gt;_</span>
          <span>ICPC Grind</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav aria-label="Main Navigation">
            <ul className="flex items-center gap-6 list-none m-0 p-0 text-sm font-medium">
              <li>
                <Link href="/#catalog" className="text-text-muted hover:text-text-primary transition-colors">
                  Problemset
                </Link>
              </li>
              <li>
                <Link href="/#submit" className="text-text-muted hover:text-text-primary transition-colors">
                  Submit Problem
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-muted hover:text-accent-cyan transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            id="menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border border-border-color rounded text-text-muted hover:text-text-primary cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              {menuOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border-color bg-bg-secondary px-4 py-3">
          <ul className="flex flex-col gap-3 list-none m-0 p-0 text-sm">
            <li>
              <Link href="/#catalog" onClick={() => setMenuOpen(false)} className="block py-1 text-text-muted hover:text-text-primary">
                Problemset
              </Link>
            </li>
            <li>
              <Link href="/#submit" onClick={() => setMenuOpen(false)} className="block py-1 text-text-muted hover:text-text-primary">
                Submit Problem
              </Link>
            </li>
            <li>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-1 text-accent-cyan font-medium">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
