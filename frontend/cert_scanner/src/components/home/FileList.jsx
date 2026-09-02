import React, { useState } from 'react';
import { FileText, X, Search } from 'lucide-react';

export default function FileList({ files, onRemoveFile }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (files.length === 0) return null;

  const filteredFiles = files
    .map((file, index) => ({ file, originalIndex: index }))
    .filter(({ file }) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-[#0a1128]">Selected Certificates</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48 transition-shadow"
            />
          </div>
          
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full whitespace-nowrap">
            {files.length} / 100
          </span>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto shadow-sm">
        <div className="flex flex-col divide-y divide-slate-100">
          {filteredFiles.map(({ file, originalIndex }) => (
            <div key={originalIndex} className="flex items-center justify-between p-3 sm:px-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={() => onRemoveFile(originalIndex)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {filteredFiles.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No files match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
