import React, { useState } from 'react'
import { Award, Sparkles } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { SkillNode } from '../components/SkillNode'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

export const SkillsPage: React.FC = () => {
  const skills = useGameStore((state) => state.skills)
  const player = useGameStore((state) => state.player)
  const unlockSkill = useGameStore((state) => state.unlockSkill)
  
  const { playUnlock, playClick } = useSound()

  // Modal inspection states
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

  // Find skill status for connecting lines
  const isSkillUnlocked = (id: string) => {
    return skills.find(s => s.id === id)?.unlocked || false
  }

  return (
    <div className="min-h-screen bg-hunter-bg rpg-grid pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
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
              {/* Connector from Speed Boost (Center Top) to Strength passive (Left Bottom) */}
              <line 
                x1="50%" y1="20%" x2="30%" y2="55%" 
                stroke={isSkillUnlocked('speed_boost') ? '#00f0ff' : '#1e293b'} 
                strokeWidth={isSkillUnlocked('speed_boost') ? '2.5' : '1.5'}
                strokeDasharray={isSkillUnlocked('speed_boost') ? '0' : '4 4'}
                className={isSkillUnlocked('speed_boost') ? 'shadow-blue-aura' : ''}
              />
              
              {/* Connector from Speed Boost (Center Top) to Mana passive (Right Bottom) */}
              <line 
                x1="50%" y1="20%" x2="70%" y2="55%" 
                stroke={isSkillUnlocked('speed_boost') ? '#00f0ff' : '#1e293b'} 
                strokeWidth={isSkillUnlocked('speed_boost') ? '2.5' : '1.5'}
                strokeDasharray={isSkillUnlocked('speed_boost') ? '0' : '4 4'}
              />

              {/* Connector from Strength (Left Bottom) to Shadow Extraction (Center Bottom Ultimate) */}
              <line 
                x1="30%" y1="55%" x2="50%" y2="85%" 
                stroke={isSkillUnlocked('strength_upgrade') ? '#9d4edd' : '#1e293b'} 
                strokeWidth={isSkillUnlocked('strength_upgrade') ? '2.5' : '1.5'}
                strokeDasharray={isSkillUnlocked('strength_upgrade') ? '0' : '4 4'}
              />

              {/* Connector from Mana Control (Right Bottom) to Shadow Extraction (Center Bottom Ultimate) */}
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

            {/* Row 2: Secondary Passives (Strength & Mana) */}
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

            {/* Row 3: Ultimate Node (Shadow Extraction) */}
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

      </div>

      {/* Skill details Modal */}
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
