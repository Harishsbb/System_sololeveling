import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Skull, Compass, Loader2 } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

export const DungeonPage: React.FC = () => {
  const dungeons = useGameStore((state) => state.dungeons)
  const player = useGameStore((state) => state.player)
  const completeDungeon = useGameStore((state) => state.completeDungeon)
  
  const { playPortalOpen, playLevelUp } = useSound()

  // State for active entry
  const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null)
  const [exploreStage, setExploreStage] = useState<'idle' | 'opening' | 'fighting' | 'finished'>('idle')
  const [combatLogs, setCombatLogs] = useState<string[]>([])
  const [rewardsGained, setRewardsGained] = useState({ xp: 0, gold: 0 })

  const activeDungeon = dungeons.find(d => d.id === selectedDungeonId)

  const handleEnterGate = (dungeonId: string) => {
    const dungeon = dungeons.find(d => d.id === dungeonId)
    if (!dungeon) return

    playPortalOpen()
    setSelectedDungeonId(dungeonId)
    setExploreStage('opening')
    setCombatLogs([])
    
    // Simulate gate opening portal transition
    setTimeout(() => {
      setExploreStage('fighting')
      runCombatSimulation(dungeon)
    }, 2000)
  }

  const runCombatSimulation = (dungeon: typeof dungeons[0]) => {
    const logs = [
      `[ SYSTEM ] Gate entry verified. Dimensional wall sealed.`,
      `[ SCANNER ] Detecting magical lifeforms... Level details matched.`,
      `[ BATTLE ] Shadow Knights summoned into vanguard positions.`,
      `[ COMBAT ] Engaging Boss: "${dungeon.bossName}"...`,
    ]
    
    let index = 0
    const interval = setInterval(() => {
      if (index < logs.length) {
        setCombatLogs(prev => [...prev, logs[index]])
        index++
      } else {
        clearInterval(interval)
        
        // Execute completion in store
        const result = completeDungeon(dungeon.id)
        if (result.success) {
          playLevelUp()
          setRewardsGained({ xp: result.xpGained, gold: result.goldGained })
          setCombatLogs(prev => [...prev, `[ SYSTEM ] Target defeated. Extraction essence dissipating.`, `[ REWARD ] Earned ${result.xpGained} XP and ${result.goldGained} Gold coins!`])
          setExploreStage('finished')
        } else {
          setCombatLogs(prev => [...prev, `[ WARNING ] Insufficient mana reserve to clear gate.`])
          setExploreStage('finished')
        }
      }
    }, 800)
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'E': return 'bg-slate-700 text-slate-200 border-slate-600'
      case 'D': return 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
      case 'C': return 'bg-hunter-blue/15 text-hunter-blue border-hunter-blue/30'
      case 'B': return 'bg-indigo-950 text-indigo-400 border-indigo-500/30'
      case 'A': return 'bg-orange-950 text-orange-400 border-orange-500/30'
      case 'S': return 'bg-red-950 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
      default: return 'bg-slate-950 text-slate-400 border-slate-800'
    }
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Dungeon Introduction Header */}
        <SystemWindow 
          title="DIMENSIONAL GATE RADAR" 
          subtitle="Real-time rift detection monitor"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex-1">
              <h3 className="font-display text-sm md:text-base font-black text-hunter-blue uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-5 h-5" />
                Dungeon Gate Exploration System
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Gates link our world to dimensional dungeons. Standard Hunters clear gates matching their ranks. Entering high-rank gates requires adequate mana levels. Clear dungeons to farm currency.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-center font-display shrink-0">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">available mana</span>
              <span className="text-xl font-black text-hunter-blue">{player.stats.mana * 10} MP</span>
            </div>
          </div>
        </SystemWindow>

        {/* Gate List Grid */}
        <div>
          <h4 className="font-display text-sm font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
            <Swords className="w-4 h-4 text-hunter-blue" />
            Detected Dungeon Portals
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dungeons.map((dungeon) => {
              const isManaEnough = player.stats.mana >= dungeon.manaRequired
              
              return (
                <motion.div
                  key={dungeon.id}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-xl bg-hunter-gray/40 border border-slate-800 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-slate-700 hover:shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                >
                  <div>
                    {/* Card Header Rank */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-display font-extrabold uppercase ${getRankBadgeColor(dungeon.rank)}`}>
                        {dungeon.rank}-Rank Gate
                      </span>
                      <span className="font-display text-[9px] text-slate-500 uppercase font-semibold">
                        Cost: {dungeon.manaRequired} MP
                      </span>
                    </div>

                    <h3 className="font-display text-sm font-black text-slate-200 uppercase tracking-wide">
                      {dungeon.name}
                    </h3>
                    
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      {dungeon.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="mt-4 p-3 bg-slate-950/60 rounded border border-slate-900/60 flex flex-col gap-1.5 font-display text-[9px] text-slate-400 uppercase font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1"><Skull className="w-3 h-3 text-red-500" /> Boss:</span>
                        <span className="text-white truncate max-w-[150px]">{dungeon.bossName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Loot:</span>
                        <span className="text-hunter-gold text-right truncate max-w-[150px]">{dungeon.reward}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => handleEnterGate(dungeon.id)}
                      disabled={!isManaEnough}
                      className={`w-full py-2.5 rounded font-display text-[10px] font-black tracking-widest uppercase border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isManaEnough 
                          ? 'bg-hunter-blue text-hunter-bg border-hunter-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:brightness-110' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      ENTER GATE
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Combat Gate Animation Modal */}
        <Modal
          isOpen={selectedDungeonId !== null}
          onClose={() => {
            setSelectedDungeonId(null)
            setExploreStage('idle')
          }}
          title={activeDungeon?.name || 'Gate Rift'}
          variant={activeDungeon?.rank === 'S' || activeDungeon?.rank === 'A' ? 'purple' : 'blue'}
        >
          {exploreStage === 'opening' && (
            <div className="flex flex-col items-center justify-center py-12 text-center select-none">
              {/* Spinning portal graphics */}
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-hunter-purple/60 animate-portal-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-hunter-blue/40 animate-[portal-spin_8s_linear_infinite_reverse]"></div>
                <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.3)_0%,rgba(157,78,221,0.05)_70%)] animate-pulse"></div>
                <Loader2 className="w-10 h-10 text-hunter-blue animate-spin" />
              </div>

              <h4 className="font-display text-sm font-black text-white tracking-widest uppercase">
                Opening Dimensional Gate...
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                stabilizing magical field parameters
              </p>
            </div>
          )}

          {(exploreStage === 'fighting' || exploreStage === 'finished') && (
            <div className="flex flex-col gap-6">
              
              {/* Combat text logger */}
              <div className="p-4 rounded-lg bg-black border border-slate-900 font-mono text-[10px] text-emerald-400 h-52 overflow-y-auto flex flex-col gap-2 shadow-inner">
                {combatLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {log}
                  </motion.div>
                ))}
                
                {exploreStage === 'fighting' && (
                  <div className="flex items-center gap-1 text-slate-500 mt-2 font-display text-[9px] uppercase font-bold animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-hunter-blue" />
                    Simulating combat encounters...
                  </div>
                )}
              </div>

              {exploreStage === 'finished' && (
                <div className="text-center mt-2 flex flex-col gap-4">
                  {rewardsGained.xp > 0 ? (
                    <div className="text-xs text-hunter-blue font-display font-semibold uppercase">
                      Gate Successfully Cleared!
                    </div>
                  ) : (
                    <div className="text-xs text-red-500 font-display font-semibold uppercase">
                      Gate Clear Failed: Mana Exhausted.
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      variant="blue" 
                      onClick={() => {
                        setSelectedDungeonId(null)
                        setExploreStage('idle')
                      }}
                      className="w-full text-xs"
                    >
                      Close Gate Log
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

      </div>
    </div>
  )
}
