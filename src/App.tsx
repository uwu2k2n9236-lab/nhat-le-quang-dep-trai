/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { WaveControlBar } from './components/WaveControlBar';
import { CastleVisualizer } from './components/CastleVisualizer';
import { HeroTable } from './components/HeroTable';
import { GoldPlanner } from './components/GoldPlanner';
import { MilestoneProjector } from './components/MilestoneProjector';
import { RatioGuide } from './components/RatioGuide';
import { HeroSelectorModal } from './components/HeroSelectorModal';
import { useGrowCastle } from './hooks/useGrowCastle';
import { CheckCircle2, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizer');

  const {
    deck,
    unitRows,
    overallStats,
    heroMap,
    notification,
    setWave,
    incrementWave,
    setCastleLevel,
    setCastleTargetRatio,
    setTownArchersLevel,
    setTownArchersTargetRatio,
    toggleArcherless,
    setHeroLevel,
    setHeroTargetRatio,
    swapHeroInSlot,
    setLeaderLevel,
    setLeaderTargetRatio,
    swapLeader,
    setTowerLevel,
    setTowerTargetRatio,
    swapTower,
    setGoldBank,
    setGoldPerWave,
    loadPreset,
    maxAllSupportHeroes,
    setAllDamageHeroesToTarget,
    resetToDefaults,
  } = useGrowCastle();

  // Modal State for Swapping Heroes/Leaders/Towers
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    slotType: 'hero' | 'leader' | 'tower';
    slotIndex?: number;
    currentHeroId: string;
    title: string;
  }>({
    isOpen: false,
    slotType: 'hero',
    currentHeroId: '',
    title: '',
  });

  const handleOpenHeroSwap = (slotIndex: number) => {
    const slot = deck.heroSlots.find((s) => s.slotIndex === slotIndex);
    if (!slot) return;
    setSwapModalState({
      isOpen: true,
      slotType: 'hero',
      slotIndex,
      currentHeroId: slot.heroId,
      title: `Hero Slot ${slotIndex + 1}`,
    });
  };

  const handleOpenLeaderSwap = () => {
    setSwapModalState({
      isOpen: true,
      slotType: 'leader',
      currentHeroId: deck.leaderSlot.heroId,
      title: 'Leader Slot',
    });
  };

  const handleOpenTowerSwap = (towerSlotIndex: number) => {
    const t = deck.towers.find((tw) => tw.slotIndex === towerSlotIndex);
    if (!t) return;
    setSwapModalState({
      isOpen: true,
      slotType: 'tower',
      slotIndex: towerSlotIndex,
      currentHeroId: t.heroId,
      title: `Tower ${towerSlotIndex + 1}`,
    });
  };

  const handleModalSelect = (heroId: string) => {
    if (swapModalState.slotType === 'leader') {
      swapLeader(heroId);
    } else if (swapModalState.slotType === 'tower' && swapModalState.slotIndex !== undefined) {
      swapTower(swapModalState.slotIndex, heroId);
    } else if (swapModalState.slotIndex !== undefined) {
      swapHeroInSlot(swapModalState.slotIndex, heroId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        balanceScore={overallStats.balanceScorePercent}
        currentWave={deck.currentWave}
      />

      {/* Global Wave Control Toolbar */}
      <WaveControlBar
        currentWave={deck.currentWave}
        setWave={setWave}
        incrementWave={incrementWave}
        totalGoldNeeded={overallStats.totalGoldNeeded}
        balanceScore={overallStats.balanceScorePercent}
        unitsOnTarget={overallStats.unitsOnTarget}
        totalUnits={deck.isArcherless ? unitRows.length - 1 : unitRows.length}
        activePresetId={deck.activePresetId}
        loadPreset={loadPreset}
        onSetAllToTarget={setAllDamageHeroesToTarget}
        onMaxSupport={maxAllSupportHeroes}
        onResetDefaults={resetToDefaults}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'visualizer' && (
          <CastleVisualizer
            deck={deck}
            heroMap={heroMap}
            setHeroLevel={setHeroLevel}
            setHeroTargetRatio={setHeroTargetRatio}
            onOpenHeroSwap={handleOpenHeroSwap}
            setCastleLevel={setCastleLevel}
            setCastleTargetRatio={setCastleTargetRatio}
            setTownArchersLevel={setTownArchersLevel}
            setTownArchersTargetRatio={setTownArchersTargetRatio}
            toggleArcherless={toggleArcherless}
            setLeaderLevel={setLeaderLevel}
            setLeaderTargetRatio={setLeaderTargetRatio}
            onOpenLeaderSwap={handleOpenLeaderSwap}
            setTowerLevel={setTowerLevel}
            setTowerTargetRatio={setTowerTargetRatio}
            onOpenTowerSwap={handleOpenTowerSwap}
          />
        )}

        {activeTab === 'table' && (
          <HeroTable
            unitRows={unitRows}
            currentWave={deck.currentWave}
            totalGoldNeeded={overallStats.totalGoldNeeded}
            totalLevelsNeeded={overallStats.totalLevelsNeeded}
            isArcherless={deck.isArcherless}
            onSetAllToTarget={setAllDamageHeroesToTarget}
            onMaxSupport={maxAllSupportHeroes}
          />
        )}

        {activeTab === 'gold_planner' && (
          <GoldPlanner
            unitRows={unitRows}
            currentWave={deck.currentWave}
            totalGoldNeeded={overallStats.totalGoldNeeded}
            currentGoldBank={deck.currentGoldBank}
            goldPerWave={deck.goldPerWave}
            setGoldBank={setGoldBank}
            setGoldPerWave={setGoldPerWave}
            isArcherless={deck.isArcherless}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestoneProjector
            currentWave={deck.currentWave}
            unitRows={unitRows}
            setWave={setWave}
            isArcherless={deck.isArcherless}
          />
        )}

        {activeTab === 'guide' && <RatioGuide />}
      </main>

      {/* Hero / Unit Swap Modal */}
      <HeroSelectorModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState((prev) => ({ ...prev, isOpen: false }))}
        onSelectHero={handleModalSelect}
        currentHeroId={swapModalState.currentHeroId}
        slotTitle={swapModalState.title}
        allowedCategory={
          swapModalState.slotType === 'leader'
            ? 'LEADER'
            : swapModalState.slotType === 'tower'
            ? 'TOWER'
            : 'HERO'
        }
      />

      {/* Floating Feedback Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-amber-300 px-4 py-2.5 rounded-xl border border-amber-500/30 shadow-2xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Quiet Footer (Anti-Slop Restraint) */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500/70" />
            <span className="text-slate-400 font-semibold font-display">Grow Castle Ratio Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Community wave balance & leveling utility</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono-nums text-[11px]">
            <span>Optimal Main DPS: 5.0% (1:20)</span>
            <span aria-hidden="true">·</span>
            <span>Support Hard Cap: Lv. 21</span>
            <span aria-hidden="true">·</span>
            <span>Worm MP Leech: 1.0%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
