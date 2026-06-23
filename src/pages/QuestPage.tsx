import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertOctagon, Info, Trophy, Calendar, Star, 
  Plus, Check, Play, MessageSquare, Award, Activity
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { SystemWindow } from '../components/SystemWindow'
import { QuestCard } from '../components/QuestCard'
import { useSound } from '../hooks/useSound'

export const QuestPage: React.FC = () => {
  const quests = useGameStore((state) => state.quests)
  const player = useGameStore((state) => state.player)
  const dailyQuest = quests.find((q) => q.type === 'daily')
  const updateDevQuestProgress = useGameStore((state) => state.updateDevQuestProgress)
  const claimDevQuestRewards = useGameStore((state) => state.claimDevQuestRewards)
  const updateDeveloperField = useGameStore((state) => state.updateDeveloperField)
  const addMockInterviewSession = useGameStore((state) => state.addMockInterviewSession)

  const { playClick, playLevelUp, playQuestComplete } = useSound()

  // Tabs: body, developer, communication, interview
  const [activeTab, setActiveTab] = useState<'body' | 'developer' | 'communication' | 'interview'>('body')

  // Timeline calculation
  const startDate = new Date('2026-06-21T00:00:00')
  const endDate = new Date('2026-09-18T23:59:59')
  const today = new Date()
  const diffTime = today.getTime() - startDate.getTime()
  const currentDay = Math.max(1, Math.min(90, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1))
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      
      const diffMs = midnight.getTime() - now.getTime()
      if (diffMs <= 0) {
        setTimeLeft('00h 00m 00s')
        return
      }
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      )
    }
    
    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [])

  // Dev quest safe fallback values
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
    lastClaimedDate: '',
    achievements: [],
    dailyJavaDsaMin: 0,
    dailyFullStackMin: 0,
    dailyCodingProblems: 0,
    dailyCommMin: 0,
    dailyProjMin: 0,
    javaProgressPercent: 0,
    reactProgressPercent: 0,
    backendProgressPercent: 0,
    projectsCompletedCount: 0,
    speakingStreak: 0,
    confidenceXp: 0,
    mockInterviews: [],
    aptitudeQuestions: 0
  }

  // Developer progress variables
  const javaProgress = dev.javaProgressPercent || 0
  const reactProgress = dev.reactProgressPercent || 0
  const backendProgress = dev.backendProgressPercent || 0
  const projectsCompleted = dev.projectsCompletedCount || 0
  const codingStreak = dev.codingStreak || 0
  const dsaSolved = dev.dsaSolved || 0

  // Communication progress variables
  const speakingStreak = dev.speakingStreak || 0
  const confidenceXp = dev.confidenceXp || 0
  const commMinutes = dev.communicationMinutes || 0

  // 1 topic checkbox
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const commTopics = [
    { id: 'self_intro', label: 'Self Introduction' },
    { id: 'project_exp', label: 'Project Explanation' },
    { id: 'react_exp', label: 'React Lifecycle & Hooks' },
    { id: 'java_concepts', label: 'Java OOPs & Multithreading' },
    { id: 'api_explanation', label: 'API & Middleware Architecture' },
    { id: 'db_design', label: 'Database Schema Normalization' }
  ]

  // Mock interview inputs
  const [interviewerName, setInterviewerName] = useState('')
  const [companyStyle, setCompanyStyle] = useState('Technical Round')
  const [questionsAsked, setQuestionsAsked] = useState('')
  const [feedback, setFeedback] = useState('')
  const [confidenceRating, setConfidenceRating] = useState(3)
  const [interviewSubmitted, setInterviewSubmitted] = useState(false)

  // Simulation timer for speaking
  const [speakTimerActive, setSpeakTimerActive] = useState(false)
  const [speakSeconds, setSpeakSeconds] = useState(0)

  useEffect(() => {
    let interval: any = null
    if (speakTimerActive) {
      interval = setInterval(() => {
        setSpeakSeconds((prev) => {
          if (prev >= 60) {
            updateDevQuestProgress('dailyCommMin', 1)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [speakTimerActive])

  // Dev Rewards condition
  const isDevQuestComplete = 
    (dev.dailyJavaDsaMin || 0) >= 90 &&
    (dev.dailyFullStackMin || 0) >= 120 &&
    (dev.dailyCodingProblems || 0) >= 3 &&
    (dev.dailyProjMin || 0) >= 60 &&
    (dev.aptitudeQuestions || 0) >= 30

  const hasClaimedDevToday = dev.lastClaimedDate === today.toDateString()

  const handleClaimDev = () => {
    if (hasClaimedDevToday || !isDevQuestComplete) return
    playQuestComplete()
    claimDevQuestRewards()
  }

  // Interview Dungeon submit
  const handleLogInterview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!interviewerName || !questionsAsked || !feedback) return

    playLevelUp()
    addMockInterviewSession({
      date: new Date().toLocaleDateString(),
      interviewerName,
      companyStyle,
      questionsAsked,
      feedback,
      confidenceRating
    })

    setInterviewerName('')
    setQuestionsAsked('')
    setFeedback('')
    setConfidenceRating(3)
    setInterviewSubmitted(true)
    setTimeout(() => setInterviewSubmitted(false), 4000)
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Warning Penalty Notice banner */}
        {today.getDay() !== 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded border border-red-500/30 bg-red-950/15 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-[pulse_3s_infinite]"
          >
            <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
                <h4 className="font-display text-xs font-black text-red-500 uppercase tracking-widest">
                  !! SYSTEM WARNING: MIDNIGHT PENALTY DEADLINE INCOMING !!
                </h4>
                <span className="font-display text-xs font-bold text-red-400 bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded">
                  {timeLeft} REMAINING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Failure to complete the training regimen before the countdown reaches zero will trigger the Penalty Quest. You will be locked out and must complete penalty survival exercises.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded border border-purple-500/30 bg-purple-950/15 flex items-start gap-3 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          >
            <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-display text-xs font-black text-purple-400 uppercase tracking-widest">
                SYSTEM MESSAGE: RECOVERY DAY ENGAGED
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                No penalty rules are active today. Take time to relax, perform light stretching, and let your muscle fibers recover.
              </p>
            </div>
          </motion.div>
        )}

        {/* 90-Day Transformation Timeline widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-5 rounded border border-slate-800 bg-hunter-bg/60 backdrop-blur-sm flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Calendar className="w-4.5 h-4.5 text-hunter-blue" />
            <h3 className="font-display text-xs font-black text-white uppercase tracking-widest">
              90-DAY HUNTER TRANSFORMATION TIMELINE
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded text-center">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Start Date</span>
              <span className="font-display text-xs text-slate-300 font-black">21 Jun 2026</span>
            </div>
            <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded text-center border-l-2 border-l-hunter-blue/40">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Current Day</span>
              <span className="font-display text-xs text-hunter-blue font-black">Day {currentDay} of 90</span>
            </div>
            <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded text-center">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Deadline Date</span>
              <span className="font-display text-xs text-slate-300 font-black">18 Sep 2026</span>
            </div>
            <div className="bg-slate-950/40 border border-slate-900/60 p-3 rounded text-center border-l-2 border-l-hunter-purple/40">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Remaining Time</span>
              <span className="font-display text-xs text-hunter-purple font-black">{remainingDays} Days</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="h-1.5 w-full bg-slate-900 rounded-full relative">
              <div 
                className="h-full bg-gradient-to-r from-hunter-blue via-indigo-500 to-hunter-purple rounded-full"
                style={{ width: `${(currentDay / 90) * 100}%` }}
              />
              <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay <= 30 ? 'bg-hunter-blue border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'} -ml-1`} />
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay > 30 && currentDay <= 60 ? 'bg-indigo-500 border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'}`} />
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay > 60 ? 'bg-hunter-purple border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'} -mr-1`} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left font-display">
              {/* E Rank */}
              <div className={`p-3 rounded border text-[11px] flex flex-col gap-1 transition-all ${
                currentDay <= 30 
                  ? 'border-hunter-blue/40 bg-hunter-blue/5 shadow-[0_0_10px_rgba(0,240,255,0.05)]' 
                  : 'border-slate-900 bg-slate-950/20 opacity-50'
              }`}>
                <div className="flex justify-between items-center border-b border-slate-900 pb-1 mb-1">
                  <span className="font-black text-hunter-blue uppercase tracking-wider">E Rank Progression</span>
                  <span className="text-[9px] text-slate-500 font-bold">Day 1-30</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1">Foundation Hunter Tier</div>
                <p className="text-[9px] text-slate-400">Establish fitness conditioning, learn programming core, set self introduction foundations.</p>
              </div>

              {/* B Rank */}
              <div className={`p-3 rounded border text-[11px] flex flex-col gap-1 transition-all ${
                currentDay > 30 && currentDay <= 60 
                  ? 'border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_10px_rgba(99,102,241,0.05)]' 
                  : 'border-slate-900 bg-slate-950/20 opacity-50'
              }`}>
                <div className="flex justify-between items-center border-b border-slate-900 pb-1 mb-1">
                  <span className="font-black text-indigo-400 uppercase tracking-wider">B Rank Elite</span>
                  <span className="text-[9px] text-slate-500 font-bold">Day 31-60</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1">Full Stack Hunter Tier</div>
                <p className="text-[9px] text-slate-400">Strengthen pull/push workouts, develop full-stack applications, master intermediate communication.</p>
              </div>

              {/* S Rank */}
              <div className={`p-3 rounded border text-[11px] flex flex-col gap-1 transition-all ${
                currentDay > 60 
                  ? 'border-hunter-purple/40 bg-hunter-purple/5 shadow-[0_0_10px_rgba(157,78,221,0.05)]' 
                  : 'border-slate-900 bg-slate-950/20 opacity-50'
              }`}>
                <div className="flex justify-between items-center border-b border-slate-900 pb-1 mb-1">
                  <span className="font-black text-hunter-purple uppercase tracking-wider">S Rank Monarch</span>
                  <span className="text-[9px] text-slate-500 font-bold">Day 61-90</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1">Full Stack Monarch Tier</div>
                <p className="text-[9px] text-slate-400">Peak physical output, advanced DevOps/AWS deployment, mock interview dungeon loops.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Selector Switcher */}
        <div className="flex overflow-x-auto gap-2 p-1 bg-slate-950/60 border border-slate-900 rounded-lg">
          <button
            onClick={() => { playClick(); setActiveTab('body'); }}
            className={`px-4 py-2 text-[10px] font-display font-black tracking-wider uppercase rounded transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'body'
                ? 'bg-hunter-blue text-hunter-bg shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            💪 Body Hunter
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('developer'); }}
            className={`px-4 py-2 text-[10px] font-display font-black tracking-wider uppercase rounded transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'developer'
                ? 'bg-cyan-500 text-hunter-bg shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            💻 Developer Hunter
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('communication'); }}
            className={`px-4 py-2 text-[10px] font-display font-black tracking-wider uppercase rounded transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'communication'
                ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🎤 Comm Hunter
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('interview'); }}
            className={`px-4 py-2 text-[10px] font-display font-black tracking-wider uppercase rounded transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-hunter-purple text-white shadow-[0_0_10px_rgba(157,78,221,0.3)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🗝️ Interview Dungeon
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'body' && (
          <SystemWindow 
            title="DAILY TRAINING REGIMEN: BODY EVOLUTION"
            subtitle="Assigned by the Great Monarch System"
            variant="blue"
          >
            {dailyQuest ? (
              <QuestCard quest={dailyQuest} />
            ) : (
              <div className="text-center py-8 text-slate-500 font-display text-xs">
                No daily quest currently assigned.
              </div>
            )}
          </SystemWindow>
        )}

        {activeTab === 'developer' && (
          <SystemWindow 
            title="DAILY QUEST: S-RANK DEVELOPER EVOLUTION"
            subtitle="Level up core technologies & problem solving speed"
            variant="blue"
          >
            <div className="flex flex-col gap-6">
              
              {/* Dev Level and Rank Info */}
              <div className="p-4 rounded bg-slate-950 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 font-display">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-widest">Active Class Tier</span>
                  <span className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                    {currentDay <= 30 ? 'E-Rank Foundation Hunter' : currentDay <= 60 ? 'B-Rank Full Stack Hunter' : 'S-Rank Full Stack Monarch'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase tracking-widest">Developer Rank Lvl</span>
                    <span className="text-sm font-black text-white">{dev.devLevel}</span>
                  </div>
                  <div className="w-24 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-cyan-400 h-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                      style={{ width: `${Math.min((dev.devXp / dev.devXpNeeded) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-widest">Coding Streak</span>
                  <span className="text-sm font-black text-hunter-gold uppercase tracking-widest">{codingStreak} Days</span>
                </div>
              </div>

              {/* Daily Developer Tasks */}
              <div className="flex flex-col gap-3">
                <h4 className="font-display text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  DAILY WORK Directives
                </h4>

                {/* Java + DSA */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-slate-200">1. Java + DSA Quest</span>
                    <span className="text-slate-400 font-display">{(dev.dailyJavaDsaMin || 0)} / 90 min</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(((dev.dailyJavaDsaMin || 0) / 90) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyJavaDsaMin', 15); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyJavaDsaMin', 30); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyJavaDsaMin', 90); }}
                      className="ml-auto px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-display cursor-pointer hover:bg-cyan-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* Full Stack Quest */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-slate-200">2. Full Stack Quest</span>
                    <span className="text-slate-400 font-display">{(dev.dailyFullStackMin || 0)} / 120 min</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(((dev.dailyFullStackMin || 0) / 120) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyFullStackMin', 15); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyFullStackMin', 30); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyFullStackMin', 120); }}
                      className="ml-auto px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-display cursor-pointer hover:bg-cyan-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* Coding Battle */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-slate-200">3. Coding Battle (Leetcode/DSA problems)</span>
                    <span className="text-slate-400 font-display">{(dev.dailyCodingProblems || 0)} / 3 Solved</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(((dev.dailyCodingProblems || 0) / 3) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyCodingProblems', 1); }}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add 1 solved
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyCodingProblems', 3); }}
                      className="ml-auto px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-display cursor-pointer hover:bg-cyan-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* System Architecture */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-slate-200">4. System Architecture Study</span>
                    <span className="text-slate-400 font-display">{(dev.dailyProjMin || 0)} / 60 min</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(((dev.dailyProjMin || 0) / 60) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 15); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 30); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyProjMin', 60); }}
                      className="ml-auto px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-display cursor-pointer hover:bg-cyan-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* Placement Aptitude */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-slate-200">5. Placement Aptitude Prep</span>
                    <span className="text-slate-400 font-display">{(dev.aptitudeQuestions || 0)} / 30 Questions</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(((dev.aptitudeQuestions || 0) / 30) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { 
                        playClick();
                        const nextVal = Math.min((dev.aptitudeQuestions || 0) + 5, 30);
                        updateDeveloperField('aptitudeQuestions', nextVal);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 hover:text-white text-[10px] font-display cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add 5 Qs
                    </button>
                    <button
                      onClick={() => { playClick(); updateDeveloperField('aptitudeQuestions', 30); }}
                      className="ml-auto px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-display cursor-pointer hover:bg-cyan-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Lifetime Developer Progress Stats */}
              <div className="p-5 rounded bg-slate-950 border border-slate-900 flex flex-col gap-4 font-display">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Hunter Skill Progress
                </h4>

                {/* Progress Adjustments */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Java % */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Java Core Progress</span>
                      <span className="text-white font-bold">{javaProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100"
                      value={javaProgress}
                      onChange={(e) => updateDeveloperField('javaProgressPercent', parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* React % */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>React & Web Progress</span>
                      <span className="text-white font-bold">{reactProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100"
                      value={reactProgress}
                      onChange={(e) => updateDeveloperField('reactProgressPercent', parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* Backend % */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Backend & APIs</span>
                      <span className="text-white font-bold">{backendProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100"
                      value={backendProgress}
                      onChange={(e) => updateDeveloperField('backendProgressPercent', parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mt-2 border-t border-slate-900 pt-3">
                  <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/40 flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">DSA Solved</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => updateDeveloperField('dsaSolved', Math.max(0, dsaSolved - 1))}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="text-xs text-white font-black">{dsaSolved}</span>
                      <button 
                        onClick={() => updateDeveloperField('dsaSolved', dsaSolved + 1)}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/40 flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Projects Built</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => updateDeveloperField('projectsCompletedCount', Math.max(0, projectsCompleted - 1))}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="text-xs text-white font-black">{projectsCompleted}</span>
                      <button 
                        onClick={() => updateDeveloperField('projectsCompletedCount', projectsCompleted + 1)}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800/40 flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Coding Streak</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => updateDeveloperField('codingStreak', Math.max(0, codingStreak - 1))}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="text-xs text-white font-black">{codingStreak}</span>
                      <button 
                        onClick={() => updateDeveloperField('codingStreak', codingStreak + 1)}
                        className="w-4 h-4 rounded bg-slate-800 text-[10px] text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dev Reward Claim Area */}
              <div className="p-4 rounded-lg bg-cyan-950/10 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      Developer Quest Rewards
                    </h4>
                    <span className="text-[9px] text-slate-400 font-display block mt-0.5">
                      Req: Java+DSA 90m, Full Stack 120m, DSA 3 Problems, Arch 60m, Aptitude 30 Qs
                    </span>
                  </div>
                </div>

                <div>
                  {hasClaimedDevToday ? (
                    <span className="px-4 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-display font-black text-xs tracking-widest uppercase">
                      Rewards Claimed
                    </span>
                  ) : isDevQuestComplete ? (
                    <button
                      onClick={handleClaimDev}
                      className="px-6 py-2.5 rounded bg-cyan-500 text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                      Claim Dev Rewards (+200 XP)
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-2.5 rounded border border-slate-800 bg-slate-900/50 text-slate-500 font-display font-black text-xs tracking-widest uppercase cursor-not-allowed"
                    >
                      In Progress...
                    </button>
                  )}
                </div>
              </div>

            </div>
          </SystemWindow>
        )}

        {activeTab === 'communication' && (
          <SystemWindow 
            title="DAILY QUEST: COMMUNICATION HUNTER SYSTEM"
            subtitle="Speak clearly, explain system architectures, build conversation streaks"
            variant="purple"
          >
            <div className="flex flex-col gap-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center font-display">
                <div className="bg-slate-950 p-3 rounded border border-slate-900">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-0.5">Speaking Streak</span>
                  <span className="text-sm font-black text-indigo-400">{speakingStreak} Days</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-900">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-0.5">Confidence XP</span>
                  <span className="text-sm font-black text-hunter-gold">+{confidenceXp}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-900">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-0.5">Total Speaking</span>
                  <span className="text-sm font-black text-white">{commMinutes} Mins</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex flex-col gap-3 font-display">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Communication Goals
                </h4>

                {/* English speaking */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">1. English Speaking (Mins)</span>
                    <span className="text-slate-400">{(dev.dailyCommMin || 0)} / 20 Min</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full" style={{ width: `${Math.min(((dev.dailyCommMin || 0) / 20) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyCommMin', 5); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-indigo-400/40 text-slate-300 hover:text-white text-[10px] cursor-pointer"
                    >
                      +5m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyCommMin', 10); }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-indigo-400/40 text-slate-300 hover:text-white text-[10px] cursor-pointer"
                    >
                      +10m
                    </button>
                    <button
                      onClick={() => { playClick(); updateDevQuestProgress('dailyCommMin', 20); }}
                      className="ml-auto px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] cursor-pointer hover:bg-indigo-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>

                {/* Technical Topic explanation */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">2. Technical Explanation (1 Topic Daily)</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${selectedTopic ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {selectedTopic ? 'CLEARED' : 'PENDING'}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-400">Select today's speaking topic to explain:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          playClick();
                          setSelectedTopic(topic.id);
                        }}
                        className={`p-2 rounded text-[10px] border text-center transition-all cursor-pointer truncate ${
                          selectedTopic === topic.id
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                            : 'bg-slate-900 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interview question practice */}
                <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">3. Interview Question Practice</span>
                    <span className="text-slate-400">{(dev.dailyAptitudeSolved || 0)} / 3 Questions</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full" style={{ width: `${Math.min(((dev.dailyAptitudeSolved || 0) / 3) * 100, 100)}%` }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { 
                        playClick(); 
                        const nextVal = Math.min((dev.dailyAptitudeSolved || 0) + 1, 3);
                        updateDeveloperField('dailyAptitudeSolved', nextVal);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-indigo-400/40 text-slate-300 hover:text-white text-[10px] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add 1 solved
                    </button>
                    <button
                      onClick={() => { playClick(); updateDeveloperField('dailyAptitudeSolved', 3); }}
                      className="ml-auto px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] cursor-pointer hover:bg-indigo-500/20"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Practice Panel */}
              <div className="p-5 rounded bg-slate-950 border border-slate-900 flex flex-col gap-4 font-display">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-indigo-400" />
                    LIVE SPEAKING LAB
                  </h4>
                  {speakTimerActive && (
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold tracking-widest animate-pulse uppercase">
                      RECORDING & EVALUATING... {speakSeconds}s
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Start the training timer below and practice speaking out loud. Explain your projects, describe MVC architecture, or run through your self introduction. Keep talking for at least 60 seconds to commit 1 minute of speech validation logs.
                </p>

                <div className="flex justify-center my-2">
                  <button
                    onClick={() => {
                      playClick();
                      setSpeakTimerActive(!speakTimerActive);
                    }}
                    className={`px-8 py-3 rounded font-black text-xs tracking-widest uppercase transition-all cursor-pointer ${
                      speakTimerActive
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                    }`}
                  >
                    {speakTimerActive ? 'Stop Practice Session' : 'Start Practice Session'}
                  </button>
                </div>
              </div>

              {/* Streak adjustments */}
              <div className="p-4 rounded border border-slate-900 bg-slate-950/20 flex justify-between items-center font-display">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Manual Speaking Streak Sync</span>
                  <span className="text-xs text-white">Ensure streak is aligned with calendar log.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { playClick(); updateDeveloperField('speakingStreak', Math.max(0, speakingStreak - 1)); }}
                    className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-white flex items-center justify-center cursor-pointer hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="text-xs text-white font-bold w-6 text-center">{speakingStreak}</span>
                  <button 
                    onClick={() => { playClick(); updateDeveloperField('speakingStreak', speakingStreak + 1); }}
                    className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-white flex items-center justify-center cursor-pointer hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </SystemWindow>
        )}

        {activeTab === 'interview' && (
          <SystemWindow 
            title="DAILY QUEST: INTERVIEW DUNGEON (MOCK LOGS)"
            subtitle="Engage in live mock simulations to harvest massive gold & stats"
            variant="purple"
          >
            <div className="flex flex-col gap-6 font-display">
              
              {/* Dungeon HUD info */}
              <div className="p-4 rounded bg-slate-950 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Dungeon Clears</span>
                  <span className="text-sm font-black text-purple-400 uppercase">{(dev.mockInterviews?.length || 0)} CLEARS COMPLETED</span>
                </div>
                <div className="p-2.5 rounded bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 max-w-sm">
                  <strong>Rewards per complete:</strong> Communication XP +100, Confidence +5, Discipline +5. Sweeping 10 Dungeons unlocks the <strong>Interview Hunter</strong> achievement!
                </div>
              </div>

              {/* Log Form */}
              <form onSubmit={handleLogInterview} className="flex flex-col gap-4 p-5 rounded border border-slate-900 bg-slate-950/20">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                  LOG A NEW DUNGEON SWEEP (INTERVIEW SESSION)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Interviewer Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Google Interviewer (Mock)"
                      value={interviewerName}
                      onChange={(e) => setInterviewerName(e.target.value)}
                      className="bg-slate-950 border border-slate-900 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Dungeon Type (Company Style)</label>
                    <select 
                      value={companyStyle}
                      onChange={(e) => setCompanyStyle(e.target.value)}
                      className="bg-slate-950 border border-slate-900 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="HR Round">HR Round (Behavioral)</option>
                      <option value="Technical Round">Technical Round (DSA & Coding)</option>
                      <option value="Project Round">Project Round (System Design)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 uppercase font-bold">Questions Asked</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="e.g. Implement a LRU Cache; Explain OAuth2 flow."
                    value={questionsAsked}
                    onChange={(e) => setQuestionsAsked(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 uppercase font-bold">Feedback / Areas of Improvement</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="e.g. Need to explain the space complexity clearer. Excellent coding logic."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-slate-950 border border-slate-900 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Confidence Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => { playClick(); setConfidenceRating(val); }}
                          className="cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${val <= confidenceRating ? 'text-hunter-gold fill-hunter-gold' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-black text-xs tracking-widest uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(157,78,221,0.4)]"
                  >
                    Complete Sweep
                  </button>
                </div>
              </form>

              {interviewSubmitted && (
                <div className="p-3 rounded bg-purple-950/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold text-center uppercase tracking-widest">
                  🎉 dungeon cleared! communication xp +100, stats updated.
                </div>
              )}

              {/* History List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                  DUNGEON SWEEP LOGS (MOCK HISTORY)
                </h4>

                {(dev.mockInterviews || []).length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No dungeons cleared yet. Log your first mock interview above.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(dev.mockInterviews || []).map((session) => (
                      <div 
                        key={session.id}
                        className="p-4 rounded border border-slate-900 bg-slate-950/40 hover:border-purple-500/30 transition-all flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/30 text-purple-400 text-[8px] font-bold tracking-widest uppercase">
                              {session.companyStyle}
                            </span>
                            <h5 className="font-black text-white text-xs mt-1">{session.interviewerName}</h5>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block">{session.date}</span>
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= session.confidenceRating ? 'text-hunter-gold fill-hunter-gold' : 'text-slate-800'}`} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] mt-1 border-t border-slate-900/60 pt-2 text-slate-400">
                          <div>
                            <strong className="text-white block mb-0.5">Questions Asked:</strong>
                            <p className="leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-900/40">{session.questionsAsked}</p>
                          </div>
                          <div>
                            <strong className="text-white block mb-0.5">Feedback & Review:</strong>
                            <p className="leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-900/40">{session.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </SystemWindow>
        )}

        {/* System Guidelines / Lore instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-lg bg-slate-950/60 border border-slate-900 flex gap-3.5">
            <Info className="w-5 h-5 text-hunter-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wider">
                Workout Logging System
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Physical reps correspond directly to system logs. Click the log increment buttons to submit your completed sets. Daily logs persist locally to build your attribute level.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-slate-950/60 border border-slate-900 flex gap-3.5">
            <Trophy className="w-5 h-5 text-hunter-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wider">
                Reward Payout Log
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Clearing the quest grants gold coins, lootboxes, and core stat points. Ensure you click "Claim Rewards" to unlock stat allocation points in your status panel.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
