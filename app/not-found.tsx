import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="font-mono text-sm text-accent-cyan mb-2">&gt;_ 404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
        Problem Not Found (TLE / WA)
      </h1>
      <p className="text-text-muted max-w-md mb-8 text-sm sm:text-base">
        The requested resource or page does not exist in the ICPC Grind catalog.
      </p>
      <Link
        href="/"
        className="font-mono text-sm px-4 py-2 rounded border border-border-color bg-bg-secondary text-text-primary hover:border-accent-cyan transition-colors no-underline"
      >
        Return to Problemset
      </Link>
    </div>
  );
}
