import { Input } from "@/features/common/components/Input";

interface ProblemFiltersProps {
  topic: string;
  difficulty: string;
  source: string;
  q: string;
  onChange: (filters: { topic?: string; difficulty?: string; source?: string; q?: string }) => void;
}

export function ProblemFiltersBar({
  topic,
  difficulty,
  source,
  q,
  onChange,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 bg-bg-secondary p-4 rounded-lg border border-border-color">
      {/* Search Input */}
      <div className="flex-1 min-w-50">
        <Input
          id="filter-q"
          type="text"
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Filter by keyword..."
          className="bg-bg-primary py-1.5 text-sm"
        />
      </div>

      {/* Topic Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-topic" className="text-xs text-text-muted font-mono">
          Topic:
        </label>
        <select
          id="filter-topic"
          value={topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className="bg-bg-primary text-text-primary border border-border-color rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent-cyan"
        >
          <option value="all">All Topics</option>
          <option value="graphs">Graphs</option>
          <option value="geometry">Computational Geometry</option>
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-difficulty" className="text-xs text-text-muted font-mono">
          Difficulty:
        </label>
        <select
          id="filter-difficulty"
          value={difficulty}
          onChange={(e) => onChange({ difficulty: e.target.value })}
          className="bg-bg-primary text-text-primary border border-border-color rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent-cyan"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Source Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-source" className="text-xs text-text-muted font-mono">
          Platform:
        </label>
        <select
          id="filter-source"
          value={source}
          onChange={(e) => onChange({ source: e.target.value })}
          className="bg-bg-primary text-text-primary border border-border-color rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent-cyan"
        >
          <option value="all">All Platforms</option>
          <option value="Codeforces">Codeforces</option>
          <option value="CSES">CSES</option>
          <option value="AtCoder">AtCoder</option>
          <option value="Community">Community</option>
        </select>
      </div>
    </div>
  );
}
