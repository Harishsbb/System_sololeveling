import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Star, Sparkles, ShieldCheck } from 'lucide-react'
import { SystemWindow } from '../components/SystemWindow'

interface StoryEvent {
  year: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
}

export const AboutPage: React.FC = () => {

  const timelineEvents: StoryEvent[] = [
    {
      year: 'Phase 1',
      title: 'The Weakest Hunter',
      subtitle: 'E-Rank Quantum Ghost Style Hunter',
      description: 'Hired as an E-rank hunter, sustaining severe injuries in the lowest-level Dungeons. Hailed by peers as humanity\'s weakest shield.',
      icon: <Star className="w-5 h-5 text-slate-500" />
    },
    {
      year: 'Phase 2',
      title: 'The Cartenon Trial',
      subtitle: 'The Secret Reawakening',
      description: 'Sacrificed in the Double Dungeon. Awakening with a bizarre screen interface. The System mandates physical training or instant death.',
      icon: <Sparkles className="w-5 h-5 text-hunter-blue" />
    },
    {
      year: 'Phase 3',
      title: 'Shadow Monarch Job Change',
      subtitle: 'Command of the Dead',
      description: 'Clearing the job change dungeon and extracting Igris the Red Knight. Evolving from a magic fighter into the sole Ruler of Shadows.',
      icon: <TrendingUp className="w-5 h-5 text-hunter-purple" />
    },
    {
      year: 'Phase 4',
      title: 'Monarch Ascendant SSS-Rank',
      subtitle: 'The Ultimate Hunter Power',
      description: 'Slaying the Ant King on Jeju Island and conquering gates alone. Standing as the absolute monarch protecting humanity from extinction.',
      icon: <ShieldCheck className="w-5 h-5 text-hunter-gold" />
    }
  ]

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Story Introduction */}
        <SystemWindow title="HUNTER GROWTH HISTORY LOG" subtitle="From Weakest Hunter to Ultimate Monarch">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex-1">
              <h3 className="font-display text-sm md:text-base font-black text-hunter-blue uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-5 h-5" />
                "From Weak Hunter To Strongest"
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review the tactical progression and power growth of Quantum Ghost. Track his evolution from a bottom-tier E-rank fighter into the supreme Commander of the Shadow Monarch army.
              </p>
            </div>
          </div>
        </SystemWindow>

        {/* Timeline List */}
        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 pl-6 md:pl-8 flex flex-col gap-12 mt-6">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Outer timeline indicator dot */}
              <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center group-hover:border-hunter-blue transition-all duration-300">
                {event.icon}
              </div>

              {/* Mobile Rank year sidebar header */}
              <div className="md:absolute md:-left-36 md:w-28 text-left md:text-right font-display text-[10px] font-black tracking-widest text-slate-500 uppercase mt-2">
                {event.year}
              </div>

              {/* Story Details Card panel */}
              <div className="glass-panel border border-slate-900 rounded-lg p-5 transition-all duration-300 hover:border-slate-800">
                <h4 className="font-display text-sm font-black text-slate-100 uppercase tracking-wide">
                  {event.title}
                </h4>
                <p className="text-[10px] text-hunter-blue font-display font-semibold uppercase mt-0.5 tracking-wider">
                  {event.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">
                  {event.description}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
