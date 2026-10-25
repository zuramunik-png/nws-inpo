import React, { useState, useMemo } from 'react';
import { NewsType, NewsComponent, BiasResult } from '../types/forex';
import { evaluateNewsBias } from '../utils/forexRules';
import { SlidersHorizontal, ArrowUpRight, ArrowDownRight, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NewsSimulatorProps {
  initialNewsType?: NewsType;
  initialComponents?: NewsComponent[];
}

export const NewsSimulator: React.FC<NewsSimulatorProps> = ({
  initialNewsType = 'NFP',
  initialComponents,
}) => {
  const [selectedType, setSelectedType] = useState<NewsType>(initialNewsType);

  // Default presets for simulation
  const [nfpJobsActual, setNfpJobsActual] = useState(240);
  const [nfpJobsForecast, setNfpJobsForecast] = useState(150);
  const [nfpJobsPrev, setNfpJobsPrev] = useState(160);

  const [unempActual, setUnempActual] = useState(4.1);
  const [unempForecast, setUnempForecast] = useState(4.2);
  const [unempPrev, setUnempPrev] = useState(4.2);

  const [wageActual, setWageActual] = useState(0.4);
  const [wageForecast, setWageForecast] = useState(0.3);

  // CPI state
  const [cpiActual, setCpiActual] = useState(3.4);
  const [cpiForecast, setCpiForecast] = useState(3.1);
  const [cpiPrev, setCpiPrev] = useState(2.9);
  const [coreCpiActual, setCoreCpiActual] = useState(3.3);
  const [coreCpiForecast, setCoreCpiForecast] = useState(3.2);

  // PPI state
  const [ppiActual, setPpiActual] = useState(2.2);
  const [ppiForecast, setPpiForecast] = useState(1.9);
  const [ppiPrev, setPpiPrev] = useState(1.8);

  // FOMC state
  const [fomcRate, setFomcRate] = useState(5.0);
  const [fomcTone, setFomcTone] = useState<'HAWKISH' | 'DOVISH' | 'NEUTRAL'>('HAWKISH');
  const [fomcRateCutBps, setFomcRateCutBps] = useState<number>(0);

  // Build simulated components based on selected type
  const biasResult: BiasResult = useMemo(() => {
    if (selectedType === 'NFP') {
      const comps: NewsComponent[] = [
        {
          name: 'Non-Farm Employment Change',
          actual: `${nfpJobsActual}K`,
          forecast: `${nfpJobsForecast}K`,
          previous: `${nfpJobsPrev}K`,
          unit: 'K',
          betterDirection: 'HIGHER_BETTER_FOR_USD',
        },
        {
          name: 'Unemployment Rate',
          actual: `${unempActual.toFixed(1)}%`,
          forecast: `${unempForecast.toFixed(1)}%`,
          previous: `${unempPrev.toFixed(1)}%`,
          unit: '%',
          betterDirection: 'LOWER_BETTER_FOR_USD',
        },
        {
          name: 'Average Hourly Earnings m/m',
          actual: `${wageActual.toFixed(1)}%`,
          forecast: `${wageForecast.toFixed(1)}%`,
          previous: '0.3%',
          unit: '%',
          betterDirection: 'HIGHER_BETTER_FOR_USD',
        },
      ];
      return evaluateNewsBias({ type: 'NFP', components: comps });
    }

    if (selectedType === 'CPI') {
      const comps: NewsComponent[] = [
        {
          name: 'CPI y/y',
          actual: `${cpiActual.toFixed(1)}%`,
          forecast: `${cpiForecast.toFixed(1)}%`,
          previous: `${cpiPrev.toFixed(1)}%`,
          unit: '%',
          betterDirection: 'HIGHER_BETTER_FOR_USD',
        },
        {
          name: 'Core CPI y/y',
          actual: `${coreCpiActual.toFixed(1)}%`,
          forecast: `${coreCpiForecast.toFixed(1)}%`,
          previous: '3.2%',
          unit: '%',
          betterDirection: 'HIGHER_BETTER_FOR_USD',
        },
      ];
      return evaluateNewsBias({ type: 'CPI', components: comps });
    }

    if (selectedType === 'PPI') {
      const comps: NewsComponent[] = [
        {
          name: 'PPI Final Demand y/y',
          actual: `${ppiActual.toFixed(1)}%`,
          forecast: `${ppiForecast.toFixed(1)}%`,
          previous: `${ppiPrev.toFixed(1)}%`,
          unit: '%',
          betterDirection: 'HIGHER_BETTER_FOR_USD',
        },
      ];
      return evaluateNewsBias({ type: 'PPI', components: comps });
    }

    // FOMC
    const comps: NewsComponent[] = [
      {
        name: 'Federal Funds Target Rate',
        actual: `${fomcRate.toFixed(2)}%`,
        forecast: '5.00%',
        previous: '5.25%',
        unit: '%',
        betterDirection: 'HIGHER_BETTER_FOR_USD',
      },
    ];
    return evaluateNewsBias({
      type: 'FOMC',
      components: comps,
      fomcTone,
      rateChangeBps: fomcRateCutBps,
    });
  }, [
    selectedType,
    nfpJobsActual,
    nfpJobsForecast,
    nfpJobsPrev,
    unempActual,
    unempForecast,
    unempPrev,
    wageActual,
    wageForecast,
    cpiActual,
    cpiForecast,
    cpiPrev,
    coreCpiActual,
    coreCpiForecast,
    ppiActual,
    ppiForecast,
    ppiPrev,
    fomcRate,
    fomcTone,
    fomcRateCutBps,
  ]);

  // Apply quick presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'nfp-bullish') {
      setSelectedType('NFP');
      setNfpJobsActual(250);
      setNfpJobsForecast(150);
      setNfpJobsPrev(160);
      setUnempActual(4.1);
      setUnempForecast(4.2);
    } else if (presetName === 'nfp-bearish') {
      setSelectedType('NFP');
      setNfpJobsActual(110);
      setNfpJobsForecast(165);
      setNfpJobsPrev(180);
      setUnempActual(4.4);
      setUnempForecast(4.1);
    } else if (presetName === 'nfp-mixed') {
      setSelectedType('NFP');
      setNfpJobsActual(230);
      setNfpJobsForecast(150);
      setNfpJobsPrev(160);
      setUnempActual(4.4);
      setUnempForecast(4.1);
    } else if (presetName === 'cpi-hot') {
      setSelectedType('CPI');
      setCpiActual(3.4);
      setCpiForecast(3.1);
      setCpiPrev(2.9);
      setCoreCpiActual(3.4);
    } else if (presetName === 'cpi-cool') {
      setSelectedType('CPI');
      setCpiActual(2.4);
      setCpiForecast(2.6);
      setCpiPrev(2.8);
      setCoreCpiActual(3.1);
    } else if (presetName === 'fomc-dovish-cut') {
      setSelectedType('FOMC');
      setFomcRate(4.75);
      setFomcRateCutBps(-50);
      setFomcTone('DOVISH');
    } else if (presetName === 'fomc-hawkish-hold') {
      setSelectedType('FOMC');
      setFomcRate(5.25);
      setFomcRateCutBps(0);
      setFomcTone('HAWKISH');
    }
  };

  const isBullish = biasResult.usdDirection === 'BULLISH';
  const isBearish = biasResult.usdDirection === 'BEARISH';
  const isMixed = biasResult.strength === 'MIXED';

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>Kalkulator & Simulator Penentu Arah News</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Uji skenario rilis data ekonomi untuk mengetahui secara instan arah bias (Bullish/Bearish), alasan makro, dan dampak ke pasangan mata uang.
          </p>
        </div>

        {/* News Type Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(['NFP', 'CPI', 'PPI', 'FOMC'] as NewsType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedType === t
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Quick Skenario */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-400">
          Skenario Cepat (Quick Presets):
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedType === 'NFP' && (
            <>
              <button
                onClick={() => applyPreset('nfp-bullish')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 rounded-md transition-colors"
              >
                NFP Beat & Pengangguran Turun (Strong Bullish USD)
              </button>
              <button
                onClick={() => applyPreset('nfp-bearish')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-rose-400 rounded-md transition-colors"
              >
                NFP Miss & Pengangguran Naik (Strong Bearish USD)
              </button>
              <button
                onClick={() => applyPreset('nfp-mixed')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-md transition-colors"
              >
                Data Campuran: Payroll Naik tapi Pengangguran Naik (Reversal Trap)
              </button>
            </>
          )}

          {selectedType === 'CPI' && (
            <>
              <button
                onClick={() => applyPreset('cpi-hot')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 rounded-md transition-colors"
              >
                Hot CPI: Inflasi Naik Melampaui Estimasi (USD Rally, Gold Drop)
              </button>
              <button
                onClick={() => applyPreset('cpi-cool')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-rose-400 rounded-md transition-colors"
              >
                Cooling CPI: Disinflasi Mulus di Bawah Estimasi (USD Lemah, Gold Rally)
              </button>
            </>
          )}

          {selectedType === 'FOMC' && (
            <>
              <button
                onClick={() => applyPreset('fomc-dovish-cut')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-rose-400 rounded-md transition-colors"
              >
                Pemotongan Suku Bunga Jumbo -50 bps (Dovish Easing)
              </button>
              <button
                onClick={() => applyPreset('fomc-hawkish-hold')}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 rounded-md transition-colors"
              >
                Suku Bunga Ditahan Tinggi + Nada Hawkish (Higher for Longer)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Controls Left, Live Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Parameter Rilis {selectedType}
            </h3>
            <span className="text-[11px] text-slate-400">Atur Angka Realisasi</span>
          </div>

          {/* NFP Controls */}
          {selectedType === 'NFP' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Non-Farm Payrolls (Actual)</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{nfpJobsActual}K</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="5"
                  value={nfpJobsActual}
                  onChange={(e) => setNfpJobsActual(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>Forecast: {nfpJobsForecast}K</span>
                  <span>Previous: {nfpJobsPrev}K</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Unemployment Rate (Pengangguran)</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{unempActual.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="5.0"
                  step="0.1"
                  value={unempActual}
                  onChange={(e) => setUnempActual(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>Forecast: {unempForecast}%</span>
                  <span>Previous: {unempPrev}%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Average Hourly Earnings m/m</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{wageActual.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.1"
                  value={wageActual}
                  onChange={(e) => setWageActual(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* CPI Controls */}
          {selectedType === 'CPI' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">CPI y/y (Inflasi Headline Tahunan)</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{cpiActual.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={cpiActual}
                  onChange={(e) => setCpiActual(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>Forecast: {cpiForecast}%</span>
                  <span>Previous: {cpiPrev}%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Core CPI y/y (Inflasi Inti)</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{coreCpiActual.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="5.0"
                  step="0.1"
                  value={coreCpiActual}
                  onChange={(e) => setCoreCpiActual(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>Forecast: {coreCpiForecast}%</span>
                </div>
              </div>
            </div>
          )}

          {/* PPI Controls */}
          {selectedType === 'PPI' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">PPI Final Demand y/y</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{ppiActual.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={ppiActual}
                  onChange={(e) => setPpiActual(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>Forecast: {ppiForecast}%</span>
                  <span>Previous: {ppiPrev}%</span>
                </div>
              </div>
            </div>
          )}

          {/* FOMC Controls */}
          {selectedType === 'FOMC' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keputusan Suku Bunga (Fed Funds Rate)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Cut 50 bps', bps: -50, rate: 4.75 },
                    { label: 'Cut 25 bps', bps: -25, rate: 5.0 },
                    { label: 'Tahan (Hold)', bps: 0, rate: 5.25 },
                  ].map((btn) => (
                    <button
                      key={btn.bps}
                      onClick={() => {
                        setFomcRateCutBps(btn.bps);
                        setFomcRate(btn.rate);
                      }}
                      className={`p-2 text-xs font-semibold rounded-md border text-center transition-colors ${
                        fomcRateCutBps === btn.bps
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tone Pernyataan / Konferensi Pers Powell
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HAWKISH', 'NEUTRAL', 'DOVISH'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFomcTone(t)}
                      className={`p-2 text-xs font-semibold rounded-md border text-center transition-colors ${
                        fomcTone === t
                          ? t === 'HAWKISH'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : t === 'DOVISH'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Column (7 cols): Bias, Reason & Pair Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {/* Direction Banner */}
          <div className={`p-5 rounded-xl border ${
            isBullish
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : isBearish
              ? 'bg-rose-950/20 border-rose-500/40'
              : 'bg-amber-950/20 border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Hasil Kalkulasi Arah USD
              </span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                isBullish
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isBearish
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                Kekuatan: {biasResult.strength}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isBullish
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isBearish
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {isBullish && <ArrowUpRight className="w-6 h-6" />}
                {isBearish && <ArrowDownRight className="w-6 h-6" />}
                {isMixed && <ArrowRight className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-2xl font-extrabold tracking-tight ${
                  isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {biasResult.usdDirection === 'BULLISH'
                    ? 'BULLISH USD'
                    : biasResult.usdDirection === 'BEARISH'
                    ? 'BEARISH USD'
                    : 'MIXED / VOLATILE DIRECTION'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {biasResult.usdDirection === 'BULLISH'
                    ? 'Dollar AS cenderung menguat tajam terhadap mata uang lawan & Emas'
                    : biasResult.usdDirection === 'BEARISH'
                    ? 'Dollar AS cenderung melemah; katalis penguatan bagi EUR/USD & Emas (XAU)'
                    : 'Pergerakan rawan false spike; pasar mencerna data yang kontradiktif'}
                </p>
              </div>
            </div>

            {/* Rationale / Reason Box */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Alasan Penentu Arah:
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {biasResult.headlineReason}
              </p>

              <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                {biasResult.detailedPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">›</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pair Matrix */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Dampak Arah Terhadap Pasangan Mata Uang (Forex & Emas)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {biasResult.pairsImpact.map((item) => {
                const isBuy = item.bias === 'BUY';
                const isSell = item.bias === 'SELL';
                const badgeClass = isBuy
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : isSell
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400';

                return (
                  <div key={item.pair} className={`p-3 rounded-lg border ${badgeClass}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.pair}</span>
                      <span className="text-[10px] font-mono opacity-80">{item.expectedPips}</span>
                    </div>
                    <div className="text-sm font-extrabold mt-1">
                      {item.bias}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      Bias: {item.directionText}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-amber-400">Tips Eksekusi Trader: </span>
              <span>{biasResult.tradingRecommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
