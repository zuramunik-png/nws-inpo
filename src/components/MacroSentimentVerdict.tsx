import React from 'react';
import { AggregateSentiment } from '../types/forex';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Zap, RefreshCw, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface MacroSentimentVerdictProps {
  sentiment: AggregateSentiment;
  sourceNote?: string;
  lastUpdatedTime?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const MacroSentimentVerdict: React.FC<MacroSentimentVerdictProps> = ({
  sentiment,
  sourceNote = 'Forex Factory Live Feed & BLS',
  lastUpdatedTime,
  onRefresh,
  isRefreshing,
}) => {
  const isBullish = sentiment.overallUsdDirection === 'BULLISH';
  const isBearish = sentiment.overallUsdDirection === 'BEARISH';
  const isMixed = sentiment.overallUsdDirection === 'NEUTRAL';

  const badgeColor = isBullish
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
    : isBearish
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
    : 'bg-amber-500/15 text-amber-400 border-amber-500/40';

  const directionTitle = isBullish
    ? 'BULLISH USD'
    : isBearish
    ? 'BEARISH USD'
    : 'NETRAL / SIDELINES';

  return (
    <section className="bg-gradient-to-b from-[#111827] to-[#0d131f] border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl space-y-5">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-extrabold text-white tracking-tight">
              Kesimpulan Otomatis Sentimen Makro Kalender Ekonomi
            </h3>
            <p className="text-[11px] text-slate-400">
              Analisis otomatis dari agregasi rilis data NFP, CPI, PPI, dan keputusan suku bunga The Fed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Sumber: {sourceNote}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Menganalisis...' : 'Simpulkan Ulang'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Verdict Split: Summary Left, Bias Breakdown Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Verdict Hero (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Arah Dominan USD:
            </span>
            <div className={`px-3 py-1 rounded-md text-xs font-black border tracking-wider flex items-center gap-1.5 ${badgeColor}`}>
              {isBullish && <ArrowUpRight className="w-4 h-4" />}
              {isBearish && <ArrowDownRight className="w-4 h-4" />}
              {isMixed && <ArrowRight className="w-4 h-4" />}
              <span>{directionTitle}</span>
              <span className="text-[10px] font-normal opacity-80">
                (Tingkat Keyakinan: {sentiment.overallStrength})
              </span>
            </div>
          </div>

          {/* Auto Synthesized Text */}
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {sentiment.executiveSummary}
          </p>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1">
            <span className="font-bold text-emerald-400">Rekomendasi Aksi Pasar: </span>
            <span className="text-slate-300">{sentiment.recommendedAction}</span>
          </div>

          {lastUpdatedTime && (
            <div className="text-[10px] text-slate-500 font-mono">
              Otomatis dihitung ulang: {lastUpdatedTime} · Berdasarkan {sentiment.analyzedEventsCount} rilis data kalender
            </div>
          )}
        </div>

        {/* Right Gauge & Drivers (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-emerald-400">Sinyal Bullish ({sentiment.bullishScore}%)</span>
              <span className="text-rose-400">Sinyal Bearish ({sentiment.bearishScore}%)</span>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${sentiment.bullishScore}%` }}
                className="bg-emerald-500 transition-all duration-500"
              />
              <div
                style={{ width: `${sentiment.bearishScore}%` }}
                className="bg-rose-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* Key Drivers List */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pemicu Utama dari Kalender:
            </span>
            <div className="space-y-1 text-xs text-slate-300">
              {sentiment.keyDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">›</span>
                  <span className="line-clamp-1">{driver}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pairs Directional Consensus Matrix (Forex & Emas) */}
      <div className="pt-4 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Konsensus Arah Pasangan Mata Uang & Emas (Forex Consensus)
          </span>
          <span className="text-[11px] text-slate-500">Otomatis Ditentukan Berdasarkan Bias Makro</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {sentiment.pairsConsensus.map((item) => {
            const isBuy = item.action === 'BUY';
            const isSell = item.action === 'SELL';
            const pairClass = isBuy
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : isSell
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400';

            return (
              <div
                key={item.pair}
                className={`p-2.5 rounded-lg border text-center transition-transform hover:-translate-y-0.5 ${pairClass}`}
              >
                <div className="text-xs font-bold text-white">{item.pair}</div>
                <div className="text-xs font-extrabold mt-0.5 tracking-wide">
                  {item.action} ({item.direction})
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Keyakinan {item.confidence}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
