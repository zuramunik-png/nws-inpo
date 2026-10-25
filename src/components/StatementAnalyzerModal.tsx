import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatementAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatementAnalyzerModal: React.FC<StatementAnalyzerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [statementText, setStatementText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleStatements = [
    {
      label: 'Powell Hawkish Presser',
      text: 'Inflation remains somewhat elevated above our 2.0 percent goal. The committee does not expect it will be appropriate to reduce the target range until it has gained greater confidence that inflation is moving sustainably toward 2 percent.',
    },
    {
      label: 'Dovish Labor Softening',
      text: 'The labor market has cooled considerably from its overheated state. In light of the progress on inflation and the balance of risks, the committee decided to lower the target range for the federal funds rate by 50 basis points.',
    },
  ];

  const handleAnalyze = async () => {
    if (!statementText.trim()) {
      setError('Silakan masukkan teks pernyataan bank sentral The Fed.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: statementText,
          context: 'FOMC Policy Press Conference / Statement',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganalisis pernyataan.');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              AI Analyzer Pernyataan FOMC & Pidato Powell
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Teks Pernyataan The Fed / Pidato (Bahasa Inggris atau Indonesia):
          </label>
          <textarea
            rows={4}
            value={statementText}
            onChange={(e) => setStatementText(e.target.value)}
            placeholder="Ketik atau tempel kutipan pidato Jerome Powell / ringkasan rapat FOMC di sini..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />

          {/* Quick Samples */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Contoh Cepat:</span>
            {sampleStatements.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStatementText(s.text)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span>Menganalisis Nada Kebijakan The Fed...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analisis Tone Hawkish / Dovish & Bias USD</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Tone Kebijakan:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                result.tone === 'HAWKISH'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : result.tone === 'DOVISH'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {result.tone} ({result.bias})
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-300">Alasan Singkat:</div>
              <p className="text-slate-200 leading-relaxed">{result.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-center">
                <span className="text-slate-400 text-[11px] block">Dampak EUR/USD</span>
                <span className={`font-bold mt-0.5 block ${
                  result.eurusdImpact?.toLowerCase().includes('bullish') || result.tone === 'DOVISH'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  {result.eurusdImpact || (result.tone === 'DOVISH' ? 'Bullish' : 'Bearish')}
                </span>
              </div>

              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 text-center">
                <span className="text-slate-400 text-[11px] block">Dampak Emas (XAU/USD)</span>
                <span className={`font-bold mt-0.5 block ${
                  result.goldImpact?.toLowerCase().includes('bullish') || result.tone === 'DOVISH'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  {result.goldImpact || (result.tone === 'DOVISH' ? 'Bullish' : 'Bearish')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
