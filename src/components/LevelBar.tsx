import React from 'react'
import { motion } from 'framer-motion'

interface LevelBarProps {
  xp: number
  xpNeeded: number
  level: number
  showDetails?: boolean
  className?: string
}

export const LevelBar: React.FC<LevelBarProps> = ({
  xp,
  xpNeeded,
  level,
  showDetails = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((xp / xpNeeded) * 100, 0), 100)

  return (
    <div className={`w-full font-display ${className}`}>
      {showDetails && (
        <div className="flex justify-between items-end mb-1.5 px-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">level</span>
            <span className="text-2xl font-black text-white tracking-wide leading-none">{level}</span>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-2">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-xs text-hunter-blue font-bold tracking-widest">
              {xp} / {xpNeeded} XP
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_6px_rgba(0,0,0,0.8)]"></div>
        
        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-hunter-purple via-hunter-blue to-hunter-blue rounded-full relative"
          style={{ boxShadow: '0 0 10px rgba(0, 240, 255, 0.7)' }}
        >
          {/* Pulsing light effect inside the bar */}
          <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-20 animate-[scanline_2s_linear_infinite]"></span>
        </motion.div>
      </div>
    </div>
  )
}
