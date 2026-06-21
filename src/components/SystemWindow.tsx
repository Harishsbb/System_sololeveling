import React from 'react'
import { motion } from 'framer-motion'

interface SystemWindowProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  variant?: 'blue' | 'purple' | 'gold'
  className?: string
}

export const SystemWindow: React.FC<SystemWindowProps> = ({
  title = 'SYSTEM MESSAGE',
  subtitle,
  children,
  variant = 'blue',
  className = '',
}) => {
  const shadowGlow = {
    blue: 'shadow-[0_0_25px_rgba(0,240,255,0.15)] border-hunter-blue/30',
    purple: 'shadow-[0_0_25px_rgba(157,78,221,0.15)] border-hunter-purple/30',
    gold: 'shadow-[0_0_25px_rgba(255,183,3,0.15)] border-hunter-gold/30',
  }

  const headerColors = {
    blue: 'text-hunter-blue border-hunter-blue/40 bg-hunter-blue/5',
    purple: 'text-hunter-purple border-hunter-purple/40 bg-hunter-purple/5',
    gold: 'text-hunter-gold border-hunter-gold/40 bg-hunter-gold/5',
  }

  const borderGlowText = {
    blue: 'text-hunter-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]',
    purple: 'text-hunter-purple drop-shadow-[0_0_5px_rgba(157,78,221,0.5)]',
    gold: 'text-hunter-gold drop-shadow-[0_0_5px_rgba(255,183,3,0.5)]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        relative w-full glass-panel rounded-lg overflow-hidden border rpg-dots
        ${shadowGlow[variant]}
        ${className}
      `}
    >
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black/30 pointer-events-none z-0"></div>
      
      {/* Scanline line element */}
      <div className="absolute left-0 right-0 h-[1px] bg-hunter-blue/10 animate-scanline pointer-events-none z-0"></div>
      
      {/* Corner Bracket decorations */}
      <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 pointer-events-none opacity-80 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
      <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 pointer-events-none opacity-80 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
      <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 pointer-events-none opacity-80 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
      <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 pointer-events-none opacity-80 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>

      {/* Header Bar */}
      <div className={`relative z-10 px-6 py-3 border-b flex flex-col items-center justify-center font-display tracking-widest ${headerColors[variant]}`}>
        <h2 className={`text-base md:text-lg font-black uppercase text-center ${borderGlowText[variant]}`}>
          [ {title} ]
        </h2>
        {subtitle && (
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold text-center font-sans tracking-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6 md:p-8 font-sans">
        {children}
      </div>
    </motion.div>
  )
}
