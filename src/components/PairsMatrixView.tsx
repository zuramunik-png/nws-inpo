import React, { useState } from 'react';
import { PAIRS_LIST } from '../data/economicData';
import { ArrowUpRight, ArrowDownRight, Layers, Flame, ShieldAlert, Zap } from 'lucide-react';

export const PairsMatrixView: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');

  const pairDetails: Record<string, {
    description: string;
    correlation: string;
    nfpMove: string;
    cpiMove: string;
    fomcMove: string;
    bullishUSDReaction: { bias: string; action: string; reason: string };
    bearishUSDReaction: { bias: string; action: string; reason: string };
    tradingAdvice: string;
  }> = {
    'EUR/USD': {
      description: 'Euro vs Dollar AS — Pair paling likuid di dunia, memegang bobot 57.6% dalam keranjang Indeks Dollar (DXY).',
      correlation: 'Korelasi Negatif / Terbalik (-0.98 vs DXY)',
      nfpMove: '60 - 110 Pips',
      cpiMove: '80 - 140 Pips',
      fomcMove: '90 - 160 Pips',
      bullishUSDReaction: {
        bias: 'BEARISH (SELL)',
        action: 'Cari peluang Sell pada retest resisten pasca-spike',
        reason: 'Penguatan ekonomi/inflasi AS memperlebar keunggulan yield USD atas suku bunga ECB (Eurozone).'
      },
      bearishUSDReaction: {
        bias: 'BULLISH (BUY)',
        action: 'Cari peluang Buy saat support hold',
        reason: 'Pelemahan dollar memicu aksi beli masif pada mata uang cadangan kedua terbesar di dunia ini.'
      },
      tradingAdvice: 'Spread biasanya sangat tipis. Hindari membuka posisi di detik ke-0 rilis; tunggu pembentukan candle 5-menit pertama.'
    },
    'XAU/USD': {
      description: 'Gold (Emas) vs Dollar AS — Aset lindung nilai (safe haven) tanpa bunga (non-yielding asset).',
      correlation: 'Sangat Sensitif Terbalik terhadap Real Yields AS & DXY',
      nfpMove: '120 - 250 Pips ($12 - $25)',
      cpiMove: '150 - 350 Pips ($15 - $35)',
      fomcMove: '200 - 500 Pips ($20 - $50)',
      bullishUSDReaction: {
        bias: 'BEARISH (SELL)',
        action: 'Tekanan jual cepat, waspadai penurunan bertingkat',
        reason: 'Suku bunga tinggi meningkatkan "biaya peluang" (opportunity cost) memegang emas batangan tanpa imbal hasil.'
      },
      bearishUSDReaction: {
        bias: 'BULLISH (BUY)',
        action: 'Breakout rally kuat menembus all-time high',
        reason: 'Penurunan suku bunga The Fed dan pelemahan dollar adalah pupuk terbaik untuk reli harga emas.'
      },
      tradingAdvice: 'Volatilitas paling liar! Gunakan lot 1/3 dari lot currency pair normal Anda untuk menjaga margin tetap aman.'
    },
    'USD/JPY': {
      description: 'Dollar AS vs Yen Jepang — Cermin langsung dari selisih imbal hasil obligasi pemerintah AS 10-Tahun.',
      correlation: 'Korelasi Positif (+0.92 vs US 10-Yr Yields)',
      nfpMove: '70 - 140 Pips',
      cpiMove: '90 - 180 Pips',
      fomcMove: '110 - 220 Pips',
      bullishUSDReaction: {
        bias: 'BULLISH (BUY)',
        action: 'Peluang Buy kuat mengikuti lonjakan yield US Treasury',
        reason: 'Kesenjangan suku bunga The Fed (5%) vs Bank of Japan (0.25%) memicu gelombang carry-trade beli USD/JPY.'
      },
      bearishUSDReaction: {
        bias: 'BEARISH (SELL)',
        action: 'Terjun tajam (unwinding carry trade)',
        reason: 'Setiap penurunan yield AS memicu penutupan posisi short Yen oleh hedge fund global.'
      },
      tradingAdvice: 'Perhatikan potensi intervensi mata uang Kementerian Keuangan Jepang (MoF) bila level harga mendekati 155 - 160.'
    },
    'GBP/USD': {
      description: 'British Pound vs Dollar AS (dikenal sebagai "The Cable") — Dikenal memiliki rentang pergerakan lebih agresif dari Euro.',
      correlation: 'Korelasi Negatif Terbalik terhadap USD',
      nfpMove: '70 - 130 Pips',
      cpiMove: '90 - 160 Pips',
      fomcMove: '100 - 190 Pips',
      bullishUSDReaction: {
        bias: 'BEARISH (SELL)',
        action: 'Tekanan sell cepat di zona resisten',
        reason: 'Dollar menguat menekan mata uang Inggris secara menyeluruh.'
      },
      bearishUSDReaction: {
        bias: 'BULLISH (BUY)',
        action: 'Rally bullish dengan momentum ekspansif',
        reason: 'Pelemahan USD dimanfaatkan oleh pembeli institusional Sterling.'
      },
      tradingAdvice: 'GBP sering mengalami false breakout (wick panjang) sebelum melanjutkan tren utamanya.'
    },
    'DXY': {
      description: 'U.S. Dollar Index — Barometer kekuatan mata uang Greenback terhadap sekeranjang 6 mata uang asing utama.',
      correlation: 'Induk dari Seluruh Pergerakan Forex USD',
      nfpMove: '40 - 90 Points',
      cpiMove: '50 - 110 Points',
      fomcMove: '60 - 150 Points',
      bullishUSDReaction: {
        bias: 'BULLISH (NAIK)',
        action: 'Dollar menguat secara merata di pasar global',
        reason: 'Pertumbuhan ekonomi kokoh dan ekspektasi suku bunga restriktif mengundang arus dana global ke obligasi AS.'
      },
      bearishUSDReaction: {
        bias: 'BEARISH (TURUN)',
        action: 'Dollar terkoreksi turun melemah',
        reason: 'Perlambatan data AS memicu aliran dana keluar mencari yield di pasar negara berkembang & komoditas.'
      },
      tradingAdvice: 'Gunakan grafik DXY sebagai konfirmator utama sebelum mengklik tombol Buy/Sell pada pair mana pun.'
    },
    'USD/CAD': {
      description: 'Dollar AS vs Dollar Kanada ("Loonie") — Pair komoditas yang dipengaruhi ekonomi AS dan harga minyak mentah.',
      correlation: 'Korelasi Positif terhadap USD, Korelasi Negatif terhadap Minyak',
      nfpMove: '45 - 90 Pips',
      cpiMove: '60 - 110 Pips',
      fomcMove: '70 - 130 Pips',
      bullishUSDReaction: {
        bias: 'BULLISH (BUY)',
        action: 'Kekuatan dollar mendorong pair naik',
        reason: 'Greenback mengungguli dollar Kanada saat sentimen makro AS tetap superior.'
      },
      bearishUSDReaction: {
        bias: 'BEARISH (SELL)',
        action: 'Penurunan harga menguji support',
        reason: 'Pelemahan greenback memberi dorongan bagi apresiasi CAD.'
      },
      tradingAdvice: 'Waspadai jika rilis NFP AS bersamaan dengan rilis Tenaga Kerja Kanada (Labor Force Survey).'
    }
  };

  const activeData = pairDetails[selectedPair] || pairDetails['EUR/USD'];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Matrix Dampak Pasangan Mata Uang (Forex & Emas)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ketahui bagaimana masing-masing instrumen merespons data NFP, CPI, PPI, dan FOMC beserta tips eksekusi spesifik.
        </p>
      </div>

      {/* Selector Tabs for Pairs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PAIRS_LIST.map((p) => {
          const isSelected = selectedPair === p.symbol;
          return (
            <button
              key={p.symbol}
              onClick={() => setSelectedPair(p.symbol)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{p.symbol}</span>
              <span className={`text-[10px] font-normal px-1.5 py-0.2 rounded ${
                p.baseRelation === 'DIRECT' ? 'bg-sky-950 text-sky-400' : 'bg-purple-950 text-purple-400'
              }`}>
                {p.baseRelation === 'DIRECT' ? 'Direct USD' : 'Inverse USD'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Pair Detailed Matrix Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {selectedPair}
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {activeData.correlation}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {activeData.description}
            </p>
          </div>

          {/* Average Pips Badge */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-lg shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Rata-Rata Volatilitas News</div>
              <div className="text-xs font-mono text-white font-semibold">
                NFP: {activeData.nfpMove} · CPI: {activeData.cpiMove}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Reaction Columns: If USD is Bullish vs If USD is Bearish */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reaction 1: USD Bullish */}
          <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ketika Berita = BULLISH USD
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${
                activeData.bullishUSDReaction.bias.includes('SELL')
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {activeData.bullishUSDReaction.bias}
              </span>
            </div>

            <div className="text-sm font-semibold text-white">
              {activeData.bullishUSDReaction.action}
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg">
              <span className="font-semibold text-slate-400">Penjelasan Logika: </span>
              {activeData.bullishUSDReaction.reason}
            </div>
          </div>

          {/* Reaction 2: USD Bearish */}
          <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ketika Berita = BEARISH USD
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${
                activeData.bearishUSDReaction.bias.includes('BUY')
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {activeData.bearishUSDReaction.bias}
              </span>
            </div>

            <div className="text-sm font-semibold text-white">
              {activeData.bearishUSDReaction.action}
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg">
              <span className="font-semibold text-slate-400">Penjelasan Logika: </span>
              {activeData.bearishUSDReaction.reason}
            </div>
          </div>
        </div>

        {/* Tactical Advice Box */}
        <div className="p-4 bg-emerald-950/15 border border-emerald-500/25 rounded-lg flex items-start gap-3">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-emerald-300 uppercase tracking-wide">
              Tips Taktikal Khusus Pasangan {selectedPair}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeData.tradingAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
