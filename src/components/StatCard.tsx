import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Shield, Activity, Zap, Cpu, Flame, Target, Award } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'

interface StatCardProps {
  name: string
  value: number
  statKey: 'strength' | 'agility' | 'intelligence' | 'endurance' | 'mana' | 'focus' | 'discipline' | 'health' | 'recovery' | 'energy'
  description: string
  canUpgrade: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  name,
  value,
  statKey,
  description,
  canUpgrade,
}) => {
  const addStatPoint = useGameStore((state) => state.addStatPoint)
  const { playClick, playUnlock } = useSound()

  const getIcon = () => {
    switch (statKey) {
      case 'strength':
        return <Flame className="w-5 h-5 text-red-500" />
      case 'agility':
        return <Zap className="w-5 h-5 text-amber-500" />
      case 'intelligence':
        return <Cpu className="w-5 h-5 text-hunter-blue" />
      case 'endurance':
        return <Shield className="w-5 h-5 text-emerald-500" />
      case 'mana':
        return <Activity className="w-5 h-5 text-hunter-purple" />
      case 'focus':
        return <Target className="w-5 h-5 text-sky-400" />
      case 'discipline':
        return <Award className="w-5 h-5 text-indigo-400" />
      case 'health':
        return <Activity className="w-5 h-5 text-red-400" />
      case 'recovery':
        return <Flame className="w-5 h-5 text-teal-400" />
      case 'energy':
        return <Zap className="w-5 h-5 text-yellow-400" />
      default:
        return <Activity className="w-5 h-5 text-slate-400" />
    }
  }

  const getGlowColor = () => {
    switch (statKey) {
      case 'strength': return 'hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
      case 'agility': return 'hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
      case 'intelligence': return 'hover:border-hunter-blue/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]'
      case 'endurance': return 'hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
      case 'mana': return 'hover:border-hunter-purple/40 hover:shadow-[0_0_15px_rgba(157,78,221,0.15)]'
      case 'focus': return 'hover:border-sky-400/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]'
      case 'discipline': return 'hover:border-indigo-400/40 hover:shadow-[0_0_15px_rgba(129,140,248,0.15)]'
      case 'health': return 'hover:border-red-400/40 hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
      case 'recovery': return 'hover:border-teal-400/40 hover:shadow-[0_0_15px_rgba(45,212,191,0.15)]'
      case 'energy': return 'hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]'
      default: return 'hover:border-slate-500/40 hover:shadow-[0_0_15px_rgba(100,116,139,0.15)]'
    }
  }

  const handleUpgrade = () => {
    if (canUpgrade) {
      playUnlock()
      addStatPoint(statKey)
    } else {
      playClick()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`
        relative p-4 rounded-lg bg-hunter-gray/40 border border-slate-800 transition-all duration-300 flex items-center justify-between gap-4 group
        ${getGlowColor()}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Glowing icon wrapper */}
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center transition-all duration-300 group-hover:border-slate-700">
          {getIcon()}
        </div>
        
        <div>
          <h3 className="font-display text-xs md:text-sm font-semibold tracking-wider text-slate-300 uppercase">
            {name}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 max-w-[150px] md:max-w-none">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dynamic value counter animation */}
        <motion.span 
          key={value}
          initial={{ scale: 1.2, color: '#00f0ff' }}
          animate={{ scale: 1, color: '#f1f1f7' }}
          className="font-display text-base md:text-lg font-black tracking-wide"
        >
          {value}
        </motion.span>

        <AnimatePresence>
          {canUpgrade && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUpgrade}
              className="p-1.5 rounded-full bg-hunter-blue text-hunter-bg border border-hunter-blue shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer"
              title="Allocate Stat Point"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
