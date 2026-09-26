import React, { useState } from 'react';
import {
  Shield,
  Zap,
  ArrowUpRight,
  Plus,
  Minus,
  Sparkles,
  Info,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Target,
  Crown,
  TowerControl,
} from 'lucide-react';
import {
  HeroDefinition,
  formatGameNumber,
  formatRatioPercent,
  evaluateRatio,
} from '../data/growCastleData';
import { GrowCastleDeckState, HeroSlotState } from '../types';
import bannerImage from '../assets/images/grow_castle_banner_1790420646579.jpg';

interface CastleVisualizerProps {
  deck: GrowCastleDeckState;
  heroMap: Map<string, HeroDefinition>;
  setHeroLevel: (slotIndex: number, lvl: number) => void;
  setHeroTargetRatio: (slotIndex: number, ratio: number) => void;
  onOpenHeroSwap: (slotIndex: number) => void;
  setCastleLevel: (lvl: number) => void;
  setCastleTargetRatio: (ratio: number) => void;
  setTownArchersLevel: (lvl: number) => void;
  setTownArchersTargetRatio: (ratio: number) => void;
  toggleArcherless: () => void;
  setLeaderLevel: (lvl: number) => void;
  setLeaderTargetRatio: (ratio: number) => void;
  onOpenLeaderSwap: () => void;
  setTowerLevel: (slotIndex: number, lvl: number) => void;
  setTowerTargetRatio: (slotIndex: number, ratio: number) => void;
  onOpenTowerSwap: (slotIndex: number) => void;
}

export const CastleVisualizer: React.FC<CastleVisualizerProps> = ({
  deck,
  heroMap,
  setHeroLevel,
  setHeroTargetRatio,
  onOpenHeroSwap,
  setCastleLevel,
  setCastleTargetRatio,
  setTownArchersLevel,
  setTownArchersTargetRatio,
  toggleArcherless,
  setLeaderLevel,
  setLeaderTargetRatio,
  onOpenLeaderSwap,
  setTowerLevel,
  setTowerTargetRatio,
  onOpenTowerSwap,
}) => {
  // Selected slot for the slide-out detail / quick action inspector
  const [selectedSlot, setSelectedSlot] = useState<{
    type: 'hero' | 'leader' | 'tower' | 'castle' | 'ta';
    index?: number;
  }>({ type: 'hero', index: 5 }); // Default to DBM (Slot 5)

  // Determine active unit based on selection
  const activeUnit = React.useMemo(() => {
    if (selectedSlot.type === 'castle') {
      const def = heroMap.get('castle_base')!;
      const analysis = evaluateRatio(
        deck.castleLevel,
        deck.castleTargetRatio,
        deck.currentWave,
        false,
        undefined,
        def.baseUpgradeCost
      );
      return {
        name: def.name,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        description: def.description,
        ratioTip: def.ratioTip,
        currentLevel: deck.castleLevel,
        targetRatio: deck.castleTargetRatio,
        analysis,
        isFixedCap: false,
        onUpdateLevel: setCastleLevel,
        onUpdateRatio: setCastleTargetRatio,
        canSwap: false,
      };
    }

    if (selectedSlot.type === 'ta') {
      const def = heroMap.get('town_archers')!;
      const analysis = evaluateRatio(
        deck.townArchersLevel,
        deck.townArchersTargetRatio,
        deck.currentWave,
        false,
        undefined,
        def.baseUpgradeCost
      );
      return {
        name: def.name,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        description: def.description,
        ratioTip: def.ratioTip,
        currentLevel: deck.townArchersLevel,
        targetRatio: deck.townArchersTargetRatio,
        analysis,
        isFixedCap: false,
        onUpdateLevel: setTownArchersLevel,
        onUpdateRatio: setTownArchersTargetRatio,
        canSwap: false,
      };
    }

    if (selectedSlot.type === 'leader') {
      const def = heroMap.get(deck.leaderSlot.heroId)!;
      const ratio = deck.leaderSlot.customRatio ?? def.defaultTargetRatio;
      const analysis = evaluateRatio(
        deck.leaderSlot.currentLevel,
        ratio,
        deck.currentWave,
        def.isFixedCap,
        def.fixedCapLevel,
        def.baseUpgradeCost
      );
      return {
        name: def.name,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        description: def.description,
        ratioTip: def.ratioTip,
        currentLevel: deck.leaderSlot.currentLevel,
        targetRatio: ratio,
        analysis,
        isFixedCap: !!def.isFixedCap,
        fixedCapLevel: def.fixedCapLevel,
        onUpdateLevel: setLeaderLevel,
        onUpdateRatio: setLeaderTargetRatio,
        canSwap: true,
        onSwap: onOpenLeaderSwap,
      };
    }

    if (selectedSlot.type === 'tower') {
      const t = deck.towers[selectedSlot.index ?? 0];
      const def = heroMap.get(t.heroId)!;
      const ratio = t.customRatio ?? def.defaultTargetRatio;
      const analysis = evaluateRatio(
        t.currentLevel,
        ratio,
        deck.currentWave,
        def.isFixedCap,
        def.fixedCapLevel,
        def.baseUpgradeCost
      );
      return {
        name: def.name,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        description: def.description,
        ratioTip: def.ratioTip,
        currentLevel: t.currentLevel,
        targetRatio: ratio,
        analysis,
        isFixedCap: !!def.isFixedCap,
        fixedCapLevel: def.fixedCapLevel,
        onUpdateLevel: (lvl: number) => setTowerLevel(t.slotIndex, lvl),
        onUpdateRatio: (r: number) => setTowerTargetRatio(t.slotIndex, r),
        canSwap: true,
        onSwap: () => onOpenTowerSwap(t.slotIndex),
      };
    }

    // Default: Hero Slot
    const slotIdx = selectedSlot.index ?? 0;
    const heroSlot = deck.heroSlots.find((s) => s.slotIndex === slotIdx) || deck.heroSlots[0];
    const def = heroMap.get(heroSlot.heroId)!;
    const ratio = heroSlot.customRatio ?? def.defaultTargetRatio;
    const analysis = evaluateRatio(
      heroSlot.currentLevel,
      ratio,
      deck.currentWave,
      def.isFixedCap,
      def.fixedCapLevel,
      def.baseUpgradeCost
    );
    return {
      name: def.name,
      shortName: def.shortName,
      category: def.category,
      element: def.element,
      iconColor: def.iconColor,
      description: def.description,
      ratioTip: def.ratioTip,
      currentLevel: heroSlot.currentLevel,
      targetRatio: ratio,
      analysis,
      isFixedCap: !!def.isFixedCap,
      fixedCapLevel: def.fixedCapLevel,
      onUpdateLevel: (lvl: number) => setHeroLevel(slotIdx, lvl),
      onUpdateRatio: (r: number) => setHeroTargetRatio(slotIdx, r),
      canSwap: true,
      onSwap: () => onOpenHeroSwap(slotIdx),
    };
  }, [
    selectedSlot,
    deck,
    heroMap,
    setHeroLevel,
    setHeroTargetRatio,
    onOpenHeroSwap,
    setCastleLevel,
    setCastleTargetRatio,
    setTownArchersLevel,
    setTownArchersTargetRatio,
    setLeaderLevel,
    setLeaderTargetRatio,
    onOpenLeaderSwap,
    setTowerLevel,
    setTowerTargetRatio,
    onOpenTowerSwap,
  ]);

  // Floors: Floor 4 (indices 0,1,2), Floor 3 (3,4,5), Floor 2 (6,7,8), Floor 1 (9,10,11)
  const floorConfig = [
    { floorNum: 4, label: 'Floor 4 (Top)', slots: [0, 1, 2] },
    { floorNum: 3, label: 'Floor 3', slots: [3, 4, 5] },
    { floorNum: 2, label: 'Floor 2', slots: [6, 7, 8] },
    { floorNum: 1, label: 'Floor 1 (Ground)', slots: [9, 10, 11] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Visualizer Hero Header Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={bannerImage}
            alt="Grow Castle Backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-nums text-amber-400 font-semibold mb-1">
              <span>CASTLE RATIO MATRIX</span>
              <span aria-hidden="true">·</span>
              <span>4 FLOORS · 12 HEROES · 4 TOWERS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Castle Deck Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Click any hero, leader, tower, or structure slot to inspect ratio health, check
              gold upgrade costs, and calibrate levels for Wave {deck.currentWave.toLocaleString()}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleArcherless}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                deck.isArcherless
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800/80 hover:bg-rose-900/40'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/40'
              }`}
            >
              Mode: {deck.isArcherless ? 'Archerless Build (0x TA)' : 'Town Archer Build (0.45x TA)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Castle Layout (Left/Center) + Inspector Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Castle Tower Architecture (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* The Castle Structure */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative shadow-md">
            {/* Castle Roof Trim */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono-nums text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Castle Tower Battlement</span>
              </div>
              <span>Click a hero to inspect & calibrate</span>
            </div>

            {/* 4 Floors of Heroes */}
            <div className="space-y-3">
              {floorConfig.map((floor) => (
                <div
                  key={floor.floorNum}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 relative group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-nums text-slate-500 mb-2 px-1">
                    <span className="font-semibold text-slate-400">{floor.label}</span>
                    <span className="text-[10px]">
                      {floor.floorNum === 4 ? 'Cooldown Spot (Pure Wiz)' : 'Hero Placement'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {floor.slots.map((slotIdx) => {
                      const slot = deck.heroSlots.find((s) => s.slotIndex === slotIdx);
                      if (!slot) return null;
                      const def = heroMap.get(slot.heroId);
                      if (!def) return null;
                      const ratio = slot.customRatio ?? def.defaultTargetRatio;
                      const analysis = evaluateRatio(
                        slot.currentLevel,
                        ratio,
                        deck.currentWave,
                        def.isFixedCap,
                        def.fixedCapLevel,
                        def.baseUpgradeCost
                      );

                      const isSelected =
                        selectedSlot.type === 'hero' && selectedSlot.index === slotIdx;

                      // Status styles
                      let borderClass = 'border-slate-800 hover:border-slate-700';
                      let statusBadge = (
                        <span className="text-[10px] font-mono-nums text-emerald-400">
                          {formatRatioPercent(analysis.currentRatio)}
                        </span>
                      );

                      if (def.isFixedCap) {
                        borderClass =
                          slot.currentLevel >= (def.fixedCapLevel || 21)
                            ? 'border-cyan-500/30 bg-cyan-950/10'
                            : 'border-amber-500/40 bg-amber-950/10';
                        statusBadge = (
                          <span className="text-[10px] font-mono-nums text-cyan-300">
                            Lv. {slot.currentLevel}/{def.fixedCapLevel}
                          </span>
                        );
                      } else if (analysis.status === 'OPTIMAL') {
                        borderClass = 'border-emerald-500/40 bg-emerald-950/10';
                      } else if (analysis.status === 'OVERLEVELED') {
                        borderClass = 'border-sky-500/40 bg-sky-950/10';
                      } else if (analysis.status === 'BEHIND') {
                        borderClass = 'border-amber-500/50 bg-amber-950/10';
                      } else {
                        borderClass = 'border-rose-500/60 bg-rose-950/10';
                      }

                      if (isSelected) {
                        borderClass += ' ring-2 ring-amber-400 shadow-md';
                      }

                      return (
                        <button
                          key={slotIdx}
                          onClick={() => setSelectedSlot({ type: 'hero', index: slotIdx })}
                          className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${borderClass} relative overflow-hidden`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: def.iconColor }}
                            />
                            {statusBadge}
                          </div>

                          <div className="font-semibold text-xs text-white truncate w-full">
                            {def.shortName}
                          </div>

                          <div className="flex items-center justify-between mt-1 text-[11px] font-mono-nums text-slate-400 w-full">
                            <span>Lv. {slot.currentLevel}</span>
                            <span className="text-slate-500 text-[10px]">
                              {def.isFixedCap ? 'Cap 21' : `T: ${formatRatioPercent(ratio)}`}
                            </span>
                          </div>

                          {/* Quick progress indicator */}
                          {!def.isFixedCap && (
                            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  analysis.status === 'OPTIMAL' || analysis.status === 'OVERLEVELED'
                                    ? 'bg-emerald-400'
                                    : analysis.status === 'BEHIND'
                                    ? 'bg-amber-400'
                                    : 'bg-rose-500'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round((slot.currentLevel / Math.max(1, analysis.targetLevel)) * 100)
                                  )}%`,
                                }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Castle Base & Town Archers Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
              {/* Castle Base Slot */}
              <button
                onClick={() => setSelectedSlot({ type: 'castle' })}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  selectedSlot.type === 'castle'
                    ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800/80'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Castle Base (HP & MP)
                  </span>
                  <span className="text-[10px] font-mono-nums text-slate-400">
                    Ratio: {formatRatioPercent(deck.castleLevel / deck.currentWave)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono-nums text-slate-300">
                  <span>Level {deck.castleLevel.toLocaleString()}</span>
                  <span className="text-slate-500">Target: {formatRatioPercent(deck.castleTargetRatio)}</span>
                </div>
              </button>

              {/* Town Archers Slot */}
              <button
                onClick={() => setSelectedSlot({ type: 'ta' })}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  selectedSlot.type === 'ta'
                    ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800/80'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Town Archers
                  </span>
                  <span className="text-[10px] font-mono-nums text-slate-400">
                    {deck.isArcherless ? 'Archerless' : `Ratio: ${formatRatioPercent(deck.townArchersLevel / deck.currentWave)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono-nums text-slate-300">
                  <span>
                    {deck.isArcherless ? '0 (Disabled)' : `Level ${deck.townArchersLevel.toLocaleString()}`}
                  </span>
                  <span className="text-slate-500">
                    {deck.isArcherless ? 'Recommended Meta' : `Target: ${formatRatioPercent(deck.townArchersTargetRatio)}`}
                  </span>
                </div>
              </button>
            </div>

            {/* Front Defense: Leader & 4 Castle Towers */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-[11px] font-mono-nums text-slate-400 font-semibold mb-2 flex items-center justify-between">
                <span>FRONT DEFENSE: LEADER & DEFENSIVE TOWERS</span>
                <span className="text-[10px] text-slate-500">Death Worm (1%) fuels MP!</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* Leader Slot */}
                {(() => {
                  const def = heroMap.get(deck.leaderSlot.heroId);
                  const isSelected = selectedSlot.type === 'leader';
                  const ratio = deck.leaderSlot.customRatio ?? def?.defaultTargetRatio ?? 0.045;
                  return (
                    <button
                      onClick={() => setSelectedSlot({ type: 'leader' })}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold mb-1">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          LEADER
                        </span>
                        <span>{formatRatioPercent(deck.leaderSlot.currentLevel / deck.currentWave)}</span>
                      </div>
                      <span className="font-semibold text-xs text-white truncate">
                        {def?.shortName}
                      </span>
                      <span className="text-[10px] font-mono-nums text-slate-400 mt-1">
                        Lv. {deck.leaderSlot.currentLevel}
                      </span>
                    </button>
                  );
                })()}

                {/* 4 Tower Slots */}
                {deck.towers.map((t) => {
                  const def = heroMap.get(t.heroId);
                  const isSelected =
                    selectedSlot.type === 'tower' && selectedSlot.index === t.slotIndex;
                  return (
                    <button
                      key={t.slotIndex}
                      onClick={() => setSelectedSlot({ type: 'tower', index: t.slotIndex })}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-nums mb-1">
                        <span>TOWER {t.slotIndex + 1}</span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: def?.iconColor }}
                        />
                      </div>
                      <span className="font-semibold text-xs text-white truncate">
                        {def?.shortName}
                      </span>
                      <span className="text-[10px] font-mono-nums text-slate-400 mt-1">
                        Lv. {t.currentLevel} {def?.isFixedCap ? `(Cap ${def.fixedCapLevel})` : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Slot Inspector & Quick Calibrator (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-24 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeUnit.iconColor }}
                />
                <h3 className="font-display font-bold text-base text-white truncate">
                  {activeUnit.name}
                </h3>
              </div>
              {activeUnit.canSwap && (
                <button
                  onClick={activeUnit.onSwap}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Swap
                </button>
              )}
            </div>

            {/* Role & Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeUnit.description}
            </p>

            {/* Ratio Tip Box */}
            <div className="p-3 bg-slate-950/80 border border-amber-500/20 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono-nums text-[11px]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                COMMUNITY RATIO RULE
              </div>
              <p className="text-slate-300 leading-normal text-[11px]">
                {activeUnit.ratioTip}
              </p>
            </div>

            {/* Ratio Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-nums">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Current Level</span>
                <span className="text-base font-bold text-white">
                  Lv. {activeUnit.currentLevel.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Ratio: {formatRatioPercent(activeUnit.analysis.currentRatio)}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Target Level</span>
                <span className="text-base font-bold text-amber-300">
                  Lv. {activeUnit.analysis.targetLevel.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {activeUnit.isFixedCap
                    ? `Fixed Cap ${activeUnit.fixedCapLevel}`
                    : `Goal: ${formatRatioPercent(activeUnit.targetRatio)}`}
                </span>
              </div>
            </div>

            {/* Status & Level Deficit */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono-nums">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Status</span>
                <span className={`font-bold ${activeUnit.analysis.statusColor}`}>
                  {activeUnit.analysis.statusLabel}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Gold to Target</span>
                <span className="font-bold text-amber-300">
                  {formatGameNumber(activeUnit.analysis.goldNeeded)}g
                </span>
              </div>
            </div>

            {/* Quick Level Adjusters */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400">
                <span>Adjust Level</span>
                <span>Current: Lv. {activeUnit.currentLevel}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => activeUnit.onUpdateLevel(Math.max(1, activeUnit.currentLevel - 100))}
                  className="py-1 text-xs font-mono-nums bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded transition-colors"
                >
                  -100
                </button>
                <button
                  onClick={() => activeUnit.onUpdateLevel(Math.max(1, activeUnit.currentLevel - 10))}
                  className="py-1 text-xs font-mono-nums bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded transition-colors"
                >
                  -10
                </button>
                <button
                  onClick={() => activeUnit.onUpdateLevel(activeUnit.currentLevel + 10)}
                  className="py-1 text-xs font-mono-nums bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-semibold rounded transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => activeUnit.onUpdateLevel(activeUnit.currentLevel + 100)}
                  className="py-1 text-xs font-mono-nums bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-semibold rounded transition-colors"
                >
                  +100
                </button>
              </div>

              {/* Set Exact Level Input */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min="1"
                  value={activeUnit.currentLevel}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) activeUnit.onUpdateLevel(val);
                  }}
                  className="w-full bg-slate-950 text-white text-xs font-mono-nums px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
                  placeholder="Direct level..."
                />
                <button
                  onClick={() => activeUnit.onUpdateLevel(activeUnit.analysis.targetLevel)}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg whitespace-nowrap shadow-sm"
                  title="Level to exact target"
                >
                  To Target
                </button>
              </div>

              {/* Target Ratio Slider (for non-fixed units) */}
              {!activeUnit.isFixedCap && (
                <div className="space-y-1 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono-nums text-slate-400">
                    <span>Target Ratio</span>
                    <span className="text-amber-300 font-semibold">
                      {formatRatioPercent(activeUnit.targetRatio)} (1:{(1 / Math.max(0.0001, activeUnit.targetRatio)).toFixed(1)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.005"
                    max="0.10"
                    step="0.005"
                    value={activeUnit.targetRatio}
                    onChange={(e) => activeUnit.onUpdateRatio(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-600 font-mono-nums">
                    <span>0.5% (Low)</span>
                    <span>5.0% (Meta DPS)</span>
                    <span>10.0% (Heavy)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
