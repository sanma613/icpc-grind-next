import React from "react";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemName?: string;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemName = "items",
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1 && totalItems === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-color">
      <div className="text-xs font-mono text-text-muted">
        Page {currentPage} of {Math.max(1, totalPages)}
        {totalItems !== undefined && (
          <span className="ml-1 text-text-primary">({totalItems} {itemName})</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          &larr; Prev
        </Button>

        <span className="text-xs font-mono px-2 text-text-muted">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
