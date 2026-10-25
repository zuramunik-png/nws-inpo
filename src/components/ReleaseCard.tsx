import React, { useState } from 'react';
import { EconomicRelease, BiasResult } from '../types/forex';
import { evaluateNewsBias } from '../utils/forexRules';
import { ArrowUpRight, ArrowDownRight, ArrowRight, ChevronDown, ChevronUp, SlidersHorizontal, Info } from 'lucide-react';

interface ReleaseCardProps {
  release: EconomicRelease;
  onOpenInSimulator: (release: EconomicRelease) => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release, onOpenInSimulator }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isUpcoming = release.status === 'UPCOMING' || release.components.every(c => !c.actual || c.actual === '0' || c.actual === '-');

  // Evaluate the real bias for this release
  const biasResult: BiasResult = evaluateNewsBias({
    type: release.type,
    components: release.components,
    fomcTone: release.type === 'FOMC' && release.components[0]?.actual === '5.00%' ? 'DOVISH' : 'NEUTRAL',
    rateChangeBps: release.type === 'FOMC' ? -50 : 0
  });

  const isBullish = biasResult.usdDirection === 'BULLISH';
  const isBearish = biasResult.usdDirection === 'BEARISH';
  const isMixed = biasResult.strength === 'MIXED';

  const badgeColor = isUpcoming
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
    : isBullish
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isBearish
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  const directionText = isUpcoming
    ? 'MENUNGGU RILIS (UPCOMING)'
    : isBullish
    ? 'BULLISH USD'
    : isBearish
    ? 'BEARISH USD'
    : 'MIXED / VOLATILE';

  return (
    <article className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 tracking-wide uppercase">
              {release.type}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{release.period}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-300">{release.timeWIB}</span>
          </div>

          {/* Direction Bias Badge */}
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold border tracking-wider flex items-center gap-1.5 ${badgeColor}`}>
            {isUpcoming ? (
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            ) : isBullish ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : isBearish ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            <span>{directionText}</span>
            {!isUpcoming && (
              <span className="text-[10px] font-normal opacity-80">
                ({biasResult.strength})
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-white mt-2">
          {release.title}
        </h3>
      </div>

      {/* Comparison Grid: Actual vs Forecast vs Previous */}
      <div className="p-5 bg-slate-900/40">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center justify-between">
          <span>Komparasi Data Ekonomi AS</span>
          <span className="text-[11px] text-slate-500">Perbandingan vs Forecast & Bulan Sebelumnya</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-medium">
                <th className="pb-2 font-normal">Indikator</th>
                <th className="pb-2 text-right font-normal">Actual</th>
                <th className="pb-2 text-right font-normal">Forecast</th>
                <th className="pb-2 text-right font-normal">Previous</th>
                <th className="pb-2 text-right font-normal">Deviasi vs Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {release.components.map((comp, idx) => {
                const actNum = typeof comp.actual === 'number' ? comp.actual : parseFloat(comp.actual);
                const fcastNum = typeof comp.forecast === 'number' ? comp.forecast : parseFloat(comp.forecast);
                const prevNum = typeof comp.previous === 'number' ? comp.previous : parseFloat(comp.previous);

                const isHigher = actNum > fcastNum;
                const isLower = actNum < fcastNum;
                const isBetterForUsd = comp.betterDirection === 'HIGHER_BETTER_FOR_USD' ? isHigher : isLower;
                const isWorseForUsd = comp.betterDirection === 'HIGHER_BETTER_FOR_USD' ? isLower : isHigher;

                const deviationColor = isBetterForUsd
                  ? 'text-emerald-400 font-semibold'
                  : isWorseForUsd
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-300';

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 text-slate-300 pr-3">
                      <div className="font-medium text-slate-200">{comp.name}</div>
                      {comp.revisedPrevious && (
                        <div className="text-[11px] text-amber-400/80 mt-0.5">
                          {comp.revisedPrevious}
                        </div>
                      )}
                    </td>
                    <td className={`py-2.5 text-right font-mono tabular-nums text-sm font-bold ${deviationColor}`}>
                      {comp.actual}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-400">
                      {comp.forecast}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-400">
                      {comp.previous}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        isBetterForUsd
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : isWorseForUsd
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isHigher ? '+' : ''}{!isNaN(actNum) && !isNaN(fcastNum) ? (actNum - fcastNum).toFixed(1) : '0'} {comp.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reason Box ("Alasan Penentu Arah Bias") */}
      <div className="p-5 border-t border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isUpcoming ? 'Skenario Otomatis Penentu Arah (Pra-Rilis)' : 'Alasan Singkat & Logika Makro'}
            </div>
            
            {isUpcoming ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  Data belum dirilis (Konsensus Forecast: <span className="text-emerald-400 font-mono font-bold">{release.components[0]?.forecast || '-'}</span>, Bulan Sebelumnya: <span className="text-slate-300 font-mono">{release.components[0]?.previous || '-'}</span>).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/25 text-emerald-300">
                    <span className="font-bold block">Jika Actual &gt; Forecast:</span>
                    <span>BULLISH USD → EUR/USD &amp; Emas (XAU) Bearish, USD/JPY Bullish.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/25 text-rose-300">
                    <span className="font-bold block">Jika Actual &lt; Forecast:</span>
                    <span>BEARISH USD → EUR/USD &amp; Emas (XAU) Bullish, USD/JPY Bearish.</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {biasResult.headlineReason}
                </p>

                {/* Detailed bullet points */}
                <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
                  {biasResult.detailedPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Pair Reaction Matrix Preview */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Arah Pasangan Mata Uang Utama (Forex Pairs & Emas)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {biasResult.pairsImpact.map((item) => {
              const isBuy = item.bias === 'BUY';
              const isSell = item.bias === 'SELL';
              const pairColor = isBuy
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                : isSell
                ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400';

              return (
                <div
                  key={item.pair}
                  className={`p-2.5 rounded-lg border text-center ${pairColor}`}
                >
                  <div className="text-xs font-bold">{item.pair}</div>
                  <div className="text-[11px] font-semibold mt-0.5 uppercase tracking-wide">
                    {item.bias} ({item.directionText})
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    ~{item.expectedPips}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Trading Playbook & Correlation Box */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3.5 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {/* Correlation Data Section if provided */}
            {release.correlation && (
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide">
                    Korelasi Data Terkait {release.type}:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Transmisi Pasar</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {release.correlation.relatedIndicators.map((ind, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-mono border border-slate-700"
                    >
                      {ind}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="font-semibold text-emerald-300 block">Dampak ke US Dollar:</span>
                    <span className="text-slate-300 leading-relaxed">{release.correlation.usdImpactSummary}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="font-semibold text-amber-300 block">Dampak Khusus ke XAU/USD (Emas):</span>
                    <span className="text-slate-300 leading-relaxed">{release.correlation.goldImpactSummary}</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="font-bold text-slate-300">Rantai Pasar:</span>
                  <span className="text-emerald-400 font-mono">{release.correlation.marketChain}</span>
                </div>
              </div>
            )}

            <div>
              <span className="font-semibold text-slate-300">Mekanisme Penggerak Pasar: </span>
              <span className="text-slate-400">{biasResult.marketMechanics}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-300">Rekomendasi Eksekusi Trading: </span>
              <span className="text-amber-300/90">{biasResult.tradingRecommendation}</span>
            </div>
            {release.summaryNote && (
              <div>
                <span className="font-semibold text-slate-300">Catatan Historis Pasar: </span>
                <span className="text-slate-400 italic">"{release.summaryNote}"</span>
              </div>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <span>Tutup Panduan & Korelasi</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Lihat Korelasi Data, Dampak XAU/USD & Catatan Pasar</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={() => onOpenInSimulator(release)}
            className="px-3 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-md transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Tes di Simulator</span>
          </button>
        </div>
      </div>
    </article>
  );
};
