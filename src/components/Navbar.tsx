import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Volume2, VolumeX, Shield, User, Scroll, Users, Swords, Award, Dumbbell, Image, BookOpen, LogOut, Utensils } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const toggleSound = useGameStore((state) => state.toggleSound)
  const player = useGameStore((state) => state.player)
  
  const { playHover, playClick } = useSound()

  const resetSystem = useGameStore((state) => state.resetSystem)

  const handleResetSystem = async () => {
    playClick()
    if (window.confirm("WARNING: Are you sure you want to log out and reset the entire Hunter System? This will clear all level progression, stat allocations, gold, and shadow soldier contracts.")) {
      await resetSystem()
      window.location.reload()
    }
  }

  const navItems = [
    { name: 'Home', path: '/', icon: <Shield className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
    { name: 'Quest', path: '/quest', icon: <Scroll className="w-4 h-4" /> },
    { name: 'Nutrition', path: '/nutrition', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Army', path: '/army', icon: <Users className="w-4 h-4" /> },
    { name: 'Dungeon', path: '/dungeon', icon: <Swords className="w-4 h-4" /> },
    { name: 'Skills', path: '/skills', icon: <Award className="w-4 h-4" /> },
    { name: 'Training', path: '/training', icon: <Dumbbell className="w-4 h-4" /> },
    { name: 'Gallery', path: '/gallery', icon: <Image className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <BookOpen className="w-4 h-4" /> },
  ]

  const handleToggleSound = () => {
    toggleSound()
    // Give immediate feedback if turning it on
    if (!soundEnabled) {
      setTimeout(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, audioCtx.currentTime)
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.1)
      }, 50)
    }
  }

  const handleItemClick = () => {
    playClick()
    setIsOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-hunter-bg/85 backdrop-blur-md border-b border-slate-900 z-40 flex items-center justify-between px-4 md:px-8">
        
        {/* LOGO HUD */}
        <NavLink 
          to="/" 
          onClick={handleItemClick}
          onMouseEnter={playHover}
          className="flex items-center gap-2 font-display text-base md:text-lg font-black tracking-widest text-white hover:text-hunter-blue transition-colors group"
        >
          <svg className="w-7 h-7 drop-shadow-[0_0_6px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.9)] transition-all duration-300" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="navShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#7b2cbf" />
                <stop offset="100%" stopColor="#9d4edd" />
              </linearGradient>
            </defs>
            <polygon points="50,6 94,50 50,94 6,50" fill="#030712" stroke="url(#navShieldGrad)" strokeWidth="6.5" />
            <polygon points="50,16 84,50 50,84 16,50" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path d="M62,32 L42,32 L38,47 L62,53 L58,68 L38,68" fill="none" stroke="#00f0ff" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>HUNTER <span className="text-hunter-blue">SYSTEM</span></span>
        </NavLink>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onMouseEnter={playHover}
              onClick={() => playClick()}
              className={({ isActive }) => `
                px-3 py-1.5 rounded font-display text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 uppercase border border-transparent
                ${isActive 
                  ? 'text-hunter-blue bg-hunter-blue/5 border-hunter-blue/20 shadow-[0_0_8px_rgba(0,240,255,0.15)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40 hover:border-slate-800'
                }
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE STATS & SOUND */}
        <div className="flex items-center gap-4">
          
          {/* Quick HUD Level Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border border-slate-900 font-display text-[10px] font-bold tracking-widest uppercase">
            <span className="text-slate-500">LVL</span>
            <span className="text-hunter-blue font-black text-sm">{player.level}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">RANK</span>
            <span className="text-hunter-purple font-black text-sm">{player.rank}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={playHover}
            className={`p-2 rounded border transition-all cursor-pointer ${
              soundEnabled 
                ? 'border-hunter-blue/20 bg-hunter-blue/5 text-hunter-blue hover:bg-hunter-blue/20' 
                : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Mute System Sounds' : 'Unmute System Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Logout / Reset System */}
          <button
            onClick={handleResetSystem}
            onMouseEnter={playHover}
            className="p-2 rounded border border-red-900/30 bg-red-950/10 text-red-400 hover:bg-red-900/20 hover:border-red-500/50 transition-all cursor-pointer"
            title="Log Out (Reset Profile)"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              playClick()
              setIsOpen(!isOpen)
            }}
            className="lg:hidden p-2 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white cursor-pointer"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleItemClick}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-40 lg:hidden"
            ></motion.div>

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-hunter-bg/95 border-l border-slate-900 z-50 p-6 lg:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-display font-black text-xs tracking-wider text-slate-500 uppercase">
                    Navigation Panel
                  </span>
                  <button
                    onClick={() => {
                      playClick()
                      setIsOpen(false)
                    }}
                    className="p-1.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onMouseEnter={playHover}
                      onClick={handleItemClick}
                      className={({ isActive }) => `
                        px-4 py-3 rounded font-display text-xs font-bold tracking-widest transition-all duration-300 flex items-center gap-3 uppercase border
                        ${isActive 
                          ? 'text-hunter-blue bg-hunter-blue/5 border-hunter-blue/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                          : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/60 hover:border-slate-800'
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Sidebar Footer details */}
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-lg flex flex-col gap-2 font-display text-[9px] font-semibold text-slate-500 tracking-wider uppercase">
                <div className="flex justify-between">
                  <span>Hunter Code:</span>
                  <span className="text-white">#9527-SJ</span>
                </div>
                <div className="flex justify-between">
                  <span>Level Status:</span>
                  <span className="text-hunter-blue">{player.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guild Standing:</span>
                  <span className="text-hunter-purple">{player.rank}-Rank</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-16"></div> {/* Spacer for fixed Nav */}
    </>
  )
}
