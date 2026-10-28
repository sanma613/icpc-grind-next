import React from "react";
import { Button } from "./Button";

export interface StatusMessageProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message?: string;
  children?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type = "info",
  title,
  message,
  children,
  onRetry,
  className = "",
}) => {
  const styles = {
    info: "border-border-color bg-card-bg text-text-muted",
    success: "border-accent-green/30 bg-accent-green/10 text-accent-green",
    warning: "border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow",
    error: "border-accent-red/30 bg-accent-red/10 text-accent-red",
  };

  return (
    <div className={`p-6 border rounded-lg text-center font-mono text-sm ${styles[type]} ${className}`}>
      {title && <p className="font-bold mb-1">{title}</p>}
      {message && <p className="text-xs opacity-90">{message}</p>}
      {children}
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs font-mono"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
