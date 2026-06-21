import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSound } from '../hooks/useSound'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  variant?: 'blue' | 'purple' | 'gold'
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  variant = 'blue',
  children,
  className = '',
}) => {
  const { playClick } = useSound()

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    playClick()
    onClose()
  }

  const borderColors = {
    blue: 'border-hunter-blue/40 shadow-[0_0_30px_rgba(0,240,255,0.15)]',
    purple: 'border-hunter-purple/40 shadow-[0_0_30px_rgba(157,78,221,0.15)]',
    gold: 'border-hunter-gold/40 shadow-[0_0_30px_rgba(255,183,3,0.15)]',
  }

  const textColors = {
    blue: 'text-hunter-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]',
    purple: 'text-hunter-purple drop-shadow-[0_0_5px_rgba(157,78,221,0.4)]',
    gold: 'text-hunter-gold drop-shadow-[0_0_5px_rgba(255,183,3,0.4)]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          ></motion.div>

          {/* Modal Content Panel */}
          <motion.div
            initial={{ scale: 0.9, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`
              relative w-full max-w-lg glass-panel border rounded-xl overflow-hidden z-10 rpg-dots
              ${borderColors[variant]}
              ${className}
            `}
          >
            {/* Corner decorations */}
            <div className={`absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none opacity-60 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
            <div className={`absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 pointer-events-none opacity-60 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
            <div className={`absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 pointer-events-none opacity-60 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>
            <div className={`absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none opacity-60 ${variant === 'blue' ? 'border-hunter-blue' : variant === 'purple' ? 'border-hunter-purple' : 'border-hunter-gold'}`}></div>

            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 relative z-10">
              <h3 className={`font-display text-sm md:text-base font-black tracking-widest uppercase ${textColors[variant]}`}>
                [ {title} ]
              </h3>
              
              <button
                onClick={handleClose}
                className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-red-500/40 hover:text-red-500 text-slate-400 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto relative z-10 font-sans">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
