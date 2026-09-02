import React from 'react';
import { Download, Search } from 'lucide-react';

export default function FilterBar({ currentFilter, onFilterChange, onExport, searchQuery, onSearchChange }) {
  const filters = [
    'All',
    'Matched',
    'Mismatch',
    'Name Mismatch',
    'Processing Failed'
  ];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <span className="text-sm font-semibold text-slate-700 shrink-0">Filter Results:</span>
        <div className="flex flex-row gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${currentFilter === f
                  ? 'bg-[#0a1128] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name/course..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-48 transition-shadow"
          />
        </div>

        <button
          onClick={onExport}
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-[#0a1128] hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
