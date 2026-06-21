import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Award, Plus, Sparkles, AlertTriangle } from 'lucide-react'
import type { Quest, Task } from '../store/gameStore'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'

interface QuestCardProps {
  quest: Quest
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const updateQuestProgress = useGameStore((state) => state.updateQuestProgress)
  const claimQuestRewards = useGameStore((state) => state.claimQuestRewards)
  const resetQuest = useGameStore((state) => state.resetQuest)
  
  const { playClick, playQuestComplete } = useSound()

  const handleIncrement = (task: Task, amount: number) => {
    playClick()
    const newValue = task.current + amount
    updateQuestProgress(task.id, newValue)
  }

  const handleClaim = () => {
    playQuestComplete()
    claimQuestRewards(quest.id)
  }

  const handleReset = () => {
    playClick()
    resetQuest(quest.id)
  }

  return (
    <div className="w-full">
      {quest.status === 'failed' ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded border border-red-500 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.25)] flex flex-col gap-5 text-center select-none font-display relative overflow-hidden"
        >
          {/* Scanline glitch overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-red-500/5 pointer-events-none" />
          
          <div className="mx-auto p-3 bg-red-500/10 border border-red-500/30 rounded-full animate-bounce">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <div>
            <h3 className="text-red-500 text-lg font-black tracking-widest uppercase">
              [ WARNING: DAILY QUEST TIME EXPIRED ]
            </h3>
            <h4 className="text-[10px] text-red-400 font-bold tracking-widest mt-1 uppercase">
              Penalty Protocol Engaged
            </h4>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed mt-3">
              You failed to fulfill the training directives of the system before the midnight deadline. As penalty, you are locked in the Penalty Dungeon.
            </p>
          </div>
          
          <div className="my-2 p-4 rounded bg-slate-950 border border-slate-900 max-w-sm mx-auto w-full flex flex-col gap-2">
            <span className="text-red-400 text-[10px] font-bold block uppercase tracking-widest">Survival Objective:</span>
            <div className="flex justify-between items-center text-xs text-white">
              <span>Execute 50 Reps to survive</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[9px] font-bold uppercase">ACTIVE</span>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-display font-black text-xs tracking-widest uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]"
            >
              Endure Penalty & Reset System
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-5">
          
          {/* Quest Status Label */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-display text-sm md:text-base font-bold text-white tracking-widest uppercase">
                {quest.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {quest.description}
              </p>
            </div>
            <div>
              {quest.status === 'completed' && (
                <span className="px-3 py-1 text-xs font-display font-black text-hunter-bg bg-hunter-blue rounded animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(0,240,255,0.4)] uppercase">
                  Ready
                </span>
              )}
              {quest.status === 'rewarded' && (
                <span className="px-3 py-1 text-xs font-display font-black text-hunter-bg bg-emerald-400 rounded uppercase">
                  Cleared
                </span>
              )}
              {quest.status === 'active' && (
                <span className="px-3 py-1 text-xs font-display font-black text-slate-400 bg-slate-900 border border-slate-800 rounded uppercase">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Tasks Regimen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quest.tasks.map((task) => {
              const isTaskDone = task.current >= task.target
              const percentage = Math.min((task.current / task.target) * 100, 100)

              return (
                <div 
                  key={task.id}
                  className={`p-4 rounded border transition-all duration-300 ${
                    isTaskDone 
                      ? 'border-emerald-500/20 bg-emerald-950/5' 
                      : 'border-slate-800 bg-slate-950/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {isTaskDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className={`font-display text-xs md:text-sm font-bold tracking-wider ${isTaskDone ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>
                          {task.name}
                        </span>
                        <div className="mt-1">
                          {isTaskDone ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded uppercase tracking-wider">
                              CLEARED
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-hunter-blue/10 border border-hunter-blue/30 text-hunter-blue rounded uppercase tracking-wider">
                              {(task.target - task.current).toFixed(task.id === 'running' || task.id === 'plank' ? 1 : 0)} {
                                task.id === 'walking' ? 'STEPS' :
                                task.id === 'plank' ? 'MIN' :
                                task.id === 'running' ? 'KM' : 'REPS'
                              } REMAINING
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-baseline gap-1">
                      <span className="font-display text-base font-black text-white">{task.current}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        of {task.target}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${isTaskDone ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-hunter-blue shadow-[0_0_8px_rgba(0,240,255,0.5)]'}`}
                    />
                  </div>

                  {/* Increment Buttons (Log workout) */}
                  {quest.status === 'active' && (
                    <div className="flex items-center gap-2 mt-2">
                      {(() => {
                        let increments = [
                          { value: 5, label: '+5' },
                          { value: 10, label: '+10' }
                        ]
                        if (task.id === 'walking') {
                          increments = [
                            { value: 500, label: '+500' },
                            { value: 1000, label: '+1000' }
                          ]
                        } else if (task.id === 'plank') {
                          increments = [
                            { value: 0.5, label: '+30s' },
                            { value: 1.0, label: '+1m' }
                          ]
                        } else if (task.id === 'running') {
                          increments = [
                            { value: 0.5, label: '+0.5' },
                            { value: 1.0, label: '+1.0' }
                          ]
                        }

                        return increments.map((inc, i) => (
                          <button
                            key={i}
                            onClick={() => handleIncrement(task, inc.value)}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-hunter-blue/40 text-slate-300 hover:text-white text-xs font-display flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            {inc.label}
                          </button>
                        ))
                      })()}
                      <button
                        onClick={() => updateQuestProgress(task.id, task.target)}
                        className="ml-auto px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-display cursor-pointer transition-all"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quest Rewards Block */}
          <div className="p-4 rounded-lg bg-hunter-gray/30 border border-slate-800 mt-2 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-hunter-gold/10 border border-hunter-gold/20 rounded">
                <Award className="w-5 h-5 text-hunter-gold" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-hunter-gold uppercase tracking-widest">
                  Clear Rewards
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] font-display font-medium text-slate-400 uppercase tracking-wide">
                  <span>XP: <strong className="text-white">+{quest.rewards.xp}</strong></span>
                  <span>Points: <strong className="text-white">+{quest.rewards.statPoints}</strong></span>
                  <span>Gold: <strong className="text-white">+{quest.rewards.gold}G</strong></span>
                  <span>Box: <strong className="text-white">{quest.rewards.box}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {quest.status === 'completed' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaim}
                  className="w-full md:w-auto px-6 py-2.5 rounded bg-hunter-blue text-hunter-bg font-display font-black text-xs tracking-widest hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 uppercase"
                >
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Claim Rewards
                </motion.button>
              )}

              {quest.status === 'rewarded' && (
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto px-6 py-2.5 rounded border border-hunter-blue/30 text-hunter-blue hover:bg-hunter-blue/10 font-display font-black text-xs tracking-widest cursor-pointer flex items-center justify-center gap-2 uppercase"
                >
                  Start Next Day
                </button>
              )}

              {quest.status === 'active' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded border border-red-500/40 hover:bg-red-500/20 text-red-400 font-display font-bold text-xs tracking-widest uppercase cursor-pointer transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                  >
                    RESET DAILY QUEST
                  </button>
                  <button
                    disabled
                    className="flex-1 md:flex-none px-6 py-2.5 rounded border border-slate-800 bg-slate-900/50 text-slate-500 font-display font-black text-xs tracking-widest uppercase cursor-not-allowed"
                  >
                    In Progress...
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
