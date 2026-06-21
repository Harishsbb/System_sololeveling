import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Lock, Zap } from 'lucide-react'
import type { ShadowSoldier } from '../store/gameStore'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'

interface ShadowCardProps {
  soldier: ShadowSoldier
}

export const ShadowCard: React.FC<ShadowCardProps> = ({ soldier }) => {
  const player = useGameStore((state) => state.player)
  const unlockShadow = useGameStore((state) => state.unlockShadow)
  
  const { playClick, playUnlock, playHover } = useSound()

  // 3D Tilt calculations
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setTilt({
      x: -y / (rect.height / 20), // Max 10 deg rotation
      y: x / (rect.width / 20)
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const handleUnlock = () => {
    const canUnlock = player.gold >= soldier.unlockCostGold && player.stats.mana >= soldier.unlockCostMana
    if (!soldier.unlocked && canUnlock) {
      playUnlock()
      unlockShadow(soldier.id)
    } else {
      playClick()
    }
  }

  const canAfford = player.gold >= soldier.unlockCostGold && player.stats.mana >= soldier.unlockCostMana

  // Shadow illustrations represented by clean geometric SVGs with heavy neon shadows
  const getShadowIllustration = (id: string) => {
    const shadowColors = "from-purple-950 via-slate-900 to-indigo-950"
    switch (id) {
      case 'shadow_knight': // Igris
        return (
          <div className={`w-full h-40 bg-gradient-to-b ${shadowColors} relative flex items-center justify-center border-b border-purple-900/40 overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(157,78,221,0.2)_10%,transparent_80%)] animate-pulse-slow"></div>
            {/* Sword silhouette */}
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-purple-400 opacity-60 shadow-aura">
              <path d="M50 10 L50 75 M40 25 L60 25 M45 75 L55 75 M50 75 L50 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M50 10 L45 20 L50 22 L55 20 Z" fill="currentColor" opacity="0.8"/>
            </svg>
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-purple-900/50 border border-purple-500/30 text-[10px] uppercase font-display text-purple-300 font-bold tracking-widest">
              Commander
            </div>
          </div>
        )
      case 'shadow_assassin': // Kaysel
        return (
          <div className={`w-full h-40 bg-gradient-to-b ${shadowColors} relative flex items-center justify-center border-b border-purple-900/40 overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(157,78,221,0.2)_10%,transparent_80%)] animate-pulse-slow"></div>
            {/* Wings / Dragon silhouette */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-purple-400 opacity-60 shadow-aura">
              <path d="M50 40 Q25 20 15 45 Q35 50 50 60 Q65 50 85 45 Q75 20 50 40 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M50 30 L50 75 M40 75 L60 75" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-blue-900/50 border border-blue-500/30 text-[10px] uppercase font-display text-blue-300 font-bold tracking-widest">
              Air Mount
            </div>
          </div>
        )
      case 'shadow_mage': // Tusk
        return (
          <div className={`w-full h-40 bg-gradient-to-b ${shadowColors} relative flex items-center justify-center border-b border-purple-900/40 overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(157,78,221,0.2)_10%,transparent_80%)] animate-pulse-slow"></div>
            {/* Staff / Orb silhouette */}
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-purple-400 opacity-60 shadow-aura">
              <circle cx="50" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"/>
              <circle cx="50" cy="30" r="4" fill="currentColor"/>
              <path d="M50 42 L50 85" stroke="currentColor" strokeWidth="3"/>
              <path d="M35 30 H65" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
            </svg>
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-violet-900/50 border border-violet-500/30 text-[10px] uppercase font-display text-violet-300 font-bold tracking-widest">
              Shaman Magic
            </div>
          </div>
        )
      case 'shadow_beast': // Tank
        return (
          <div className={`w-full h-40 bg-gradient-to-b ${shadowColors} relative flex items-center justify-center border-b border-purple-900/40 overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(157,78,221,0.2)_10%,transparent_80%)] animate-pulse-slow"></div>
            {/* Bear head / claw silhouette */}
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-purple-400 opacity-60 shadow-aura">
              <path d="M30 45 L20 25 L35 35 L50 20 L65 35 L80 25 L70 45 Q70 70 50 80 Q30 70 30 45 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
              <circle cx="40" cy="45" r="3" fill="currentColor"/>
              <circle cx="60" cy="45" r="3" fill="currentColor"/>
            </svg>
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-indigo-900/50 border border-indigo-500/30 text-[10px] uppercase font-display text-indigo-300 font-bold tracking-widest">
              Heavy Tanker
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        playHover()
      }}
      animate={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      className={`
        relative w-full rounded-xl overflow-hidden border transition-all duration-300 flex flex-col z-10
        ${soldier.unlocked 
          ? 'border-purple-800/30 bg-slate-950/90 shadow-[0_5px_20px_rgba(0,0,0,0.6)] hover:border-hunter-purple/60 hover:shadow-[0_0_20px_rgba(157,78,221,0.25)]' 
          : 'border-slate-800/60 bg-slate-950/40 shadow-none'
        }
      `}
    >
      {/* Locked overlay lock screen */}
      <AnimatePresence>
        {!soldier.unlocked && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            <Lock className="w-8 h-8 text-slate-500 mb-3" />
            <h3 className="font-display text-sm font-black tracking-widest text-slate-400 uppercase">
              {soldier.name.split(' ')[0]}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Extract and command this shadow soldier.
            </p>

            <div className="mt-4 p-3 bg-purple-950/10 border border-purple-900/30 rounded flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center text-[10px] uppercase font-display font-semibold">
                <span className="text-slate-400">Gold Needed:</span>
                <span className={player.gold >= soldier.unlockCostGold ? 'text-hunter-gold' : 'text-red-500'}>
                  {soldier.unlockCostGold} G
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-display font-semibold">
                <span className="text-slate-400">Mana Needed:</span>
                <span className={player.stats.mana >= soldier.unlockCostMana ? 'text-hunter-blue' : 'text-red-500'}>
                  {soldier.unlockCostMana} MP
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canAfford}
              onClick={handleUnlock}
              className={`mt-4 px-5 py-2 rounded text-xs font-display font-black tracking-wider uppercase border w-full flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                canAfford 
                  ? 'bg-hunter-purple text-white border-hunter-purple shadow-[0_0_12px_rgba(157,78,221,0.5)] hover:brightness-110' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              EXTRACT SHADOW
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shadow Card Content */}
      {getShadowIllustration(soldier.id)}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-1.5">
            <h3 className="font-display text-sm font-black tracking-wider text-slate-100 uppercase">
              {soldier.name}
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-display font-extrabold bg-purple-950 text-hunter-purple border border-hunter-purple/40 rounded shrink-0">
              {soldier.rank}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            {soldier.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="p-2 bg-slate-900/50 rounded border border-slate-900 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-display font-semibold">str</span>
              <span className="text-xs font-display font-black text-slate-200 mt-0.5">{soldier.stats.strength}</span>
            </div>
            <div className="p-2 bg-slate-900/50 rounded border border-slate-900 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-display font-semibold">hp</span>
              <span className="text-xs font-display font-black text-slate-200 mt-0.5">{soldier.stats.hp}</span>
            </div>
            <div className="p-2 bg-slate-900/50 rounded border border-slate-900 flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-display font-semibold">mana</span>
              <span className="text-xs font-display font-black text-slate-200 mt-0.5">{soldier.stats.mana}</span>
            </div>
          </div>
        </div>

        {/* Skills list */}
        <div className="mt-4">
          <h4 className="text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-hunter-purple" />
            Special Abilities
          </h4>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {soldier.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-purple-950/20 border border-purple-900/30 text-[9px] font-display text-purple-300 rounded uppercase font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
