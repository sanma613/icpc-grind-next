"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCreateSuggestion } from "../hooks/useCreateSuggestion";
import { Topic, Difficulty } from "@/features/problems/domain/problem.types";
import { SuggestionFieldErrors } from "../domain/suggestion.types";
import { Button } from "@/features/common/components/Button";
import { Input } from "@/features/common/components/Input";
import Link from "next/link";

export function SuggestProblemForm() {
  const { isAuthenticated } = useAuth();
  const { createSuggestion, submitting, errors: apiErrors } = useCreateSuggestion();

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [topic, setTopic] = useState<Topic | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [description, setDescription] = useState("");

  const [localErrors, setLocalErrors] = useState<SuggestionFieldErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errors = { ...apiErrors, ...localErrors };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const newErrors: SuggestionFieldErrors = {};

    if (!name.trim()) newErrors.name = "Problem Name is required";
    if (!link.trim()) {
      newErrors.link = "Problem URL is required";
    } else if (!/^https?:\/\/.+/.test(link.trim())) {
      newErrors.link = "Please enter a valid URL starting with http:// or https://";
    }

    if (!topic) newErrors.topic = "Please select a topic";
    if (!difficulty) newErrors.difficulty = "Please select a difficulty rating";

    if (!description.trim()) {
      newErrors.description = "Editorial summary is required";
    } else if (description.trim().length < 20) {
      newErrors.description = "Editorial summary must be at least 20 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      return;
    }

    setLocalErrors({});

    const result = await createSuggestion({
      name: name.trim(),
      link: link.trim(),
      topic: topic as Topic,
      difficulty: difficulty as Difficulty,
      description: description.trim(),
    });

    if (result) {
      setSuccessMessage("Problem suggestion added to review queue successfully!");
      setName("");
      setLink("");
      setTopic("");
      setDifficulty("");
      setDescription("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-bg-secondary border border-border-color rounded-lg p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-1">Suggest a Problem</h2>
        <p className="text-sm text-text-muted">
          Found a benchmark problem during a contest? Add it to the practice backlog.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="p-6 border border-dashed border-border-color rounded-lg text-center bg-bg-primary">
          <p className="text-text-primary font-medium mb-2">
            Authentication Required
          </p>
          <p className="text-xs text-text-muted mb-4 max-w-sm mx-auto">
            You must be logged in to contribute problem suggestions to the ICPC Grind catalog.
          </p>
          <Link
            href="/login"
            className="inline-block bg-accent-cyan text-black text-xs font-semibold px-4 py-2 rounded font-mono hover:opacity-90 transition-opacity"
          >
            Sign in to suggest
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded text-xs text-accent-red">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-accent-green/10 border border-accent-green/30 rounded text-xs text-accent-green font-medium">
              ✓ {successMessage}
            </div>
          )}

          {/* Problem Name */}
          <Input
            label="Problem Name"
            id="problem-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Flight Discount or Convex Hull"
            error={errors.name}
            aria-required="true"
          />

          {/* Problem URL */}
          <Input
            label="Problem URL"
            id="problem-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://codeforces.com/problemset/problem/..."
            error={errors.link}
            aria-required="true"
          />

          {/* Topic & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-topic" className="block text-xs font-mono font-medium text-text-muted mb-1">
                Topic
              </label>
              <select
                id="form-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                aria-required="true"
                aria-describedby={errors.topic ? "error-topic" : undefined}
                className={`w-full bg-bg-primary text-text-primary border ${
                  errors.topic ? "border-accent-red" : "border-border-color"
                } rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan`}
              >
                <option value="">Select topic...</option>
                <option value="graphs">Graphs</option>
                <option value="geometry">Computational Geometry</option>
              </select>
              {errors.topic && (
                <p id="error-topic" className="mt-1 text-xs text-accent-red font-medium">
                  {errors.topic}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="form-difficulty" className="block text-xs font-mono font-medium text-text-muted mb-1">
                Difficulty Rating
              </label>
              <select
                id="form-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                aria-required="true"
                aria-describedby={errors.difficulty ? "error-difficulty" : undefined}
                className={`w-full bg-bg-primary text-text-primary border ${
                  errors.difficulty ? "border-accent-red" : "border-border-color"
                } rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan`}
              >
                <option value="">Select level...</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p id="error-difficulty" className="mt-1 text-xs text-accent-red font-medium">
                  {errors.difficulty}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="problem-desc" className="block text-xs font-mono font-medium text-text-muted mb-1">
              Editorial Summary (min 20 characters)
            </label>
            <textarea
              id="problem-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the key algorithmic technique (e.g. Graham Scan, DSU, Dinic)"
              aria-required="true"
              aria-describedby={errors.description ? "error-desc" : undefined}
              className={`w-full bg-bg-primary text-text-primary border ${
                errors.description ? "border-accent-red" : "border-border-color"
              } rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan`}
            />
            {errors.description && (
              <p id="error-desc" className="mt-1 text-xs text-accent-red font-medium">
                {errors.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={submitting}
            className="w-full font-mono text-sm"
          >
            Submit Problem
          </Button>
        </form>
      )}
    </div>
  );
}
