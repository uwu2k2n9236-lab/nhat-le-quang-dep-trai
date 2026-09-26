import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
} from 'lucide-react';
import { PRESET_BUILDS, formatGameNumber } from '../data/growCastleData';

interface WaveControlBarProps {
  currentWave: number;
  setWave: (wave: number) => void;
  incrementWave: (delta: number) => void;
  totalGoldNeeded: number;
  balanceScore: number;
  unitsOnTarget: number;
  totalUnits: number;
  activePresetId: string;
  loadPreset: (presetId: string) => void;
  onSetAllToTarget: () => void;
  onMaxSupport: () => void;
  onResetDefaults: () => void;
}

export const WaveControlBar: React.FC<WaveControlBarProps> = ({
  currentWave,
  setWave,
  incrementWave,
  totalGoldNeeded,
  balanceScore,
  unitsOnTarget,
  totalUnits,
  activePresetId,
  loadPreset,
  onSetAllToTarget,
  onMaxSupport,
  onResetDefaults,
}) => {
  const [isEditingWave, setIsEditingWave] = useState(false);
  const [waveInputValue, setWaveInputValue] = useState(currentWave.toString());

  const handleWaveInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(waveInputValue.replace(/,/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      setWave(parsed);
    }
    setIsEditingWave(false);
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Wave Number Controller */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-3 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Wave
              </span>

              {isEditingWave ? (
                <form onSubmit={handleWaveInputSubmit} className="inline-block">
                  <input
                    type="number"
                    min="1"
                    value={waveInputValue}
                    onChange={(e) => setWaveInputValue(e.target.value)}
                    onBlur={() => {
                      const parsed = parseInt(waveInputValue.replace(/,/g, ''), 10);
                      if (!isNaN(parsed) && parsed > 0) setWave(parsed);
                      setIsEditingWave(false);
                    }}
                    autoFocus
                    className="w-28 bg-slate-800 text-amber-300 font-mono-nums font-bold text-lg px-2 py-0.5 rounded outline-none border border-amber-500/50"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setWaveInputValue(currentWave.toString());
                    setIsEditingWave(true);
                  }}
                  className="font-mono-nums font-bold text-xl text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group flex items-center gap-1.5"
                  title="Click to manually edit wave number"
                >
                  <span>{currentWave.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 uppercase tracking-tighter">
                    (Edit)
                  </span>
                </button>
              )}
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => incrementWave(-1000)}
                className="px-2 py-1 text-xs font-mono-nums text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Subtract 1,000 Waves"
              >
                -1k
              </button>
              <button
                onClick={() => incrementWave(-100)}
                className="px-2 py-1 text-xs font-mono-nums text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Subtract 100 Waves"
              >
                -100
              </button>
              <button
                onClick={() => incrementWave(100)}
                className="px-2.5 py-1 text-xs font-mono-nums font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors"
                title="Add 100 Waves"
              >
                +100
              </button>
              <button
                onClick={() => incrementWave(500)}
                className="px-2.5 py-1 text-xs font-mono-nums font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors"
                title="Add 500 Waves"
              >
                +500
              </button>
              <button
                onClick={() => incrementWave(1000)}
                className="px-2.5 py-1 text-xs font-mono-nums font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors"
                title="Add 1,000 Waves"
              >
                +1k
              </button>
              <button
                onClick={() => incrementWave(5000)}
                className="px-2.5 py-1 text-xs font-mono-nums font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors hidden sm:inline-block"
                title="Add 5,000 Waves"
              >
                +5k
              </button>
              <button
                onClick={() => incrementWave(10000)}
                className="px-2.5 py-1 text-xs font-mono-nums font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors hidden sm:inline-block"
                title="Add 10,000 Waves"
              >
                +10k
              </button>
            </div>

            {/* Build Preset Selector */}
            <div className="relative">
              <select
                value={activePresetId}
                onChange={(e) => loadPreset(e.target.value)}
                className="appearance-none bg-slate-950 text-slate-200 text-xs font-medium pl-3 pr-8 py-2 rounded-xl border border-slate-800 hover:border-slate-700 outline-none cursor-pointer"
              >
                {PRESET_BUILDS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    Preset: {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right: Quick Batch Actions & Summary Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Health & Gold Status (Unboxed Anti-Slop) */}
            <div className="flex items-center gap-3 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono-nums">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Needed:</span>
                <span className="font-bold text-amber-300">
                  {formatGameNumber(totalGoldNeeded)}g
                </span>
              </div>
              <span aria-hidden="true" className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Target Ready:</span>
                <span className="font-semibold text-emerald-400">
                  {unitsOnTarget}/{totalUnits} ({balanceScore}%)
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSetAllToTarget}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                title="Level all heroes to match the exact target ratio for the current wave"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Sync to Wave Target
              </button>

              <button
                onClick={onMaxSupport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                title="Set Pure Wizard, Dark Necro, Bishop, Chrono to Lv. 21 cap"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Max Support (Lv. 21)
              </button>

              <button
                onClick={onResetDefaults}
                className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Deck to Defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
