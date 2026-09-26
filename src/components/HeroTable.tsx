import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Coins,
  Zap,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { UnitRowData } from '../types';
import { formatGameNumber, formatRatioPercent } from '../data/growCastleData';

interface HeroTableProps {
  unitRows: UnitRowData[];
  currentWave: number;
  totalGoldNeeded: number;
  totalLevelsNeeded: number;
  isArcherless: boolean;
  onSetAllToTarget: () => void;
  onMaxSupport: () => void;
  onSelectSlot?: (slotKey: string) => void;
}

type SortField = 'priority' | 'name' | 'currentLevel' | 'currentRatio' | 'targetRatio' | 'goldNeeded' | 'levelDelta';
type SortOrder = 'asc' | 'desc';

export const HeroTable: React.FC<HeroTableProps> = ({
  unitRows,
  currentWave,
  totalGoldNeeded,
  totalLevelsNeeded,
  isArcherless,
  onSetAllToTarget,
  onMaxSupport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filtered & Sorted rows
  const processedRows = useMemo(() => {
    let rows = unitRows.filter((r) => {
      if (isArcherless && r.id === 'town_archers') return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!r.name.toLowerCase().includes(query) && !r.shortName.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (categoryFilter !== 'ALL') {
        if (categoryFilter === 'CARRIES' && r.category !== 'MAIN_DPS') return false;
        if (categoryFilter === 'SUB_DPS' && r.category !== 'SUB_DPS') return false;
        if (categoryFilter === 'SUPPORT' && r.category !== 'SUPPORT_FIXED' && r.category !== 'UTILITY') return false;
        if (categoryFilter === 'LEADER' && r.category !== 'LEADER') return false;
        if (categoryFilter === 'TOWER' && r.category !== 'TOWER') return false;
        if (categoryFilter === 'STRUCTURE' && r.category !== 'STRUCTURE') return false;
      }
      return true;
    });

    // Sorting logic
    rows.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'priority') {
        // Most deficit and gold needed first
        comparison = (b.analysis.levelDelta * 1000) - (a.analysis.levelDelta * 1000);
      } else if (sortField === 'name') {
        comparison = a.shortName.localeCompare(b.shortName);
      } else if (sortField === 'currentLevel') {
        comparison = a.currentLevel - b.currentLevel;
      } else if (sortField === 'currentRatio') {
        comparison = a.analysis.currentRatio - b.analysis.currentRatio;
      } else if (sortField === 'targetRatio') {
        comparison = a.targetRatio - b.targetRatio;
      } else if (sortField === 'goldNeeded') {
        comparison = a.analysis.goldNeeded - b.analysis.goldNeeded;
      } else if (sortField === 'levelDelta') {
        comparison = a.analysis.levelDelta - b.analysis.levelDelta;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return rows;
  }, [unitRows, searchQuery, categoryFilter, sortField, sortOrder, isArcherless]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header Info & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search heroes & towers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none w-56 placeholder:text-slate-600"
            />
          </div>

          {/* Interactive filter segmented buttons (allowed per section 1A) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Units' },
              { id: 'CARRIES', label: 'Main DPS' },
              { id: 'SUB_DPS', label: 'Sub DPS' },
              { id: 'SUPPORT', label: 'Supports (Cap 21)' },
              { id: 'LEADER', label: 'Leaders' },
              { id: 'TOWER', label: 'Towers' },
              { id: 'STRUCTURE', label: 'Structures' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === tab.id
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSetAllToTarget}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Set All to Target
          </button>
          <button
            onClick={onMaxSupport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Max Support (21)
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono-nums text-[11px] uppercase tracking-wider">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Unit / Hero</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('currentLevel')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Current Lv</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('currentRatio')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Current Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('targetRatio')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Target Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right">Target Lv</th>
                <th
                  onClick={() => handleSort('levelDelta')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Deficit</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('goldNeeded')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Gold Needed</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-mono-nums">
              {processedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-sans">
                    No matching units found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                processedRows.map((row) => {
                  const isBehind = row.analysis.status === 'BEHIND';
                  const isCritical = row.analysis.status === 'CRITICAL';
                  const isFixed = row.isFixedCap;

                  return (
                    <tr
                      key={row.slotKey}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Role */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: row.iconColor }}
                          />
                          <div>
                            <span className="font-semibold text-white block font-sans">
                              {row.shortName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-sans">
                              <span>{row.element}</span>
                              <span aria-hidden="true">·</span>
                              <span>{row.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Level with Inline Stepper */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => row.onUpdateLevel(Math.max(1, row.currentLevel - 10))}
                            className="text-[10px] text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-slate-800"
                            title="-10 Levels"
                          >
                            -10
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={row.currentLevel}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) row.onUpdateLevel(val);
                            }}
                            className="w-16 bg-slate-950 text-right px-1.5 py-0.5 rounded border border-slate-800 text-white font-bold text-xs"
                          />
                          <button
                            onClick={() => row.onUpdateLevel(row.currentLevel + 10)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 p-0.5 rounded hover:bg-slate-800"
                            title="+10 Levels"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Current Ratio */}
                      <td className="py-3 px-3 text-right">
                        <span className={`font-semibold ${row.analysis.statusColor}`}>
                          {formatRatioPercent(row.analysis.currentRatio)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          1:{(1 / Math.max(0.0001, row.analysis.currentRatio)).toFixed(1)}
                        </span>
                      </td>

                      {/* Target Ratio */}
                      <td className="py-3 px-3 text-right">
                        {isFixed ? (
                          <span className="text-slate-500 text-[11px]">Fixed Cap</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.005"
                              min="0"
                              max="1"
                              value={row.targetRatio}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) row.onUpdateRatio(val);
                              }}
                              className="w-14 bg-slate-950 text-right px-1 py-0.5 rounded border border-slate-800 text-amber-300 text-xs"
                            />
                            <span className="text-slate-400 text-[10px]">
                              ({formatRatioPercent(row.targetRatio)})
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Target Level */}
                      <td className="py-3 px-3 text-right text-slate-200 font-semibold">
                        Lv. {row.analysis.targetLevel.toLocaleString()}
                      </td>

                      {/* Level Deficit */}
                      <td className="py-3 px-3 text-right">
                        {row.analysis.levelDelta > 0 ? (
                          <span className="text-rose-400 font-bold">
                            -{row.analysis.levelDelta.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">✓ Ready</span>
                        )}
                      </td>

                      {/* Gold Needed */}
                      <td className="py-3 px-3 text-right">
                        <span
                          className={
                            row.analysis.goldNeeded > 0
                              ? 'text-amber-300 font-semibold'
                              : 'text-slate-500'
                          }
                        >
                          {row.analysis.goldNeeded > 0
                            ? `${formatGameNumber(row.analysis.goldNeeded)}g`
                            : '0g'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[11px] font-semibold font-sans px-2 py-0.5 rounded ${
                            row.analysis.status === 'OPTIMAL'
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : row.analysis.status === 'OVERLEVELED'
                              ? 'text-sky-400 bg-sky-950/40'
                              : row.analysis.status === 'BEHIND'
                              ? 'text-amber-400 bg-amber-950/40'
                              : row.analysis.status === 'CRITICAL'
                              ? 'text-rose-400 bg-rose-950/40'
                              : 'text-cyan-400 bg-cyan-950/40'
                          }`}
                        >
                          {row.analysis.statusLabel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => row.onUpdateLevel(row.analysis.targetLevel)}
                          disabled={row.analysis.levelDelta <= 0}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded font-sans transition-colors ${
                            row.analysis.levelDelta > 0
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          Match Target
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Aggregate Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-nums">
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Total Units Evaluated:{' '}
              <strong className="text-white">{processedRows.length}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Total Levels to Optimal:{' '}
              <strong className="text-amber-300">
                {totalLevelsNeeded.toLocaleString()}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Gold Investment:</span>
            <span className="text-sm font-bold text-amber-300">
              {formatGameNumber(totalGoldNeeded)} Gold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
