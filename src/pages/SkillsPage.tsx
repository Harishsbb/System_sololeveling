import React, { useState } from 'react'
import { 
  Award, Sparkles, Code, Terminal, Trophy, BookOpen, Swords, Globe, 
  Palette, Code2, Braces, Server, Database, Coffee, GitFork, MessageSquare, Users
} from 'lucide-react'
import { useGameStore, getCurrentDayCount } from '../store/gameStore'
import type { SkillNodeData } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { SkillNode } from '../components/SkillNode'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

export const SkillsPage: React.FC = () => {
  const skills = useGameStore((state) => state.skills)
  const player = useGameStore((state) => state.player)
  const unlockSkill = useGameStore((state) => state.unlockSkill)
  const upgradeSkillLevel = useGameStore((state) => state.upgradeSkillLevel)
  
  const { playUnlock, playClick } = useSound()

  const [activeTab, setActiveTab] = useState<'combat' | 'developer'>('combat')

  // Modal inspection states
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeSkill = skills.find((s) => s.id === selectedSkillId)

  const getSkillCost = (skill: SkillNodeData) => {
    if (!skill.unlocked) return skill.cost
    return skill.cost * (skill.level + 1)
  }

  const handleUnlockSkill = (skillId: string) => {
    setErrorMessage(null)
    const skill = skills.find(s => s.id === skillId)
    if (!skill) return

    const isDeveloperSkill = ['Frontend', 'Backend', 'Programming', 'Soft Skills'].includes(skill.category)

    if (isDeveloperSkill) {
      const cost = getSkillCost(skill)
      if (player.gold < cost) {
        setErrorMessage(`Insufficient gold. Need ${cost} Gold (Current: ${player.gold} G).`)
        return
      }
      const success = upgradeSkillLevel(skillId)
      if (success) {
        playUnlock()
        setSelectedSkillId(null)
      } else {
        setErrorMessage(`Upgrade condition failed.`)
      }
    } else {
      const success = unlockSkill(skillId)
      if (success) {
        playUnlock()
        setSelectedSkillId(null)
      } else {
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
    achievements: [],
    dailyJavaDsaMin: 0,
    dailyFullStackMin: 0,
    dailyCodingProblems: 0,
    dailyCommMin: 0,
    dailyProjMin: 0,
    lastClaimedDate: '',
    javaProgressPercent: 0,
    reactProgressPercent: 0,
    backendProgressPercent: 0,
    projectsCompletedCount: 0,
    speakingStreak: 0,
    confidenceXp: 0,
    mockInterviews: []
  }

  const currentDay = getCurrentDayCount()
  const devXpPercent = Math.min((dev.devXp / dev.devXpNeeded) * 100, 100)

  // Dev skill icons map
  const getDevSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />
      case 'Palette': return <Palette className="w-5 h-5 text-pink-400" />
      case 'Code2': return <Code2 className="w-5 h-5 text-blue-400" />
      case 'Braces': return <Braces className="w-5 h-5 text-indigo-400" />
      case 'Server': return <Server className="w-5 h-5 text-emerald-400" />
      case 'Database': return <Database className="w-5 h-5 text-teal-400" />
      case 'Coffee': return <Coffee className="w-5 h-5 text-orange-400" />
      case 'GitFork': return <GitFork className="w-5 h-5 text-purple-400" />
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-sky-400" />
      case 'Users': return <Users className="w-5 h-5 text-violet-400" />
      default: return <Code className="w-5 h-5 text-slate-400" />
    }
  }

  // Developer Skills divided by category
  const frontendSkills = skills.filter(s => s.category === 'Frontend')
  const backendSkills = skills.filter(s => s.category === 'Backend')
  const programmingSkills = skills.filter(s => s.category === 'Programming')
  const softSkills = skills.filter(s => s.category === 'Soft Skills')

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
            💻 Developer Skill Tree
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
                <div className="flex-grow">
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
            {/* S-Rank Developer Skill Tree Header */}
            <SystemWindow 
              title="S-RANK DEVELOPER SKILL TREE" 
              subtitle="Upgrade core development, programming, and soft skill proficiencies"
              variant="blue"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-cyan-400 font-display">
                    <Terminal className="w-5 h-5" />
                    <h3 className="text-sm md:text-base font-black uppercase tracking-widest">
                      Developer Lvl {dev.devLevel}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Log daily developer quests to gain XP, then unlock and upgrade core software engineering skill nodes. Spending gold coins levels up your skills up to Level 5.
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
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Available Gold</span>
                  <span className="text-xl font-black text-hunter-gold">{player.gold} G</span>
                  <span className="text-[8px] text-slate-600 uppercase tracking-widest mt-1 block">Active Day: Day {currentDay} of 90</span>
                </div>
              </div>
            </SystemWindow>

            {/* RPG Skill Grids divided by Category */}
            <div className="flex flex-col gap-8 font-display">
              
              {/* Category: Frontend */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4.5 h-4.5 text-cyan-400" />
                  Frontend Skill nodes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {frontendSkills.map(skill => {
                    const cost = getSkillCost(skill)
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => { playClick(); setSelectedSkillId(skill.id); }}
                        className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          skill.unlocked 
                            ? 'border-cyan-500/30 bg-cyan-950/5 hover:border-cyan-400' 
                            : 'border-slate-900 bg-slate-950/40 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            {getDevSkillIcon(skill.icon)}
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            skill.unlocked ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-slate-600'
                          }`}>
                            {skill.unlocked ? `Lvl ${skill.level}/5` : 'Locked'}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-black text-white text-xs uppercase">{skill.name}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-[9px]">
                          <span className="text-slate-500">Cost:</span>
                          <span className="text-hunter-gold font-bold">{cost} G</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Backend */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                  <Database className="w-4.5 h-4.5 text-emerald-400" />
                  Backend Skill nodes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {backendSkills.map(skill => {
                    const cost = getSkillCost(skill)
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => { playClick(); setSelectedSkillId(skill.id); }}
                        className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          skill.unlocked 
                            ? 'border-emerald-500/30 bg-emerald-950/5 hover:border-emerald-400' 
                            : 'border-slate-900 bg-slate-950/40 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            {getDevSkillIcon(skill.icon)}
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            skill.unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-600'
                          }`}>
                            {skill.unlocked ? `Lvl ${skill.level}/5` : 'Locked'}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-black text-white text-xs uppercase">{skill.name}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-[9px]">
                          <span className="text-slate-500">Cost:</span>
                          <span className="text-hunter-gold font-bold">{cost} G</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Programming */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                  <Coffee className="w-4.5 h-4.5 text-orange-400" />
                  Programming Skill nodes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {programmingSkills.map(skill => {
                    const cost = getSkillCost(skill)
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => { playClick(); setSelectedSkillId(skill.id); }}
                        className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          skill.unlocked 
                            ? 'border-orange-500/30 bg-orange-950/5 hover:border-orange-400' 
                            : 'border-slate-900 bg-slate-950/40 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            {getDevSkillIcon(skill.icon)}
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            skill.unlocked ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-slate-900 text-slate-600'
                          }`}>
                            {skill.unlocked ? `Lvl ${skill.level}/5` : 'Locked'}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-black text-white text-xs uppercase">{skill.name}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-[9px]">
                          <span className="text-slate-500">Cost:</span>
                          <span className="text-hunter-gold font-bold">{cost} G</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Soft Skills */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-sky-400" />
                  Soft Skill nodes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {softSkills.map(skill => {
                    const cost = getSkillCost(skill)
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => { playClick(); setSelectedSkillId(skill.id); }}
                        className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          skill.unlocked 
                            ? 'border-sky-500/30 bg-sky-950/5 hover:border-sky-400' 
                            : 'border-slate-900 bg-slate-950/40 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            {getDevSkillIcon(skill.icon)}
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            skill.unlocked ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-slate-900 text-slate-600'
                          }`}>
                            {skill.unlocked ? `Lvl ${skill.level}/5` : 'Locked'}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-black text-white text-xs uppercase">{skill.name}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-[9px]">
                          <span className="text-slate-500">Cost:</span>
                          <span className="text-hunter-gold font-bold">{cost} G</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Achievements Badges Panel */}
            <div className="flex flex-col gap-6 mt-6">
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
                  const unlocked = dev.achievements.includes('algorithm_knight') || dev.dsaSolved >= 150
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">ALGORITHM KNIGHT</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Solve 150+ DSA problems</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}

                {/* 3. Java Master */}
                {(() => {
                  const unlocked = dev.achievements.includes('java_master') || (dev.javaProgressPercent || 0) >= 100
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col justify-between gap-3 transition-all ${
                      unlocked ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-slate-900 bg-slate-950/40 text-slate-600'
                    }`}>
                      <Trophy className={`w-8 h-8 mx-auto ${unlocked ? 'text-cyan-400 animate-float' : 'text-slate-700'}`} />
                      <div>
                        <span className="font-black block uppercase">JAVA MASTER</span>
                        <span className="text-[8px] text-slate-500 block mt-1">Java roadmap progress 100%</span>
                      </div>
                      <span className="font-black text-[9px] block tracking-wider uppercase mt-1">
                        {unlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                      </span>
                    </div>
                  )
                })()}

                {/* 4. Placement Monarch */}
                {(() => {
                  const unlocked = dev.achievements.includes('s_rank_monarch') || currentDay >= 90
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
            <div className="glass-panel p-6 rounded-lg border border-cyan-400/20 bg-hunter-bg/80 relative overflow-hidden flex flex-col gap-6">
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
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-955/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
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
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-955/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
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
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-955/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
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
                  className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-400/50 hover:bg-cyan-955/10 text-left flex items-start gap-3 transition-all cursor-pointer group"
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

      {/* Skill details Modal */}
      <Modal
        isOpen={selectedSkillId !== null}
        onClose={() => setSelectedSkillId(null)}
        title={activeSkill?.name || 'Skill Details'}
        variant={activeSkill ? (activeSkill.category === 'Monarch' ? 'purple' : 'blue') : 'blue'}
      >
        {activeSkill && (() => {
          const isDevSkill = ['Frontend', 'Backend', 'Programming', 'Soft Skills'].includes(activeSkill.category)
          const cost = getSkillCost(activeSkill)
          const isAffordable = player.gold >= cost
          
          return (
            <div className="flex flex-col gap-6">
              <div>
                <span className={`px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-display font-bold uppercase tracking-widest ${
                  isDevSkill ? 'text-cyan-400' : 'text-hunter-blue'
                }`}>
                  {activeSkill.category} Skill Node
                </span>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {activeSkill.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded bg-slate-950 border border-slate-900 font-display text-[10px] text-slate-500 uppercase font-semibold">
                {isDevSkill ? (
                  <>
                    <div>
                      <span>Current Level:</span>
                      <span className="text-white ml-1.5">{activeSkill.unlocked ? `Lvl ${activeSkill.level} / ${activeSkill.maxLevel}` : 'Locked'}</span>
                    </div>
                    <div>
                      <span>Status:</span>
                      <span className={`${activeSkill.unlocked ? 'text-emerald-400' : 'text-red-500'} ml-1.5`}>
                        {activeSkill.unlocked ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                    <div>
                      <span>Required Hunter Lvl:</span>
                      <span className={player.level >= activeSkill.requiredLevel ? 'text-cyan-400 ml-1.5' : 'text-red-500 ml-1.5'}>
                        Lvl {activeSkill.requiredLevel}
                      </span>
                    </div>
                    <div>
                      <span>Upgrade Gold Cost:</span>
                      <span className={isAffordable ? 'text-hunter-gold ml-1.5' : 'text-red-500 ml-1.5'}>
                        {cost} G
                      </span>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded bg-red-950/20 border border-red-500/30 text-[10px] font-display font-semibold uppercase text-red-500 tracking-wide text-center">
                  {errorMessage}
                </div>
              )}

              <div className="mt-2 flex gap-4">
                {isDevSkill ? (
                  activeSkill.level >= activeSkill.maxLevel ? (
                    <button
                      disabled
                      className="w-full py-3 rounded border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-display font-black text-xs tracking-widest uppercase cursor-not-allowed text-center"
                    >
                      MAX LEVEL REACHED ({activeSkill.level}/{activeSkill.maxLevel})
                    </button>
                  ) : (
                    <Button
                      variant="blue"
                      onClick={() => handleUnlockSkill(activeSkill.id)}
                      className="w-full text-xs"
                    >
                      <Sparkles className="w-4 h-4" />
                      {activeSkill.unlocked ? 'UPGRADE SKILL LEVEL' : 'UNLOCK SKILL'}
                    </Button>
                  )
                ) : (
                  activeSkill.unlocked ? (
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
                  )
                )}
              </div>
            </div>
          )
        })()}
      </Modal>

    </div>
  )
}
