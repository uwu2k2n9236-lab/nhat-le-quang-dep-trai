import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HERO_DATABASE,
  PRESET_BUILDS,
  evaluateRatio,
  estimateGoldCost,
  HeroDefinition,
  BuildPreset,
  RatioAnalysis,
} from '../data/growCastleData';
import { GrowCastleDeckState, HeroSlotState, UnitRowData } from '../types';

const STORAGE_KEY = 'grow_castle_tracker_state_v2';

const DEFAULT_STATE: GrowCastleDeckState = {
  currentWave: 10000,
  castleLevel: 800,
  castleTargetRatio: 0.08,
  townArchersLevel: 0,
  townArchersTargetRatio: 0.0,
  isArcherless: true,
  leaderSlot: {
    heroId: 'leader_edward',
    currentLevel: 450,
  },
  towers: [
    { slotIndex: 0, heroId: 'tower_death_worm', currentLevel: 100 },
    { slotIndex: 1, heroId: 'tower_lightning', currentLevel: 200 },
    { slotIndex: 2, heroId: 'tower_mirror', currentLevel: 99 },
    { slotIndex: 3, heroId: 'tower_trophy', currentLevel: 21 },
  ],
  heroSlots: [
    { slotIndex: 0, heroId: 'pure_wizard', currentLevel: 21 },
    { slotIndex: 1, heroId: 'dark_necromancer', currentLevel: 21 },
    { slotIndex: 2, heroId: 'bishop', currentLevel: 21 },
    { slotIndex: 3, heroId: 'dark_hunter', currentLevel: 31 },
    { slotIndex: 4, heroId: 'dark_elf', currentLevel: 350 },
    { slotIndex: 5, heroId: 'dbm', currentLevel: 500 },
    { slotIndex: 6, heroId: 'dark_chrono', currentLevel: 21 },
    { slotIndex: 7, heroId: 'stone_giant', currentLevel: 500 },
    { slotIndex: 8, heroId: 'poison_slingers', currentLevel: 300 },
    { slotIndex: 9, heroId: 'angel', currentLevel: 300 },
    { slotIndex: 10, heroId: 'dark_assassin', currentLevel: 200 },
    { slotIndex: 11, heroId: 'military_band_m', currentLevel: 21 },
  ],
  currentGoldBank: 50000000, // 50M initial gold bank
  goldPerWave: 150000, // 150k gold per wave
  activePresetId: 'physical_summon_meta',
};

export function useGrowCastle() {
  const [deck, setDeck] = useState<GrowCastleDeckState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage', e);
    }
    return DEFAULT_STATE;
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [deck]);

  // Helper map of all hero definitions
  const heroMap = useMemo(() => {
    const map = new Map<string, HeroDefinition>();
    HERO_DATABASE.forEach((h) => map.set(h.id, h));
    return map;
  }, []);

  // Set Wave Number
  const setWave = useCallback((newWave: number) => {
    const clamped = Math.max(1, Math.round(newWave));
    setDeck((prev) => ({ ...prev, currentWave: clamped }));
  }, []);

  // Increment wave by step
  const incrementWave = useCallback((delta: number) => {
    setDeck((prev) => ({
      ...prev,
      currentWave: Math.max(1, prev.currentWave + delta),
    }));
  }, []);

  // Update Castle level
  const setCastleLevel = useCallback((lvl: number) => {
    setDeck((prev) => ({ ...prev, castleLevel: Math.max(1, Math.round(lvl)) }));
  }, []);

  // Update Castle target ratio
  const setCastleTargetRatio = useCallback((ratio: number) => {
    setDeck((prev) => ({ ...prev, castleTargetRatio: Math.max(0.01, ratio) }));
  }, []);

  // Update Town Archers level
  const setTownArchersLevel = useCallback((lvl: number) => {
    setDeck((prev) => ({ ...prev, townArchersLevel: Math.max(0, Math.round(lvl)) }));
  }, []);

  // Update Town Archers target ratio
  const setTownArchersTargetRatio = useCallback((ratio: number) => {
    setDeck((prev) => ({
      ...prev,
      townArchersTargetRatio: Math.max(0, ratio),
      isArcherless: ratio === 0,
    }));
  }, []);

  // Toggle Archerless mode
  const toggleArcherless = useCallback(() => {
    setDeck((prev) => {
      const nextArcherless = !prev.isArcherless;
      return {
        ...prev,
        isArcherless: nextArcherless,
        townArchersTargetRatio: nextArcherless ? 0 : 0.45,
      };
    });
  }, []);

  // Update Hero Level in slot
  const setHeroLevel = useCallback((slotIndex: number, lvl: number) => {
    setDeck((prev) => ({
      ...prev,
      heroSlots: prev.heroSlots.map((slot) =>
        slot.slotIndex === slotIndex ? { ...slot, currentLevel: Math.max(1, Math.round(lvl)) } : slot
      ),
    }));
  }, []);

  // Update Hero Target Ratio in slot
  const setHeroTargetRatio = useCallback((slotIndex: number, ratio: number) => {
    setDeck((prev) => ({
      ...prev,
      heroSlots: prev.heroSlots.map((slot) =>
        slot.slotIndex === slotIndex ? { ...slot, customRatio: Math.max(0, ratio) } : slot
      ),
    }));
  }, []);

  // Swap Hero in slot
  const swapHeroInSlot = useCallback((slotIndex: number, newHeroId: string) => {
    setDeck((prev) => {
      const newDef = heroMap.get(newHeroId);
      const initialLevel = newDef?.isFixedCap ? newDef.fixedCapLevel || 21 : 100;
      return {
        ...prev,
        heroSlots: prev.heroSlots.map((slot) =>
          slot.slotIndex === slotIndex
            ? {
                ...slot,
                heroId: newHeroId,
                currentLevel: initialLevel,
                customRatio: undefined,
              }
            : slot
        ),
      };
    });
    showToast('Hero updated in deck slot.');
  }, [heroMap, showToast]);

  // Update Leader
  const setLeaderLevel = useCallback((lvl: number) => {
    setDeck((prev) => ({
      ...prev,
      leaderSlot: { ...prev.leaderSlot, currentLevel: Math.max(1, Math.round(lvl)) },
    }));
  }, []);

  const setLeaderTargetRatio = useCallback((ratio: number) => {
    setDeck((prev) => ({
      ...prev,
      leaderSlot: { ...prev.leaderSlot, customRatio: Math.max(0, ratio) },
    }));
  }, []);

  const swapLeader = useCallback((leaderId: string) => {
    setDeck((prev) => ({
      ...prev,
      leaderSlot: {
        heroId: leaderId,
        currentLevel: prev.leaderSlot.currentLevel || 200,
        customRatio: undefined,
      },
    }));
    showToast('Leader swapped.');
  }, [showToast]);

  // Update Towers
  const setTowerLevel = useCallback((towerSlotIndex: number, lvl: number) => {
    setDeck((prev) => ({
      ...prev,
      towers: prev.towers.map((t) =>
        t.slotIndex === towerSlotIndex ? { ...t, currentLevel: Math.max(1, Math.round(lvl)) } : t
      ),
    }));
  }, []);

  const setTowerTargetRatio = useCallback((towerSlotIndex: number, ratio: number) => {
    setDeck((prev) => ({
      ...prev,
      towers: prev.towers.map((t) =>
        t.slotIndex === towerSlotIndex ? { ...t, customRatio: Math.max(0, ratio) } : t
      ),
    }));
  }, []);

  const swapTower = useCallback((towerSlotIndex: number, towerId: string) => {
    setDeck((prev) => {
      const def = heroMap.get(towerId);
      const lvl = def?.isFixedCap ? def.fixedCapLevel || 21 : 100;
      return {
        ...prev,
        towers: prev.towers.map((t) =>
          t.slotIndex === towerSlotIndex ? { ...t, heroId: towerId, currentLevel: lvl, customRatio: undefined } : t
        ),
      };
    });
    showToast('Tower swapped.');
  }, [heroMap, showToast]);

  // Set Gold Bank & Income
  const setGoldBank = useCallback((gold: number) => {
    setDeck((prev) => ({ ...prev, currentGoldBank: Math.max(0, gold) }));
  }, []);

  const setGoldPerWave = useCallback((gold: number) => {
    setDeck((prev) => ({ ...prev, goldPerWave: Math.max(0, gold) }));
  }, []);

  // Load Preset Build
  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESET_BUILDS.find((p) => p.id === presetId);
    if (!preset) return;

    setDeck((prev) => ({
      ...prev,
      activePresetId: preset.id,
      castleTargetRatio: preset.castleLevelRatio,
      townArchersTargetRatio: preset.townArchersRatio,
      isArcherless: preset.isArcherless,
      leaderSlot: {
        heroId: preset.leaderId,
        currentLevel: Math.max(1, Math.round(prev.currentWave * (heroMap.get(preset.leaderId)?.defaultTargetRatio || 0.045))),
      },
      towers: preset.towerIds.map((tId, idx) => {
        const def = heroMap.get(tId);
        const lvl = def?.isFixedCap
          ? def.fixedCapLevel || 21
          : Math.max(1, Math.round(prev.currentWave * (def?.defaultTargetRatio || 0.01)));
        return {
          slotIndex: idx,
          heroId: tId,
          currentLevel: lvl,
        };
      }),
      heroSlots: preset.slots.map((s) => {
        const def = heroMap.get(s.heroId);
        const ratio = s.targetRatio ?? def?.defaultTargetRatio ?? 0.04;
        const lvl = def?.isFixedCap
          ? def.fixedCapLevel || 21
          : Math.max(1, Math.round(prev.currentWave * ratio));
        return {
          slotIndex: s.slotIndex,
          heroId: s.heroId,
          currentLevel: lvl,
          customRatio: s.targetRatio,
        };
      }),
    }));
    showToast(`Loaded "${preset.name}" preset!`);
  }, [heroMap, showToast]);

  // Bulk Actions
  const maxAllSupportHeroes = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      heroSlots: prev.heroSlots.map((slot) => {
        const def = heroMap.get(slot.heroId);
        if (def?.isFixedCap && def.fixedCapLevel) {
          return { ...slot, currentLevel: def.fixedCapLevel };
        }
        return slot;
      }),
      towers: prev.towers.map((t) => {
        const def = heroMap.get(t.heroId);
        if (def?.isFixedCap && def.fixedCapLevel) {
          return { ...t, currentLevel: def.fixedCapLevel };
        }
        return t;
      }),
    }));
    showToast('All fixed-cap support heroes and towers set to max level!');
  }, [heroMap, showToast]);

  const setAllDamageHeroesToTarget = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      castleLevel: Math.max(1, Math.round(prev.currentWave * prev.castleTargetRatio)),
      townArchersLevel: prev.isArcherless ? 0 : Math.max(1, Math.round(prev.currentWave * prev.townArchersTargetRatio)),
      leaderSlot: {
        ...prev.leaderSlot,
        currentLevel: Math.max(
          1,
          Math.round(
            prev.currentWave *
              (prev.leaderSlot.customRatio ?? heroMap.get(prev.leaderSlot.heroId)?.defaultTargetRatio ?? 0.045)
          )
        ),
      },
      heroSlots: prev.heroSlots.map((slot) => {
        const def = heroMap.get(slot.heroId);
        if (def?.isFixedCap && def.fixedCapLevel) {
          return { ...slot, currentLevel: def.fixedCapLevel };
        }
        const ratio = slot.customRatio ?? def?.defaultTargetRatio ?? 0.04;
        return {
          ...slot,
          currentLevel: Math.max(1, Math.round(prev.currentWave * ratio)),
        };
      }),
      towers: prev.towers.map((t) => {
        const def = heroMap.get(t.heroId);
        if (def?.isFixedCap && def.fixedCapLevel) {
          return { ...t, currentLevel: def.fixedCapLevel };
        }
        const ratio = t.customRatio ?? def?.defaultTargetRatio ?? 0.01;
        return {
          ...t,
          currentLevel: Math.max(1, Math.round(prev.currentWave * ratio)),
        };
      }),
    }));
    showToast('All units brought up to 100% target ratio for Wave ' + deck.currentWave);
  }, [deck.currentWave, heroMap, showToast]);

  // Reset to default
  const resetToDefaults = useCallback(() => {
    setDeck(DEFAULT_STATE);
    showToast('Reset all values to default standard build.');
  }, [showToast]);

  // Aggregate Table Data & Analysis
  const unitRows: UnitRowData[] = useMemo(() => {
    const list: UnitRowData[] = [];

    // 1. Castle Base
    const castleDef = heroMap.get('castle_base')!;
    const castleAnalysis = evaluateRatio(
      deck.castleLevel,
      deck.castleTargetRatio,
      deck.currentWave,
      false,
      undefined,
      castleDef.baseUpgradeCost
    );
    list.push({
      id: 'castle_base',
      slotKey: 'castle',
      name: castleDef.name,
      shortName: castleDef.shortName,
      category: castleDef.category,
      element: castleDef.element,
      iconColor: castleDef.iconColor,
      isFixedCap: false,
      currentLevel: deck.castleLevel,
      targetRatio: deck.castleTargetRatio,
      targetLevel: castleAnalysis.targetLevel,
      analysis: castleAnalysis,
      definition: castleDef,
      onUpdateLevel: setCastleLevel,
      onUpdateRatio: setCastleTargetRatio,
    });

    // 2. Town Archers (if not archerless or if level > 0)
    const taDef = heroMap.get('town_archers')!;
    const taAnalysis = evaluateRatio(
      deck.townArchersLevel,
      deck.townArchersTargetRatio,
      deck.currentWave,
      false,
      undefined,
      taDef.baseUpgradeCost
    );
    list.push({
      id: 'town_archers',
      slotKey: 'ta',
      name: taDef.name,
      shortName: taDef.shortName,
      category: taDef.category,
      element: taDef.element,
      iconColor: taDef.iconColor,
      isFixedCap: false,
      currentLevel: deck.townArchersLevel,
      targetRatio: deck.townArchersTargetRatio,
      targetLevel: taAnalysis.targetLevel,
      analysis: taAnalysis,
      definition: taDef,
      onUpdateLevel: setTownArchersLevel,
      onUpdateRatio: setTownArchersTargetRatio,
    });

    // 3. Leader
    const leaderDef = heroMap.get(deck.leaderSlot.heroId);
    if (leaderDef) {
      const ratio = deck.leaderSlot.customRatio ?? leaderDef.defaultTargetRatio;
      const leaderAnalysis = evaluateRatio(
        deck.leaderSlot.currentLevel,
        ratio,
        deck.currentWave,
        leaderDef.isFixedCap,
        leaderDef.fixedCapLevel,
        leaderDef.baseUpgradeCost
      );
      list.push({
        id: leaderDef.id,
        slotKey: 'leader',
        name: leaderDef.name,
        shortName: leaderDef.shortName,
        category: leaderDef.category,
        element: leaderDef.element,
        iconColor: leaderDef.iconColor,
        isFixedCap: !!leaderDef.isFixedCap,
        fixedCapLevel: leaderDef.fixedCapLevel,
        currentLevel: deck.leaderSlot.currentLevel,
        targetRatio: ratio,
        targetLevel: leaderAnalysis.targetLevel,
        analysis: leaderAnalysis,
        definition: leaderDef,
        onUpdateLevel: setLeaderLevel,
        onUpdateRatio: setLeaderTargetRatio,
      });
    }

    // 4. Hero Slots (12 slots)
    deck.heroSlots.forEach((slot) => {
      const def = heroMap.get(slot.heroId);
      if (!def) return;
      const ratio = slot.customRatio ?? def.defaultTargetRatio;
      const analysis = evaluateRatio(
        slot.currentLevel,
        ratio,
        deck.currentWave,
        def.isFixedCap,
        def.fixedCapLevel,
        def.baseUpgradeCost
      );
      list.push({
        id: def.id,
        slotKey: `hero-${slot.slotIndex}`,
        name: `${def.name} (Slot ${slot.slotIndex + 1})`,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        isFixedCap: !!def.isFixedCap,
        fixedCapLevel: def.fixedCapLevel,
        currentLevel: slot.currentLevel,
        targetRatio: ratio,
        targetLevel: analysis.targetLevel,
        analysis,
        definition: def,
        onUpdateLevel: (lvl) => setHeroLevel(slot.slotIndex, lvl),
        onUpdateRatio: (r) => setHeroTargetRatio(slot.slotIndex, r),
      });
    });

    // 5. Towers (4 slots)
    deck.towers.forEach((t) => {
      const def = heroMap.get(t.heroId);
      if (!def) return;
      const ratio = t.customRatio ?? def.defaultTargetRatio;
      const analysis = evaluateRatio(
        t.currentLevel,
        ratio,
        deck.currentWave,
        def.isFixedCap,
        def.fixedCapLevel,
        def.baseUpgradeCost
      );
      list.push({
        id: def.id,
        slotKey: `tower-${t.slotIndex}`,
        name: `${def.name} (Tower ${t.slotIndex + 1})`,
        shortName: def.shortName,
        category: def.category,
        element: def.element,
        iconColor: def.iconColor,
        isFixedCap: !!def.isFixedCap,
        fixedCapLevel: def.fixedCapLevel,
        currentLevel: t.currentLevel,
        targetRatio: ratio,
        targetLevel: analysis.targetLevel,
        analysis,
        definition: def,
        onUpdateLevel: (lvl) => setTowerLevel(t.slotIndex, lvl),
        onUpdateRatio: (r) => setTowerTargetRatio(t.slotIndex, r),
      });
    });

    return list;
  }, [
    deck,
    heroMap,
    setCastleLevel,
    setCastleTargetRatio,
    setTownArchersLevel,
    setTownArchersTargetRatio,
    setLeaderLevel,
    setLeaderTargetRatio,
    setHeroLevel,
    setHeroTargetRatio,
    setTowerLevel,
    setTowerTargetRatio,
  ]);

  // Overall Statistics
  const overallStats = useMemo(() => {
    let totalGoldNeeded = 0;
    let totalLevelsNeeded = 0;
    let unitsOnTarget = 0;
    let unitsBehind = 0;
    let unitsCritical = 0;

    unitRows.forEach((row) => {
      // If archerless and TA is row, skip
      if (deck.isArcherless && row.id === 'town_archers') return;

      totalGoldNeeded += row.analysis.goldNeeded;
      totalLevelsNeeded += Math.max(0, row.analysis.levelDelta);

      if (row.analysis.status === 'OPTIMAL' || row.analysis.status === 'OVERLEVELED' || row.analysis.status === 'FIXED_MAX') {
        unitsOnTarget++;
      } else if (row.analysis.status === 'BEHIND') {
        unitsBehind++;
      } else {
        unitsCritical++;
      }
    });

    const activeTotalUnits = deck.isArcherless ? unitRows.length - 1 : unitRows.length;
    const balanceScorePercent = activeTotalUnits > 0 ? Math.round((unitsOnTarget / activeTotalUnits) * 100) : 100;

    // Waves needed if goldPerWave is given
    const wavesNeeded = deck.goldPerWave > 0 ? Math.ceil(totalGoldNeeded / deck.goldPerWave) : 0;
    // Estimated waving time at 25 seconds per wave with 1.4x Chrono (~18 seconds)
    const hoursNeeded = (wavesNeeded * 18) / 3600;

    return {
      totalGoldNeeded,
      totalLevelsNeeded,
      unitsOnTarget,
      unitsBehind,
      unitsCritical,
      balanceScorePercent,
      wavesNeeded,
      hoursNeeded,
    };
  }, [unitRows, deck.isArcherless, deck.goldPerWave]);

  return {
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
    showToast,
  };
}
