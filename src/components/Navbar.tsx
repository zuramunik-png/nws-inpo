import React from 'react';
import { TrendingUp, RefreshCw, SlidersHorizontal, BookOpen, Layers, GitCompare } from 'lucide-react';

interface NavbarProps {
  activeTab: 'releases' | 'simulator' | 'matrix' | 'correlations' | 'guide';
  onSelectTab: (tab: 'releases' | 'simulator' | 'matrix' | 'correlations' | 'guide') => void;
  onOpenSimulator: () => void;
  isRefreshing?: boolean;
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSimulator,
  isRefreshing,
  onRefreshData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d131f]/95 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-base lg:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            ForexBias <span className="text-emerald-400 font-semibold text-sm">US News</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('releases')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'releases' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rilis Berita 2026
            {activeTab === 'releases' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('correlations')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'correlations' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Korelasi Makro &amp; Emas
            {activeTab === 'correlations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('simulator')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'simulator' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Kalkulator Arah
            {activeTab === 'simulator' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('matrix')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Matrix Pairs
            {activeTab === 'matrix' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'guide' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Panduan &amp; Rules
            {activeTab === 'guide' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Perbarui Data Kalender"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}

          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulasi</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
        <button
          onClick={() => onSelectTab('releases')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            activeTab === 'releases' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Rilis 2026
        </button>
        <button
          onClick={() => onSelectTab('correlations')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            activeTab === 'correlations' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Korelasi Makro
        </button>
        <button
          onClick={() => onSelectTab('simulator')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            activeTab === 'simulator' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Kalkulator
        </button>
        <button
          onClick={() => onSelectTab('matrix')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            activeTab === 'matrix' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Matrix
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            activeTab === 'guide' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Panduan
        </button>
      </div>
    </header>
  );
};
