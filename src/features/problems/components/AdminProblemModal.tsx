"use client";

import React, { useState } from "react";
import {
  Problem,
  CreateProblemRequest,
  UpdateProblemRequest,
  Topic,
  Difficulty,
  PlatformSource,
  ProblemFieldErrors,
} from "../domain/problem.types";
import { Input } from "@/features/common/components/Input";
import { Button } from "@/features/common/components/Button";

export interface AdminProblemModalProps {
  isOpen: boolean;
  problemToEdit: Problem | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProblemRequest | UpdateProblemRequest) => Promise<{ success: boolean; errors?: ProblemFieldErrors }>;
}

interface ModalFormProps {
  problemToEdit: Problem | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProblemRequest | UpdateProblemRequest) => Promise<{ success: boolean; errors?: ProblemFieldErrors }>;
}

function AdminProblemFormContent({
  problemToEdit,
  isLoading,
  onClose,
  onSubmit,
}: ModalFormProps) {
  const isEditing = Boolean(problemToEdit);

  const [name, setName] = useState(problemToEdit?.name ?? "");
  const [topic, setTopic] = useState<Topic>(problemToEdit?.topic ?? "graphs");
  const [difficulty, setDifficulty] = useState<Difficulty>(problemToEdit?.difficulty ?? "easy");
  const [source, setSource] = useState<PlatformSource | string>(problemToEdit?.source ?? "Codeforces");
  const [year, setYear] = useState<number>(problemToEdit?.year ?? new Date().getFullYear());
  const [link, setLink] = useState(problemToEdit?.link ?? "");
  const [description, setDescription] = useState(problemToEdit?.description ?? "");
  const [errors, setErrors] = useState<ProblemFieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const clientErrors: ProblemFieldErrors = {};
    if (!name.trim()) clientErrors.name = "Problem name is required";
    if (!link.trim()) clientErrors.link = "Problem URL is required";
    if (!description.trim()) clientErrors.description = "Editorial summary is required";
    if (!year || year < 1970 || year > 2030) clientErrors.year = "Enter a valid year (1970-2030)";

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const payload: CreateProblemRequest = {
      name: name.trim(),
      topic,
      difficulty,
      source,
      year: Number(year),
      link: link.trim(),
      description: description.trim(),
    };

    const res = await onSubmit(payload);
    if (res.success) {
      onClose();
    } else if (res.errors) {
      setErrors(res.errors);
    }
  };

  return (
    <div
      className="w-full max-w-xl bg-bg-secondary border border-border-color rounded-lg p-6 shadow-2xl space-y-4 my-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start border-b border-border-color pb-3">
        <div>
          <h2 id="modal-title" className="text-xl font-bold text-text-primary">
            {isEditing ? `Edit Problem #${problemToEdit?.id}` : "Create New Problem"}
          </h2>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            {isEditing ? "Modify existing benchmark challenge" : "Add a curated ICPC challenge to catalog"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-xl font-mono px-2 cursor-pointer"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>

      {errors.general && (
        <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded text-xs text-accent-red font-mono">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-sm">
        <Input
          label="Problem Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Flight Discount"
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="problem-topic" className="block text-xs font-mono text-text-muted mb-1">
              Topic
            </label>
            <select
              id="problem-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value as Topic)}
              className="w-full bg-card-bg border border-border-color rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              <option value="graphs">Graphs</option>
              <option value="geometry">Geometry</option>
            </select>
          </div>

          <div>
            <label htmlFor="problem-diff" className="block text-xs font-mono text-text-muted mb-1">
              Difficulty
            </label>
            <select
              id="problem-diff"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-card-bg border border-border-color rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="problem-source" className="block text-xs font-mono text-text-muted mb-1">
              Platform
            </label>
            <select
              id="problem-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-card-bg border border-border-color rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              <option value="Codeforces">Codeforces</option>
              <option value="CSES">CSES</option>
              <option value="AtCoder">AtCoder</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <Input
              label="Contest Year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              error={errors.year}
              min={1970}
              max={2030}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Problem URL"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              error={errors.link}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="problem-description" className="block text-xs font-mono text-text-muted mb-1">
            Editorial Summary
          </label>
          <textarea
            id="problem-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the algorithmic problem..."
            className={`w-full bg-card-bg border ${
              errors.description ? "border-accent-red" : "border-border-color focus:border-accent-cyan"
            } rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-colors`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-accent-red font-mono">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-color">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            {isEditing ? "Save Changes" : "Create Problem"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function AdminProblemModal(props: AdminProblemModalProps) {
  if (!props.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <AdminProblemFormContent
        key={props.problemToEdit?.id ?? "create-new"}
        {...props}
      />
    </div>
  );
}
