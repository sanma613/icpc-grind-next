"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): "dark" | "light" {
  const saved = localStorage.getItem("theme");
  return saved === "light" ? "light" : "dark";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      className="font-mono text-xs px-2 py-1 border border-border-color rounded hover:border-accent-cyan transition-colors cursor-pointer text-text-muted hover:text-text-primary"
    >
      [ <span id="theme-status" className="text-accent-cyan">{theme}</span> ]
    </button>
  );
}
