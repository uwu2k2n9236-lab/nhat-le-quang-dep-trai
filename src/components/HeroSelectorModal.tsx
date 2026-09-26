import React, { useState } from 'react';
import { X, Search, Shield, Zap, Check } from 'lucide-react';
import { HERO_DATABASE, HeroDefinition, formatRatioPercent } from '../data/growCastleData';

interface HeroSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHero: (heroId: string) => void;
  currentHeroId: string;
  slotTitle: string;
  allowedCategory?: 'HERO' | 'LEADER' | 'TOWER';
}

export const HeroSelectorModal: React.FC<HeroSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectHero,
  currentHeroId,
  slotTitle,
  allowedCategory = 'HERO',
}) => {
  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredHeroes = HERO_DATABASE.filter((h) => {
    // Category match
    if (allowedCategory === 'LEADER') {
      if (h.category !== 'LEADER') return false;
    } else if (allowedCategory === 'TOWER') {
      if (h.category !== 'TOWER') return false;
    } else {
      // Normal heroes: exclude structures, leaders, and towers
      if (h.category === 'LEADER' || h.category === 'TOWER' || h.category === 'STRUCTURE') {
        return false;
      }
    }

    // Element filter
    if (elementFilter !== 'ALL' && h.element !== elementFilter) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.shortName.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Choose Unit for {slotTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Select a hero or tower to assign to this deck position.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
            {['ALL', 'Physical', 'Fire', 'Lightning', 'Ice', 'Poison', 'Holy'].map((elem) => (
              <button
                key={elem}
                onClick={() => setElementFilter(elem)}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  elementFilter === elem
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {elem}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredHeroes.map((hero) => {
            const isCurrent = hero.id === currentHeroId;
            return (
              <button
                key={hero.id}
                onClick={() => {
                  onSelectHero(hero.id);
                  onClose();
                }}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-950/20 ring-1 ring-amber-400'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/70 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: hero.iconColor }}
                    />
                    <span className="font-semibold text-xs text-white">
                      {hero.name}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {hero.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-nums text-slate-500">
                  <span>{hero.element}</span>
                  <span className="text-amber-400/90 font-medium">
                    {hero.isFixedCap
                      ? `Max Cap: Lv. ${hero.fixedCapLevel}`
                      : `Target Ratio: ${formatRatioPercent(hero.defaultTargetRatio)}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
