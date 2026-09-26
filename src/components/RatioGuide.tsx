import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Shield,
  Zap,
  Flame,
  Coins,
  ArrowRight,
} from 'lucide-react';

export const RatioGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Guide Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono-nums text-amber-400 font-semibold mb-2">
          <span>GROW CASTLE STRATEGY HANDBOOK</span>
          <span aria-hidden="true">·</span>
          <span>COMMUNITY META RATIO GUIDELINES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          The Definitive Grow Castle Ratio Guide
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          In Grow Castle, monster HP and boss damage scale directly with your current wave number.
          Tracking your hero-to-wave ratios ensures your damage carries remain potent without
          squandering billions of gold on support heroes with fixed ability caps.
        </p>
      </div>

      {/* Core Ratio Formula Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          The Core Ratio Math
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold block">
              1. Ratio Percentage Formula
            </span>
            <div className="font-mono-nums text-amber-300 font-bold text-base bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              Ratio = Hero Level ÷ Wave Number
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Example: If you are at Wave 10,000 and your Dark Bow Master is Level 500:
              <br />
              <code className="text-slate-200">500 / 10,000 = 0.05 (5.0% or 1:20 ratio)</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono-nums text-slate-400 uppercase font-semibold block">
              2. Target Level Formula
            </span>
            <div className="font-mono-nums text-emerald-400 font-bold text-base bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              Target Level = Wave Number × Desired Ratio
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Example: For Wave 50,000 at a 5% target ratio:
              <br />
              <code className="text-slate-200">50,000 × 0.05 = Level 2,500 Target</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Rule 1: The 5% (1:20) Carry Rule */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono-nums font-bold flex items-center justify-center text-xs border border-amber-500/30">
            1
          </span>
          <h3 className="font-display font-bold text-base text-white">
            The Golden 5% (1:20) Rule for Main Carries
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your primary damage dealers do the heavy lifting of killing bosses and clearing enemy
          clusters before they breach your castle wall.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Dark Bow Master (DBM)</span>
            <span className="text-amber-400 font-mono-nums font-semibold block text-[11px]">
              Recommended: 5.0% - 6.0% (0.05 - 0.06)
            </span>
            <p className="text-slate-400 text-[11px]">
              Single-target shredder. If bosses reach your wall with HP left, raise DBM ratio first.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Stone Giants</span>
            <span className="text-amber-400 font-mono-nums font-semibold block text-[11px]">
              Recommended: 4.5% - 5.0% (0.045 - 0.05)
            </span>
            <p className="text-slate-400 text-[11px]">
              Constant ground summon pushback. Pair with Leader Edward for +10% summon buff.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Sniper / Zeus / Flame Ogre</span>
            <span className="text-amber-400 font-mono-nums font-semibold block text-[11px]">
              Recommended: 4.0% - 4.5% (0.04 - 0.045)
            </span>
            <p className="text-slate-400 text-[11px]">
              Secondary wave clearing. Prevents flying or dense monster clusters from swarming.
            </p>
          </div>
        </div>
      </div>

      {/* Rule 2: The Level 21 Hard Cap for Supports (Save Billions!) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono-nums font-bold flex items-center justify-center text-xs border border-cyan-500/30">
            2
          </span>
          <h3 className="font-display font-bold text-base text-white">
            The Level 21 Cap Rule: Never Level Fixed Supports Past 21!
          </h3>
        </div>

        <div className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>
            <strong>Beginner Pitfall Alert:</strong> Upgrading Pure Wizard, Dark Necromancer, or
            Bishop to Level 1,000+ provides virtually zero extra utility because their skill benefits
            reach 100% capacity at Level 21! Players lose hundreds of millions of gold this way.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block">Pure Wizard</span>
            <span className="text-cyan-400 font-mono-nums text-[11px] block mt-0.5">
              Hard Cap: Level 21
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Active cooldown -6s and adjacent hero cooldown -1s max out at Lv. 21.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block">Dark Necromancer</span>
            <span className="text-cyan-400 font-mono-nums text-[11px] block mt-0.5">
              Hard Cap: Level 21
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              -54% enemy defense reduction is fully capped at Lv. 21.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block">Bishop / Cleric</span>
            <span className="text-cyan-400 font-mono-nums text-[11px] block mt-0.5">
              Hard Cap: Level 21
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              +100% Town Archer and hero attack speed buff reaches maximum at Lv. 21.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white block">Dark Chrono</span>
            <span className="text-cyan-400 font-mono-nums text-[11px] block mt-0.5">
              Hard Cap: Level 21
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              +1.4x-1.5x battle speed maxes out. Higher levels give zero extra speed.
            </p>
          </div>
        </div>
      </div>

      {/* Rule 3: Archerless Meta vs Town Archers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-nums font-bold flex items-center justify-center text-xs border border-emerald-500/30">
            3
          </span>
          <h3 className="font-display font-bold text-base text-white">
            Town Archers (0.45x) vs Modern Archerless (0x)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 block text-sm">
              Early Game: Town Archers (0.40 - 0.50 Ratio)
            </span>
            <p className="text-slate-300 leading-relaxed">
              From Wave 1 to ~Wave 20,000, Town Archers are very cost-effective. Keeping them at 45%
              of your wave gives reliable passive damage without requiring skill activations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-rose-300 block text-sm">
              Mid-to-Late Game: The Archerless Meta (0x Ratio)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Town Archers cannot equip Legendary/Equipment gear and cannot benefit from cooldown
              reductions. Beyond Wave 50,000, keeping TA at 0.45x becomes astronomically expensive.
              Top players stop upgrading TA completely and invest 100% of gold into DBM and Giants.
            </p>
          </div>
        </div>
      </div>

      {/* Rule 4: Castle & Death Worm Sustenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono-nums font-bold flex items-center justify-center text-xs border border-amber-500/30">
            4
          </span>
          <h3 className="font-display font-bold text-base text-white">
            Castle Health (0.08x) & Death Worm Mana (0.01x)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-400" />
              Castle Level: 6% to 10% (0.06 - 0.10)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Provides raw HP and MP pool. If an enemy boss or lightning mage wipes your castle in
              one hit, your castle level is behind. 8% (0.08) is the standard safety buffer.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-lime-400" />
              Death Worm: 1.0% (0.01)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Death Worm restores mana per hit. Without a 1% ratio Death Worm, your castle will run
              completely dry of MP during 1.4x speed auto-battle, halting all hero abilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
