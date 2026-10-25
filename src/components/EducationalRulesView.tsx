import React from 'react';
import { EDUCATIONAL_RULES } from '../data/economicData';
import { BookOpen, AlertOctagon, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const EducationalRulesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>Panduan Makroekonomi & Rules Penentu Arah News</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pahami bagaimana data ekonomi Amerika menggerakkan roda pasar forex, mekanisme suku bunga The Fed, dan cara membaca deviasi data secara akurat.
        </p>
      </div>

      {/* 3 Golden Rules Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>3 Aturan Emas Membaca Arah Rilis Berita</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Aturan 1: Forecast Adalah Tolok Ukur
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pasar finansial selalu melakukan <em>"pricing-in"</em> (memperhitungkan) angka Forecast sebelum rilis. Volatilitas dan arah spike terjadi akibat <strong>deviasi (selisih)</strong> antara data Realisasi (Actual) terhadap Forecast, bukan semata-mata angka nominalnya.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Aturan 2: Perbandingan Bulan Lalu (Previous)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jika Actual mengalahkan Forecast tapi jauh lebih rendah dari Previous, reli USD bisa tertahan atau berumur pendek karena mengindikasikan perlambatan jangka menengah. Waspadai juga <strong>revisi data bulan lalu</strong> yang sering diubah diam-diam oleh BLS.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Aturan 3: Rantai Sebab-Akibat The Fed
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Alasan utama data menggerakkan forex: <br />
              <span className="text-white font-mono text-[11px]">Data Panas → Inflasi / Tenaga Kerja Kuat → The Fed Tahan Bunga Tinggi → Yields AS Naik → USD Rally.</span>
            </p>
          </div>
        </div>
      </div>

      {/* In-depth 4 News Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Detail Karakteristik 4 Berita Utama AS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDUCATIONAL_RULES.map((rule) => (
            <div
              key={rule.id}
              className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-white">
                  {rule.newsType}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {rule.typicalPips}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Waktu Rilis:</span>
                  <span className="text-slate-200">{rule.frequency}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sumber Resmi:</span>
                  <span className="text-slate-200">{rule.source}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bobot Pasar:</span>
                  <span className="text-amber-400 font-semibold">{rule.marketWeight}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Rumus Penentu Arah:
                </div>
                <p className="text-slate-200 font-medium">
                  {rule.biasRule}
                </p>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-400">Mekanisme Makro:</div>
                <p className="text-slate-300 leading-relaxed">
                  {rule.mechanics}
                </p>
              </div>

              <div className="p-3 bg-rose-950/20 border border-rose-500/25 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>Jebakan Trader (Trap & Pitfall):</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {rule.pitfall}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
