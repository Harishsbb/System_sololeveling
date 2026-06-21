import React from 'react'
import { motion } from 'framer-motion'

export const Portal3D: React.FC<{ active?: boolean }> = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-hunter-bg">
      {/* 2D Dungeon Portal Image Background */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ 
          scale: [1.02, 1.06, 1.02],
          opacity: 0.65
        }}
        transition={{ 
          scale: {
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          },
          opacity: {
            duration: 1.5,
            ease: "easeOut"
          }
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none select-none opacity-60"
        style={{ backgroundImage: "url('/dungeon_portal_2d.png')" }}
      />
      
      {/* Dark vignette blending ring */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(3,3,8,0.95)_85%)] pointer-events-none" />
      
      {/* Subtly moving magic aura overlays */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.08)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(157,78,221,0.06)_0%,transparent_70%)] animate-pulse-slow" style={{ animationDelay: '2s' }} />
    </div>
  )
}
