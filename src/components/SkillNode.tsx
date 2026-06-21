import React from 'react'
import { motion } from 'framer-motion'
import { Zap, UserPlus, Cpu, Activity, Lock, Check } from 'lucide-react'
import type { SkillNodeData } from '../store/gameStore'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'

interface SkillNodeProps {
  skill: SkillNodeData
  onClick: () => void
}

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, onClick }) => {
  const player = useGameStore((state) => state.player)
  const { playHover } = useSound()

  const getIcon = () => {
    switch (skill.icon) {
      case 'UserPlus':
        return <UserPlus className="w-6 h-6" />
      case 'Zap':
        return <Zap className="w-6 h-6" />
      case 'Activity':
        return <Activity className="w-6 h-6" />
      case 'Cpu':
        return <Cpu className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const isLevelMet = player.level >= skill.requiredLevel
  const isAffordable = player.gold >= skill.cost
  const canUnlock = !skill.unlocked && isLevelMet && isAffordable

  // Node glowing styles based on state
  const getNodeStyles = () => {
    if (skill.unlocked) {
      return 'bg-hunter-blue text-hunter-bg border-hunter-blue shadow-[0_0_20px_rgba(0,240,255,0.7)]'
    }
    if (canUnlock) {
      return 'bg-hunter-purple/20 text-hunter-purple border-hunter-purple shadow-[0_0_15px_rgba(157,78,221,0.4)] hover:bg-hunter-purple hover:text-white cursor-pointer'
    }
    return 'bg-slate-900 border-slate-800 text-slate-500 cursor-pointer'
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Circle Node */}
      <motion.div
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={playHover}
        onClick={onClick}
        className={`
          w-16 h-16 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 z-10
          ${getNodeStyles()}
        `}
      >
        {/* Floating pulse ring if unlockable */}
        {canUnlock && (
          <span className="absolute inset-0 rounded-full border-2 border-hunter-purple animate-ping opacity-60"></span>
        )}

        {getIcon()}

        {/* Small corner status badges */}
        <span className="absolute -top-1 -right-1 p-0.5 rounded-full text-[8px] bg-slate-950 border border-slate-800 flex items-center justify-center">
          {skill.unlocked ? (
            <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
          ) : !isLevelMet ? (
            <Lock className="w-2.5 h-2.5 text-slate-500" />
          ) : (
            <span className="w-2.5 h-2.5 text-hunter-purple font-bold text-center flex items-center justify-center leading-none">!</span>
          )}
        </span>
      </motion.div>

      {/* Node label */}
      <div className="mt-2 text-center max-w-[120px]">
        <h4 className="font-display text-[10px] font-black uppercase tracking-wider text-slate-200 line-clamp-1">
          {skill.name}
        </h4>
        <p className="text-[8px] text-slate-500 mt-0.5 font-display font-semibold uppercase">
          {skill.unlocked ? `Lvl ${skill.level}` : `Req. Lvl ${skill.requiredLevel}`}
        </p>
      </div>
    </div>
  )
}
