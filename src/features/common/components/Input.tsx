import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono text-text-muted mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-card-bg border ${
            error ? "border-accent-red" : "border-border-color focus:border-accent-cyan"
          } rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 ${
            error ? "focus:ring-accent-red" : "focus:ring-accent-cyan"
          } transition-colors ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-accent-red font-mono">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-text-muted font-mono">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
