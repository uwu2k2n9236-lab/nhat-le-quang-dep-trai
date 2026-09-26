/**
 * Grow Castle Domain Data & Ratio Models
 * Grounded in community meta (r/GrowCastle, Discord guides, Lakupii / Laku / Unthgod)
 */

export type HeroRole = 'MAIN_DPS' | 'SUB_DPS' | 'SUPPORT_FIXED' | 'UTILITY' | 'LEADER' | 'TOWER' | 'STRUCTURE';

export interface HeroDefinition {
  id: string;
  name: string;
  shortName: string;
  category: HeroRole;
  element: 'Physical' | 'Fire' | 'Lightning' | 'Ice' | 'Poison' | 'Holy' | 'None';
  defaultTargetRatio: number; // e.g. 0.05 = 5% of wave
  isFixedCap?: boolean;
  fixedCapLevel?: number;
  description: string;
  ratioTip: string;
  recommendedPosition?: 'Left' | 'Center' | 'Right' | 'Any';
  baseUpgradeCost: number; // base gold cost factor
  iconColor: string;
}

export interface DeckSlotItem {
  slotIndex: number; // 0 to 11 for castle heroes, 12 for leader, 13-16 for towers, 17 for castle base, 18 for town archers
  heroId: string;
  currentLevel: number;
  customRatio?: number; // Override ratio if player wants custom
}

export interface BuildPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  castleLevelRatio: number;
  townArchersRatio: number;
  isArcherless: boolean;
  slots: { slotIndex: number; heroId: string; targetRatio?: number }[];
  leaderId: string;
  towerIds: string[];
}

export const HERO_DATABASE: HeroDefinition[] = [
  // --- MAIN DPS HEROES ---
  {
    id: 'dbm',
    name: 'Dark Bow Master',
    shortName: 'DBM',
    category: 'MAIN_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.05, // 5% of wave
    description: 'Primary single-target boss killer and physical waving carry.',
    ratioTip: 'Golden standard is 5% (0.05). If struggling on boss waves, push to 6% (0.06).',
    recommendedPosition: 'Center',
    baseUpgradeCost: 200,
    iconColor: '#f59e0b',
  },
  {
    id: 'stone_giant',
    name: 'Stone Giant',
    shortName: 'Giants',
    category: 'MAIN_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.05,
    description: 'Top-tier sustained physical summon DPS with continuous wave pushback.',
    ratioTip: 'Keep matched 1:1 with DBM at 5% of wave for balanced crowd and boss damage.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 220,
    iconColor: '#a8a29e',
  },
  {
    id: 'sniper',
    name: 'Sniper',
    shortName: 'Sniper',
    category: 'MAIN_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.04,
    description: 'Ranged piercing archer, excellent for clearing aerial waves and clusters.',
    ratioTip: 'Maintain at 4% to 5% of wave. Scales exceptionally with cooldown & flat damage gear.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 210,
    iconColor: '#38bdf8',
  },
  {
    id: 'flame_ogre',
    name: 'Flame Ogre',
    shortName: 'F. Ogre',
    category: 'MAIN_DPS',
    element: 'Fire',
    defaultTargetRatio: 0.045,
    description: 'Massive screen-wide fire explosion. Vital for clearing dense ground swarms.',
    ratioTip: 'Target 4% - 5% of wave in Fire builds or 3.5% in mixed waving decks.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 250,
    iconColor: '#ef4444',
  },
  {
    id: 'zeus',
    name: 'Lightning Mage (Zeus)',
    shortName: 'Zeus',
    category: 'MAIN_DPS',
    element: 'Lightning',
    defaultTargetRatio: 0.045,
    description: 'Continuous chain lightning DPS that shocks and interrupts advancing mobs.',
    ratioTip: 'Main DPS in Lightning Meta decks. Keep at 4.5% - 5% of wave.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 240,
    iconColor: '#eab308',
  },
  {
    id: 'dark_elf',
    name: 'Dark Elf',
    shortName: 'D. Elf',
    category: 'MAIN_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.035,
    description: 'Converts inflicted damage into Castle HP & MP recovery on hit.',
    ratioTip: 'Keep around 3% to 4% of wave so its hits generate enough sustain for auto-battle.',
    recommendedPosition: 'Center',
    baseUpgradeCost: 200,
    iconColor: '#10b981',
  },
  {
    id: 'poison_slingers',
    name: 'Poison Slingers',
    shortName: 'Slingers',
    category: 'SUB_DPS',
    element: 'Poison',
    defaultTargetRatio: 0.03,
    description: 'Quick-spawning ground units that inflict poison and slow down enemy waves.',
    ratioTip: 'Keep at 3% of wave. Their primary power is body-blocking bosses and slowing creeps.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 190,
    iconColor: '#84cc16',
  },
  {
    id: 'angel',
    name: 'Dark Angel',
    shortName: 'Angel',
    category: 'SUB_DPS',
    element: 'Holy',
    defaultTargetRatio: 0.03,
    description: 'Flying summons that grant party speed boost and snipe aerial monsters.',
    ratioTip: '3% of wave provides high uptime and reliable anti-air support.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 210,
    iconColor: '#fbbf24',
  },
  {
    id: 'dark_skeleton',
    name: 'Dark Skeleton',
    shortName: 'D. Skeleton',
    category: 'SUB_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.025,
    description: 'Boosts Town Archer and allied archer critical damage while providing steady DPS.',
    ratioTip: '2.5% ratio is adequate since primary value comes from the archer crit buff.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 180,
    iconColor: '#d6d3d1',
  },
  {
    id: 'dark_assassin',
    name: 'Dark Assassin',
    shortName: 'Assassin',
    category: 'SUB_DPS',
    element: 'Physical',
    defaultTargetRatio: 0.02,
    description: 'Deploys deep assassination strikes, marking targets for massive critical amplification.',
    ratioTip: '2% of wave is plenty. Used primarily for the huge +300% critical damage debuff on bosses.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 230,
    iconColor: '#c084fc',
  },
  {
    id: 'dark_ice_wizard',
    name: 'Dark Ice Wizard',
    shortName: 'D. Ice Wiz',
    category: 'UTILITY',
    element: 'Ice',
    defaultTargetRatio: 0.015,
    description: 'Area freeze and crowd control. Locks down fast chargers and bosses.',
    ratioTip: '1.5% ratio is plenty; freeze duration does not scale heavily with level.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 200,
    iconColor: '#67e8f9',
  },
  {
    id: 'alice',
    name: 'Witch Alice',
    shortName: 'Alice',
    category: 'SUB_DPS',
    element: 'Fire',
    defaultTargetRatio: 0.035,
    description: 'Ranged witch summoner that spawns endless skeleton archers.',
    ratioTip: 'Keep at 3% to 4% of wave in summon or witch builds alongside Dorothy & Lisa.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 200,
    iconColor: '#fb923c',
  },
  {
    id: 'dorothy',
    name: 'Witch Dorothy',
    shortName: 'Dorothy',
    category: 'SUB_DPS',
    element: 'Fire',
    defaultTargetRatio: 0.035,
    description: 'Mage witch summoner casting fireballs and spawning caster skeletons.',
    ratioTip: 'Keep equal to Alice (3% to 4% of wave) for coordinated Witch passive buffs.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 200,
    iconColor: '#f43f5e',
  },
  {
    id: 'lisa',
    name: 'Witch Lisa',
    shortName: 'Lisa',
    category: 'SUB_DPS',
    element: 'Poison',
    defaultTargetRatio: 0.025,
    description: 'Melee witch summoner spawning armored skeletons to hold the front line.',
    ratioTip: '2.5% ratio is optimal; Lisa primarily serves as a melee meat-shield.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 200,
    iconColor: '#4ade80',
  },
  {
    id: 'flying_orc',
    name: 'Flying Orc',
    shortName: 'Flying Orc',
    category: 'SUB_DPS',
    element: 'Fire',
    defaultTargetRatio: 0.025,
    description: 'Dedicated anti-air bomber targeting enemy griffins, bats, and airships.',
    ratioTip: '2.5% ratio prevents flyers from overwhelming your castle towers.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 210,
    iconColor: '#ea580c',
  },

  // --- FIXED-CAP SUPPORT HEROES (NEVER LEVEL PAST CAP!) ---
  {
    id: 'pure_wizard',
    name: 'Pure Wizard',
    shortName: 'Pure Wiz',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Universal cooldown reducer. Reduces cooldowns by 6s and adjacent heroes by 1s.',
    ratioTip: 'CRITICAL: Stop leveling at Lv. 21! Cooldown is fully maxed. Any gold past 21 is wasted!',
    recommendedPosition: 'Center',
    baseUpgradeCost: 150,
    iconColor: '#60a5fa',
  },
  {
    id: 'dark_necromancer',
    name: 'Dark Necromancer',
    shortName: 'Dark Necro',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Reduces all enemy defense by 54%. The single strongest damage multiplier in game.',
    ratioTip: 'CRITICAL: Stop leveling at Lv. 21! Defense reduction caps at 54% and does not increase.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 150,
    iconColor: '#9333ea',
  },
  {
    id: 'bishop',
    name: 'Bishop (Cleric)',
    shortName: 'Bishop',
    category: 'SUPPORT_FIXED',
    element: 'Holy',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Increases Town Archers attack speed by 100% and boosts allied hero attack power.',
    ratioTip: 'Stop at Lv. 21. Attack speed buff reaches its 100% maximum cap at level 21.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 150,
    iconColor: '#e0e7ff',
  },
  {
    id: 'dark_chrono',
    name: 'Dark Chrono',
    shortName: 'Chrono',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Speeds up game waving speed by 1.4x to 1.5x for faster progression.',
    ratioTip: 'Stop at Lv. 21. Max game acceleration achieved at 21.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 150,
    iconColor: '#facc15',
  },
  {
    id: 'dark_hunter',
    name: 'Dark Hunter',
    shortName: 'Hunter',
    category: 'SUPPORT_FIXED',
    element: 'Physical',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 31,
    description: 'Archery team trio booster; buffs Town Archers attack speed.',
    ratioTip: 'Stop at Lv. 31 once the archer attack speed duration skill is fully maxed.',
    recommendedPosition: 'Left',
    baseUpgradeCost: 160,
    iconColor: '#34d399',
  },
  {
    id: 'st_smith',
    name: 'St. Smith',
    shortName: 'Smith',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Instantly restores 60% of Castle maximum HP when activated in an emergency.',
    ratioTip: 'Stop at Lv. 21. Heal percentage is capped at 60% of max Castle HP.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 150,
    iconColor: '#f472b6',
  },
  {
    id: 'military_band_m',
    name: 'Military Band (M)',
    shortName: 'Mil Band M',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Provides +35% permanent additional bonus gold from waving monsters.',
    ratioTip: 'Cap at Lv. 21. The gold multiplier caps at +35%. Essential for gold farming.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 120,
    iconColor: '#fbbf24',
  },
  {
    id: 'orc_band',
    name: 'Orc Band',
    shortName: 'Orc Band',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Spawns +20% additional monsters per wave, increasing wave gold yield and experience.',
    ratioTip: 'Cap at Lv. 21. Great for speeding up gold accumulation during auto-battle.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 120,
    iconColor: '#15803d',
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    shortName: 'Alchemist',
    category: 'SUPPORT_FIXED',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Transmutes defeated enemies into gold frogs and grants extra gold per kill.',
    ratioTip: 'Stop at Lv. 21. Max frog transmutation frequency reached at 21.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 130,
    iconColor: '#a855f7',
  },

  // --- LEADERS ---
  {
    id: 'leader_edward',
    name: 'Leader Edward',
    shortName: 'Edward',
    category: 'LEADER',
    element: 'Physical',
    defaultTargetRatio: 0.045,
    description: 'Spawns 2 sword guardians and grants +10% summon damage. Best Physical leader.',
    ratioTip: 'Maintain at 4% to 5% of wave. Carries physical summon builds.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 350,
    iconColor: '#38bdf8',
  },
  {
    id: 'leader_solar',
    name: 'Leader Solar',
    shortName: 'Solar',
    category: 'LEADER',
    element: 'Fire',
    defaultTargetRatio: 0.045,
    description: 'Grants +5% fire damage, +5% fire crit chance, and summons fire elementals.',
    ratioTip: 'Keep at 4% to 5% of wave in Fire and Colony clearing builds.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 350,
    iconColor: '#f97316',
  },
  {
    id: 'leader_zero',
    name: 'Leader Zero',
    shortName: 'Zero',
    category: 'LEADER',
    element: 'Ice',
    defaultTargetRatio: 0.04,
    description: 'Deals massive bonus damage against slowed or frozen enemies.',
    ratioTip: 'Keep at 4% of wave when using ice slow strategies or high wave pushing.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 350,
    iconColor: '#06b6d4',
  },
  {
    id: 'leader_thor',
    name: 'Leader Thor',
    shortName: 'Thor',
    category: 'LEADER',
    element: 'Lightning',
    defaultTargetRatio: 0.045,
    description: 'Grants chain lightning bounces to all allied lightning attacks.',
    ratioTip: 'Keep at 4% to 5% of wave in Lightning Meta builds.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 350,
    iconColor: '#facc15',
  },
  {
    id: 'leader_skeleton_king',
    name: 'Skeleton King',
    shortName: 'Skel King',
    category: 'LEADER',
    element: 'Physical',
    defaultTargetRatio: 0.04,
    description: 'Heavy melee leader who summons undead guards and deals crushing physical hits.',
    ratioTip: 'Maintain at 4% of wave for high wave frontline crowd control.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 350,
    iconColor: '#94a3b8',
  },

  // --- TOWERS ---
  {
    id: 'tower_death_worm',
    name: 'Death Worm',
    shortName: 'D. Worm',
    category: 'TOWER',
    element: 'Poison',
    defaultTargetRatio: 0.01, // 1% of wave
    description: 'Steals enemy MP on every attack. Crucial fuel to prevent mana depletion during auto-battle.',
    ratioTip: 'Target exactly 1% (0.01) of wave. Never skip Death Worm or your heroes will run out of MP!',
    recommendedPosition: 'Any',
    baseUpgradeCost: 140,
    iconColor: '#84cc16',
  },
  {
    id: 'tower_lightning',
    name: 'Lightning Tower',
    shortName: 'Light Tower',
    category: 'TOWER',
    element: 'Lightning',
    defaultTargetRatio: 0.02,
    description: 'Zaps advancing enemies with lightning. Strongest DPS tower when paired with Mirror.',
    ratioTip: '2% of wave is community standard. Replicated by Mirror for double damage output.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 150,
    iconColor: '#eab308',
  },
  {
    id: 'tower_mirror',
    name: 'Mirror Tower',
    shortName: 'Mirror',
    category: 'TOWER',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 99,
    description: 'Duplicates the tower next to it and amplifies its damage output.',
    ratioTip: 'Level to 99 max cap. Place next to Lightning Tower or Death Worm.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 120,
    iconColor: '#38bdf8',
  },
  {
    id: 'tower_trophy',
    name: 'Trophy',
    shortName: 'Trophy',
    category: 'TOWER',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Grants +10% bonus gold per wave. Staple tower for all waving decks.',
    ratioTip: 'Cap at Lv. 21. Free extra gold on every wave.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 100,
    iconColor: '#eab308',
  },
  {
    id: 'tower_tree',
    name: 'Crystal Tree',
    shortName: 'Tree',
    category: 'TOWER',
    element: 'None',
    defaultTargetRatio: 0,
    isFixedCap: true,
    fixedCapLevel: 21,
    description: 'Generates free diamonds (crystals) every 3 waves or extra exp.',
    ratioTip: 'Cap at Lv. 21. Critical for crystal generation to craft L/E items.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 100,
    iconColor: '#10b981',
  },
  {
    id: 'tower_frozen',
    name: 'Frozen Tower',
    shortName: 'Frozen Tower',
    category: 'TOWER',
    element: 'Ice',
    defaultTargetRatio: 0.005,
    description: 'Slows entire wave speed by up to 50%, clustering mobs for area damage.',
    ratioTip: '0.5% or Lv. 99 is sufficient; its value is the slow field, not raw damage.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 130,
    iconColor: '#38bdf8',
  },

  // --- STRUCTURES (Castle Base & Town Archers) ---
  {
    id: 'castle_base',
    name: 'Castle Base (HP & MP)',
    shortName: 'Castle',
    category: 'STRUCTURE',
    element: 'None',
    defaultTargetRatio: 0.08, // 8% of wave (range 0.06 - 0.10)
    description: 'Determines maximum Castle Health and Mana pool. Prevents one-shots from bosses.',
    ratioTip: 'Community consensus: 6% to 10% (0.06 - 0.10). If bosses kill your castle, raise to 0.08 or 0.10.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 180,
    iconColor: '#64748b',
  },
  {
    id: 'town_archers',
    name: 'Town Archers (TA)',
    shortName: 'Town Archers',
    category: 'STRUCTURE',
    element: 'Physical',
    defaultTargetRatio: 0.45, // 45% of wave in TA builds, 0 in Archerless
    description: 'Stationed archers firing continuous volleys from castle battlements.',
    ratioTip: 'In TA builds: Maintain 40% to 50% (0.40 - 0.50). In modern "Archerless" builds: Leave at 0.',
    recommendedPosition: 'Any',
    baseUpgradeCost: 110,
    iconColor: '#fb7185',
  },
];

export const PRESET_BUILDS: BuildPreset[] = [
  {
    id: 'physical_summon_meta',
    name: 'Physical / Summon Meta (Recommended)',
    tagline: 'Standard Reddit & Discord Waving Meta',
    description: 'The highest efficiency waving build. DBM and Stone Giant carry the DPS with Edward buffing summons and pure utility supports.',
    castleLevelRatio: 0.08,
    townArchersRatio: 0.0, // Modern meta is Archerless to invest gold into heroes
    isArcherless: true,
    leaderId: 'leader_edward',
    towerIds: ['tower_death_worm', 'tower_lightning', 'tower_mirror', 'tower_trophy'],
    slots: [
      // Top Floor (Floor 4)
      { slotIndex: 0, heroId: 'pure_wizard', targetRatio: 0 },
      { slotIndex: 1, heroId: 'dark_necromancer', targetRatio: 0 },
      { slotIndex: 2, heroId: 'bishop', targetRatio: 0 },
      // Floor 3
      { slotIndex: 3, heroId: 'dark_hunter', targetRatio: 0 },
      { slotIndex: 4, heroId: 'dark_elf', targetRatio: 0.035 },
      { slotIndex: 5, heroId: 'dbm', targetRatio: 0.05 },
      // Floor 2
      { slotIndex: 6, heroId: 'dark_chrono', targetRatio: 0 },
      { slotIndex: 7, heroId: 'stone_giant', targetRatio: 0.05 },
      { slotIndex: 8, heroId: 'poison_slingers', targetRatio: 0.03 },
      // Bottom Floor (Floor 1)
      { slotIndex: 9, heroId: 'angel', targetRatio: 0.03 },
      { slotIndex: 10, heroId: 'dark_assassin', targetRatio: 0.02 },
      { slotIndex: 11, heroId: 'military_band_m', targetRatio: 0 },
    ],
  },
  {
    id: 'physical_ta_classic',
    name: 'Classic Town Archer Physical',
    tagline: 'Traditional 0.45x TA Ratio Build',
    description: 'Traditional build utilizing high-level Town Archers with Dark Bow Master and Sniper, backed by Bishop and Hunter.',
    castleLevelRatio: 0.08,
    townArchersRatio: 0.45,
    isArcherless: false,
    leaderId: 'leader_edward',
    towerIds: ['tower_death_worm', 'tower_lightning', 'tower_mirror', 'tower_trophy'],
    slots: [
      { slotIndex: 0, heroId: 'dark_hunter', targetRatio: 0 },
      { slotIndex: 1, heroId: 'dark_elf', targetRatio: 0.035 },
      { slotIndex: 2, heroId: 'dbm', targetRatio: 0.05 },
      { slotIndex: 3, heroId: 'pure_wizard', targetRatio: 0 },
      { slotIndex: 4, heroId: 'dark_necromancer', targetRatio: 0 },
      { slotIndex: 5, heroId: 'bishop', targetRatio: 0 },
      { slotIndex: 6, heroId: 'sniper', targetRatio: 0.04 },
      { slotIndex: 7, heroId: 'stone_giant', targetRatio: 0.045 },
      { slotIndex: 8, heroId: 'dark_chrono', targetRatio: 0 },
      { slotIndex: 9, heroId: 'dark_skeleton', targetRatio: 0.025 },
      { slotIndex: 10, heroId: 'dark_assassin', targetRatio: 0.02 },
      { slotIndex: 11, heroId: 'military_band_m', targetRatio: 0 },
    ],
  },
  {
    id: 'lightning_meta',
    name: 'Lightning Shock Deck',
    tagline: 'Chain Lightning & Interruption Build',
    description: 'Uses Thor and Zeus with Lightning Tower and Mirror for relentless crowd shock and heavy multi-target bursts.',
    castleLevelRatio: 0.08,
    townArchersRatio: 0.0,
    isArcherless: true,
    leaderId: 'leader_thor',
    towerIds: ['tower_lightning', 'tower_mirror', 'tower_death_worm', 'tower_trophy'],
    slots: [
      { slotIndex: 0, heroId: 'pure_wizard', targetRatio: 0 },
      { slotIndex: 1, heroId: 'dark_necromancer', targetRatio: 0 },
      { slotIndex: 2, heroId: 'zeus', targetRatio: 0.05 },
      { slotIndex: 3, heroId: 'dark_assassin', targetRatio: 0.02 },
      { slotIndex: 4, heroId: 'dark_ice_wizard', targetRatio: 0.015 },
      { slotIndex: 5, heroId: 'dbm', targetRatio: 0.045 },
      { slotIndex: 6, heroId: 'dark_chrono', targetRatio: 0 },
      { slotIndex: 7, heroId: 'stone_giant', targetRatio: 0.04 },
      { slotIndex: 8, heroId: 'poison_slingers', targetRatio: 0.03 },
      { slotIndex: 9, heroId: 'dark_elf', targetRatio: 0.035 },
      { slotIndex: 10, heroId: 'st_smith', targetRatio: 0 },
      { slotIndex: 11, heroId: 'military_band_m', targetRatio: 0 },
    ],
  },
  {
    id: 'fire_summon_colony',
    name: 'Fire Swarm & Colony Pusher',
    tagline: 'Solar + Flame Ogre + Fire Witches',
    description: 'High burst fire explosions and endless skeleton summon pressure. Excels at clearing Earth/Hell colonies and mob-dense waves.',
    castleLevelRatio: 0.09,
    townArchersRatio: 0.0,
    isArcherless: true,
    leaderId: 'leader_solar',
    towerIds: ['tower_death_worm', 'tower_frozen', 'tower_lightning', 'tower_trophy'],
    slots: [
      { slotIndex: 0, heroId: 'flame_ogre', targetRatio: 0.05 },
      { slotIndex: 1, heroId: 'pure_wizard', targetRatio: 0 },
      { slotIndex: 2, heroId: 'dark_necromancer', targetRatio: 0 },
      { slotIndex: 3, heroId: 'alice', targetRatio: 0.04 },
      { slotIndex: 4, heroId: 'dorothy', targetRatio: 0.04 },
      { slotIndex: 5, heroId: 'lisa', targetRatio: 0.025 },
      { slotIndex: 6, heroId: 'dark_chrono', targetRatio: 0 },
      { slotIndex: 7, heroId: 'flying_orc', targetRatio: 0.025 },
      { slotIndex: 8, heroId: 'stone_giant', targetRatio: 0.04 },
      { slotIndex: 9, heroId: 'dark_elf', targetRatio: 0.035 },
      { slotIndex: 10, heroId: 'st_smith', targetRatio: 0 },
      { slotIndex: 11, heroId: 'military_band_m', targetRatio: 0 },
    ],
  },
];

/**
 * Grow Castle Gold Cost Formula Approximation:
 * Upgrade cost grows quadratically with level.
 * Hero Cost: L * baseCost * 0.95 + 100
 * Cumulative cost from L1 to L2:
 * Sum(Cost(l)) for l = L1 to L2-1
 */
export function estimateGoldCost(baseFactor: number, fromLevel: number, toLevel: number): number {
  if (toLevel <= fromLevel) return 0;
  
  // High-precision cumulative sum approximation for Grow Castle leveling cost
  // Cost(l) ~= baseFactor * (l * 1.02 + 80)
  // Sum = baseFactor * [ 1.02 * (toLevel^2 - fromLevel^2)/2 + 80 * (toLevel - fromLevel) ]
  const count = toLevel - fromLevel;
  const avgLevel = (fromLevel + toLevel) / 2;
  const total = count * (baseFactor * (avgLevel * 1.02 + 80));
  return Math.round(Math.max(0, total));
}

/**
 * Format large numbers for game dashboard (e.g. 1.25M, 340.5K, 4.80B)
 */
export function formatGameNumber(num: number): string {
  if (num === 0) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

/**
 * Format ratio percentage (e.g. 5.00% or 0.050)
 */
export function formatRatioPercent(ratio: number): string {
  return (ratio * 100).toFixed(2) + '%';
}

/**
 * Ratio status calculation
 */
export type RatioStatus = 'OPTIMAL' | 'OVERLEVELED' | 'BEHIND' | 'CRITICAL' | 'FIXED_MAX' | 'FIXED_NEEDS_LEVEL';

export interface RatioAnalysis {
  currentLevel: number;
  targetLevel: number;
  targetRatio: number;
  currentRatio: number;
  levelDelta: number; // positive = levels needed
  goldNeeded: number;
  status: RatioStatus;
  statusLabel: string;
  statusColor: string;
}

export function evaluateRatio(
  currentLevel: number,
  targetRatio: number,
  waveNumber: number,
  isFixedCap?: boolean,
  fixedCapLevel?: number,
  baseCostFactor: number = 200
): RatioAnalysis {
  if (isFixedCap && fixedCapLevel) {
    const targetLevel = fixedCapLevel;
    const levelDelta = Math.max(0, targetLevel - currentLevel);
    const goldNeeded = estimateGoldCost(baseCostFactor, currentLevel, targetLevel);
    const isMax = currentLevel >= fixedCapLevel;
    return {
      currentLevel,
      targetLevel,
      targetRatio: 0,
      currentRatio: waveNumber > 0 ? currentLevel / waveNumber : 0,
      levelDelta,
      goldNeeded,
      status: isMax ? 'FIXED_MAX' : 'FIXED_NEEDS_LEVEL',
      statusLabel: isMax ? `Capped at Lv. ${fixedCapLevel}` : `Needs Lv. ${fixedCapLevel}`,
      statusColor: isMax ? 'text-cyan-400' : 'text-amber-400',
    };
  }

  const targetLevel = Math.max(1, Math.round(waveNumber * targetRatio));
  const currentRatio = waveNumber > 0 ? currentLevel / waveNumber : 0;
  const levelDelta = targetLevel - currentLevel;
  const goldNeeded = levelDelta > 0 ? estimateGoldCost(baseCostFactor, currentLevel, targetLevel) : 0;

  let status: RatioStatus = 'OPTIMAL';
  let statusLabel = 'On Target';
  let statusColor = 'text-emerald-400';

  if (currentLevel >= targetLevel * 1.05) {
    status = 'OVERLEVELED';
    statusLabel = 'Over-leveled';
    statusColor = 'text-sky-400';
  } else if (currentLevel >= targetLevel * 0.92) {
    status = 'OPTIMAL';
    statusLabel = 'Balanced (Good)';
    statusColor = 'text-emerald-400';
  } else if (currentLevel >= targetLevel * 0.70) {
    status = 'BEHIND';
    statusLabel = 'Behind Target';
    statusColor = 'text-amber-400';
  } else {
    status = 'CRITICAL';
    statusLabel = 'Critical Deficit';
    statusColor = 'text-rose-400';
  }

  return {
    currentLevel,
    targetLevel,
    targetRatio,
    currentRatio,
    levelDelta,
    goldNeeded,
    status,
    statusLabel,
    statusColor,
  };
}
