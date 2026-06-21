import React from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, Info, Trophy } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { SystemWindow } from '../components/SystemWindow'
import { QuestCard } from '../components/QuestCard'

export const QuestPage: React.FC = () => {
  const quests = useGameStore((state) => state.quests)

  const dailyQuest = quests.find((q) => q.type === 'daily')

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Warning Penalty Notice banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded border border-red-500/30 bg-red-950/10 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
        >
          <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-display text-xs font-black text-red-500 uppercase tracking-widest">
              !! WARNING: PENALTY DEADLINE INCOMING !!
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Failure to complete the training regimen by midnight will trigger a penalty threshold. You will be transported to the Desert Wasteland Dungeon for 4 hours of survival.
            </p>
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
