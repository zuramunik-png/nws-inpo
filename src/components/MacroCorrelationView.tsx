import React, { useState } from 'react';
import { NEWS_CORRELATION_MATRIX } from '../data/economicData';
import { NewsType } from '../types/forex';
import { GitCompare, Coins, DollarSign, ArrowRight, ShieldCheck, Flame, Layers } from 'lucide-react';

export const MacroCorrelationView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<NewsType>('NFP');
  const current = NEWS_CORRELATION_MATRIX[selectedType];

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-emerald-400" />
          <span>Peta Korelasi Makro &amp; Dampak Pasar (Fokus USD &amp; XAU/USD Emas)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pelajari data apa saja yang saling berkaitan dengan NFP, CPI, PPI, dan FOMC, serta bagaimana transmisi dampaknya ke pasar emas dan valuta asing.
        </p>
      </div>

      {/* News Type Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['NFP', 'CPI', 'PPI', 'FOMC'] as NewsType[]).map((t) => {
          const isSelected = selectedType === t;
          return (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{t}</span>
              <span className="text-[10px] font-normal opacity-80">
                {t === 'NFP'
                  ? 'Ketenagakerjaan'
                  : t === 'CPI'
                  ? 'Inflasi Konsumen'
                  : t === 'PPI'
                  ? 'Inflasi Pabrik'
                  : 'Suku Bunga Fed'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Header Block */}
        <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {current.newsType}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {current.fullName}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sumber: {current.sourceAuthority} · Jadwal: {current.releaseSchedule}
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 shrink-0">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Volatilitas Utama: USD &amp; Emas (XAU)</span>
          </div>
        </div>

        {/* Section 1: Data-Data yang Berkaitan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Data-Data Ekonomi yang Berkaitan Erat dengan {current.newsType}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {current.relatedIndicators.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    item.nature === 'LEADING'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                      : item.nature === 'COINCIDENT'
                      ? 'bg-sky-950/40 text-sky-300 border-sky-800/40'
                      : 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                  }`}>
                    {item.nature === 'LEADING'
                      ? 'Indikator Awal (Leading)'
                      : item.nature === 'COINCIDENT'
                      ? 'Bersamaan (Coincident)'
                      : 'Konfirmasi (Confirmatory)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.relationship}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Split Dampak ke USD & XAU/USD (Gold) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Dampak ke USD */}
          <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <DollarSign className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Dampak Mekanisme ke US Dollar (DXY)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {current.usdImpactMechanism}
            </p>
          </div>

          {/* Dampak ke XAU/USD Emas */}
          <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Coins className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Dampak Khusus ke Emas (XAU/USD)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {current.goldImpactMechanism}
            </p>
          </div>
        </div>

        {/* Section 3: Rantai Transmisi Pasar */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Rantai Transmisi Pasar Finansial (Market Chain):
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 flex-wrap">
            <span>{current.marketTransmissionChain}</span>
          </div>
        </div>

        {/* Section 4: Aturan Eksekusi Praktis Trader */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aturan Eksekusi Praktis &amp; Tips Lapangan:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
            {current.tradingRules.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">›</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
