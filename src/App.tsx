import React, { useState, useEffect, useMemo } from 'react';
import { EconomicRelease, NewsType, AggregateSentiment } from './types/forex';
import { INITIAL_ECONOMIC_RELEASES } from './data/economicData';
import { calculateAggregateMacroSentiment } from './utils/forexRules';
import { Navbar } from './components/Navbar';
import { NewsFilterBar } from './components/NewsFilterBar';
import { ReleaseCard } from './components/ReleaseCard';
import { NewsSimulator } from './components/NewsSimulator';
import { PairsMatrixView } from './components/PairsMatrixView';
import { EducationalRulesView } from './components/EducationalRulesView';
import { StatementAnalyzerModal } from './components/StatementAnalyzerModal';
import { MacroSentimentVerdict } from './components/MacroSentimentVerdict';
import { MacroCorrelationView } from './components/MacroCorrelationView';
import { Search, Sparkles, Filter, RefreshCw, CalendarCheck, Clock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'releases' | 'simulator' | 'matrix' | 'correlations' | 'guide'>('releases');
  const [selectedNewsType, setSelectedNewsType] = useState<NewsType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RELEASED' | 'UPCOMING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [releases, setReleases] = useState<EconomicRelease[]>(INITIAL_ECONOMIC_RELEASES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sourceNote, setSourceNote] = useState<string>('Forex Factory & BLS AS');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Baru saja');
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Active simulator preload
  const [simulatorPreload, setSimulatorPreload] = useState<{
    newsType: NewsType;
    components?: any[];
  }>({ newsType: 'NFP' });

  // Otomatis sinkronisasi data dari Forex Factory saat pertama kali dimuat
  useEffect(() => {
    fetchLatestCalendarData();
  }, []);

  const fetchLatestCalendarData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/economic-calendar');
      const data = await res.json();
      if (data.success && Array.isArray(data.releases) && data.releases.length > 0) {
        // Gabungkan live releases terbaru dengan arsip rilis terverifikasi
        // Prioritaskan data live jika ada kesamaan
        const liveReleases = data.releases as EconomicRelease[];
        const combined = [...liveReleases, ...INITIAL_ECONOMIC_RELEASES];
        
        // Deduplicate berdasarkan title & releaseDate
        const seen = new Set<string>();
        const unique = combined.filter((item) => {
          const key = `${item.title.toLowerCase().trim()}_${item.releaseDate}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setReleases(unique);
        setSourceNote(data.source || 'Forex Factory Live Feed (Real-Time)');
        setRefreshMessage(`Berhasil menyinkronkan data kalender ekonomi real-time (${data.releases.length} event diperbarui).`);
      } else {
        setSourceNote('Data Terverifikasi (BLS & Fed AS)');
      }
    } catch {
      setSourceNote('Arsip Terverifikasi (Offline Safe)');
    } finally {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
      setTimeout(() => setRefreshMessage(null), 4500);
    }
  };

  // KESIMPULAN OTOMATIS: Dihitung secara real-time dari data kalender yang ada
  const aggregateSentiment: AggregateSentiment = useMemo(() => {
    return calculateAggregateMacroSentiment(releases);
  }, [releases]);

  // Counts for filter bar
  const counts = {
    ALL: releases.length,
    NFP: releases.filter((r) => r.type === 'NFP').length,
    CPI: releases.filter((r) => r.type === 'CPI').length,
    PPI: releases.filter((r) => r.type === 'PPI').length,
    FOMC: releases.filter((r) => r.type === 'FOMC').length,
  };

  // Filtered releases
  const filteredReleases = releases.filter((r) => {
    if (selectedNewsType !== 'ALL' && r.type !== selectedNewsType) return false;
    if (statusFilter !== 'ALL') {
      const isUp = r.status === 'UPCOMING';
      if (statusFilter === 'UPCOMING' && !isUp) return false;
      if (statusFilter === 'RELEASED' && isUp) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchPeriod = r.period.toLowerCase().includes(q);
      const matchComp = r.components.some((c) => c.name.toLowerCase().includes(q));
      return matchTitle || matchPeriod || matchComp;
    }
    return true;
  });

  const handleOpenInSimulator = (release: EconomicRelease) => {
    setSimulatorPreload({
      newsType: release.type,
      components: release.components,
    });
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSimulator={() => setActiveTab('simulator')}
        isRefreshing={isRefreshing}
        onRefreshData={fetchLatestCalendarData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Refresh feedback toast if triggered */}
        {refreshMessage && (
          <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{refreshMessage}</span>
            </div>
            <button
              onClick={() => setRefreshMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab 1: Releases Feed */}
        {activeTab === 'releases' && (
          <div className="space-y-6">
            {/* FITUR UTAMA: KESIMPULAN OTOMATIS MAKRO DARI KALENDER */}
            <MacroSentimentVerdict
              sentiment={aggregateSentiment}
              sourceNote={sourceNote}
              lastUpdatedTime={lastUpdatedTime}
              onRefresh={fetchLatestCalendarData}
              isRefreshing={isRefreshing}
            />

            {/* Filter and Search Bar */}
            <NewsFilterBar
              selectedType={selectedNewsType}
              onSelectType={setSelectedNewsType}
              counts={counts}
            />

            {/* Status Tabs & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Status Filter (Semua vs Sudah Rilis vs Mendatang) */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      statusFilter === 'ALL'
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua ({releases.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('RELEASED')}
                    className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                      statusFilter === 'RELEASED'
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CalendarCheck className="w-3 h-3" />
                    <span>Sudah Rilis</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('UPCOMING')}
                    className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                      statusFilter === 'UPCOMING'
                        ? 'bg-sky-500/20 text-sky-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Mendatang (Upcoming)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari rilis data (Core CPI, NFP, Unemployment, PPI)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <button
                  onClick={() => setIsStatementModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI FOMC Speech</span>
                </button>
              </div>
            </div>

            {/* Release Cards Feed */}
            {filteredReleases.length === 0 ? (
              <div className="text-center py-16 bg-[#111827] border border-slate-800 rounded-xl space-y-3">
                <Filter className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-semibold text-white">Tidak ada data rilis yang sesuai filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau set status ke "Semua".
                </p>
                <button
                  onClick={() => {
                    setSelectedNewsType('ALL');
                    setStatusFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredReleases.map((release) => (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    onOpenInSimulator={handleOpenInSimulator}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Macro Correlations & Market Impact (USD & Gold) */}
        {activeTab === 'correlations' && <MacroCorrelationView />}

        {/* Tab 3: What-If Simulator */}
        {activeTab === 'simulator' && (
          <NewsSimulator
            initialNewsType={simulatorPreload.newsType}
            initialComponents={simulatorPreload.components}
          />
        )}

        {/* Tab 3: Currency Pairs Reaction Matrix */}
        {activeTab === 'matrix' && <PairsMatrixView />}

        {/* Tab 4: Educational Guide & Rules */}
        {activeTab === 'guide' && <EducationalRulesView />}
      </main>

      {/* AI Statement Analyzer Modal */}
      <StatementAnalyzerModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0d131f] py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ForexBias US News Analyzer</span>
            <span aria-hidden="true">·</span>
            <span>Sinkronisasi Otomatis Forex Factory, BLS &amp; Federal Reserve</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Standar Waktu: WIB (UTC+7)</span>
            <span aria-hidden="true">·</span>
            <span>4 High-Impact News: NFP · CPI · PPI · FOMC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
