import Image from "next/image";
import { Problem } from "../domain/problem.types";

const PLATFORM_ICONS: Record<string, string> = {
  Codeforces: "/icons/codeforces.svg",
  CSES: "/icons/cses.png",
  AtCoder: "/icons/atcoder.svg",
  Community: "/icons/community.svg",
};

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const iconSrc = PLATFORM_ICONS[problem.source] || PLATFORM_ICONS.Community;

  return (
    <article className="bg-bg-card border border-border-color rounded-lg p-6 flex flex-col justify-between h-full transition-all hover:-translate-y-1 hover:border-accent-cyan shadow-sm">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            {problem.name}
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded capitalize font-mono text-text-muted bg-bg-primary border border-border-color">
            {problem.topic}
          </span>
          <span className="text-xs px-2 py-1 rounded capitalize font-mono text-text-muted bg-bg-primary border border-border-color">
            {problem.difficulty}
          </span>
        </div>

        <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
          {problem.description}
        </p>
      </div>

      <div className="flex justify-between items-center border-t border-border-color pt-4 text-xs text-text-muted">
        <span className="inline-flex items-center gap-2">
          <Image
            src={iconSrc}
            alt={problem.source}
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
          <span>{problem.source} ({problem.year})</span>
        </span>
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan hover:underline font-medium inline-flex items-center gap-1"
        >
          Solve ↗
        </a>
      </div>
    </article>
  );
}
