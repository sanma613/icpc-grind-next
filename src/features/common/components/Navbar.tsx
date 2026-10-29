"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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

              {/* Si no es admin, mostrar enlaces de sugerencia y mis sugerencias */}
              {!isAdmin && (
                <li>
                  <Link href="/#submit" className="text-text-muted hover:text-text-primary transition-colors">
                    Submit Problem
                  </Link>
                </li>
              )}

              {isAuthenticated && !isAdmin && (
                <li>
                  <Link href="/mis-sugerencias" className="text-text-muted hover:text-text-primary transition-colors">
                    My Suggestions
                  </Link>
                </li>
              )}

              {/* Panel exclusivo para administradores */}
              {isAdmin && (
                <li>
                  <Link href="/admin" className="text-accent-cyan hover:underline transition-colors font-mono text-xs px-2 py-1 border border-accent-cyan/30 rounded bg-accent-cyan/10">
                    [ Admin Dashboard ]
                  </Link>
                </li>
              )}

              {isAuthenticated ? (
                <li className="flex items-center gap-3">
                  <span className="font-mono text-xs text-text-muted">
                    {user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    type="button"
                    className="text-xs text-accent-red border-accent-red/30 hover:bg-accent-red/10 font-mono py-0.5 px-2"
                  >
                    Logout
                  </Button>
                </li>
              ) : (
                <li>
                  <Link href="/login" className="text-accent-cyan hover:underline transition-colors font-semibold">
                    Login
                  </Link>
                </li>
              )}
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
            {!isAdmin && (
              <li>
                <Link href="/#submit" onClick={() => setMenuOpen(false)} className="block py-1 text-text-muted hover:text-text-primary">
                  Submit Problem
                </Link>
              </li>
            )}
            {isAuthenticated && !isAdmin && (
              <li>
                <Link href="/mis-sugerencias" onClick={() => setMenuOpen(false)} className="block py-1 text-text-muted hover:text-text-primary">
                  My Suggestions
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-1 text-accent-cyan font-mono text-xs">
                  [ Admin Dashboard ]
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <li className="pt-2 border-t border-border-color flex justify-between items-center">
                <span className="font-mono text-xs text-text-muted">{user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  type="button"
                  className="text-xs text-accent-red border-accent-red/30 hover:bg-accent-red/10 font-mono py-0.5 px-2"
                >
                  Logout
                </Button>
              </li>
            ) : (
              <li>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-1 text-accent-cyan font-medium">
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
