import React from 'react';
import { Shield, Sparkles, BookOpen, Layers, Table, Coins, TrendingUp } from 'lucide-react';
import crestImage from '../assets/images/grow_castle_crest_1790420665771.jpg';

export type ActiveTab = 'visualizer' | 'table' | 'gold_planner' | 'milestones' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  balanceScore: number;
  currentWave: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  balanceScore,
  currentWave,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 shadow-sm shrink-0 bg-slate-900">
              <img
                src={crestImage}
                alt="Grow Castle Crest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white leading-tight">
                Grow Castle
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-400/90 font-mono-nums font-semibold -mt-0.5">
                Ratio Tracker & Optimizer
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs with single-line controls */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'visualizer'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Castle Visualizer
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'table'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Roster Table
            </button>

            <button
              onClick={() => setActiveTab('gold_planner')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'gold_planner'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              Gold & Upgrades
            </button>

            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'milestones'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Milestone Projector
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Ratio Guide
            </button>
          </nav>

          {/* Zone 3: Primary action & live status */}
          <div className="flex items-center gap-3">
            {/* Clean unboxed metadata with separators (Anti-Slop Zero-Pill rule) */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono-nums text-slate-400">
              <span className="text-slate-200 font-semibold">Wave {currentWave.toLocaleString()}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={balanceScore >= 80 ? 'text-emerald-400' : balanceScore >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                {balanceScore}% Health
              </span>
            </div>

            <button
              onClick={() => setActiveTab('guide')}
              className="flex md:hidden items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              title="View Guide"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950 gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'visualizer' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3 h-3" />
          Visualizer
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'table' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          <Table className="w-3 h-3" />
          Roster
        </button>
        <button
          onClick={() => setActiveTab('gold_planner')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'gold_planner' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          <Coins className="w-3 h-3" />
          Gold
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'milestones' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          Milestones
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'guide' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          Guide
        </button>
      </div>
    </header>
  );
};
