import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Image as ImageIcon } from 'lucide-react'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

interface GalleryItem {
  id: string
  title: string
  category: string
  description: string
  svg: React.ReactNode
}

export const GalleryPage: React.FC = () => {
  const { playClick, playHover } = useSound()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const items: GalleryItem[] = [
    {
      id: 'statue_of_god',
      title: 'Statue of God (Double Dungeon)',
      category: 'Dungeon Boss',
      description: 'The terrifying giant stone monolith guarding the Cartenon Temple. It enforces the laws of worship, praise, and belief upon all who enter.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400 fill-current">
          <circle cx="50" cy="30" r="14" fill="#0f0f18" stroke="#ef4444" strokeWidth="1.5" />
          <ellipse cx="46" cy="28" rx="2" ry="3" fill="#ef4444" className="animate-pulse" />
          <ellipse cx="54" cy="28" rx="2" ry="3" fill="#ef4444" className="animate-pulse" />
          <path d="M50 44 L32 80 H68 Z" fill="#1b1b29" stroke="#334155" strokeWidth="1" />
          <path d="M38 80 L38 95 M62 80 L62 95" stroke="#334155" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'monarch_dagger',
      title: 'Monarch Dagger',
      category: 'Weapons',
      description: 'Forged from magical black crystals, this dagger vibrates with intense shadow energy, increasing critical strike ratios by 50%.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full text-hunter-blue fill-current">
          <path d="M50 15 L53 50 L51 80 L49 80 L47 50 Z" fill="none" stroke="#00f0ff" strokeWidth="2.5" className="shadow-blue-aura" />
          <path d="M43 80 H57 M50 80 L50 92" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="92" r="3" fill="#9d4edd" />
        </svg>
      )
    },
    {
      id: 'dimensional_gate',
      title: 'Dungeon Gate',
      category: 'Rifts',
      description: 'An open dimensional rift connecting our reality to magical beast dungeons. The neon borders correspond to the hazard rating scale.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full text-hunter-purple fill-current">
          <ellipse cx="50" cy="50" rx="35" ry="35" fill="none" stroke="#9d4edd" strokeWidth="3" strokeDasharray="5 5" className="animate-spin" style={{ transformOrigin: '50px 50px' }} />
          <ellipse cx="50" cy="50" rx="25" ry="25" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="10" fill="#090912" />
        </svg>
      )
    },
    {
      id: 'igris_helm',
      title: 'Igris Crown Helm',
      category: 'Shadow Army',
      description: 'The helm worn by Igris the Red-Blood Knight. It symbolizes his noble pride and unbending loyalty to the Shadow Monarch.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full text-hunter-purple fill-current">
          <path d="M30 45 L50 10 L70 45 L62 80 H38 Z" fill="#0c0714" stroke="#9d4edd" strokeWidth="2" />
          <path d="M50 10 L50 80" stroke="#ef4444" strokeWidth="1" />
          <polygon points="45,45 50,38 55,45" fill="#00f0ff" />
          <path d="M50 10 Q35 0 25 15" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
        </svg>
      )
    }
  ]

  const activeItem = items.find(item => item.id === selectedItemId)

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Gallery introduction window */}
        <SystemWindow title="HUNTER ARCHIVE GALLERY" subtitle="Visual logs of system encounters">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex-1">
              <h3 className="font-display text-sm md:text-base font-black text-hunter-blue uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="w-5 h-5" />
                Visual Archives Library
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore graphic archives of boss monsters, weapons, and dimensional portals discovered during operations. Hover to scan, click to view details.
              </p>
            </div>
          </div>
        </SystemWindow>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              onMouseEnter={playHover}
              onClick={() => {
                playClick()
                setSelectedItemId(item.id)
              }}
              className="glass-panel border border-slate-800 rounded-xl overflow-hidden cursor-pointer flex flex-col h-80 group transition-all duration-300 hover:border-hunter-blue/40"
            >
              {/* SVG Graphic panel */}
              <div className="h-48 bg-slate-950/90 relative border-b border-slate-900/60 p-6 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,240,255,0.06)_0%,transparent_70%)]"></div>
                <div className="w-32 h-32 transform group-hover:scale-105 transition-transform duration-300">
                  {item.svg}
                </div>
                
                {/* Hover overlay badge */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all duration-300">
                  <Eye className="w-5 h-5 text-hunter-blue" />
                  <span className="font-display text-[10px] font-black uppercase text-hunter-blue tracking-wider">
                    Inspect File
                  </span>
                </div>
              </div>

              {/* Title & category */}
              <div className="p-4 flex-1 flex flex-col justify-center">
                <span className="text-[9px] font-display font-extrabold uppercase tracking-widest text-hunter-purple">
                  {item.category}
                </span>
                <h4 className="font-display text-xs font-black uppercase tracking-wide text-slate-200 mt-1 line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Inspect Item Modal */}
      <Modal
        isOpen={selectedItemId !== null}
        onClose={() => setSelectedItemId(null)}
        title={activeItem?.title || 'Archive File'}
        variant={activeItem?.category === 'Shadow Army' ? 'purple' : 'blue'}
      >
        {activeItem && (
          <div className="flex flex-col gap-6 items-center">
            
            {/* Expanded Illustration display */}
            <div className="w-56 h-56 p-6 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(157,78,221,0.06)_0%,transparent_80%)] animate-pulse-slow"></div>
              {activeItem.svg}
            </div>

            <div>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[9px] font-display font-bold uppercase tracking-widest text-hunter-purple">
                {activeItem.category}
              </span>
              <h4 className="font-display text-sm font-black uppercase text-slate-100 mt-3 tracking-wide">
                Description & parameters
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            <Button 
              variant="blue" 
              onClick={() => setSelectedItemId(null)} 
              className="w-full text-xs mt-2"
            >
              Close Archive File
            </Button>

          </div>
        )}
      </Modal>

    </div>
  )
}
