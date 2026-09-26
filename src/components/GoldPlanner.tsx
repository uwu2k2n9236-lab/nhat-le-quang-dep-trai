import React, { useState, useMemo } from 'react';
import {
  Coins,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  PiggyBank,
} from 'lucide-react';
import { UnitRowData } from '../types';
import {
  formatGameNumber,
  formatRatioPercent,
  estimateGoldCost,
} from '../data/growCastleData';

interface GoldPlannerProps {
  unitRows: UnitRowData[];
  currentWave: number;
  totalGoldNeeded: number;
  currentGoldBank: number;
  goldPerWave: number;
  setGoldBank: (gold: number) => void;
  setGoldPerWave: (gold: number) => void;
  isArcherless: boolean;
  onApplyAllocations?: (allocations: { slotKey: string; newLevel: number }[]) => void;
}

export const GoldPlanner: React.FC<GoldPlannerProps> = ({
  unitRows,
  currentWave,
  totalGoldNeeded,
  currentGoldBank,
  goldPerWave,
  setGoldBank,
  setGoldPerWave,
  isArcherless,
  onApplyAllocations,
}) => {
  const [bankInput, setBankInput] = useState(currentGoldBank.toString());
  const [incomeInput, setIncomeInput] = useState(goldPerWave.toString());

  // Rank upgrade priorities: Who gives highest ratio improvement per gold spent?
  const priorityList = useMemo(() => {
    return unitRows
      .filter((r) => {
        if (isArcherless && r.id === 'town_archers') return false;
        return r.analysis.levelDelta > 0;
      })
      .map((r) => {
        // Priority weight: Higher if deficit is large, or if it's a primary carry like DBM/Giants or fixed cap 21
        let weight = (r.analysis.levelDelta / Math.max(1, r.analysis.targetLevel)) * 100;
        if (r.category === 'MAIN_DPS') weight *= 2.5;
        if (r.isFixedCap) weight *= 3.0; // maxing support 21 is highest priority!
        if (r.id === 'tower_death_worm') weight *= 2.0; // MP sustain is critical!
        if (r.id === 'castle_base') weight *= 1.8;

        return {
          ...r,
          weight,
        };
      })
      .sort((a, b) => b.weight - a.weight);
  }, [unitRows, isArcherless]);

  // Gold Budget Distributor Simulation
  const distributionResult = useMemo(() => {
    const goldAvailable = currentGoldBank;
    let remainingGold = goldAvailable;
    const allocations: {
      slotKey: string;
      name: string;
      shortName: string;
      iconColor: string;
      startLevel: number;
      addedLevels: number;
      targetLevel: number;
      cost: number;
      unit: UnitRowData;
    }[] = [];

    // Prioritize units in order of urgency
    for (const item of priorityList) {
      if (remainingGold <= 0) break;
      const needed = item.analysis.levelDelta;
      if (needed <= 0) continue;

      // Check how many levels of this unit we can afford
      let affordableLevels = 0;
      let costForLevels = 0;

      // Binary search or incremental step to find affordable levels up to target
      let low = 0;
      let high = needed;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const cost = estimateGoldCost(
          item.definition.baseUpgradeCost,
          item.currentLevel,
          item.currentLevel + mid
        );
        if (cost <= remainingGold) {
          affordableLevels = mid;
          costForLevels = cost;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      if (affordableLevels > 0) {
        remainingGold -= costForLevels;
        allocations.push({
          slotKey: item.slotKey,
          name: item.name,
          shortName: item.shortName,
          iconColor: item.iconColor,
          startLevel: item.currentLevel,
          addedLevels: affordableLevels,
          targetLevel: item.analysis.targetLevel,
          cost: costForLevels,
          unit: item,
        });
      }
    }

    const totalSpent = goldAvailable - remainingGold;
    return {
      allocations,
      totalSpent,
      remainingGold,
    };
  }, [currentGoldBank, priorityList]);

  // Handle bank input submit
  const handleUpdateBank = (val: number) => {
    setGoldBank(val);
    setBankInput(val.toString());
  };

  const handleUpdateIncome = (val: number) => {
    setGoldPerWave(val);
    setIncomeInput(val.toString());
  };

  // Execute upgrades
  const handleExecuteUpgrades = () => {
    distributionResult.allocations.forEach((alloc) => {
      alloc.unit.onUpdateLevel(alloc.startLevel + alloc.addedLevels);
    });
    // Deduct spent gold
    setGoldBank(distributionResult.remainingGold);
    setBankInput(distributionResult.remainingGold.toString());
  };

  // Time & Wave math
  const wavesNeeded = goldPerWave > 0 ? Math.ceil(totalGoldNeeded / goldPerWave) : 0;
  // Standard wave duration with 1.4x Chrono: ~18 seconds
  const autoBattleHours = (wavesNeeded * 18) / 3600;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Section: Gold Bank & Farming Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Gold In Pocket */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-amber-400" />
              Current Gold Bank
            </span>
            <span className="text-xs font-bold text-amber-300 font-mono-nums">
              {formatGameNumber(currentGoldBank)}g
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={bankInput}
              onChange={(e) => {
                setBankInput(e.target.value);
                const p = parseInt(e.target.value, 10);
                if (!isNaN(p)) setGoldBank(p);
              }}
              className="w-full bg-slate-950 text-white font-mono-nums text-sm font-bold px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-amber-400"
              placeholder="e.g. 50000000"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[10e6, 50e6, 100e6, 500e6, 1e9, 5e9].map((amt) => (
              <button
                key={amt}
                onClick={() => handleUpdateBank(amt)}
                className="px-2 py-0.5 text-[10px] font-mono-nums bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 rounded border border-slate-800 transition-colors"
              >
                +{formatGameNumber(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Gold Income Per Wave */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              Gold Earned Per Wave
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono-nums">
              {formatGameNumber(goldPerWave)}g/wave
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1000"
              value={incomeInput}
              onChange={(e) => {
                setIncomeInput(e.target.value);
                const p = parseInt(e.target.value, 10);
                if (!isNaN(p)) setGoldPerWave(p);
              }}
              className="w-full bg-slate-950 text-white font-mono-nums text-sm font-bold px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-emerald-400"
              placeholder="e.g. 150000"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[50000, 150000, 300000, 600000, 1200000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleUpdateIncome(amt)}
                className="px-2 py-0.5 text-[10px] font-mono-nums bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 rounded border border-slate-800 transition-colors"
              >
                {formatGameNumber(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Time to 100% Ratio Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            Progression Estimate
          </span>

          <div className="pt-1">
            <div className="text-xl font-display font-bold text-white">
              {wavesNeeded.toLocaleString()} Waves
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ≈{' '}
              <strong className="text-amber-300">
                {autoBattleHours >= 24
                  ? `${(autoBattleHours / 24).toFixed(1)} Days`
                  : `${autoBattleHours.toFixed(1)} Hours`}
              </strong>{' '}
              of auto-battle with 1.4x Chrono speed to achieve 100% target ratios.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono-nums pt-2 border-t border-slate-800/80">
            Total investment remaining: {formatGameNumber(totalGoldNeeded)}g
          </div>
        </div>
      </div>

      {/* Live Gold Allocation Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-nums text-amber-400 font-semibold mb-1">
              <span>ALGORITHM RECOMMENDATION</span>
              <span aria-hidden="true">·</span>
              <span>GREEDY UPGRADE EFFICIENCY</span>
            </div>
            <h2 className="text-lg font-display font-bold text-white">
              Optimal Gold Allocation from Current Bank ({formatGameNumber(currentGoldBank)}g)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Distributes your existing gold into the most critical ratio bottlenecks first
              (DBM/Giants carries, MP worm sustain, and maxing Lv. 21 supports).
            </p>
          </div>

          {distributionResult.allocations.length > 0 && (
            <button
              onClick={handleExecuteUpgrades}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
            >
              <Zap className="w-4 h-4 fill-current" />
              Apply Upgrades ({formatGameNumber(distributionResult.totalSpent)}g)
            </button>
          )}
        </div>

        {distributionResult.allocations.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            {currentGoldBank <= 0
              ? 'Enter gold amount in your bank above to view recommended level purchases.'
              : 'All units are already at or above their target ratios! No upgrades required.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {distributionResult.allocations.map((alloc) => (
              <div
                key={alloc.slotKey}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: alloc.iconColor }}
                      />
                      <span className="font-semibold text-xs text-white">
                        {alloc.shortName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-nums text-emerald-400 font-semibold">
                      +{alloc.addedLevels} Levels
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400 mt-2">
                    <span>
                      Lv. {alloc.startLevel} →{' '}
                      <strong className="text-white">
                        Lv. {alloc.startLevel + alloc.addedLevels}
                      </strong>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Target: Lv. {alloc.targetLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-nums">
                  <span className="text-slate-500">Upgrade Cost:</span>
                  <span className="text-amber-300 font-bold">
                    {formatGameNumber(alloc.cost)}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority Upgrade Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              Full Deck Upgrade Priority Ranking
            </h3>
          </div>
          <span className="text-xs font-mono-nums text-slate-400">
            {priorityList.length} units with deficit
          </span>
        </div>

        {priorityList.length === 0 ? (
          <div className="py-8 text-center text-emerald-400 text-xs font-medium">
            🎉 Outstanding! Your deck is completely balanced and optimized for Wave{' '}
            {currentWave.toLocaleString()}!
          </div>
        ) : (
          <div className="space-y-2">
            {priorityList.map((item, idx) => (
              <div
                key={item.slotKey}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:bg-slate-950 text-xs font-mono-nums transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-500 w-5 text-center">
                    #{idx + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.iconColor }}
                  />
                  <div>
                    <span className="font-semibold text-white block font-sans">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      {item.definition.ratioTip}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Lv. {item.currentLevel} → Lv. {item.analysis.targetLevel}
                    </span>
                    <span className="text-rose-400 font-semibold text-[10px]">
                      -{item.analysis.levelDelta} Deficit
                    </span>
                  </div>

                  <div className="w-24">
                    <span className="text-amber-300 font-bold block">
                      {formatGameNumber(item.analysis.goldNeeded)}g
                    </span>
                    <span className="text-[9px] text-slate-500">Full Catchup</span>
                  </div>

                  <button
                    onClick={() => item.onUpdateLevel(item.analysis.targetLevel)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-sans transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
