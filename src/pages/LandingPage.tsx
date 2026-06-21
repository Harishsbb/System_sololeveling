import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Swords, User, Heart, Droplet, Zap, Users, Scroll, Dumbbell, Shield, Activity, ChevronRight } from 'lucide-react'
import { useGameStore, getCurrentDayCount } from '../store/gameStore'

export const LandingPage: React.FC = () => {
  const player = useGameStore((state) => state.player)
  const quests = useGameStore((state) => state.quests)
  const dungeons = useGameStore((state) => state.dungeons)
  const shadows = useGameStore((state) => state.shadows)

  // Typewriter Terminal Animation
  const [typedText, setTypedText] = useState('')
  const phrases = [
    'SYSTEM IS ONLINE...',
    'DAILY TRAINING INITIATED...',
    'SHADOW EXTRACTION READY...',
    'ARISE, SHADOW MONARCH.'
  ]
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const currentPhrase = phrases[phraseIdx]
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIdx - 1))
        setCharIdx(prev => prev - 1)
      }, 30)
    } else {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIdx + 1))
        setCharIdx(prev => prev + 1)
      }, 80)
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false)
      setPhraseIdx(prev => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timer)
  }, [charIdx, isDeleting, phraseIdx])

  // GSAP Title Entrance Animation
  useEffect(() => {
    gsap.fromTo('.arise-main-title',
      { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' }
    )
  }, [])

  // Daily Quest stats
  const dailyQuest = quests.find((q) => q.type === 'daily')
  const totalTasks = dailyQuest?.tasks.length || 4
  const completedTasksCount = dailyQuest?.tasks.filter((t) => t.current >= t.target).length || 0

  // Shadow Army stats
  const totalShadows = shadows.filter((s) => s.unlocked).length

  // Gates stats
  const activeGates = dungeons.filter((d) => player.stats.mana >= d.manaRequired).length
  const totalGates = dungeons.length
  const clearRate = totalGates ? Math.round((dungeons.filter((d) => player.stats.mana >= d.manaRequired).length / totalGates) * 100) : 0

  // Training progress percentage
  const trainingPercentage = dailyQuest
    ? Math.round(
        (dailyQuest.tasks.reduce((acc, t) => acc + Math.min(t.current / t.target, 1), 0) /
          dailyQuest.tasks.length) *
          100
      )
    : 0

  // XP progress bar
  const xpPercentage = Math.min((player.xp / player.xpNeeded) * 100, 100)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col justify-between bg-black">
      
      {/* 1. Background Video Engine */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none filter blur-[2px]"
      >
        <source src="/Create_a_cinematic_dark_fantas.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays (Vignette, Blue-Black Gradients, Scanline overlays) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.75)_90%)] z-0 pointer-events-none" />
      <div className="scanline-overlay pointer-events-none" />

      {/* Main Responsive Grid Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex-grow flex flex-col justify-between gap-10">
        
        {/* Top Header Row (Status Label) */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 border border-hunter-blue/30 bg-hunter-blue/5 px-3 py-1.5 rounded-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] backdrop-blur-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-hunter-blue animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <div className="font-display">
              <span className="text-hunter-blue text-[10px] font-black tracking-widest block leading-none">SYSTEM NOTIFICATION</span>
              <span className="text-slate-400 text-[9px] font-bold tracking-widest block mt-0.5 uppercase">REAWAKENING DETECTED</span>
            </div>
          </motion.div>
        </div>

        {/* Center Grid: Hero Text & Right HUD Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-7 flex flex-col items-start select-none">
            <h1 className="arise-main-title font-display text-8xl md:text-9xl font-black tracking-widest leading-none text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.3)] uppercase">
              ARISE
            </h1>
            
            <h2 className="font-display text-xs md:text-sm font-black tracking-[0.3em] text-hunter-blue uppercase mt-3">
              THE ULTIMATE HUNTER SYSTEM
            </h2>

            {/* Terminal Typing Indicator */}
            <div className="h-8 flex items-center font-display text-xs tracking-widest text-slate-400 font-semibold mt-4">
              <span>&gt;&gt; {typedText}</span>
              <span className="w-1.5 h-4 bg-hunter-blue ml-1.5 animate-pulse"></span>
            </div>

            <p className="text-xs md:text-sm text-slate-400 max-w-md mt-6 leading-relaxed font-sans">
              Train your physical body, unlock Monarch class skills, command an eternal army of shadows, and conquer high-ranking gates.
            </p>

            {/* Action buttons with glowing neon borders */}
            <div className="flex flex-wrap gap-4 mt-8 w-full sm:w-auto">
              <Link to="/quest">
                <button className="px-6 py-3 rounded-sm bg-hunter-blue text-hunter-bg font-display font-black text-xs tracking-widest hover:brightness-110 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:shadow-[0_0_30px_rgba(0,240,255,0.65)] flex items-center gap-2 uppercase transition-all">
                  <Swords className="w-4 h-4" />
                  ENTER DUNGEON
                </button>
              </Link>
              <Link to="/profile">
                <button className="px-6 py-3 rounded-sm border border-hunter-purple/60 text-hunter-purple bg-hunter-purple/5 hover:bg-hunter-purple/25 hover:border-hunter-purple font-display font-black text-xs tracking-widest hover:shadow-[0_0_20px_rgba(157,78,221,0.35)] cursor-pointer flex items-center gap-2 uppercase transition-all">
                  <User className="w-4 h-4" />
                  HUNTER PROFILE
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating SYSTEM STATUS Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 lg:justify-self-end w-full max-w-xs glass-panel p-5 rounded border border-hunter-blue/20 bg-hunter-bg/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 mb-4">
              <h3 className="font-display text-xs font-black text-hunter-blue uppercase tracking-widest">SYSTEM STATUS</h3>
              <Activity className="w-4 h-4 text-hunter-blue/60" />
            </div>

            <div className="flex flex-col gap-4 font-display text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="font-bold tracking-wider">Health</span>
                </div>
                <span className="text-white font-black">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Droplet className="w-4 h-4 text-hunter-blue" />
                  <span className="font-bold tracking-wider">Mana</span>
                </div>
                <span className="text-white font-black">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold tracking-wider">Stamina</span>
                </div>
                <span className="text-white font-black">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Users className="w-4 h-4 text-hunter-purple" />
                  <span className="font-bold tracking-wider">Shadow Army</span>
                </div>
                <span className="text-white font-black">{totalShadows}</span>
              </div>
            </div>

            <Link to="/profile" className="block mt-5 pt-3 border-t border-slate-800/60">
              <button className="w-full py-2 rounded-sm bg-slate-900/60 hover:bg-hunter-blue/15 border border-slate-800 hover:border-hunter-blue/30 text-slate-300 hover:text-hunter-blue font-display font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>VIEW STATS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Row Panel Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 mt-auto">
          
          {/* 1. Daily Quest Widget */}
          <div className="lg:col-span-3 glass-panel p-4 rounded border border-slate-800/80 bg-hunter-bg/70 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Scroll className="w-4 h-4 text-hunter-blue" />
              <span className="font-display text-[10px] font-black tracking-widest uppercase">DAILY QUEST</span>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-white font-bold">Daily Progress</span>
                <span className="font-display text-xs font-bold text-hunter-blue">{completedTasksCount} / {totalTasks}</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-hunter-blue" style={{ width: `${(completedTasksCount / totalTasks) * 100}%` }} />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-display font-medium border-t border-slate-800/40 pt-2 uppercase">
              <span className="text-slate-500">REWARD</span>
              <span className="text-hunter-blue font-bold">💎 +{dailyQuest?.rewards.gold || 200}G</span>
            </div>
          </div>

          {/* 2. Shadow Army Widget */}
          <div className="lg:col-span-2 glass-panel p-4 rounded border border-slate-800/80 bg-hunter-bg/70 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4 text-hunter-purple" />
              <span className="font-display text-[10px] font-black tracking-widest uppercase">SHADOW ARMY</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Shadows</div>
              <div className="text-2xl font-display font-black text-white mt-1">{totalShadows}</div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-display font-medium border-t border-slate-800/40 pt-2 uppercase">
              <span className="text-slate-500">RANK</span>
              <span className="text-hunter-purple font-black">{player.rank}</span>
            </div>
          </div>

          {/* 3. Gates Open Widget */}
          <div className="lg:col-span-2 glass-panel p-4 rounded border border-slate-800/80 bg-hunter-bg/70 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-hunter-gold" />
              <span className="font-display text-[10px] font-black tracking-widest uppercase">GATES OPEN</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Active Gates</div>
              <div className="text-2xl font-display font-black text-white mt-1">{activeGates}</div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-display font-medium border-t border-slate-800/40 pt-2 uppercase">
              <span className="text-slate-500">CLEAR RATE</span>
              <span className="text-hunter-gold font-bold">{clearRate}%</span>
            </div>
          </div>

          {/* 4. Training Widget */}
          <div className="lg:col-span-2 glass-panel p-4 rounded border border-slate-800/80 bg-hunter-bg/70 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span className="font-display text-[10px] font-black tracking-widest uppercase">TRAINING</span>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Today's Progress</span>
                <span className="font-display text-xs font-bold text-emerald-400">{trainingPercentage}%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${Math.min(trainingPercentage, 100)}%` }} />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-display font-medium border-t border-slate-800/40 pt-2 uppercase">
              <span className="text-slate-500">REWARD</span>
              <span className="text-emerald-400 font-bold">✨ x150</span>
            </div>
          </div>

          {/* 5. Mini Profile Card Widget */}
          <div className="lg:col-span-3 glass-panel p-3.5 rounded border border-hunter-purple/20 bg-hunter-bg/70 backdrop-blur-sm flex items-center justify-between gap-3.5">
            <div className="w-12 h-12 rounded border border-slate-800 bg-slate-950 overflow-hidden shrink-0">
              <img src="/hunter_character.png" alt="Avatar" className="w-full h-full object-cover object-top scale-105" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-display text-xs font-black text-white truncate uppercase tracking-wide">{player.name}</h4>
                <span className="font-display text-[9px] text-hunter-purple font-black shrink-0 uppercase">RANK {player.rank}</span>
              </div>
              
              <div className="flex items-center justify-between text-[9px] font-display font-bold text-slate-400 mt-1">
                <span>LEVEL {player.level}</span>
                <span>{player.xp} / {player.xpNeeded} XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-hunter-purple" style={{ width: `${xpPercentage}%` }} />
              </div>
            </div>
            <Link to="/profile" className="shrink-0">
              <button className="p-1.5 rounded-sm bg-slate-900 border border-slate-800 hover:border-hunter-purple/40 text-slate-400 hover:text-hunter-purple cursor-pointer transition-all flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

        </div>

        {/* Developer Quest HUD Integration */}
        {(() => {
          const dev = player.developer || {
            devLevel: 1,
            devXp: 0,
            devXpNeeded: 1000,
            dsaSolved: 0,
            codingStreak: 0,
            projectHours: 0,
            javaProgress: [],
            dsaProgress: [],
            frontendProgress: [],
            backendProgress: [],
            devopsProgress: [],
            communicationMinutes: 0,
            mockInterviewHistory: [],
            projectProgress: [],
            achievements: []
          }
          const currentDay = getCurrentDayCount()
          const getDevRank = (day: number) => {
            if (day <= 30) return "Foundation Hunter (E-Rank)"
            if (day <= 60) return "Full Stack Hunter (B-Rank)"
            return "Full Stack Monarch (S-Rank)"
          }
          const devRank = getDevRank(currentDay)
          const devXpPercent = Math.min((dev.devXp / dev.devXpNeeded) * 100, 100)

          const statsList = [
            { label: 'Intelligence (INT)', value: player.stats.intelligence || 10, color: 'from-cyan-500 to-blue-500' },
            { label: 'Problem Solving (PRB)', value: player.stats.problemSolving || 10, color: 'from-indigo-500 to-purple-500' },
            { label: 'Focus (FCS)', value: player.stats.focus || 10, color: 'from-teal-500 to-emerald-500' },
            { label: 'Communication (COM)', value: player.stats.communication || 10, color: 'from-blue-500 to-indigo-500' },
            { label: 'Discipline (DIS)', value: player.stats.discipline || 10, color: 'from-purple-500 to-pink-500' }
          ]

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 border-t border-slate-900 pt-6">
              {/* Left Column: Dev HUD stats */}
              <div className="lg:col-span-7 glass-panel p-5 rounded border border-hunter-blue/20 bg-hunter-bg/60 backdrop-blur-sm flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                    <h3 className="font-display text-[10px] font-black tracking-widest text-cyan-400 uppercase">DEVELOPER HUNTER MONITOR</h3>
                  </div>
                  <span className="font-display text-[9px] font-bold text-slate-500 tracking-wider">SYSTEM VERSION: 3.0.0</span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-display">
                  <div className="p-3 rounded bg-slate-950/80 border border-slate-900 text-center">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block">DEV LEVEL</span>
                    <span className="text-lg font-black text-cyan-400">LVL {dev.devLevel}</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950/80 border border-slate-900 text-center">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block">CODING STREAK</span>
                    <span className="text-lg font-black text-amber-400">🔥 {dev.codingStreak} DAYS</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950/80 border border-slate-900 text-center">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block">DEV RANK</span>
                    <span className="text-[10px] font-black text-indigo-400 block mt-1 uppercase truncate">{devRank}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 font-display text-[9px]">
                  <div className="flex flex-col p-2 bg-slate-950/40 rounded border border-slate-900/50">
                    <span className="text-slate-500 uppercase">DSA Solved</span>
                    <span className="text-white font-bold mt-0.5">{dev.dsaSolved || 0} Problems</span>
                  </div>
                  <div className="flex flex-col p-2 bg-slate-950/40 rounded border border-slate-900/50">
                    <span className="text-slate-500 uppercase">Projects</span>
                    <span className="text-white font-bold mt-0.5">{(dev.projectProgress || []).length} Completed</span>
                  </div>
                  <div className="flex flex-col p-2 bg-slate-950/40 rounded border border-slate-900/50">
                    <span className="text-slate-500 uppercase">Comm Level</span>
                    <span className="text-white font-bold mt-0.5">LVL {Math.min(5, Math.floor((dev.communicationMinutes || 0) / 100) + 1)}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-slate-950/40 rounded border border-slate-900/50">
                    <span className="text-slate-500 uppercase">Mock Interviews</span>
                    <span className="text-white font-bold mt-0.5">{(dev.mockInterviewHistory || []).length} Mocks</span>
                  </div>
                </div>

                {/* Developer XP bar */}
                <div className="font-display">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Developer XP</span>
                    <span className="text-[10px] text-cyan-400 font-black">{dev.devXp} / {dev.devXpNeeded} XP</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-[1px] border border-cyan-500/10">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500" style={{ width: `${devXpPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Right Column: Skill XP Graph */}
              <div className="lg:col-span-5 glass-panel p-5 rounded border border-hunter-blue/20 bg-hunter-bg/60 backdrop-blur-sm flex flex-col justify-between gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                  <h3 className="font-display text-[10px] font-black tracking-widest text-cyan-400 uppercase">SKILL XP MATRIX</h3>
                </div>

                <div className="flex-grow flex flex-col gap-2.5 justify-center py-2 font-display text-[10px]">
                  {statsList.map((st) => {
                    const pct = Math.min((st.value / 150) * 100, 100) // max scale for graph viz is 150
                    return (
                      <div key={st.label}>
                        <div className="flex justify-between text-[9px] mb-1 font-semibold">
                          <span className="text-slate-400">{st.label}</span>
                          <span className="text-cyan-400 font-bold">{st.value}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-sm overflow-hidden p-[1px] border border-slate-900">
                          <div className={`h-full bg-gradient-to-r ${st.color} rounded-sm transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Link to="/skills">
                  <button className="w-full py-2.5 rounded bg-cyan-950/20 hover:bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 font-display font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>ENTER SKILL QUEST STATION</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}
