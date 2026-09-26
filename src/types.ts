import { HeroDefinition, RatioAnalysis } from './data/growCastleData';

export interface HeroSlotState {
  slotIndex: number;
  heroId: string;
  currentLevel: number;
  customRatio?: number; // if set, overrides defaultTargetRatio
}

export interface GrowCastleDeckState {
  currentWave: number;
  castleLevel: number;
  castleTargetRatio: number; // default ~0.08
  townArchersLevel: number;
  townArchersTargetRatio: number; // default ~0.45 or 0
  isArcherless: boolean;
  leaderSlot: {
    heroId: string;
    currentLevel: number;
    customRatio?: number;
  };
  towers: {
    slotIndex: number; // 0 to 3
    heroId: string;
    currentLevel: number;
    customRatio?: number;
  }[];
  heroSlots: HeroSlotState[]; // 12 slots (indices 0 to 11)
  currentGoldBank: number;
  goldPerWave: number;
  activePresetId: string;
}

export interface UnitRowData {
  id: string;
  slotKey: string; // 'hero-0', 'leader', 'tower-1', 'castle', 'ta'
  name: string;
  shortName: string;
  category: string;
  element: string;
  iconColor: string;
  isFixedCap: boolean;
  fixedCapLevel?: number;
  currentLevel: number;
  targetRatio: number;
  targetLevel: number;
  analysis: RatioAnalysis;
  definition: HeroDefinition;
  onUpdateLevel: (newLevel: number) => void;
  onUpdateRatio: (newRatio: number) => void;
  onSwapHero?: () => void;
}
