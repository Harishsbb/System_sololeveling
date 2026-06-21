import React, { useState } from 'react'
import { Award, Sparkles, Code, Terminal, Timer, Lock, Trophy, CheckSquare, Square, BookOpen, Swords, Globe } from 'lucide-react'
import { useGameStore, getCurrentDayCount } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { SkillNode } from '../components/SkillNode'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

export const SkillsPage: React.FC = () => {
  const skills = useGameStore((state) => state.skills)
  const player = useGameStore((state) => state.player)
  const unlockSkill = useGameStore((state) => state.unlockSkill)
  const updateDevQuestProgress = useGameStore((state) => state.updateDevQuestProgress)
  const toggleJavaTopic = useGameStore((state) => state.toggleJavaTopic)
  const claimDevQuestRewards = useGameStore((state) => state.claimDevQuestRewards)
  
  const { playUnlock, playClick, playLevelUp } = useSound()

  const [activeTab, setActiveTab] = useState<'combat' | 'developer'>('combat')

  // Modal inspection states for Combat Skills
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeSkill = skills.find((s) => s.id === selectedSkillId)

  const handleUnlockSkill = (skillId: string) => {
    setErrorMessage(null)
    const success = unlockSkill(skillId)
    
    if (success) {
      playUnlock()
      setSelectedSkillId(null)
    } else {
      const skill = skills.find(s => s.id === skillId)
      if (skill) {
        if (player.level < skill.requiredLevel) {
          setErrorMessage(`Required Hunter Level ${skill.requiredLevel} not met.`)
        } else if (player.gold < skill.cost) {
          setErrorMessage(`Insufficient gold. Need ${skill.cost} Gold (Current: ${player.gold} G).`)
        } else {
          setErrorMessage(`Unlock condition failed. Check core stats compliance.`)
        }
      }
    }
  }

  const isSkillUnlocked = (id: string) => {
    return skills.find(s => s.id === id)?.unlocked || false
  }

  // Developer variables
  const dev = player.developer || {
    devLevel: 1,
    devXp: 0,
    devXpNeeded: 1000,
    dsaSolved: 0,
    aptitudeQuestions: 0,
    codingStreak: 0,
    projectHours: 0,
    javaProgress: [],
    achievements: [],
    dailyJavaMin: 0,
    dailyDsaSolved: 0,
    dailyAptitudeSolved: 0,
    dailyCommMin: 0,
    dailyProjMin: 0,
    lastClaimedDate: ''
  }

  const currentDay = getCurrentDayCount()
  const todayStr = new Date().toDateString()
  const devXpPercent = Math.min((dev.devXp / dev.devXpNeeded) * 100, 100)

  // Java roadmap topics grouped by rank
  const javaRoadmap = {
    E: [
      { id: 'variables', label: 'Variables & Data Types' },
      { id: 'conditionals', label: 'Conditionals & Loops' },
      { id: 'functions', label: 'Functions & Arrays' },
      { id: 'strings', label: 'Strings Basics' },
      { id: 'oop_intro', label: 'OOP Core Concepts' },
      { id: 'collections_intro', label: 'Collections Intro' }
    ],
    B: [
      { id: 'exceptions', label: 'Exception Handling' },
      { id: 'file_io', label: 'File Handling (I/O)' },
      { id: 'jdbc', label: 'JDBC Database Access' },
      { id: 'collections_adv', label: 'Advanced Collections' },
      { id: 'multithreading', label: 'Multithreading Basics' }
    ],
    S: [
      { id: 'java8', label: 'Java 8 Lambdas & Streams' },
      { id: 'jvm', label: 'JVM Architecture & Memory' },
      { id: 'interview_rev', label: 'Interview Coding Revision' },
      { id: 'design_patterns', label: 'Design Patterns' },
      { id: 'mock_tests', label: 'Mock Practical Coding' }
    ]
  }

  // Check if daily quest is completed
  const isDailyQuestComplete = 
    dev.dailyJavaMin >= 60 &&
    dev.dailyDsaSolved >= 3 &&
    dev.dailyAptitudeSolved >= 20 &&
    dev.dailyCommMin >= 10 &&
    dev.dailyProjMin >= 60

  const hasClaimedToday = dev.lastClaimedDate === todayStr

  const handleClaimDevRewards = () => {
    if (hasClaimedToday || !isDailyQuestComplete) return
    playLevelUp()
    claimDevQuestRewards()
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Tab Switcher */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { playClick(); setActiveTab('combat'); }}
            className={`px-5 py-2.5 font-display text-[10px] tracking-widest font-black uppercase border rounded transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'combat'
                ? 'border-hunter-blue bg-hunter-blue/15 text-hunter-blue shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            ⚔️ Combat Skill Tree
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('developer'); }}
            className={`px-5 py-2.5 font-display text-[10px] tracking-widest font-black uppercase border rounded transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'developer'
                ? 'border-cyan-400 bg-cyan-400/15 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            💻 Developer Quest
          </button>
        </div>

        {activeTab === 'combat' ? (
          <>
            {/* Skill Introduction HUD */}
            <SystemWindow 
              title="SKILL COMPLIANCE MATRIX" 
              subtitle="Monarch class abilities acquisition log"
              variant="blue"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-display text-sm md:text-base font-black text-hunter-blue uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-5 h-5" />
                    Hunter Skill Tree Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Unlock active combat skills and passive attribute upgrades. Unlocking skills requires reaching specified level compliance and spending gold coins acquired from dungeon sweeps.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-center font-display shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">available gold</span>
                  <span className="text-xl font-black text-hunter-gold">{player.gold} G</span>
                </div>
              </div>
            </SystemWindow>

            {/* Skill Tree Node Map */}
            <div className="p-8 md:p-12 rounded-xl bg-hunter-gray/40 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
              
              {/* Background grid canvas vectors */}
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="skillGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00f0ff" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#skillGrid)" />
                </svg>
              </div>

              {/* SVG Connecting Paths */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <line 
                    x1="50%" y1="20%" x2="30%" y2="55%" 
                    stroke={isSkillUnlocked('speed_boost') ? '#00f0ff' : '#1e293b'} 
                    strokeWidth={isSkillUnlocked('speed_boost') ? '2.5' : '1.5'}
                    strokeDasharray={isSkillUnlocked('speed_boost') ? '0' : '4 4'}
                  />
                  <line 
                    x1="50%" y1="20%" x2="70%" y2="55%" 
                    stroke={isSkillUnlocked('speed_boost') ? '#00f0ff' : '#1e293b'} 
                    strokeWidth={isSkillUnlocked('speed_boost') ? '2.5' : '1.5'}
                    strokeDasharray={isSkillUnlocked('speed_boost') ? '0' : '4 4'}
                  />
                  <line 
                    x1="30%" y1="55%" x2="50%" y2="85%" 
                    stroke={isSkillUnlocked('strength_upgrade') ? '#9d4edd' : '#1e293b'} 
                    strokeWidth={isSkillUnlocked('strength_upgrade') ? '2.5' : '1.5'}
                    strokeDasharray={isSkillUnlocked('strength_upgrade') ? '0' : '4 4'}
                  />
                  <line 
                    x1="70%" y1="55%" x2="50%" y2="85%" 
                    stroke={isSkillUnlocked('mana_control') ? '#9d4edd' : '#1e293b'} 
                    strokeWidth={isSkillUnlocked('mana_control') ? '2.5' : '1.5'}
                    strokeDasharray={isSkillUnlocked('mana_control') ? '0' : '4 4'}
                  />
                </svg>
              </div>

              {/* Node Grid Layout */}
              <div className="relative z-10 w-full flex flex-col items-center justify-between min-h-[350px]">
                
                {/* Row 1: Start node (Speed Boost) */}
                <div className="mt-2">
                  {skills.find(s => s.id === 'speed_boost') && (
                    <SkillNode 
                      skill={skills.find(s => s.id === 'speed_boost')!} 
                      onClick={() => {
                        playClick()
                        setErrorMessage(null)
                        setSelectedSkillId('speed_boost')
                      }}
                    />
                  )}
                </div>

                {/* Row 2: Passives */}
                <div className="flex justify-between w-full max-w-sm px-6 md:px-12 my-6">
                  {skills.find(s => s.id === 'strength_upgrade') && (
                    <SkillNode 
                      skill={skills.find(s => s.id === 'strength_upgrade')!} 
                      onClick={() => {
                        playClick()
                        setErrorMessage(null)
                        setSelectedSkillId('strength_upgrade')
                      }}
                    />
                  )}
                  {skills.find(s => s.id === 'mana_control') && (
                    <SkillNode 
                      skill={skills.find(s => s.id === 'mana_control')!} 
                      onClick={() => {
                        playClick()
                        setErrorMessage(null)
                        setSelectedSkillId('mana_control')
                      }}
                    />
                  )}
                </div>

                {/* Row 3: Ultimate */}
                <div className="mb-2">
                  {skills.find(s => s.id === 'shadow_extraction') && (
                    <SkillNode 
                      skill={skills.find(s => s.id === 'shadow_extraction')!} 
                      onClick={() => {
                        playClick()
                        setErrorMessage(null)
                        setSelectedSkillId('shadow_extraction')
                      }}
                    />
                  )}
                </div>

              </div>
            </div>
          </>
        ) : (
          <>
            {/* Developer Hunter System Header */}
            <SystemWindow 
              title="DEVELOPER PLACEMENT MATRIX" 
              subtitle="Software engineering roadmap and daily skill quest parameters"
              variant="blue"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Terminal className="w-5 h-5" />
                    <h3 className="font-display text-sm md:text-base font-black uppercase tracking-widest">
                      Developer Level {dev.devLevel}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Improve coding stats dynamically through deliberate practice. Accumulate Developer XP daily to level up and gain stat multipliers for Intelligence, Problem Solving, and Discipline.
                  </p>
                  
                  {/* XP Bar */}
                  <div className="mt-4 font-display">
                    <div className="flex justify-between text-[9px] mb-1 font-bold">
                      <span className="text-slate-500 uppercase">XP progression</span>
                      <span className="text-cyan-400">{dev.devXp} / {dev.devXpNeeded} XP</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-sm overflow-hidden p-[1px] border border-cyan-500/20">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm transition-all" style={{ width: `${devXpPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-center font-display shrink-0 flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">streak bonus</span>
                  <span className="text-xl font-black text-amber-400">🔥 {dev.codingStreak} DAYS</span>
                  <span className="text-[8px] text-slate-600 uppercase tracking-widest mt-1 block">active day: {currentDay}/90</span>
                </div>
              </div>
            </SystemWindow>

            {/* Daily Quest Log HUD */}
            <div className="glass-panel p-6 rounded-lg border border-cyan-400/20 bg-hunter-bg/80 relative overflow-hidden flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-display text-xs font-black uppercase tracking-widest text-cyan-400">Daily skill quests</h4>
                </div>
                <span className="font-display text-[9px] text-slate-500">QUESTS RESET AT MIDNIGHT</span>
              </div>

              {/* Tasks List */}
              <div className="flex flex-col gap-4 font-display text-xs">
                {/* 1. Java Training */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white uppercase tracking-wider">💻 Java Training</span>
                      <span className="text-cyan-400 font-bold">{dev.dailyJavaMin} / 60 Mins</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min((dev.dailyJavaMin / 60) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyJavaMin', 10); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+10m</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyJavaMin', 30); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+30m</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyJavaMin', 60 - dev.dailyJavaMin); }} className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-black rounded hover:bg-cyan-500/10 hover:border-cyan-400 cursor-pointer">MAX</button>
                  </div>
                </div>

                {/* 2. DSA Battle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white uppercase tracking-wider">⚔️ DSA Battle</span>
                      <span className="text-cyan-400 font-bold">{dev.dailyDsaSolved} / 3 Problems</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min((dev.dailyDsaSolved / 3) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyDsaSolved', 1); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+1 DSA</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyDsaSolved', 3 - dev.dailyDsaSolved); }} className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-black rounded hover:bg-cyan-500/10 hover:border-cyan-400 cursor-pointer">MAX</button>
                  </div>
                </div>

                {/* 3. Aptitude Training */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white uppercase tracking-wider">🧠 Aptitude Training</span>
                      <span className="text-cyan-400 font-bold">{dev.dailyAptitudeSolved} / 20 Questions</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min((dev.dailyAptitudeSolved / 20) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyAptitudeSolved', 5); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+5 Qs</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyAptitudeSolved', 10); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+10 Qs</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyAptitudeSolved', 20 - dev.dailyAptitudeSolved); }} className="px-3 py-1.5 bg-cyan-955/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-black rounded hover:bg-cyan-500/10 hover:border-cyan-400 cursor-pointer">MAX</button>
                  </div>
                </div>

                {/* 4. Communication */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white uppercase tracking-wider">🎤 Communication Practice</span>
                      <span className="text-cyan-400 font-bold">{dev.dailyCommMin} / 10 Mins</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min((dev.dailyCommMin / 10) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyCommMin', 5); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+5m</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyCommMin', 10 - dev.dailyCommMin); }} className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-black rounded hover:bg-cyan-500/10 hover:border-cyan-400 cursor-pointer">MAX</button>
                  </div>
                </div>

                {/* 5. Project Building */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white uppercase tracking-wider">🚀 Project Building</span>
                      <span className="text-cyan-400 font-bold">{dev.dailyProjMin} / 60 Mins</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all" style={{ width: `${Math.min((dev.dailyProjMin / 60) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 10); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+10m</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 30); }} className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-black rounded hover:bg-slate-850 hover:border-slate-700 cursor-pointer">+30m</button>
                    <button onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 60 - dev.dailyProjMin); }} className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-black rounded hover:bg-cyan-500/10 hover:border-cyan-400 cursor-pointer">MAX</button>
                  </div>
                </div>
              </div>

              {/* Reward Block */}
              <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-display">
                <div>
                  <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-black">DAILY COMPLETION REWARD</h5>
                  <div className="flex gap-3 text-[11px] font-bold text-slate-300 mt-1 uppercase">
                    <span className="text-cyan-400">✨ +200 DEV XP</span>
                    <span className="text-indigo-400">🧠 stats +5 each</span>
                  </div>
                </div>

                {hasClaimedToday ? (
                  <button disabled className="px-6 py-2.5 rounded border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-xs font-black tracking-widest uppercase cursor-not-allowed">
                    REWARDS CLAIMED TODAY
                  </button>
                ) : isDailyQuestComplete ? (
                  <button onClick={handleClaimDevRewards} className="px-6 py-2.5 rounded bg-cyan-500 text-hunter-bg text-xs font-black tracking-widest uppercase hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.45)] cursor-pointer transition-all">
                    ARISE / CLAIM REWARDS
                  </button>
                ) : (
                  <button disabled className="px-6 py-2.5 rounded border border-slate-800 bg-slate-950/80 text-slate-600 text-[10px] font-black tracking-wider uppercase cursor-not-allowed">
                    LOG ALL TRACKERS TO CLEAR QUEST
                  </button>
                )}
              </div>
            </div>

            {/* 90-Day Placement Prep Timeline */}
            <div className="flex flex-col gap-6">
              <h4 className="font-display text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-400" />
                90-Day Placement preparation timeline Matrix
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* E Rank Card */}
                <div className={`p-5 rounded-lg border bg-slate-950/50 flex flex-col justify-between gap-4 transition-all relative overflow-hidden ${
                  currentDay <= 30 ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-900 opacity-75'
                }`}>
                  {currentDay > 30 && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-500 text-[8px] font-display font-bold text-emerald-400 uppercase">COMPLETED</div>}
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
                      <span className="font-display text-[10px] font-black tracking-widest text-cyan-400 uppercase">E RANK (DAY 1-30)</span>
                    </div>

                    <div className="flex flex-col gap-4 font-sans text-xs">
                      <div>
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">JAVA SYLLABUS ROADMAP</span>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {javaRoadmap.E.map(item => {
                            const isDone = dev.javaProgress.includes(item.id)
                            return (
                              <button key={item.id} onClick={() => { playClick(); toggleJavaTopic(item.id); }} className="flex items-center gap-2 text-left cursor-pointer hover:text-cyan-300 transition-colors w-full group">
                                {isDone ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />}
                                <span className={`text-[11px] ${isDone ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">CORE DSA CURRICULUM</span>
                        <p className="text-[11px] text-slate-300 mt-1">Time Complexity, Arrays, Strings, Sorting, Searching</p>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">APTITUDE & SPEAKING</span>
                        <p className="text-[11px] text-slate-300 mt-1">Percentage, Ratio, Average, Self Introduction, speaking basics</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3 font-display">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">QUEST TARGET PROGRESS</span>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-1">
                      <span>DSA Problems (50):</span>
                      <span className={dev.dsaSolved >= 50 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.dsaSolved} / 50</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-0.5">
                      <span>Aptitude (300):</span>
                      <span className={dev.aptitudeQuestions >= 300 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.aptitudeQuestions} / 300</span>
                    </div>
                  </div>
                </div>

                {/* B Rank Card */}
                <div className={`p-5 rounded-lg border bg-slate-950/50 flex flex-col justify-between gap-4 transition-all relative overflow-hidden ${
                  currentDay > 30 && currentDay <= 60 ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-900 opacity-75'
                }`}>
                  {currentDay > 60 && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-500 text-[8px] font-display font-bold text-emerald-400 uppercase">COMPLETED</div>}
                  {currentDay <= 30 && <div className="absolute top-2 right-2 text-[8px] font-display font-black text-slate-700 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> LOCKED</div>}
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
                      <span className="font-display text-[10px] font-black tracking-widest text-cyan-400 uppercase">B RANK (DAY 31-60)</span>
                    </div>

                    <div className="flex flex-col gap-4 font-sans text-xs">
                      <div>
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">JAVA SYLLABUS ROADMAP</span>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {javaRoadmap.B.map(item => {
                            const isDone = dev.javaProgress.includes(item.id)
                            return (
                              <button key={item.id} onClick={() => { playClick(); toggleJavaTopic(item.id); }} className="flex items-center gap-2 text-left cursor-pointer hover:text-cyan-300 transition-colors w-full group">
                                {isDone ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />}
                                <span className={`text-[11px] ${isDone ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">CORE DSA CURRICULUM</span>
                        <p className="text-[11px] text-slate-300 mt-1">Binary Search, Recursion, Sliding Window, Linked List, Stack, Queue</p>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">APTITUDE & GD PRACTICE</span>
                        <p className="text-[11px] text-slate-300 mt-1">Time & Work, Speed & Distance, GD Mock, Project explanation</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3 font-display">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">QUEST TARGET PROGRESS</span>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-1">
                      <span>DSA Problems (100):</span>
                      <span className={dev.dsaSolved >= 100 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.dsaSolved} / 100</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-0.5">
                      <span>Aptitude (700):</span>
                      <span className={dev.aptitudeQuestions >= 700 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.aptitudeQuestions} / 700</span>
                    </div>
                  </div>
                </div>

                {/* S Rank Card */}
                <div className={`p-5 rounded-lg border bg-slate-950/50 flex flex-col justify-between gap-4 transition-all relative overflow-hidden ${
                  currentDay > 60 ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-slate-900 opacity-75'
                }`}>
                  {currentDay <= 60 && <div className="absolute top-2 right-2 text-[8px] font-display font-black text-slate-700 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> LOCKED</div>}
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
                      <span className="font-display text-[10px] font-black tracking-widest text-cyan-400 uppercase">S RANK (DAY 61-90)</span>
                    </div>

                    <div className="flex flex-col gap-4 font-sans text-xs">
                      <div>
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">JAVA SYLLABUS ROADMAP</span>
                        <div className="flex flex-col gap-1.5 mt-2">
                          {javaRoadmap.S.map(item => {
                            const isDone = dev.javaProgress.includes(item.id)
                            return (
                              <button key={item.id} onClick={() => { playClick(); toggleJavaTopic(item.id); }} className="flex items-center gap-2 text-left cursor-pointer hover:text-cyan-300 transition-colors w-full group">
                                {isDone ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />}
                                <span className={`text-[11px] ${isDone ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">CORE DSA CURRICULUM</span>
                        <p className="text-[11px] text-slate-300 mt-1">Trees, Graph BFS/DFS, Greedy, Dynamic Programming Basics</p>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3">
                        <span className="font-display text-[9px] text-slate-500 uppercase tracking-widest font-black block">INTERVIEW SIMULATIONS</span>
                        <p className="text-[11px] text-slate-300 mt-1">Technical Mock Interviews, HR Mock Rounds, Mock evaluations</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3 font-display">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">QUEST TARGET PROGRESS</span>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-1">
                      <span>DSA Problems (150):</span>
                      <span className={dev.dsaSolved >= 150 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.dsaSolved} / 150</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 mt-0.5">
                      <span>Aptitude (1000):</span>
                      <span className={dev.aptitudeQuestions >= 1000 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{dev.aptitudeQuestions} / 1000</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Achievements Badges Panel */}
            <div className="flex flex-col gap-6 mt-4">
              <h4 className="font-display text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-cyan-400" />
                Developer Achievements Log
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-display text-[10px]">
                {/* 1. Code Hunter */}
                {(() => {
                  const unlocked = dev.achievements.includes('code_hunter') || dev.dsaSolved >= 50
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">CODE HUNTER</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Solve 50+ DSA problems</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}

                {/* 2. Algorithm Knight */}
                {(() => {
                  const unlocked = dev.achievements.includes('algorithm_knight') || dev.dsaSolved >= 100
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">ALGORITHM KNIGHT</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Solve 100+ DSA problems</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}

                {/* 3. Java Master */}
                {(() => {
                  const unlocked = dev.achievements.includes('java_master') || dev.javaProgress.length === 16
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">JAVA MASTER</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Check all 16 Java topics</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}

                {/* 4. Placement Monarch */}
                {(() => {
                  const unlocked = dev.achievements.includes('placement_monarch') || currentDay >= 90
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">PLACEMENT MONARCH</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Survive the 90-day quest</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Developer Notes / Study Database Panel */}
            <div className="glass-panel p-6 rounded-lg border border-cyan-400/20 bg-hunter-bg/80 relative overflow-hidden flex flex-col gap-6 mt-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-display text-xs font-black uppercase tracking-widest text-cyan-400">System Study Resources & Database</h4>
                </div>
                <span className="font-display text-[9px] text-slate-500">KNOWLEDGE REPOSITORY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-display text-[10px]">
                <a 
                  href="https://www.geeksforgeeks.org/java/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => playClick()}
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-950/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block uppercase group-hover:text-cyan-400 transition-colors">Core Java Reference</span>
                    <span className="text-[9px] text-slate-500 block mt-1 leading-relaxed">Access essential study material for Java fundamentals, OOPs, Collections, Multithreading, and Exception Handling.</span>
                  </div>
                </a>

                <a 
                  href="https://leetcode.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => playClick()}
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-950/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block uppercase group-hover:text-cyan-400 transition-colors">DSA Combat Database</span>
                    <span className="text-[9px] text-slate-500 block mt-1 leading-relaxed">Solve coding questions across Array, String, Linked List, Stack, Queue, Trees, Graphs, DP, and Recursion.</span>
                  </div>
                </a>

                <a 
                  href="https://www.indiabix.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => playClick()}
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-950/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block uppercase group-hover:text-cyan-400 transition-colors">Aptitude Practice Vault</span>
                    <span className="text-[9px] text-slate-500 block mt-1 leading-relaxed">Practice Quantitative Aptitude, Logical Reasoning, and Verbal Ability tests for placement rounds.</span>
                  </div>
                </a>

                <a 
                  href="https://developer.mozilla.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => playClick()}
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-950/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block uppercase group-hover:text-cyan-400 transition-colors">Frontend Web Grimoire</span>
                    <span className="text-[9px] text-slate-500 block mt-1 leading-relaxed">Read MDN references, CSS designs, JavaScript architectures, and client-server API documentation.</span>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Skill details Modal for Combat Tree */}
      <Modal
        isOpen={selectedSkillId !== null}
        onClose={() => setSelectedSkillId(null)}
        title={activeSkill?.name || 'Skill Details'}
        variant={activeSkill?.category === 'Monarch' ? 'purple' : 'blue'}
      >
        {activeSkill && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-display font-bold uppercase tracking-widest text-hunter-blue">
                {activeSkill.category} Skill
              </span>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {activeSkill.description}
              </p>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded bg-slate-950 border border-slate-900 font-display text-[10px] text-slate-500 uppercase font-semibold">
              <div>
                <span>Mana Cost:</span>
                <span className="text-white ml-1.5">{activeSkill.manaCost > 0 ? `${activeSkill.manaCost} MP` : 'Passive (0)'}</span>
              </div>
              <div>
                <span>Cooldown:</span>
                <span className="text-white ml-1.5">{activeSkill.cooldown > 0 ? `${activeSkill.cooldown}s` : 'None'}</span>
              </div>
              <div>
                <span>Required Level:</span>
                <span className={player.level >= activeSkill.requiredLevel ? 'text-hunter-blue ml-1.5' : 'text-red-500 ml-1.5'}>
                  Lvl {activeSkill.requiredLevel}
                </span>
              </div>
              <div>
                <span>Unlock Cost:</span>
                <span className={player.gold >= activeSkill.cost ? 'text-hunter-gold ml-1.5' : 'text-red-500 ml-1.5'}>
                  {activeSkill.cost} Gold
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded bg-red-950/20 border border-red-500/30 text-[10px] font-display font-semibold uppercase text-red-500 tracking-wide text-center">
                {errorMessage}
              </div>
            )}

            <div className="mt-2 flex gap-4">
              {activeSkill.unlocked ? (
                <button
                  disabled
                  className="w-full py-3 rounded border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-display font-black text-xs tracking-widest uppercase cursor-not-allowed text-center"
                >
                  Skill Unlocked Lvl {activeSkill.level}
                </button>
              ) : (
                <Button
                  variant={activeSkill.category === 'Monarch' ? 'purple' : 'blue'}
                  onClick={() => handleUnlockSkill(activeSkill.id)}
                  className="w-full text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  UNLOCK SKILL
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
