import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { formatBnNumber } from '../utils/exportExcel';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs sm:text-sm text-slate-600">
      
      {/* Range Info & Page Size */}
      <div className="flex items-center gap-3">
        <span>
          দেখাচ্ছে <strong className="text-slate-900">{formatBnNumber(startIdx)}</strong> থেকে{' '}
          <strong className="text-slate-900">{formatBnNumber(endIdx)}</strong> (সর্বমোট{' '}
          <strong className="text-emerald-800">{formatBnNumber(totalItems)}</strong> জন সদস্য)
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-slate-500">প্রতি পাতায়:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={25}>২৫ জন</option>
            <option value={50}>৫০ জন</option>
            <option value={100}>১০০ জন</option>
            <option value={570}>সকল সদস্য ({formatBnNumber(totalItems)})</option>
          </select>
        </div>
      </div>

      {/* Page Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
            title="প্রথম পাতা"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
            title="আগের পাতা"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-8 h-8 rounded border border-slate-300 hover:bg-slate-100 transition font-medium"
              >
                ১
              </button>
              {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded font-medium transition ${
                p === currentPage
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'border border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {formatBnNumber(p)}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 rounded border border-slate-300 hover:bg-slate-100 transition font-medium"
              >
                {formatBnNumber(totalPages)}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
            title="পরের পাতা"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
            title="শেষ পাতা"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

        </div>
      )}

    </div>
  );
};
