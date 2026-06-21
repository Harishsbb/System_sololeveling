import React from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, Info, Trophy, Calendar } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { SystemWindow } from '../components/SystemWindow'
import { QuestCard } from '../components/QuestCard'

export const QuestPage: React.FC = () => {
  const quests = useGameStore((state) => state.quests)
  const dailyQuest = quests.find((q) => q.type === 'daily')

  // Timeline calculation
  const startDate = new Date('2026-06-21T00:00:00')
  const endDate = new Date('2026-09-18T23:59:59')
  const today = new Date()
  const diffTime = today.getTime() - startDate.getTime()
  const currentDay = Math.max(1, Math.min(90, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1))
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const [timeLeft, setTimeLeft] = React.useState('')

  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Warning Penalty Notice banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded border border-red-500/30 bg-red-950/15 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
        >
          <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
              <h4 className="font-display text-xs font-black text-red-500 uppercase tracking-widest">
                !! SYSTEM WARNING: MIDNIGHT PENALTY DEADLINE INCOMING !!
              </h4>
              <span className="font-display text-xs font-bold text-red-400 bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded animate-pulse">
                {timeLeft} REMAINING
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Failure to complete the training regimen before the countdown reaches zero will trigger the Penalty Quest. You will be locked out and must complete penalty survival exercises.
            </p>
          </div>
        </motion.div>

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

          {/* Timeline metrics grid */}
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

          {/* Rank Progression timeline bar */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="h-1.5 w-full bg-slate-900 rounded-full relative">
              {/* Progress fill */}
              <div 
                className="h-full bg-gradient-to-r from-hunter-blue via-indigo-500 to-hunter-purple rounded-full"
                style={{ width: `${(currentDay / 90) * 100}%` }}
              />
              
              {/* Timeline nodes */}
              <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay <= 30 ? 'bg-hunter-blue border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'} -ml-1`} />
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay > 30 && currentDay <= 60 ? 'bg-indigo-500 border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'}`} />
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${currentDay > 60 ? 'bg-hunter-purple border-white shadow-[0_0_8px_white]' : 'bg-slate-900 border-slate-800'} -mr-1`} />
              </div>
            </div>

            {/* Stage description cards */}
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
                <div className="text-[10px] text-slate-500 mb-1">21 Jun - 21 Jul</div>
                <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                  <li>Pushups: 30</li>
                  <li>Squats: 50</li>
                  <li>Walking: 8000 Steps</li>
                  <li>Plank: 3 Minutes</li>
                  <li>Meditation: 10 Minutes</li>
                </ul>
              </div>

              {/* B Rank */}
              <div className={`p-3 rounded border text-[11px] flex flex-col gap-1 transition-all ${
                currentDay > 30 && currentDay <= 60 
                  ? 'border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_10px_rgba(99,102,241,0.05)]' 
                  : 'border-slate-900 bg-slate-950/20 opacity-50'
              }`}>
                <div className="flex justify-between items-center border-b border-slate-900 pb-1 mb-1">
                  <span className="font-black text-indigo-400 uppercase tracking-wider">B Rank Progression</span>
                  <span className="text-[9px] text-slate-500 font-bold">Day 31-60</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1">22 Jul - 20 Aug</div>
                <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                  <li>Pushups: 60</li>
                  <li>Squats: 80</li>
                  <li>Walking: 10000 Steps</li>
                  <li>Plank: 5 Minutes</li>
                  <li>Meditation: 15 Minutes</li>
                </ul>
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
                <div className="text-[10px] text-slate-500 mb-1">21 Aug - 18 Sep</div>
                <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                  <li>Pushups: 100</li>
                  <li>Squats: 100</li>
                  <li>Running: 5 KM</li>
                  <li>Plank: 10 Minutes</li>
                  <li>Meditation: 20 Minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Quest Panel */}
        <SystemWindow 
          title="DAILY QUEST: PREPARATION TO BECOME STRONG"
          subtitle="Assigned by the Great Monarch System"
        >
          {dailyQuest ? (
            <QuestCard quest={dailyQuest} />
          ) : (
            <div className="text-center py-8 text-slate-500 font-display text-xs">
              No daily quest currently assigned. Re-check compliance log.
            </div>
          )}
        </SystemWindow>

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
