import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Sparkles, Trophy } from 'lucide-react'
import { useGameStore, syncFromDatabase } from './store/gameStore'
import { useSound } from './hooks/useSound'

// Components
import { Navbar } from './components/Navbar'
import { Modal } from './components/Modal'

// Pages
import { LandingPage } from './pages/LandingPage'
import { ProfilePage } from './pages/ProfilePage'
import { QuestPage } from './pages/QuestPage'
import { ShadowArmyPage } from './pages/ShadowArmyPage'
import { DungeonPage } from './pages/DungeonPage'
import { SkillsPage } from './pages/SkillsPage'
import { TrainingTracker } from './pages/TrainingTracker'
import { GalleryPage } from './pages/GalleryPage'
import { AboutPage } from './pages/AboutPage'

function App() {
  const levelUpNotification = useGameStore((state) => state.levelUpNotification)
  const dismissLevelUp = useGameStore((state) => state.dismissLevelUp)
  const questCompleteNotification = useGameStore((state) => state.questCompleteNotification)
  const dismissQuestComplete = useGameStore((state) => state.dismissQuestComplete)
  
  const { playClick } = useSound()

  useEffect(() => {
    syncFromDatabase()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-hunter-bg text-slate-100 flex flex-col font-sans antialiased selection:bg-hunter-blue/30 selection:text-white">
        
        {/* Navigation HUD */}
        <Navbar />

        {/* Core Router viewports with animated route pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/army" element={<ShadowArmyPage />} />
            <Route path="/dungeon" element={<DungeonPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/training" element={<TrainingTracker />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Global Level-Up Alert Modal */}
        <Modal
          isOpen={levelUpNotification}
          onClose={dismissLevelUp}
          title="SYSTEM MESSAGE: LEVEL UP"
          variant="gold"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none">
            <div className="relative w-20 h-20 rounded-full bg-hunter-gold/10 border border-hunter-gold flex items-center justify-center shadow-[0_0_20px_rgba(255,183,3,0.4)] animate-bounce">
              <Sparkles className="w-10 h-10 text-hunter-gold" />
            </div>

            <h3 className="font-display text-lg font-black text-hunter-gold uppercase tracking-wider">
              CONGRATULATION! LEVEL INCREASED!
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm">
              Your physical capacity has transcended. 5 Stat Points have been assigned to your status panel. Re-allocate them on the Profile tab to cement your gains.
            </p>

            <button
              onClick={() => {
                playClick()
                dismissLevelUp()
              }}
              className="w-full mt-4 py-2.5 rounded bg-hunter-gold text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_12px_rgba(255,183,3,0.4)] transition-all"
            >
              Acknowledge System Log
            </button>
          </div>
        </Modal>

        {/* Global Quest Complete System Warning Modal */}
        <Modal
          isOpen={questCompleteNotification !== null}
          onClose={dismissQuestComplete}
          title="SYSTEM WARNING: REGIMEN CLEAR"
          variant="blue"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none">
            <div className="relative w-20 h-20 rounded-full bg-hunter-blue/10 border border-hunter-blue flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Trophy className="w-10 h-10 text-hunter-blue animate-pulse" />
            </div>

            <h3 className="font-display text-base font-black text-hunter-blue uppercase tracking-wider">
              DAILY TRAINING INSTRUCTIONS COMPLETED
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm">
              {questCompleteNotification}
            </p>

            <button
              onClick={() => {
                playClick()
                dismissQuestComplete()
              }}
              className="w-full mt-4 py-2.5 rounded bg-hunter-blue text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
            >
              ARISING REWARDS NOW
            </button>
          </div>
        </Modal>

      </div>
    </Router>
  )
}

export default App
