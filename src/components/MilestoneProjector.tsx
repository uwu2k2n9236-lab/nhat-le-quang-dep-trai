import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  ArrowRight,
  Shield,
  Coins,
  CheckCircle,
  Zap,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { UnitRowData } from '../types';
import {
  formatGameNumber,
  formatRatioPercent,
  estimateGoldCost,
} from '../data/growCastleData';

interface MilestoneProjectorProps {
  currentWave: number;
  unitRows: UnitRowData[];
  setWave: (wave: number) => void;
  isArcherless: boolean;
}

const PRESET_MILESTONES = [
  { wave: 5000, label: 'Wave 5k (Early Midgame)' },
  { wave: 10000, label: 'Wave 10k (Midgame Milestone)' },
  { wave: 25000, label: 'Wave 25k (Infinite Colony Phase)' },
  { wave: 50000, label: 'Wave 50k (Dragon & L-Items)' },
  { wave: 100000, label: 'Wave 100k (Endgame Standard)' },
  { wave: 250000, label: 'Wave 250k (High Wave Clan Push)' },
  { wave: 500000, label: 'Wave 500k (Leaderboard Veteran)' },
];

export const MilestoneProjector: React.FC<MilestoneProjectorProps> = ({
  currentWave,
  unitRows,
  setWave,
  isArcherless,
}) => {
  const [targetWaveInput, setTargetWaveInput] = useState<number>(
    Math.max(25000, Math.ceil((currentWave + 10000) / 10000) * 10000)
  );

  // Milestone Calculations
  const projection = useMemo(() => {
    const wave = targetWaveInput;
    let totalProjectedGold = 0;
    const projectedUnits = unitRows
      .filter((r) => !(isArcherless && r.id === 'town_archers'))
      .map((r) => {
        let projectedLevel = 0;
        if (r.isFixedCap) {
          projectedLevel = r.fixedCapLevel || 21;
        } else {
          projectedLevel = Math.max(1, Math.round(wave * r.targetRatio));
        }

        const levelsDelta = Math.max(0, projectedLevel - r.currentLevel);
        const goldCost = estimateGoldCost(
          r.definition.baseUpgradeCost,
          r.currentLevel,
          projectedLevel
        );

        totalProjectedGold += goldCost;

        return {
          ...r,
          projectedLevel,
          levelsDelta,
          goldCost,
        };
      });

    // Castle HP & MP estimations at target wave
    const castleLevel = Math.round(wave * 0.08);
    const estimatedCastleHP = castleLevel * 140 + 2500;
    const estimatedCastleMP = castleLevel * 45 + 800;

    return {
      wave,
      totalProjectedGold,
      projectedUnits,
      estimatedCastleHP,
      estimatedCastleMP,
    };
  }, [targetWaveInput, unitRows, isArcherless]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-nums text-amber-400 font-semibold mb-1">
            <span>LONG-TERM ROADMAP</span>
            <span aria-hidden="true">·</span>
            <span>CURRENT: WAVE {currentWave.toLocaleString()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
            Future Milestone Projector
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Calculate the exact hero levels, castle capacity, and gold investment required to reach
            any future wave milestone without hitting DPS walls.
          </p>
        </div>

        {/* Milestone Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MILESTONES.map((m) => (
            <button
              key={m.wave}
              onClick={() => setTargetWaveInput(m.wave)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-nums transition-colors ${
                targetWaveInput === m.wave
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Wave {(m.wave / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>

      {/* Target Wave Input Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold block">
              Simulated Future Wave
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min="1000"
                step="1000"
                value={targetWaveInput}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) setTargetWaveInput(val);
                }}
                className="w-36 bg-slate-950 text-amber-300 font-mono-nums text-lg font-bold px-3 py-1 rounded-xl border border-slate-800 outline-none focus:border-amber-400"
              />
              <span className="text-xs text-slate-400">
                (+{(targetWaveInput - currentWave).toLocaleString()} waves from now)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono-nums">
            <span className="text-[10px] text-slate-500 uppercase block">Total Gold to Reach Target</span>
            <span className="text-lg font-bold text-amber-300">
              {formatGameNumber(projection.totalProjectedGold)} Gold
            </span>
          </div>

          <button
            onClick={() => setWave(targetWaveInput)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
            title="Set app current wave to this milestone"
          >
            <Zap className="w-4 h-4 fill-current" />
            Jump Current Wave to {targetWaveInput.toLocaleString()}
          </button>
        </div>
      </div>

      {/* Castle Stat Benchmarks at Target Wave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-mono-nums text-slate-400 uppercase">
            Projected Castle Level (0.08x)
          </span>
          <div className="text-xl font-bold font-mono-nums text-white">
            Level {Math.round(targetWaveInput * 0.08).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            Recommended to safely tank lightning strikes & colony volleys.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-mono-nums text-slate-400 uppercase">
            Estimated Castle HP
          </span>
          <div className="text-xl font-bold font-mono-nums text-emerald-400">
            ~{formatGameNumber(projection.estimatedCastleHP)} HP
          </div>
          <p className="text-[11px] text-slate-500">
            Prevents boss charge one-shots during high wave auto-battle.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-mono-nums text-slate-400 uppercase">
            Death Worm MP Threshold (0.01x)
          </span>
          <div className="text-xl font-bold font-mono-nums text-cyan-400">
            Level {Math.round(targetWaveInput * 0.01).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            Restores enough mana per hit to continuously fuel Dark Chrono & skill loops.
          </p>
        </div>
      </div>

      {/* Target Roster Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-white">
          Hero Level Goals for Wave {targetWaveInput.toLocaleString()}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono-nums">
          {projection.projectedUnits.map((unit) => (
            <div
              key={unit.slotKey}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: unit.iconColor }}
                    />
                    <span className="font-semibold text-xs text-white font-sans">
                      {unit.shortName}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    {unit.isFixedCap ? 'Cap 21' : formatRatioPercent(unit.targetRatio)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mt-2 text-slate-300">
                  <span>Current: Lv. {unit.currentLevel}</span>
                  <span className="text-amber-300 font-bold">
                    Goal: Lv. {unit.projectedLevel.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Gold Needed:</span>
                <span className="text-slate-300 font-semibold">
                  {formatGameNumber(unit.goldCost)}g
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
