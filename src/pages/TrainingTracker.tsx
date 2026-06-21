import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dumbbell, 
  Sparkles, 
  PlusCircle, 
  Check, 
  Calendar, 
  Award, 
  Trophy, 
  Footprints, 
  Flame, 
  Timer, 
  Activity, 
  ShieldAlert, 
  TrendingUp 
} from 'lucide-react'
import { useGameStore, getCurrentDayCount } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { LevelBar } from '../components/LevelBar'
import { Button } from '../components/Button'
import confetti from 'canvas-confetti'

interface FloatingXp {
  id: number
  taskId: string
  amount: number
}

export const TrainingTracker: React.FC = () => {
  const player = useGameStore((state) => state.player)
  const addXp = useGameStore((state) => state.addXp)
  const updateQuestProgress = useGameStore((state) => state.updateQuestProgress)
  const claimQuestRewards = useGameStore((state) => state.claimQuestRewards)
  const logWorkout = useGameStore((state) => state.logWorkout)
  const quests = useGameStore((state) => state.quests)
  
  const { playClick, playLevelUp } = useSound()

  // Local state
  const [justLeveledUp, setJustLeveledUp] = useState(false)
  const [floatingXps, setFloatingXps] = useState<FloatingXp[]>([])

  const currentDay = getCurrentDayCount()
  const dailyQuest = quests.find((q) => q.type === 'daily' && q.id === 'daily_training')
  const logs = player.workoutHistory || []

  // Week Logic Focus
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

  const weekSchedule = [
    { id: 1, name: 'Monday', focus: 'Chest + Triceps' },
    { id: 2, name: 'Tuesday', focus: 'Back + Biceps' },
    { id: 3, name: 'Wednesday', focus: 'Legs' },
    { id: 4, name: 'Thursday', focus: 'Shoulder + Core' },
    { id: 5, name: 'Friday', focus: 'Full Body' },
    { id: 6, name: 'Saturday', focus: 'Active Recovery' },
    { id: 0, name: 'Sunday', focus: 'Recovery Day' },
  ]

  const activeFocus = weekSchedule.find((d) => d.id === dayOfWeek)?.focus || 'Training Day'

  // Exercises helpers
  const getExerciseIcon = (id: string) => {
    switch (id) {
      case 'pushups':
      case 'squats':
        return <Dumbbell className="w-5 h-5 text-cyan-400 animate-float" />
      case 'walking':
        return <Footprints className="w-5 h-5 text-emerald-400" />
      case 'running':
        return <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
      case 'plank':
      case 'hanging':
      case 'wall_posture':
        return <Timer className="w-5 h-5 text-indigo-400" />
      case 'meditation':
      case 'stretching':
      case 'cobra_stretch':
      case 'cat_cow':
        return <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
      default:
        return <Dumbbell className="w-5 h-5 text-slate-400" />
    }
  }

  const getExerciseStep = (id: string) => {
    switch (id) {
      case 'pushups':
      case 'squats':
        return 5
      case 'walking':
        return 1000
      case 'running':
        return 0.5
      case 'hanging':
        return 15 // seconds
      case 'cobra_stretch':
        return 1 // sets
      case 'plank':
      case 'meditation':
      case 'cat_cow':
      case 'wall_posture':
      case 'stretching':
        return 1 // minute
      default:
        return 1
    }
  }

  const getExerciseXpValue = (id: string, amount: number) => {
    switch (id) {
      case 'pushups':
      case 'squats':
        return amount * 2
      case 'walking':
        return Math.round(amount * 0.05)
      case 'running':
        return Math.round(amount * 50)
      case 'plank':
      case 'meditation':
      case 'stretching':
      case 'hanging':
      case 'cobra_stretch':
      case 'cat_cow':
      case 'wall_posture':
        return amount * 10
      default:
        return amount * 2
    }
  }

  const getExerciseUnit = (id: string) => {
    switch (id) {
      case 'walking':
        return 'Steps'
      case 'running':
        return 'KM'
      case 'pushups':
      case 'squats':
        return 'Reps'
      case 'cobra_stretch':
        return 'Sets'
      case 'hanging':
        return 'Seconds'
      default:
        return 'Mins'
    }
  }

  const handleProgress = (taskId: string, isComplete: boolean = false) => {
    playClick()
    const task = dailyQuest?.tasks.find((t) => t.id === taskId)
    if (!task) return

    const stepAmount = getExerciseStep(taskId)
    let nextValue = isComplete ? task.target : task.current + stepAmount
    nextValue = Math.min(task.target, nextValue)

    const incrementAmount = nextValue - task.current
    if (incrementAmount <= 0) return

    const xpEarned = getExerciseXpValue(taskId, incrementAmount)

    // Trigger Floating XP micro-animation
    const animId = Date.now() + Math.random()
    setFloatingXps((prev) => [...prev, { id: animId, taskId, amount: xpEarned }])
    setTimeout(() => {
      setFloatingXps((prev) => prev.filter((item) => item.id !== animId))
    }, 1000)

    // Log workout into Zustand store (synced automatically to MongoDB)
    logWorkout(task.name.split(' ')[0], incrementAmount, xpEarned)

    // Update quest progress
    updateQuestProgress(taskId, nextValue)

    // Allocate XP in store
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
  }

  const handleClaimReward = () => {
    if (!dailyQuest || dailyQuest.status !== 'completed') return
    playLevelUp()
    claimQuestRewards('daily_training')
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#9d4edd', '#ffb703', '#ffffff']
    })
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
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
                Your physical capabilities have grown. +5 Stat Points allocated to profile.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-display font-black text-cyan-400 uppercase tracking-widest block">
              System Console v3.1.0 // Physical Pillar
            </span>
            <h1 className="font-display text-xl md:text-2xl font-black text-white uppercase tracking-widest mt-1">
              S-RANK BODY HUNTER TRAINING SYSTEM
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
              Track daily training routines, verify weekly muscle group targets, and push limits to trigger physiological adaptations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-slate-950 border border-slate-900 font-display text-[10px] font-black text-amber-500 tracking-wider">
              DAY {currentDay}/90
            </span>
            <span className="px-3 py-1 rounded bg-slate-950 border border-slate-900 font-display text-[10px] font-black text-cyan-400 tracking-wider">
              TODAY: {activeFocus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live parameter synchronization */}
        <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-900">
          <h4 className="font-display text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Active Physical Parameter Synchronization
          </h4>
          <LevelBar xp={player.xp} xpNeeded={player.xpNeeded} level={player.level} />
        </div>

        {/* 90-Day Fitness Evolution Timeline Matrix */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cyan-400" />
            90-Day Fitness Evolution Timeline
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* E Rank */}
            <div className={`p-4 rounded border font-display relative transition-all ${
              currentDay <= 30
                ? 'border-cyan-500/40 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                : 'border-slate-900 bg-slate-950/30 opacity-60'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">Day 1 - Day 30</span>
                  <span className="text-[11px] font-black text-slate-200 block uppercase mt-0.5">E-RANK: FOUNDATION BODY HUNTER</span>
                </div>
                {currentDay <= 30 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase">ACTIVE</span>}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
                Build initial baseline conditioning, posture alignment, and muscle endurance. 
              </p>
              <ul className="mt-3 space-y-1 text-[8.5px] text-slate-400 border-t border-slate-900/60 pt-2 font-mono">
                <li>• Pushups: 30 reps / Squats: 50 reps</li>
                <li>• Mobility: Hanging (90s), Cobra, Cat-Cow, Wall Posture</li>
                <li>• Conditioning: Walking 8k Steps / Plank 3m</li>
              </ul>
            </div>

            {/* B Rank */}
            <div className={`p-4 rounded border font-display relative transition-all ${
              currentDay > 30 && currentDay <= 60
                ? 'border-indigo-500/40 bg-indigo-950/10 shadow-[0_0_15px_rgba(99,102,241,0.08)]'
                : 'border-slate-900 bg-slate-950/30 opacity-60'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">Day 31 - Day 60</span>
                  <span className="text-[11px] font-black text-slate-200 block uppercase mt-0.5">B-RANK: ELITE BODY HUNTER</span>
                </div>
                {currentDay > 30 && currentDay <= 60 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold uppercase">ACTIVE</span>}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
                Increase workout density and reps to forge solid strength foundations.
              </p>
              <ul className="mt-3 space-y-1 text-[8.5px] text-slate-400 border-t border-slate-900/60 pt-2 font-mono">
                <li>• Pushups: 60 reps / Squats: 80 reps</li>
                <li>• Stretching: 15 minutes flexibility routine</li>
                <li>• Conditioning: Walking 10k Steps / Plank 5m</li>
              </ul>
            </div>

            {/* S Rank */}
            <div className={`p-4 rounded border font-display relative transition-all ${
              currentDay > 60
                ? 'border-purple-500/40 bg-purple-950/10 shadow-[0_0_15px_rgba(168,85,247,0.08)]'
                : 'border-slate-900 bg-slate-950/30 opacity-60'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">Day 61 - Day 90</span>
                  <span className="text-[11px] font-black text-slate-200 block uppercase mt-0.5">S-RANK: SHADOW MONARCH PHYSIQUE</span>
                </div>
                {currentDay > 60 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold uppercase">ACTIVE</span>}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
                Enter ultimate conditioning phase. High repetitions, running capacity, and maximum recovery.
              </p>
              <ul className="mt-3 space-y-1 text-[8.5px] text-slate-400 border-t border-slate-900/60 pt-2 font-mono">
                <li>• Pushups: 100 reps / Squats: 100 reps</li>
                <li>• Running: 5 KM cardio challenge</li>
                <li>• Conditioning: Plank 10m / Stretching 20m</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Weekly Split Focus Schedule */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Weekly Target Split & Muscle Group Focus
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-display">
            {weekSchedule.map((sched) => {
              const isToday = sched.id === dayOfWeek
              return (
                <div 
                  key={sched.id} 
                  className={`p-2.5 rounded border text-center transition-all ${
                    isToday 
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                      : 'border-slate-900 bg-slate-950/40 opacity-70'
                  }`}
                >
                  <span className={`text-[8px] uppercase tracking-wider block font-bold ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {sched.name}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wide block mt-1 ${isToday ? 'text-white' : 'text-slate-300'}`}>
                    {sched.focus}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main daily quests workspace */}
        <div className="flex flex-col lg:flex-row gap-8 mt-2">
          
          {/* Daily training quest checklist */}
          <div className="flex-[2] flex flex-col gap-6">
            
            {dailyQuest ? (
              <SystemWindow 
                title={dailyQuest.name.toUpperCase()} 
                subtitle="Verify and increment daily targets to earn parameter points"
                variant={dayOfWeek === 0 ? 'purple' : 'blue'}
              >
                
                {/* Sunday Recovery Day Alert */}
                {dayOfWeek === 0 && (
                  <div className="p-4 rounded border border-purple-500/20 bg-purple-950/10 mb-6 font-display text-xs text-purple-300 leading-relaxed flex items-start gap-3">
                    <Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="font-black uppercase block text-[10px] tracking-wider text-purple-400">Recovery Mode Engaged</span>
                      Take time to stretch, walk light paces, and meditate. No failure penalty rules are active today. Focus purely on restoration.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyQuest.tasks.map((task) => {
                    const progressPercent = Math.min(100, Math.round((task.current / task.target) * 100))
                    const isCompleted = task.current >= task.target
                    const stepSize = getExerciseStep(task.id)
                    const unit = getExerciseUnit(task.id)

                    return (
                      <div 
                        key={task.id}
                        className={`p-4 rounded bg-slate-950 border relative transition-all flex flex-col justify-between gap-4 group ${
                          isCompleted 
                            ? 'border-emerald-500/30 bg-emerald-950/5' 
                            : 'border-slate-900 hover:border-cyan-500/30'
                        }`}
                      >
                        {/* Floating XP Anim Wrapper */}
                        {floatingXps.filter(x => x.taskId === task.id).map(x => (
                          <motion.span
                            key={x.id}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: -45, scale: 1.25 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="absolute top-4 right-4 text-cyan-400 font-display font-black text-[11px] pointer-events-none select-none z-10"
                          >
                            +{x.amount} XP
                          </motion.span>
                        ))}

                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded bg-slate-900 border ${isCompleted ? 'border-emerald-500/20 text-emerald-400' : 'border-slate-800 text-slate-400 group-hover:text-cyan-400'} transition-all`}>
                              {getExerciseIcon(task.id)}
                            </div>
                            <div>
                              <span className="font-display font-black text-slate-200 block text-[11px] uppercase tracking-wider">
                                {task.name}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                Increment size: +{stepSize} {unit}
                              </span>
                            </div>
                          </div>
                          
                          {isCompleted ? (
                            <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono font-bold">
                              {progressPercent}%
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1.5 font-bold">
                            <span>PROGRESS</span>
                            <span>{task.current} / {task.target} {unit}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-sm overflow-hidden p-[1.5px] border border-slate-900">
                            <div 
                              className={`h-full rounded-sm transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                                  : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                              }`} 
                              style={{ width: `${progressPercent}%` }} 
                            />
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            disabled={isCompleted}
                            onClick={() => handleProgress(task.id)}
                            className={`flex-grow py-2 rounded text-[9px] font-display font-black tracking-widest uppercase flex items-center justify-center gap-1.5 border transition-all ${
                              isCompleted 
                                ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                                : 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500 hover:bg-cyan-500/20 text-cyan-400 cursor-pointer'
                            }`}
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            ADD +{stepSize}
                          </button>
                          <button
                            disabled={isCompleted}
                            onClick={() => handleProgress(task.id, true)}
                            className={`px-3 py-2 rounded text-[9px] font-display font-black tracking-widest uppercase border transition-all ${
                              isCompleted 
                                ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                                : 'bg-slate-900 border-slate-800 hover:border-emerald-500 hover:text-emerald-400 text-slate-400 cursor-pointer'
                            }`}
                          >
                            COMPLETE
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Claim reward / completed panel */}
                {dailyQuest.status === 'completed' && (
                  <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col items-center text-center">
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Button
                        variant={dayOfWeek === 0 ? 'purple' : 'blue'}
                        onClick={handleClaimReward}
                        className="text-xs px-8 py-3.5 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      >
                        <Award className="w-4 h-4" />
                        Arise & Claim Training Rewards
                      </Button>
                    </motion.div>
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block mt-2 font-mono">
                      Workout Complete reward: +200 XP, Strength +5, Endurance +5, Health +5, Discipline +5
                    </span>
                  </div>
                )}

                {dailyQuest.status === 'rewarded' && (
                  <div className="mt-8 border-t border-slate-900 pt-6 text-center">
                    <div className="px-4 py-3 rounded border border-emerald-500/20 bg-emerald-950/10 inline-flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Daily Quest Completed & Rewards Claimed [STATUS: RESOLVED]
                    </div>
                  </div>
                )}

              </SystemWindow>
            ) : (
              <div className="p-8 rounded-lg bg-slate-950/40 border border-slate-900 text-center font-display">
                <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto animate-pulse mb-3" />
                <span className="text-xs font-black uppercase tracking-widest block text-slate-400">
                  NO ACTIVE DAILY QUEST DETECTED
                </span>
                <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-wide">
                  The system will automatically initialize your quest at midnight.
                </p>
              </div>
            )}

          </div>

          {/* Combat fitness logs and parameter panel */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Workout Parameters panel */}
            <SystemWindow title="HUNTER PHYSICAL ATTRIBUTES" subtitle="Current physical parameter points">
              <div className="flex flex-col gap-3 font-display text-[10px]">
                <div className="p-3 rounded bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Strength (STR)</span>
                  <span className="text-xs font-black text-cyan-400">LVL {player.stats.strength}</span>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Endurance (END)</span>
                  <span className="text-xs font-black text-indigo-400">LVL {player.stats.endurance}</span>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Health Capacity (HP)</span>
                  <span className="text-xs font-black text-emerald-400">LVL {player.stats.health}</span>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Discipline (DIS)</span>
                  <span className="text-xs font-black text-purple-400">LVL {player.stats.discipline}</span>
                </div>
              </div>
            </SystemWindow>

            {/* Combat fitness history */}
            <SystemWindow title="COMBAT FITNESS LOG" subtitle="Recent completed training exercises">
              
              <div className="flex-1 overflow-y-auto max-h-[340px] pr-2 flex flex-col gap-3">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-slate-600 font-display text-[9px] uppercase font-bold tracking-wider">
                    No workout records logged today.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3 rounded bg-slate-950 border border-slate-900 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                          <Dumbbell className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-display font-black text-slate-200 uppercase tracking-wider">
                            {log.exercise}
                          </span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">
                            Logged at {log.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-display">
                        <span className="font-bold text-white block">
                          +{log.amount} {log.exercise === 'Running' ? 'KM' : log.exercise === 'Walking' ? 'Steps' : 'Reps'}
                        </span>
                        <span className="text-[8.5px] font-black text-cyan-400 uppercase tracking-wider">
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
