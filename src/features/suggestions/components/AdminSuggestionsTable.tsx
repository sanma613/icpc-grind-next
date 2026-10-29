"use client";

import React, { useState } from "react";
import { useAdminSuggestions } from "../hooks/useAdminSuggestions";
import { Suggestion, SuggestionStatus } from "../domain/suggestion.types";
import { Button } from "@/features/common/components/Button";
import { Pagination } from "@/features/common/components/Pagination";
import { StatusMessage } from "@/features/common/components/StatusMessage";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending Review",
    className: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
  },
  approved: {
    label: "Approved & Added",
    className: "bg-accent-green/10 text-accent-green border-accent-green/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-accent-red/10 text-accent-red border-accent-red/30",
  },
};

export function AdminSuggestionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    suggestions,
    pagination,
    loading,
    error,
    actionLoading,
    statusFilter,
    setStatusFilter,
    fetchSuggestions,
    updateStatus,
  } = useAdminSuggestions(currentPage);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: SuggestionStatus) => {
    const ok = await updateStatus(id, newStatus);
    if (ok) {
      setFeedback(`Suggestion marked as ${newStatus}.`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSuggestions(page);
  };

  return (
    <div className="space-y-4">
      {/* Cabecera y Filtro de estado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border-color">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Suggestions Moderation</h2>
          <p className="text-xs text-text-muted font-mono">
            Review community submissions and approve them into the catalog.
          </p>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-status" className="text-xs text-text-muted font-mono">
            Status:
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
            className="bg-card-bg border border-border-color rounded px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-cyan"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded text-xs font-mono border bg-accent-green/10 border-accent-green/30 text-accent-green flex justify-between items-center">
          <span>✓ {feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer ml-2"
          >
            ×
          </button>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-text-muted font-mono animate-pulse">
          &gt; Loading suggestions queue...
        </div>
      )}

      {!loading && error && (
        <StatusMessage
          type="error"
          title="Error loading suggestions"
          message={error}
          onRetry={() => fetchSuggestions(currentPage)}
        />
      )}

      {!loading && !error && suggestions.length === 0 && (
        <StatusMessage
          type="info"
          title="No suggestions found"
          message={
            statusFilter !== "all"
              ? `There are no submissions currently with status '${statusFilter}'.`
              : "No community submissions have been posted yet."
          }
        />
      )}

      {!loading && !error && suggestions.length > 0 && (
        <>
          <div className="overflow-x-auto border border-border-color rounded-lg bg-bg-secondary">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-primary text-xs font-mono uppercase text-text-muted border-b border-border-color">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Topic / Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color font-mono text-xs">
                {suggestions.map((sugg: Suggestion) => {
                  const badge = STATUS_BADGES[sugg.status] || STATUS_BADGES.pending;
                  return (
                    <tr key={sugg.id} className="hover:bg-bg-card/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-text-primary text-sm font-sans">{sugg.name}</p>
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5 font-sans">
                          {sugg.description}
                        </p>
                        <a
                          href={sugg.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-cyan hover:underline text-xs"
                        >
                          {sugg.link.length > 35 ? `${sugg.link.slice(0, 35)}...` : sugg.link} ↗
                        </a>
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        <p className="text-text-primary font-sans font-medium">{sugg.userName || "Competitor"}</p>
                        <p className="text-xs">{sugg.userEmail || sugg.userId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{sugg.topic}</span>
                        <span className="text-text-muted"> • </span>
                        <span className="capitalize">{sugg.difficulty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {sugg.status !== "approved" && (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleStatusChange(sugg.id, "approved")}
                            className="text-xs py-1 px-2.5 bg-accent-green hover:bg-accent-green/90 text-black"
                          >
                            Approve
                          </Button>
                        )}
                        {sugg.status !== "rejected" && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleStatusChange(sugg.id, "rejected")}
                            className="text-xs py-1 px-2.5 text-accent-red border-accent-red/30 hover:bg-accent-red/10"
                          >
                            Reject
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemName="suggestions"
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </>
      )}
    </div>
  );
}
