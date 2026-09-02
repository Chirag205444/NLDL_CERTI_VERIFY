import React from 'react';
import { CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

export default function ProcessingStatus({ 
  total, 
  completed, 
  currentFilename, 
  isScanning,
  showResults,
  onToggleResults
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const isComplete = !isScanning && completed === total;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-8 px-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          {isComplete ? (
            <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
          ) : (
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
          )}
          <h2 className="text-xl font-bold text-[#0a1128] mb-1">
            {isComplete ? 'Verification Complete' : 'Verifying Certificates'}
          </h2>
          <p className="text-sm text-slate-500 text-center">
            {isComplete 
              ? `✓ All ${total} certificates have been processed.` 
              : 'Processing certificates one by one...'}
          </p>
          {!isComplete && (
            <p className="text-sm text-slate-500 font-medium mt-2">
              {completed} / {total} certificates processed
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Current File Info */}
        {!isComplete && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Currently Processing</p>
            <p className="text-sm font-semibold text-[#0a1128] truncate">{currentFilename || 'Initializing...'}</p>
          </div>
        )}

        {/* View Results Button */}
        <div className="flex justify-center">
          <button
            onClick={onToggleResults}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-colors shadow-sm"
          >
            {showResults ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Results
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                View Results
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
