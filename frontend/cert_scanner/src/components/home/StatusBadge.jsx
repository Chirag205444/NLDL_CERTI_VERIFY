import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function StatusBadge({ status, comparison }) {
  let mismatchCount = 0;
  if (comparison && typeof comparison === 'object') {
    mismatchCount = Object.values(comparison).filter((v) => v === false).length;
  }

  let colorClass = '';
  let Icon = null;
  let bgClass = '';
  let label = status;

  if (status === 'Matched' || status === 'Verified') {
    // Matched -> Green
    colorClass = 'text-emerald-700';
    bgClass = 'bg-emerald-50 border-emerald-200';
    Icon = CheckCircle2;
  } else if (status === 'Processing Failed' || status === 'Failed') {
    // Processing Failed -> Red
    colorClass = 'text-rose-700';
    bgClass = 'bg-rose-50 border-rose-200';
    Icon = XCircle;
  } else if (mismatchCount > 1 || status === 'Multiple Mismatches') {
    // Many Mismatches -> Red
    colorClass = 'text-rose-700';
    bgClass = 'bg-rose-50 border-rose-200';
    Icon = AlertTriangle;
    label = status === 'Mismatch' ? 'Multiple Mismatches' : status;
  } else {
    // 1 Mismatch -> Orange
    colorClass = 'text-amber-700';
    bgClass = 'bg-amber-50 border-amber-200';
    Icon = AlertTriangle;
    label = status === 'Mismatch' ? '1 Mismatch' : status;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass} ${colorClass}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </span>
  );
}

