"use client";

import React, { useState } from "react";
import { useAdminProblems } from "../hooks/useAdminProblems";
import { Problem, CreateProblemRequest, UpdateProblemRequest } from "../domain/problem.types";
import { Button } from "@/features/common/components/Button";
import { Pagination } from "@/features/common/components/Pagination";
import { StatusMessage } from "@/features/common/components/StatusMessage";
import { ConfirmDialog } from "@/features/common/components/ConfirmDialog";
import { AdminProblemModal } from "./AdminProblemModal";

export function AdminProblemsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    problems,
    pagination,
    loading,
    error,
    actionLoading,
    fetchProblems,
    createProblem,
    updateProblem,
    deleteProblem,
  } = useAdminProblems(currentPage);

  // Estados de modal y confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleOpenCreate = () => {
    setEditingProblem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateProblemRequest | UpdateProblemRequest) => {
    if (editingProblem) {
      const res = await updateProblem(editingProblem.id, data);
      if (res.success) {
        setFeedback({ type: "success", message: `Problem #${editingProblem.id} updated successfully.` });
      }
      return res;
    } else {
      const res = await createProblem(data as CreateProblemRequest);
      if (res.success) {
        setFeedback({ type: "success", message: "New problem created and added to catalog." });
      }
      return res;
    }
  };

  const handleConfirmDelete = async () => {
    if (!problemToDelete) return;
    const ok = await deleteProblem(problemToDelete.id);
    if (ok) {
      setFeedback({ type: "success", message: `Problem "${problemToDelete.name}" was successfully deleted.` });
    }
    setProblemToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProblems(page);
  };

  return (
    <div className="space-y-4">
      {/* Barra superior con botón nuevo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border-color">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Catalog Management</h2>
          <p className="text-xs text-text-muted font-mono">
            Create, update, or remove contest benchmark problems.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          className="font-mono"
        >
          + Add Problem
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded text-xs font-mono border flex justify-between items-center ${
            feedback.type === "success"
              ? "bg-accent-green/10 border-accent-green/30 text-accent-green"
              : "bg-accent-red/10 border-accent-red/30 text-accent-red"
          }`}
        >
          <span>{feedback.message}</span>
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
          &gt; Loading problem catalog...
        </div>
      )}

      {!loading && error && (
        <StatusMessage
          type="error"
          title="Error loading problems"
          message={error}
          onRetry={() => fetchProblems(currentPage)}
        />
      )}

      {!loading && !error && problems.length === 0 && (
        <StatusMessage
          type="info"
          title="No problems found"
          message="The catalog is empty. Click '+ Add Problem' to insert the first challenge."
        />
      )}

      {!loading && !error && problems.length > 0 && (
        <>
          <div className="overflow-x-auto border border-border-color rounded-lg bg-bg-secondary">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-primary text-xs font-mono uppercase text-text-muted border-b border-border-color">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Topic / Diff</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color font-mono text-xs">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-card/50 transition-colors">
                    <td className="py-3 px-4 text-text-muted">{p.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text-primary text-sm font-sans">{p.name}</p>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-cyan hover:underline text-xs"
                      >
                        {p.link.length > 35 ? `${p.link.slice(0, 35)}...` : p.link} ↗
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{p.topic}</span>
                      <span className="text-text-muted"> • </span>
                      <span className="capitalize">{p.difficulty}</span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {p.source} ({p.year})
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEdit(p)}
                        className="text-xs py-1 px-2.5"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => setProblemToDelete(p)}
                        className="text-xs py-1 px-2.5"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemName="catalog items"
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </>
      )}

      {/* Modal de Crear / Editar */}
      <AdminProblemModal
        isOpen={isModalOpen}
        problemToEdit={editingProblem}
        isLoading={actionLoading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Modal de confirmación antes de borrar (+1 punto bonus) */}
      <ConfirmDialog
        isOpen={Boolean(problemToDelete)}
        title="Confirm Problem Deletion"
        message={`Are you sure you want to permanently delete problem "${problemToDelete?.name}"? Competitors will no longer see this challenge in the practice backlog.`}
        confirmLabel="Delete Problem"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProblemToDelete(null)}
      />
    </div>
  );
}
