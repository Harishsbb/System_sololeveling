import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Sparkles, PlusCircle } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { LevelBar } from '../components/LevelBar'
import { Button } from '../components/Button'
import confetti from 'canvas-confetti'

interface WorkoutLog {
  id: string
  date: string
  exercise: string
  reps: number
  xpEarned: number
}

export const TrainingTracker: React.FC = () => {
  const player = useGameStore((state) => state.player)
  const addXp = useGameStore((state) => state.addXp)
  const updateQuestProgress = useGameStore((state) => state.updateQuestProgress)
  const quests = useGameStore((state) => state.quests)
  
  const { playClick, playLevelUp } = useSound()

  // Local state
  const [selectedExercise, setSelectedExercise] = useState('pushups')
  const [amount, setAmount] = useState('')
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [justLeveledUp, setJustLeveledUp] = useState(false)

  const dailyQuest = quests.find((q) => q.type === 'daily')
  const exercises = dailyQuest ? dailyQuest.tasks.map(t => {
    let xpPerUnit = 2
    if (t.id === 'running') xpPerUnit = 50
    else if (t.id === 'walking') xpPerUnit = 0.05
    else if (t.id === 'plank') xpPerUnit = 50
    
    return {
      id: t.id,
      name: t.name,
      xpPerUnit,
      questId: t.id
    }
  }) : [
    { id: 'pushups', name: 'Push-ups', xpPerUnit: 2, questId: 'pushups' },
    { id: 'squats', name: 'Squats', xpPerUnit: 2, questId: 'squats' },
    { id: 'walking', name: 'Walking (Steps)', xpPerUnit: 0.05, questId: 'walking' },
    { id: 'plank', name: 'Plank (Minutes)', xpPerUnit: 50, questId: 'plank' }
  ]

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    playClick()
    const activeEx = exercises.find((ex) => ex.id === selectedExercise)!
    const xpEarned = Math.round(numAmount * activeEx.xpPerUnit)

    // Log workout into local state history
    const newLog: WorkoutLog = {
      id: Math.random().toString(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exercise: activeEx.name.split(' ')[0],
      reps: numAmount,
      xpEarned,
    }
    setLogs((prev) => [newLog, ...prev])

    // Update quest progress in store
    const dailyQuest = quests.find(q => q.type === 'daily')
    if (dailyQuest) {
      const task = dailyQuest.tasks.find(t => t.id === activeEx.questId)
      if (task) {
        updateQuestProgress(task.id, task.current + numAmount)
      }
    }

    // Allocate XP in store & check level up
    const leveledUp = addXp(xpEarned)
    if (leveledUp) {
      playLevelUp()
      setJustLeveledUp(true)
      confetti({
        particleCount: 120,
        spread: 70,
        colors: ['#00f0ff', '#9d4edd', '#ffffff']
      })
      setTimeout(() => setJustLeveledUp(false), 4000)
    }

    setAmount('')
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Level Up Notification Overlay */}
        <AnimatePresence>
          {justLeveledUp && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-6 rounded-lg border border-hunter-blue bg-hunter-blue/15 text-center flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-pulse"
            >
              <Sparkles className="w-8 h-8 text-hunter-blue animate-spin" />
              <h2 className="font-display text-lg font-black text-hunter-blue uppercase tracking-widest">
                !! LEVEL UP INCREASED !!
              </h2>
              <p className="text-xs text-slate-300 font-display">
                Your stats capacity has expanded. 5 Stat Points allocated to profile.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live level details progress card */}
        <div className="p-6 rounded-xl bg-hunter-gray/40 border border-slate-800">
          <h4 className="font-display text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">
            active parameter synchronization
          </h4>
          <LevelBar xp={player.xp} xpNeeded={player.xpNeeded} level={player.level} />
        </div>

        {/* Training input system panel */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          
          <div className="flex-1">
            <SystemWindow title="FITNESS TRAINING CONSOLE" subtitle="Submit physical workout repetitions">
              <form onSubmit={handleLogWorkout} className="flex flex-col gap-5">
                
                {/* Exercise selection */}
                <div className="flex flex-col gap-2">
                  <label className="font-display text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Activity Type
                  </label>
                  <select
                    value={selectedExercise}
                    onChange={(e) => {
                      playClick()
                      setSelectedExercise(e.target.value)
                    }}
                    className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-display tracking-widest focus:outline-none focus:border-hunter-blue cursor-pointer"
                  >
                    {exercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div className="flex flex-col gap-2">
                  <label className="font-display text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Enter Amount completed
                  </label>
                  <input
                    type="number"
                    step={selectedExercise === 'running' ? '0.1' : '1'}
                    placeholder={selectedExercise === 'running' ? 'e.g. 2.5 KM' : 'e.g. 30 Reps'}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-display tracking-wider focus:outline-none focus:border-hunter-blue"
                  />
                </div>

                {/* Submit button */}
                <Button variant="blue" type="submit" className="w-full text-xs py-3 mt-2">
                  <PlusCircle className="w-4 h-4" />
                  SUBMIT WORKOUT Reps
                </Button>

              </form>
            </SystemWindow>
          </div>

          {/* Workout History logs list */}
          <div className="flex-1 flex flex-col">
            <SystemWindow title="COMBAT FITNESS LOG" subtitle="Recent completed training exercises">
              
              <div className="flex-1 overflow-y-auto max-h-72 pr-2 flex flex-col gap-3">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 font-display text-[10px] uppercase font-bold">
                    No workout records logged today.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3 rounded bg-slate-950 border border-slate-900 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-hunter-blue shrink-0" />
                        <div>
                          <span className="font-display font-black text-slate-200 uppercase tracking-wider">
                            {log.exercise}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Logged at {log.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-white block">
                          +{log.reps} {log.exercise === 'Running' ? 'KM' : 'Reps'}
                        </span>
                        <span className="text-[9px] font-display font-black text-hunter-purple uppercase tracking-wider">
                          +{log.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </SystemWindow>
          </div>

        </div>

      </div>
    </div>
  )
}
