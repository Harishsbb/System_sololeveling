import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Sparkles, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
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
import { NutritionPage } from './pages/NutritionPage'

function App() {
  const levelUpNotification = useGameStore((state) => state.levelUpNotification)
  const devLevelUpNotification = useGameStore((state) => state.devLevelUpNotification)
  const dismissLevelUp = useGameStore((state) => state.dismissLevelUp)
  const dismissDevLevelUp = useGameStore((state) => state.dismissDevLevelUp)
  const questCompleteNotification = useGameStore((state) => state.questCompleteNotification)
  const dismissQuestComplete = useGameStore((state) => state.dismissQuestComplete)
  const checkDailyQuestExpiry = useGameStore((state) => state.checkDailyQuestExpiry)
  const checkNutritionDailyReset = useGameStore((state) => state.checkNutritionDailyReset)
  const checkDevDailyReset = useGameStore((state) => state.checkDevDailyReset)
  
  const { playClick } = useSound()

  useEffect(() => {
    syncFromDatabase()
    checkDailyQuestExpiry()
    checkNutritionDailyReset()
    checkDevDailyReset()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-hunter-bg text-slate-100 flex flex-col font-sans select-none">
        
        {/* Navigation HUD */}
        <Navbar />

        {/* Global Page Layout wrapper */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
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
          title="SYSTEM MESSAGE: TRANSCENDENCE"
          variant="gold"
          className="relative overflow-visible"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none relative z-10">
            {/* Animated glowing rays */}
            <div className="absolute inset-0 -top-20 pointer-events-none overflow-visible flex items-center justify-center">
              <div className="w-60 h-60 bg-hunter-gold/20 rounded-full blur-[60px] animate-pulse absolute" />
              <div className="w-80 h-80 bg-yellow-500/10 rounded-full blur-[80px] animate-ping absolute" />
            </div>

            {/* Rising particle effect loops */}
            <div className="relative w-24 h-24 rounded-full bg-hunter-gold/25 border-2 border-hunter-gold flex items-center justify-center shadow-[0_0_35px_rgba(255,183,3,0.6)] overflow-hidden">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: -50, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute w-1.5 h-1.5 bg-white rounded-full left-6 pointer-events-none"
              />
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: -60, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: "linear" }}
                className="absolute w-2 h-2 bg-hunter-gold rounded-full right-8 pointer-events-none"
              />
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: -40, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.8, ease: "linear" }}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full left-12 pointer-events-none"
              />
              <Sparkles className="w-12 h-12 text-hunter-gold drop-shadow-[0_0_8px_rgba(255,183,3,0.8)] animate-pulse" />
            </div>

            <motion.h3 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl font-black text-hunter-gold uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,183,3,0.8)]"
            >
              LEVEL UP
            </motion.h3>

            <motion.h4 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-[10px] text-white/85 tracking-widest uppercase"
            >
              System Transcendence Completed
            </motion.h4>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm mt-2">
              Your cellular and muscular structures have undergone complete system reorganization.
              <strong className="text-hunter-gold block mt-2 text-xs font-display tracking-wider">⚔️ +5 STATUS POINTS GRANTED</strong>
            </p>

            <button
              onClick={() => {
                playClick()
                dismissLevelUp()
              }}
              className="w-full mt-4 py-3 rounded-sm bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_20px_rgba(255,183,3,0.4)] transition-all border-none"
            >
              Acknowledge System Upgrade
            </button>
          </div>
        </Modal>

        {/* Global Developer Level-Up Alert Modal */}
        <Modal
          isOpen={devLevelUpNotification}
          onClose={dismissDevLevelUp}
          title="SYSTEM MESSAGE: DEV TRANSCENDENCE"
          variant="blue"
          className="relative overflow-visible"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none relative z-10">
            {/* Animated glowing rays */}
            <div className="absolute inset-0 -top-20 pointer-events-none overflow-visible flex items-center justify-center">
              <div className="w-60 h-60 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse absolute" />
              <div className="w-80 h-80 bg-cyan-400/10 rounded-full blur-[80px] animate-ping absolute" />
            </div>

            {/* Rising particle effect loops */}
            <div className="relative w-24 h-24 rounded-full bg-cyan-950/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.6)] overflow-hidden">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: -50, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute w-1.5 h-1.5 bg-white rounded-full left-6 pointer-events-none"
              />
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: -60, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: "linear" }}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full right-8 pointer-events-none"
              />
              <Sparkles className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            </div>

            <motion.h3 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl font-black text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            >
              DEVELOPER LEVEL UP
            </motion.h3>

            <motion.h4 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-[10px] text-white/85 tracking-widest uppercase"
            >
              Placement Prep Potential Maxed
            </motion.h4>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm mt-2">
              Your coding synapses and problem-solving parameters have expanded to the next tier.
              <strong className="text-cyan-400 block mt-2 text-xs font-display tracking-wider">💻 STAT ATTRIBUTES GROWTH ENHANCED</strong>
            </p>

            <button
              onClick={() => {
                playClick()
                dismissDevLevelUp()
              }}
              className="w-full mt-4 py-3 rounded-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all border-none"
            >
              Acknowledge Developer Upgrade
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
