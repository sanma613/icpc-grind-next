import { MySuggestionsList } from "@/features/suggestions/components/MySuggestionsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Suggestions — ICPC Grind",
  description: "View and track the status of your suggested ICPC benchmark problems.",
};

export default function MySuggestionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <p className="font-mono text-xs text-accent-cyan mb-1">&gt;_ Submissions</p>
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Problem Suggestions</h1>
        <p className="text-sm text-text-muted">
          Review the moderation status of the competitive programming problems you have proposed to the catalog.
        </p>
      </div>

      <MySuggestionsList />
    </div>
  );
}
