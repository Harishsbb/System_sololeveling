import React from 'react'
import { Crown, UserPlus } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { SystemWindow } from '../components/SystemWindow'
import { ShadowCard } from '../components/ShadowCard'

export const ShadowArmyPage: React.FC = () => {
  const shadows = useGameStore((state) => state.shadows)
  const player = useGameStore((state) => state.player)

  const unlockedCount = shadows.filter((s) => s.unlocked).length

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Monarch Extraction details */}
        <SystemWindow 
          title="SHADOW ARMY HUD: ARMY CREATION"
          subtitle="Monarch class shadow extraction matrix"
          variant="purple"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-display text-sm md:text-base font-black text-hunter-purple uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-5 h-5" />
                "Arise" Shadow Extraction Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                When a powerful creature falls, you can extract its shadow essence using raw mana. Unlocked shadow soldiers fight alongside you, inheriting custom status indicators and unique skills.
              </p>
            </div>
            
            {/* Quick counters */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 flex gap-6 items-center shrink-0">
              <div className="text-center font-display">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">extracted</span>
                <span className="text-xl font-black text-hunter-purple">{unlockedCount} / {shadows.length}</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800"></div>
              <div className="text-center font-display">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">mana check</span>
                <span className="text-xl font-black text-hunter-blue">{player.stats.mana * 10} MP</span>
              </div>
            </div>
          </div>
        </SystemWindow>

        {/* Soldiers Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-4 h-4 text-hunter-purple" />
            <h4 className="font-display text-sm font-bold text-white tracking-wider uppercase">
              Extracted Shadows Regiment
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shadows.map((soldier) => (
              <ShadowCard key={soldier.id} soldier={soldier} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
