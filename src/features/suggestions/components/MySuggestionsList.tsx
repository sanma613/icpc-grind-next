"use client";

import { useMySuggestions } from "../hooks/useMySuggestions";
import Link from "next/link";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Under Review",
    className: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
  },
  approved: {
    label: "Approved & Added",
    className: "bg-accent-green/10 text-accent-green border-accent-green/30",
  },
  rejected: {
    label: "Declined",
    className: "bg-accent-red/10 text-accent-red border-accent-red/30",
  },
};

export function MySuggestionsList() {
  const { suggestions, pagination, loading, error, refetch } = useMySuggestions(1);

  if (loading) {
    return (
      <div className="py-16 text-center text-text-muted font-mono animate-pulse">
        &gt; Loading your submitted suggestions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-accent-red rounded-lg text-center bg-bg-secondary">
        <p className="text-accent-red font-semibold mb-2">Error loading submissions</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-1.5 text-xs font-mono rounded border border-border-color hover:border-accent-cyan cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-12 border border-dashed border-border-color rounded-lg text-center bg-bg-secondary">
        <p className="text-lg font-semibold text-text-primary mb-2">No problem suggestions yet</p>
        <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
          You haven&apos;t suggested any contest benchmark problems yet. Contribute one to help other competitors practice!
        </p>
        <Link
          href="/#submit"
          className="inline-block bg-accent-cyan text-black text-xs font-semibold px-4 py-2 rounded font-mono hover:opacity-90"
        >
          Suggest your first problem
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border-color rounded-lg bg-bg-secondary">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-primary text-xs font-mono uppercase text-text-muted border-b border-border-color">
            <tr>
              <th className="py-3 px-4">Problem</th>
              <th className="py-3 px-4">Topic / Rating</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {suggestions.map((sugg) => {
              const badge = STATUS_BADGES[sugg.status] || STATUS_BADGES.pending;
              const formattedDate = new Date(sugg.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={sugg.id} className="hover:bg-bg-card/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    <p className="font-semibold">{sugg.name}</p>
                    <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{sugg.description}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs">
                    <span className="capitalize">{sugg.topic}</span>
                    <span className="text-text-muted"> • </span>
                    <span className="capitalize">{sugg.difficulty}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-text-muted">
                    {formattedDate}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={sugg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan text-xs font-mono hover:underline inline-flex items-center gap-1"
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-mono text-text-muted text-right">
        Total submissions: {pagination.total}
      </p>
    </div>
  );
}
