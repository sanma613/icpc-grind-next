"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminProblemsTable } from "@/features/problems/components/AdminProblemsTable";
import { AdminSuggestionsTable } from "@/features/suggestions/components/AdminSuggestionsTable";

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"problems" | "suggestions">("problems");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center font-mono text-xs text-text-muted animate-pulse">
        &gt; Verifying administrator privileges...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-xs text-accent-cyan mb-1">&gt;_ System Administration</p>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Control Panel</h1>
        <p className="text-sm text-text-muted">
          Logged in as <span className="text-accent-cyan font-mono">{user?.name}</span> ({user?.email}) with role{" "}
          <span className="text-accent-cyan font-mono">[admin]</span>. Manage problem inventory and moderate submissions.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-color flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("problems")}
          className={`py-2.5 px-4 font-mono text-xs border-b-2 transition-colors cursor-pointer ${
            activeTab === "problems"
              ? "border-accent-cyan text-accent-cyan font-semibold"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          [ Problems Catalog ]
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("suggestions")}
          className={`py-2.5 px-4 font-mono text-xs border-b-2 transition-colors cursor-pointer ${
            activeTab === "suggestions"
              ? "border-accent-cyan text-accent-cyan font-semibold"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          [ Community Suggestions ]
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "problems" ? <AdminProblemsTable /> : <AdminSuggestionsTable />}
    </div>
  );
}
