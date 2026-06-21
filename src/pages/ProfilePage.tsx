import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles, Award, Coins, Flame, UserCheck } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { StatCard } from '../components/StatCard'
import { LevelBar } from '../components/LevelBar'
import confetti from 'canvas-confetti'

export const ProfilePage: React.FC = () => {
  const player = useGameStore((state) => state.player)
  const upgradeRank = useGameStore((state) => state.upgradeRank)
  const { playLevelUp, playClick } = useSound()
  
  const [evaluating, setEvaluating] = useState(false)
  const [evalMessage, setEvalMessage] = useState<string | null>(null)

  const handleRankUpgrade = () => {
    playClick()
    setEvaluating(true)
    setEvalMessage(null)

    setTimeout(() => {
      const rankUpgraded = upgradeRank()
      setEvaluating(false)
      
      if (rankUpgraded) {
        playLevelUp()
        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#00f0ff', '#9d4edd', '#ffb703'],
          origin: { y: 0.6 }
        })
        setEvalMessage(`Rank Evaluation Complete: Congratulation! You have ascended to ${useGameStore.getState().player.rank}-Rank!`)
      } else {
        const lvl = player.level
        let nextRankReq = 'Level 10'
        let target = 'D-Rank'
        
        if (player.rank === 'E') { nextRankReq = 'Level 10'; target = 'D-Rank'; }
        else if (player.rank === 'D') { nextRankReq = 'Level 20'; target = 'C-Rank'; }
        else if (player.rank === 'C') { nextRankReq = 'Level 30'; target = 'B-Rank'; }
        else if (player.rank === 'B') { nextRankReq = 'Level 40'; target = 'A-Rank'; }
        else if (player.rank === 'A') { nextRankReq = 'Level 50'; target = 'S-Rank'; }
        else if (player.rank === 'S') { nextRankReq = 'Level 70'; target = 'SSS-Rank'; }
        else { nextRankReq = 'Maxed'; target = 'Monarch'; }

        setEvalMessage(
          lvl >= 70 
            ? "Your rank matches the maximum evaluated potential." 
            : `Evaluation Complete: Denied. You must reach ${nextRankReq} to unlock ${target} (Current Level: ${lvl}).`
        )
      }
    }, 1200)
  }

  // Stat item descriptions
  const statInfo = {
    strength: { name: 'Strength', desc: 'Increases physical power, strike damage and load carrying weight.' },
    agility: { name: 'Agility', desc: 'Improves reflex response, speed of strikes and critical hit rate.' },
    intelligence: { name: 'Intelligence', desc: 'Raises max mana reserves, spell casting potency and cooldown recovery.' },
    endurance: { name: 'Endurance', desc: 'Enhances body fortitude, raw health limits and defense ratings.' },
    mana: { name: 'Mana Control', desc: 'Accelerates passive mana restoration rates and reduces fatigue.' },
    focus: { name: 'Focus', desc: 'Increases mental stamina, precision, and skill activation rates.' },
    discipline: { name: 'Discipline', desc: 'Reduces fatigue accumulation and increases attributes growth factors.' },
    health: { name: 'Health', desc: 'Increases vitality limit and raw structural damage mitigation.' },
    recovery: { name: 'Recovery', desc: 'Improves active tissue healing rates and recovery times post-injury.' },
    energy: { name: 'Energy', desc: 'Enhances physical work capacity, sprint duration, and cardio output.' },
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Main profile layout */}
        <SystemWindow title="HUNTER STATUS PANEL" subtitle="Real-time player parameter synchronization">
          
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            
            {/* Left Box: Avatar Silhouette & Level/Rank summary */}
            <div className="flex-1 flex flex-col items-center justify-between p-6 rounded-lg bg-slate-950/60 border border-slate-900 text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[8px] font-display text-slate-600 uppercase font-black">
                ID: Monarch-SJ
              </div>

              {/* Glowing aura badge */}
              <div className="relative w-40 h-40 mt-4 rounded-full border border-hunter-blue/20 bg-gradient-to-t from-hunter-blue/15 to-transparent flex items-center justify-center shadow-blue-aura">
                <Shield className="w-16 h-16 text-hunter-blue animate-float" />
                <span className="absolute bottom-2 px-3 py-0.5 rounded bg-hunter-blue text-hunter-bg text-xs font-display font-black tracking-widest uppercase">
                  {player.rank}-Rank
                </span>
              </div>

              <div className="mt-6 w-full">
                <h3 className="font-display text-xl font-black text-slate-100 uppercase tracking-widest">
                  {player.name}
                </h3>
                <p className="text-xs text-hunter-purple font-display font-extrabold uppercase mt-1 tracking-widest">
                  Class: {player.title}
                </p>
                
                {/* Level details */}
                <div className="mt-6">
                  <LevelBar xp={player.xp} xpNeeded={player.xpNeeded} level={player.level} />
                </div>
              </div>

              {/* Currency indicators */}
              <div className="flex justify-between items-center w-full mt-6 pt-4 border-t border-slate-900 font-display text-xs">
                <div className="flex items-center gap-1.5 text-hunter-gold font-bold">
                  <Coins className="w-4 h-4" />
                  <span>{player.gold} Gold</span>
                </div>
                <div className="flex items-center gap-1.5 text-hunter-blue font-bold">
                  <Flame className="w-4 h-4" />
                  <span>{player.stats.mana * 10} Mana</span>
                </div>
              </div>
            </div>

            {/* Right Box: Level Rank Compliance Station */}
            <div className="flex-1 flex flex-col justify-between p-6 rounded-lg bg-slate-950/60 border border-slate-900 relative">
              <div>
                <h4 className="font-display text-xs font-bold text-hunter-blue uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Rank Compliance Evaluation
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The system evaluates your combat records, physical parameters, and overall level. Ascending to higher Hunter ranks unlocks premium dungeons and shadow soldiers.
                </p>

                <div className="mt-4 p-4 rounded bg-slate-900 border border-slate-800 flex flex-col gap-1.5 font-display text-[10px] text-slate-500 uppercase font-semibold">
                  <div className="flex justify-between">
                    <span>Current Rank:</span>
                    <span className="text-white font-bold">{player.rank}-Rank</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level Check:</span>
                    <span className="text-hunter-blue font-bold">Lvl {player.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Title:</span>
                    <span className="text-hunter-purple font-bold">{player.title}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleRankUpgrade}
                  disabled={evaluating}
                  className={`w-full py-3 rounded text-xs font-display font-black tracking-widest uppercase border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    evaluating 
                      ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-wait' 
                      : 'bg-hunter-purple text-white border-hunter-purple shadow-[0_0_15px_rgba(157,78,221,0.4)] hover:brightness-110'
                  }`}
                >
                  {evaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-hunter-purple" />
                      Evaluating Core Stats...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      RE-EVALUATE RANK
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Stat Points Allocator section */}
          <div className="mt-8 border-t border-slate-900 pt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-display text-sm font-bold text-white tracking-wider uppercase">
                  Hunter Core Attributes
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Distribute stat points earned from daily training leveling to optimize build potency.
                </p>
              </div>

              {player.statPoints > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="px-3 py-1 rounded border border-hunter-blue text-hunter-blue bg-hunter-blue/15 font-display text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  {player.statPoints} Points Available
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(player.stats) as Array<keyof typeof player.stats>).map((key) => (
                <StatCard
                  key={key}
                  name={statInfo[key].name}
                  value={player.stats[key]}
                  statKey={key}
                  description={statInfo[key].desc}
                  canUpgrade={player.statPoints > 0}
                />
              ))}
            </div>
          </div>

        </SystemWindow>

        {/* Rank compliance banner alert notifications */}
        <AnimatePresence>
          {evalMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded border border-hunter-blue/30 bg-hunter-blue/10 text-center font-display text-xs tracking-wider text-hunter-blue font-bold uppercase shadow-[0_0_12px_rgba(0,240,255,0.1)] relative"
            >
              <button 
                onClick={() => setEvalMessage(null)} 
                className="absolute top-2 right-2 text-slate-500 hover:text-white"
              >
                ×
              </button>
              {evalMessage}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
