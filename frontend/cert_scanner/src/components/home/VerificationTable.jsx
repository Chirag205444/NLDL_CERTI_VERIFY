import React from 'react';
import StatusBadge from './StatusBadge';

export default function VerificationTable({ results }) {
  if (results.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 bg-slate-50 border border-slate-200 rounded-xl mt-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No verification results yet</h3>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          Upload certificates and start verification to see results here.
        </p>
      </div>
    );
  }

  const renderField = (visualValue, qrValue) => {
    const isMismatch = visualValue !== qrValue;
    return (
      <td className={`px-4 py-3 text-sm border-b border-slate-100 ${isMismatch ? 'bg-amber-50/50' : ''}`}>
        <span className={isMismatch ? 'text-amber-700 font-medium' : 'text-slate-700'}>
          {visualValue}
        </span>
      </td>
    );
  };

  const renderQRField = (visualValue, qrValue) => {
    const isMismatch = visualValue !== qrValue;
    return (
      <td className={`px-4 py-3 text-sm border-b border-slate-100 ${isMismatch ? 'bg-amber-50/50' : ''}`}>
        <span className={isMismatch ? 'text-amber-700 font-medium' : 'text-slate-700'}>
          {qrValue}
        </span>
      </td>
    );
  };

  const openCertificate = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    window.open(url, '_blank');

    // Clean up the temporary URL after a reasonable delay.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr>
            <th rowSpan={2} className="px-4 py-3 bg-slate-50 border-b border-r border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">
              Certificate
            </th>
            <th colSpan={3} className="px-4 py-2 bg-blue-50/50 border-b border-r border-slate-200 text-xs font-bold text-blue-800 uppercase tracking-wider text-center">
              Visual Result
            </th>
            <th colSpan={3} className="px-4 py-2 bg-slate-50 border-b border-r border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
              QR Result
            </th>
            <th rowSpan={2} className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
              Status
            </th>
          </tr>
          <tr>
            {/* Visual */}
            <th className="px-4 py-2 bg-blue-50/30 border-b border-slate-200 text-xs font-medium text-slate-600">Name</th>
            <th className="px-4 py-2 bg-blue-50/30 border-b border-slate-200 text-xs font-medium text-slate-600">Course</th>
            <th className="px-4 py-2 bg-blue-50/30 border-b border-r border-slate-200 text-xs font-medium text-slate-600">Completed On</th>

            {/* QR */}
            <th className="px-4 py-2 bg-slate-50/50 border-b border-slate-200 text-xs font-medium text-slate-600">Name</th>
            <th className="px-4 py-2 bg-slate-50/50 border-b border-slate-200 text-xs font-medium text-slate-600">Course</th>
            <th className="px-4 py-2 bg-slate-50/50 border-b border-r border-slate-200 text-xs font-medium text-slate-600">Completed On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((res, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-[#0a1128] border-r border-slate-100 truncate max-w-[12rem]" title={res.filename}>
                {res.fileObject ? (
                  <button
                    type="button"
                    onClick={() => openCertificate(res.fileObject)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate block max-w-full text-left font-medium focus:outline-none"
                    title={`Open ${res.filename}`}
                  >
                    {res.filename}
                  </button>
                ) : (
                  <span>{res.filename}</span>
                )}
              </td>

              {/* Visual Result Columns */}
              {renderField(res.visual.name, res.qr.name)}
              {renderField(res.visual.course, res.qr.course)}
              <td className={`px-4 py-3 text-sm border-b border-r border-slate-100 ${res.visual.completedOn !== res.qr.completedOn ? 'bg-amber-50/50' : ''}`}>
                <span className={res.visual.completedOn !== res.qr.completedOn ? 'text-amber-700 font-medium' : 'text-slate-700'}>
                  {res.visual.completedOn}
                </span>
              </td>

              {/* QR Result Columns */}
              {renderQRField(res.visual.name, res.qr.name)}
              {renderQRField(res.visual.course, res.qr.course)}
              <td className={`px-4 py-3 text-sm border-b border-r border-slate-100 ${res.visual.completedOn !== res.qr.completedOn ? 'bg-amber-50/50' : ''}`}>
                <span className={res.visual.completedOn !== res.qr.completedOn ? 'text-amber-700 font-medium' : 'text-slate-700'}>
                  {res.qr.completedOn}
                </span>
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={res.status} comparison={res.comparison} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
