import React from 'react';

export default function SummaryCards({ processed, verified, mismatches, failed }) {
  const cards = [
    { label: 'Processed', value: processed, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Matched', value: verified, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Mismatches', value: mismatches, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Failed', value: failed, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  ];

  return (
    <div className="w-full mt-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border ${card.border} ${card.bg} shadow-sm`}>
            <span className={`text-3xl sm:text-4xl font-bold mb-1 ${card.color}`}>{card.value}</span>
            <span className={`text-sm font-semibold uppercase tracking-wider ${card.color} opacity-80`}>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
