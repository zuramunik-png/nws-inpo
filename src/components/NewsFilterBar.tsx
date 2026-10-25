import React from 'react';
import { NewsType } from '../types/forex';

interface NewsFilterBarProps {
  selectedType: NewsType | 'ALL';
  onSelectType: (type: NewsType | 'ALL') => void;
  counts: Record<string, number>;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  selectedType,
  onSelectType,
  counts,
}) => {
  const options: { id: NewsType | 'ALL'; label: string; fullTitle: string }[] = [
    { id: 'ALL', label: 'Semua News', fullTitle: '4 Berita Utama AS' },
    { id: 'NFP', label: 'NFP', fullTitle: 'Non-Farm Payrolls & Tenaga Kerja' },
    { id: 'CPI', label: 'CPI', fullTitle: 'Consumer Price Index (Inflasi Konsumen)' },
    { id: 'PPI', label: 'PPI', fullTitle: 'Producer Price Index (Inflasi Produsen)' },
    { id: 'FOMC', label: 'FOMC', fullTitle: 'Suku Bunga & Kebijakan The Fed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Pemantau Rilis Berita Ekonomi AS
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Fokus pada 4 berita berdampak paling tinggi (High Impact) terhadap US Dollar & Forex Pairs
        </p>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
        {options.map((opt) => {
          const isActive = selectedType === opt.id;
          const count = opt.id === 'ALL' ? counts.ALL : counts[opt.id] || 0;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
