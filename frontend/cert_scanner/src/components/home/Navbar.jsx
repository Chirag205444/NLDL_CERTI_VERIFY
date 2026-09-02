import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Navbar({ selectedCount }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-blue-600" />
        <span className="text-xl font-bold text-[#0a1128]">CertiVerify</span>
      </div>
      <div className="text-sm font-medium text-slate-500">
        {selectedCount} / 100 files
      </div>
    </nav>
  );
}
