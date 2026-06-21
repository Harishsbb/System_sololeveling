import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Utensils, Flame, Trophy, Award, Sparkles, 
  GlassWater, Apple, Salad, Heart, Star, 
  Dumbbell
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { SystemWindow } from '../components/SystemWindow'
import { Modal } from '../components/Modal'

export const NutritionPage: React.FC = () => {
  const player = useGameStore((state) => state.player)
  const toggleMeal = useGameStore((state) => state.toggleMeal)
  const addWater = useGameStore((state) => state.addWater)
  const addProtein = useGameStore((state) => state.addProtein)
  const addFruits = useGameStore((state) => state.addFruits)
  const addVegetables = useGameStore((state) => state.addVegetables)
  const claimFullNutritionRewards = useGameStore((state) => state.claimFullNutritionRewards)
  
  const { playClick, playQuestComplete } = useSound()

  // Local state for UI feedback
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showSundayRewardModal, setShowSundayRewardModal] = useState(false)
  const [sundaySteps, setSundaySteps] = useState(0)

  const nutrition = player.nutrition || {
    meals: {
      morningFuel: false,
      breakfast: false,
      lunch: false,
      preWorkout: false,
      postWorkout: false,
      dinner: false,
      rewardMeal: false
    },
    water: 0,
    protein: 0,
    fruits: 0,
    vegetables: 0,
    streak: 0,
    badges: [],
    proteinDaysCount: 0,
    waterDaysCount: 0,
    fullQuestDaysCount: 0,
    lastUpdatedDate: new Date().toDateString()
  }

  const isSunday = new Date().getDay() === 0

  // Check if daily criteria are met
  const isWaterDone = nutrition.water >= 3.0
  const isProteinDone = nutrition.protein >= 100
  const isFruitsDone = nutrition.fruits >= 2
  const isVeggiesDone = nutrition.vegetables >= 2

  const areMealsDone = 
    nutrition.meals.morningFuel &&
    nutrition.meals.breakfast &&
    nutrition.meals.lunch &&
    nutrition.meals.preWorkout &&
    nutrition.meals.postWorkout &&
    nutrition.meals.dinner

  // Determine if full quest is completed (Sunday rules differ)
  const isSundayQuestDone = isSunday && isWaterDone && isProteinDone && sundaySteps >= 5000
  const isNormalQuestDone = !isSunday && areMealsDone && isWaterDone && isProteinDone && isFruitsDone && isVeggiesDone

  const isQuestFullyCompleted = isSunday ? isSundayQuestDone : isNormalQuestDone
  
  // Track if rewards for today's full quest have already been claimed
  const [rewardsClaimedToday, setRewardsClaimedToday] = useState(false)

  useEffect(() => {
    const todayStr = new Date().toDateString()
    const claimedDate = localStorage.getItem('sl_nutrition_claimed_date')
    if (claimedDate === todayStr) {
      setRewardsClaimedToday(true)
    } else {
      setRewardsClaimedToday(false)
    }
  }, [nutrition.fullQuestDaysCount])

  const handleClaimQuest = () => {
    if (rewardsClaimedToday) return
    playQuestComplete()
    claimFullNutritionRewards()
    const todayStr = new Date().toDateString()
    localStorage.setItem('sl_nutrition_claimed_date', todayStr)
    setRewardsClaimedToday(true)
    setShowCompleteModal(true)
  }

  const handleToggleRewardMeal = () => {
    if (!isSunday) return
    playClick()
    
    // Toggle state locally/in-store
    const prevVal = nutrition.meals.rewardMeal
    toggleMeal('rewardMeal')

    if (!prevVal) {
      playQuestComplete()
      setShowSundayRewardModal(true)
    }
  }

  // Meal configurations
  const mealsConfig = [
    {
      id: 'morningFuel' as const,
      title: '🌅 Morning Fuel',
      items: ['Eggs or clean protein source', 'Banana or whole fruit', 'Glass of milk / water']
    },
    {
      id: 'breakfast' as const,
      title: '🍽 Breakfast',
      items: ['Idli + Sambar', 'Dosa + Sambar', 'Oats + Nuts', 'Ragi-based foods']
    },
    {
      id: 'lunch' as const,
      title: '🍚 Lunch',
      items: ['Protein (Chicken / Egg / Fish / Paneer / Dal)', 'Vegetables (Green salad / Cooked)', 'Carbs (Rice / Chapati)']
    },
    {
      id: 'preWorkout' as const,
      title: '⚡ Pre Workout',
      items: ['Banana', 'Black Coffee', 'Mixed fruits', 'Handful of nuts']
    },
    {
      id: 'postWorkout' as const,
      title: '💪 Post Workout',
      items: ['Eggs', 'Milk / Protein shake', 'Chicken', 'Paneer']
    },
    {
      id: 'dinner' as const,
      title: '🌙 Dinner',
      items: ['Chapati / Wheat roti', 'Light Dosa', 'Light Rice with Dal', 'Lean Protein source']
    }
  ]

  return (
    <div className={`min-h-screen pt-8 pb-20 px-4 transition-all duration-500 ${isSunday ? 'bg-amber-950/20' : 'bg-hunter-bg'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Sunday Recovery Banner */}
        {isSunday && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded border border-amber-500/30 bg-amber-500/10 text-center shadow-[0_0_20px_rgba(245,158,11,0.15)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-pulse" />
            <h2 className="font-display text-sm font-black text-amber-500 tracking-widest uppercase flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              RECOVERY DAY ACTIVATED
              <Sparkles className="w-5 h-5 animate-spin" />
            </h2>
            <p className="text-[10px] text-amber-200 mt-1 uppercase tracking-wider font-semibold">
              Muscles are rebuilding. Rest and refuel are crucial phases of system growth.
            </p>
          </motion.div>
        )}

        <SystemWindow 
          title="NUTRITION QUEST LOG" 
          subtitle="Systematic fuel loading and biological optimization panel"
          className={isSunday ? 'border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.05)]' : ''}
        >
          {/* Top Info grid: Streak and Full Quest Claim Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Clean Eating Streak Card */}
            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-900 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-display text-slate-500 uppercase tracking-widest font-black">
                  Clean Eating Streak
                </h4>
                <p className="text-2xl font-display font-black text-white mt-1 flex items-center gap-1.5">
                  <span className="text-red-500">🔥</span> {nutrition.streak} {nutrition.streak === 1 ? 'Day' : 'Days'}
                </p>
              </div>
              <div className="p-3 rounded bg-red-950/30 border border-red-900/50 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>

            {/* Active Quest Stats summary */}
            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-900 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-display text-slate-500 uppercase tracking-widest font-black">
                  Active Routine Rank
                </h4>
                <p className="text-lg font-display font-black text-hunter-blue mt-1 uppercase tracking-widest">
                  {isSunday ? 'RECOVERY RANK' : `${player.rank}-Rank Normal`}
                </p>
                <span className="text-[9px] text-slate-400">
                  {isSunday ? 'Hydration, Protein & Rest walking' : '6 Meals + 4 Nutrient Goals'}
                </span>
              </div>
              <div className="p-3 rounded bg-hunter-blue/10 border border-hunter-blue/30 flex items-center justify-center">
                <Heart className="w-6 h-6 text-hunter-blue" />
              </div>
            </div>

            {/* Ultimate Claim Trigger */}
            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-900 flex flex-col justify-center">
              {rewardsClaimedToday ? (
                <div className="text-center py-2 px-3 rounded bg-slate-900 border border-slate-800 text-[10px] font-display font-bold text-emerald-400 uppercase tracking-wider">
                  ✓ Today's Quest Complete & Claimed
                </div>
              ) : (
                <button
                  onClick={handleClaimQuest}
                  disabled={!isQuestFullyCompleted}
                  className={`w-full py-2.5 rounded text-xs font-display font-black tracking-widest uppercase border transition-all cursor-pointer ${
                    isQuestFullyCompleted
                      ? isSunday
                        ? 'bg-amber-500 text-hunter-bg border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110'
                        : 'bg-hunter-blue text-hunter-bg border-hunter-blue shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:brightness-110'
                      : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {isQuestFullyCompleted ? 'Claim Quest Rewards' : 'Complete Daily Goals to Claim'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Meal Tracking column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-hunter-purple pl-2.5 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-hunter-purple" />
                {isSunday ? 'Sunday Rest Refuel Rules' : 'Daily Food Quests (+20 XP each)'}
              </h3>

              {isSunday ? (
                /* Sunday Meal Mode */
                <div className="p-6 rounded-lg bg-slate-950/40 border border-slate-900 flex flex-col gap-6">
                  <div>
                    <h4 className="font-display text-xs font-bold text-amber-500 uppercase tracking-wider">
                      Cheat / Reward Meal Allowed
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      On recovery day, you are allowed one reward meal (Pizza, Biriyani, or your favorite food) to reward discipline and restore mental focus.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h5 className="font-display text-xs font-bold text-slate-200 uppercase">
                          🍔 Reward Meal
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Biriyani / Pizza / Favorite Food (One time only)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleToggleRewardMeal}
                      className={`px-4 py-2 rounded text-[10px] font-display font-black tracking-widest uppercase border transition-all cursor-pointer ${
                        nutrition.meals.rewardMeal
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {nutrition.meals.rewardMeal ? '✓ Eaten' : 'Mark Eaten'}
                    </button>
                  </div>

                  {/* Sunday walking requirement details */}
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-display text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4 text-amber-500" />
                        Sunday Recovery Walk (Steps)
                      </h5>
                      <span className={`text-[10px] font-display font-bold ${sundaySteps >= 5000 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {sundaySteps} / 5000 Steps
                      </span>
                    </div>

                    {/* Walk slider/increments */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { playClick(); setSundaySteps(prev => Math.max(0, prev - 1000)) }}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-display font-bold text-slate-400 hover:border-slate-700"
                      >
                        -1000
                      </button>
                      <button
                        onClick={() => { playClick(); setSundaySteps(prev => Math.min(20000, prev + 1000)) }}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-display font-bold text-slate-400 hover:border-slate-700"
                      >
                        +1000
                      </button>
                      <button
                        onClick={() => { playClick(); setSundaySteps(5000) }}
                        className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-display font-bold text-amber-500 hover:border-amber-500/40"
                      >
                        Set 5000
                      </button>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min((sundaySteps / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Normal Day Meal Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mealsConfig.map((meal) => {
                    const isCompleted = nutrition.meals[meal.id]
                    return (
                      <motion.div
                        key={meal.id}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border transition-all duration-300 flex flex-col justify-between gap-4 ${
                          isCompleted
                            ? 'bg-hunter-purple/5 border-hunter-purple/30 shadow-[0_0_12px_rgba(157,78,221,0.08)]'
                            : 'bg-slate-950/40 border-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wide">
                              {meal.title}
                            </h4>
                            {isCompleted && (
                              <span className="text-[9px] font-display font-bold text-hunter-purple uppercase tracking-widest">
                                Completed (+20 XP)
                              </span>
                            )}
                          </div>

                          <ul className="mt-2.5 space-y-1">
                            {meal.items.map((item, idx) => (
                              <li key={idx} className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-hunter-purple" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => {
                            playClick()
                            toggleMeal(meal.id)
                          }}
                          className={`w-full py-2 rounded text-[10px] font-display font-black tracking-widest uppercase border transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-hunter-purple text-white border-hunter-purple hover:bg-hunter-purple/80'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isCompleted ? '✓ Completed' : 'Complete Meal'}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right: RPG Stat Progress Goals */}
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-hunter-blue pl-2.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-hunter-blue" />
                Daily Parameters
              </h3>

              <div className="flex flex-col gap-4">
                
                {/* 1. Hydration Card */}
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <GlassWater className="w-4 h-4 text-sky-400" />
                      <h4 className="font-display text-xs font-bold text-slate-300 uppercase">
                        Hydration Goal
                      </h4>
                    </div>
                    <span className="text-[10px] font-display font-black text-sky-400">
                      {nutrition.water.toFixed(2)}L / 3.0L
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { playClick(); addWater(0.25) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-sky-400/40"
                    >
                      +250ml
                    </button>
                    <button
                      onClick={() => { playClick(); addWater(0.5) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-sky-400/40"
                    >
                      +500ml
                    </button>
                    <button
                      onClick={() => { playClick(); addWater(1.0) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-sky-400/40"
                    >
                      +1L
                    </button>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-sky-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min((nutrition.water / 3.0) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Protein Card */}
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <h4 className="font-display text-xs font-bold text-slate-300 uppercase">
                        Protein Intake
                      </h4>
                    </div>
                    <span className="text-[10px] font-display font-black text-red-500">
                      {nutrition.protein}g / 100g
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { playClick(); addProtein(10) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-red-500/40"
                    >
                      +10g
                    </button>
                    <button
                      onClick={() => { playClick(); addProtein(25) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-red-500/40"
                    >
                      +25g
                    </button>
                    <button
                      onClick={() => { playClick(); addProtein(50) }}
                      className="flex-grow py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-red-500/40"
                    >
                      +50g
                    </button>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min((nutrition.protein / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Fruits Card */}
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-display text-xs font-bold text-slate-300 uppercase">
                        Fruits Servings
                      </h4>
                    </div>
                    <span className="text-[10px] font-display font-black text-emerald-400">
                      {nutrition.fruits} / 2 Servings
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={nutrition.fruits >= 10}
                      onClick={() => { playClick(); addFruits(1) }}
                      className="w-full py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-emerald-400/45 cursor-pointer"
                    >
                      +1 Serving
                    </button>
                    <button
                      disabled={nutrition.fruits <= 0}
                      onClick={() => { playClick(); addFruits(-1) }}
                      className="w-full py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-slate-700 cursor-pointer"
                    >
                      -1 Serving
                    </button>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min((nutrition.fruits / 2) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 4. Vegetables Card */}
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-900 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Salad className="w-4 h-4 text-lime-400" />
                      <h4 className="font-display text-xs font-bold text-slate-300 uppercase">
                        Vegetables Servings
                      </h4>
                    </div>
                    <span className="text-[10px] font-display font-black text-lime-400">
                      {nutrition.vegetables} / 2 Servings
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={nutrition.vegetables >= 10}
                      onClick={() => { playClick(); addVegetables(1) }}
                      className="w-full py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-lime-400/45 cursor-pointer"
                    >
                      +1 Serving
                    </button>
                    <button
                      disabled={nutrition.vegetables <= 0}
                      onClick={() => { playClick(); addVegetables(-1) }}
                      className="w-full py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-display font-bold text-slate-300 hover:border-slate-700 cursor-pointer"
                    >
                      -1 Serving
                    </button>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-lime-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min((nutrition.vegetables / 2) * 100, 100)}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Badges showcase section */}
          <div className="mt-12 border-t border-slate-900 pt-8">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6 pl-2.5 border-l-2 border-hunter-gold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-hunter-gold" />
              SYSTEM ACHIEVEMENTS & BADGES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Badge 1: Protein Master */}
              <div className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${
                nutrition.badges.includes('hydration_hunter') || nutrition.proteinDaysCount >= 30
                  ? 'bg-hunter-gold/5 border-hunter-gold/30 shadow-[0_0_12px_rgba(255,183,3,0.1)]'
                  : 'bg-slate-950/20 border-slate-900 opacity-60'
              }`}>
                <div className="p-3 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Trophy className={`w-6 h-6 ${nutrition.proteinDaysCount >= 30 ? 'text-hunter-gold' : 'text-slate-600'}`} />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-slate-200 uppercase">
                    🏆 Protein Master
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Complete protein goal (100g) for 30 days.
                  </p>
                  <span className="text-[9px] font-semibold text-hunter-gold block mt-1 uppercase">
                    Progress: {nutrition.proteinDaysCount} / 30 Days
                  </span>
                </div>
              </div>

              {/* Badge 2: Hydration Hunter */}
              <div className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${
                nutrition.badges.includes('hydration_hunter')
                  ? 'bg-sky-500/5 border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.1)]'
                  : 'bg-slate-950/20 border-slate-900 opacity-60'
              }`}>
                <div className="p-3 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Award className={`w-6 h-6 ${nutrition.badges.includes('hydration_hunter') ? 'text-sky-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-slate-200 uppercase">
                    🏆 Hydration Hunter
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Drink 3L water for 30 days.
                  </p>
                  <span className="text-[9px] font-semibold text-sky-400 block mt-1 uppercase">
                    Progress: {nutrition.waterDaysCount} / 30 Days
                  </span>
                </div>
              </div>

              {/* Badge 3: Discipline Monarch */}
              <div className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${
                nutrition.badges.includes('discipline_monarch')
                  ? 'bg-hunter-purple/5 border-hunter-purple/30 shadow-[0_0_12px_rgba(157,78,221,0.1)]'
                  : 'bg-slate-950/20 border-slate-900 opacity-60'
              }`}>
                <div className="p-3 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Star className={`w-6 h-6 ${nutrition.badges.includes('discipline_monarch') ? 'text-hunter-purple' : 'text-slate-600'}`} />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-slate-200 uppercase">
                    🏆 Discipline Monarch
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Complete nutrition quest for 90 days.
                  </p>
                  <span className="text-[9px] font-semibold text-hunter-purple block mt-1 uppercase">
                    Progress: {nutrition.fullQuestDaysCount} / 90 Days
                  </span>
                </div>
              </div>

            </div>
          </div>

        </SystemWindow>

        {/* Modal 1: Full Nutrition Quest Complete Alert */}
        <Modal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title="SYSTEM MESSAGE: NUTRITION QUEST COMPLETE"
          variant="gold"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none">
            <div className="relative w-20 h-20 rounded-full bg-hunter-gold/15 border border-hunter-gold flex items-center justify-center shadow-[0_0_20px_rgba(255,183,3,0.4)]">
              <Trophy className="w-10 h-10 text-hunter-gold animate-bounce" />
            </div>

            <h3 className="font-display text-base font-black text-hunter-gold uppercase tracking-wider">
              YOU HAVE BECOME HEALTHIER!
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm">
              Your metabolic rate is optimized. The nutrients are successfully absorbed. Cellular repair accelerated.
            </p>

            <div className="mt-2 w-full border border-slate-800 bg-slate-950/80 p-3 rounded text-left flex flex-col gap-1 text-[10px] font-display font-semibold uppercase text-slate-400">
              <div className="flex justify-between text-hunter-gold font-bold">
                <span>XP REWARD:</span>
                <span>+150 XP</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>HEALTH STAT:</span>
                <span>+3 POINTS</span>
              </div>
              <div className="flex justify-between text-teal-400">
                <span>RECOVERY STAT:</span>
                <span>+3 POINTS</span>
              </div>
              <div className="flex justify-between text-indigo-400">
                <span>DISCIPLINE STAT:</span>
                <span>+5 POINTS</span>
              </div>
              <div className="flex justify-between text-yellow-400">
                <span>ENERGY STAT:</span>
                <span>+5 POINTS</span>
              </div>
            </div>

            <button
              onClick={() => setShowCompleteModal(false)}
              className="w-full mt-4 py-2.5 rounded bg-hunter-gold text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_12px_rgba(255,183,3,0.4)] border-none transition-all"
            >
              Acknowledge Upgrades
            </button>
          </div>
        </Modal>

        {/* Modal 2: Sunday Cheat Reward Alert */}
        <Modal
          isOpen={showSundayRewardModal}
          onClose={() => setShowSundayRewardModal(false)}
          title="SYSTEM MESSAGE: RECOVERY REFUEL ABSORPTION"
          variant="blue"
        >
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 select-none">
            <div className="relative w-20 h-20 rounded-full bg-hunter-blue/10 border border-hunter-blue flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Star className="w-10 h-10 text-hunter-blue animate-pulse" />
            </div>

            <h3 className="font-display text-base font-black text-hunter-blue uppercase tracking-wider">
              REWARD MEAL CONSUMED
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm">
              Your mental fatigue has vanished. Happiness and mental health parameters are temporarily upgraded.
            </p>

            <div className="mt-2 w-full border border-slate-800 bg-slate-950/80 p-3 rounded text-left flex flex-col gap-1 text-[10px] font-display font-semibold uppercase text-slate-400">
              <div className="flex justify-between text-sky-400 font-bold">
                <span>HAPPINESS STAT:</span>
                <span>+10</span>
              </div>
              <div className="flex justify-between text-hunter-purple font-bold">
                <span>MENTAL RECOVERY:</span>
                <span>+10</span>
              </div>
            </div>

            <button
              onClick={() => setShowSundayRewardModal(false)}
              className="w-full mt-4 py-2.5 rounded bg-hunter-blue text-hunter-bg font-display font-black text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)] border-none transition-all"
            >
              Arise!
            </button>
          </div>
        </Modal>

      </div>
    </div>
  )
}
