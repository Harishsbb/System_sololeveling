import React from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { useSound } from '../hooks/useSound'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'onClick'> {
  variant?: 'blue' | 'purple' | 'gold' | 'gray' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  glow?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  size = 'md',
  children,
  className = '',
  glow = true,
  onClick,
  ...props
}) => {
  const { playHover, playClick } = useSound()

  const baseStyles = 'relative font-display uppercase tracking-widest transition-all duration-300 font-semibold border focus:outline-none flex items-center justify-center gap-2 clip-path-rpg overflow-hidden cursor-pointer'
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  const variantStyles = {
    blue: 'border-hunter-blue text-hunter-blue bg-hunter-blue/5 hover:bg-hunter-blue/20 hover:text-white',
    purple: 'border-hunter-purple text-hunter-purple bg-hunter-purple/5 hover:bg-hunter-purple/20 hover:text-white',
    gold: 'border-hunter-gold text-hunter-gold bg-hunter-gold/5 hover:bg-hunter-gold/20 hover:text-white',
    gray: 'border-hunter-gray-light text-slate-400 bg-hunter-gray/40 hover:bg-hunter-gray-light hover:text-white',
    danger: 'border-red-500 text-red-500 bg-red-950/10 hover:bg-red-500 hover:text-white',
  }

  const glowStyles = {
    blue: 'shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    purple: 'shadow-[0_0_10px_rgba(157,78,221,0.15)] hover:shadow-[0_0_20px_rgba(157,78,221,0.4)]',
    gold: 'shadow-[0_0_10px_rgba(255,183,3,0.15)] hover:shadow-[0_0_20px_rgba(255,183,3,0.4)]',
    gray: 'hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]',
    danger: 'shadow-[0_0_10px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick()
    if (onClick) onClick(e)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={playHover}
      onClick={handleClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${glow ? glowStyles[variant] : ''}
        ${className}
      `}
      {...props}
    >
      {/* Corner decor lines for RPG sci-fi feel */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-70"></span>
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-current opacity-70"></span>
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-current opacity-70"></span>
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-70"></span>
      
      {/* Scanline reflection overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[scanline_1s_ease-out_infinite] pointer-events-none"></span>
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
}
