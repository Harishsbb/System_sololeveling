import { create } from 'zustand'
import defaultHunters from '../data/hunters.json'
import defaultSkills from '../data/skills.json'
import defaultDungeons from '../data/dungeons.json'

export interface Stats {
  strength: number
  agility: number
  intelligence: number
  endurance: number
  mana: number
  focus: number
  discipline: number
  health: number
  recovery: number
  energy: number
  problemSolving?: number
  communication?: number
}

export interface PlayerDeveloperQuest {
  devLevel: number
  devXp: number
  devXpNeeded: number
  dsaSolved: number
  codingStreak: number
  projectHours: number
  javaProgress: string[]
  dsaProgress: string[]
  frontendProgress: string[]
  backendProgress: string[]
  devopsProgress: string[]
  communicationMinutes: number
  mockInterviewHistory: string[]
  projectProgress: string[]
  lastClaimedDate: string
  achievements: string[]
  
  // Daily progress
  dailyJavaDsaMin: number
  dailyFullStackMin: number
  dailyCodingProblems: number
  dailyCommMin: number
  dailyProjMin: number

  // Fallbacks for compatibility
  aptitudeQuestions?: number
  dailyJavaMin?: number
  dailyDsaSolved?: number
  dailyAptitudeSolved?: number
}

export interface PlayerNutrition {
  meals: {
    morningFuel: boolean
    breakfast: boolean
    lunch: boolean
    preWorkout: boolean
    postWorkout: boolean
    dinner: boolean
    rewardMeal: boolean
  }
  water: number
  protein: number
  fruits: number
  vegetables: number
  streak: number
  badges: string[]
  proteinDaysCount: number
  waterDaysCount: number
  fullQuestDaysCount: number
  lastUpdatedDate: string
}

export interface Player {
  name: string
  title: string
  rank: string
  level: number
  xp: number
  xpNeeded: number
  stats: Stats
  statPoints: number
  gold: number
  nutrition?: PlayerNutrition
  developer?: PlayerDeveloperQuest
  workoutHistory?: {
    id: string
    date: string
    exercise: string
    amount: number
    xpEarned: number
  }[]
}

export interface SkillNodeData {
  id: string
  name: string
  description: string
  level: number
  maxLevel: number
  manaCost: number
  cooldown: number
  icon: string
  category: string
  requiredLevel: number
  unlocked: boolean
  cost: number
}

export interface Task {
  id: string
  name: string
  current: number
  target: number
}

export interface Quest {
  id: string
  name: string
  description: string
  type: string
  status: 'active' | 'completed' | 'rewarded' | 'failed'
  tasks: Task[]
  rewards: {
    xp: number
    statPoints: number
    gold: number
    box: string
  }
}

export interface Dungeon {
  id: string
  name: string
  rank: string
  bossName: string
  dangerLevel: string
  reward: string
  description: string
  manaRequired: number
  xpReward: number
}

export const getCurrentDayCount = (): number => {
  const startDate = new Date('2026-06-21T00:00:00')
  const today = new Date()
  const diffTime = today.getTime() - startDate.getTime()
  return Math.max(1, Math.min(90, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1))
}

export const getQuestForDayCount = (dayCount: number, currentTasks?: Task[]): Quest => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1-6 = Mon-Sat

  if (dayOfWeek === 0) {
    // Sunday - Rest/Recovery Day
    const tasksConfig = [
      { id: 'walking', name: 'Walking (Steps)', target: 5000 },
      { id: 'stretching', name: 'Stretching (Minutes)', target: 10 },
      { id: 'meditation', name: 'Meditation (Minutes)', target: 10 }
    ]
    const tasks = tasksConfig.map((cfg) => {
      const existing = currentTasks?.find((t) => t.id === cfg.id)
      return {
        id: cfg.id,
        name: cfg.name,
        current: existing ? existing.current : 0,
        target: cfg.target
      }
    })
    return {
      id: "daily_training",
      name: "RECOVERY QUEST ACTIVATED",
      description: "Recovery Day Activated. Muscles are rebuilding. Focus on light movement and stretching. No penalty today.",
      type: "daily",
      status: "active",
      tasks,
      rewards: { xp: 100, statPoints: 0, gold: 50, box: "Recovery Elixir" }
    }
  }

  // Monday - Saturday (Normal Daily Quest based on day count)
  let tasksConfig: { id: string; name: string; target: number }[] = []
  let rewards = { xp: 200, statPoints: 0, gold: 200, box: "Random Loot Box" }
  let name = ""

  if (dayCount <= 30) {
    name = "Daily Quest: E-Rank Beginner Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 30 },
      { id: 'squats', name: 'Squats', target: 50 },
      { id: 'walking', name: 'Walking (Steps)', target: 8000 },
      { id: 'plank', name: 'Plank (Minutes)', target: 3 },
      { id: 'meditation', name: 'Meditation (Minutes)', target: 10 },
      { id: 'hanging', name: 'Hanging (Seconds)', target: 90 },
      { id: 'cobra_stretch', name: 'Cobra Stretch (Sets)', target: 3 },
      { id: 'cat_cow', name: 'Cat-Cow (Minutes)', target: 2 },
      { id: 'wall_posture', name: 'Wall Posture (Minutes)', target: 3 }
    ]
    rewards = { xp: 200, statPoints: 0, gold: 200, box: "Random Loot Box" }
  } else if (dayCount <= 60) {
    name = "Daily Quest: B-Rank Intermediate Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 60 },
      { id: 'squats', name: 'Squats', target: 80 },
      { id: 'walking', name: 'Walking (Steps)', target: 10000 },
      { id: 'plank', name: 'Plank (Minutes)', target: 5 },
      { id: 'meditation', name: 'Meditation (Minutes)', target: 15 },
      { id: 'stretching', name: 'Stretching (Minutes)', target: 15 }
    ]
    rewards = { xp: 200, statPoints: 0, gold: 300, box: "Elixir of Life" }
  } else {
    name = "Daily Quest: S-Rank Monarch Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 100 },
      { id: 'squats', name: 'Squats', target: 100 },
      { id: 'running', name: 'Running (KM)', target: 5 },
      { id: 'plank', name: 'Plank (Minutes)', target: 10 },
      { id: 'meditation', name: 'Meditation (Minutes)', target: 20 },
      { id: 'stretching', name: 'Stretching (Minutes)', target: 20 }
    ]
    rewards = { xp: 200, statPoints: 0, gold: 500, box: "Monarch Chest" }
  }

  const tasks = tasksConfig.map((cfg) => {
    const existing = currentTasks?.find((t) => t.id === cfg.id)
    return {
      id: cfg.id,
      name: cfg.name,
      current: existing ? existing.current : 0,
      target: cfg.target
    }
  })

  return {
    id: "daily_training",
    name,
    description: "Complete the training regimen. WARNING: Failure to complete this daily quest before midnight will result in a Penalty Quest.",
    type: "daily",
    status: "active",
    tasks,
    rewards
  }
}

export interface ShadowSoldier {
  id: string
  name: string
  type: string
  rank: string
  skills: string[]
  stats: {
    strength: number
    hp: number
    mana: number
  }
  unlocked: boolean
  unlockCostGold: number
  unlockCostMana: number
  description: string
}

const defaultShadows: ShadowSoldier[] = [
  {
    id: "shadow_knight",
    name: "Igris (Shadow Knight)",
    type: "Knight",
    rank: "Elite Knight",
    skills: ["Dominator's Touch", "Sword Dance", "Absolute Loyalty"],
    stats: { strength: 85, hp: 1200, mana: 300 },
    unlocked: true, // Start with Igris unlocked or unlockable
    unlockCostGold: 0,
    unlockCostMana: 0,
    description: "The commander of Quantum Ghost's shadow knights. He is a master swordsman who once guarded the empty throne room."
  },
  {
    id: "shadow_assassin",
    name: "Kaysel (Shadow Wyvern)",
    type: "Assassin",
    rank: "Knight",
    skills: ["Supersonic Flight", "Tail Whip", "Draconic Roar"],
    stats: { strength: 70, hp: 950, mana: 400 },
    unlocked: false,
    unlockCostGold: 2000,
    unlockCostMana: 100,
    description: "The shadow wyvern extracted from the drake mount of Demon King Baran. Serves as swift aerial transportation."
  },
  {
    id: "shadow_mage",
    name: "Tusk (Shadow High Orc)",
    type: "Mage",
    rank: "Elite Knight",
    skills: ["Hymn of Giants", "Gravity Magic", "Firestorm Shamanism"],
    stats: { strength: 90, hp: 1400, mana: 800 },
    unlocked: false,
    unlockCostGold: 5000,
    unlockCostMana: 250,
    description: "Extracted from Kargalgan, the High Orc Shaman. Commands massive gravitational and elemental magic."
  },
  {
    id: "shadow_beast",
    name: "Tank (Shadow Ice Bear)",
    type: "Beast",
    rank: "Knight",
    skills: ["Beast Roar", "Tear & Claw", "Ice Armor"],
    stats: { strength: 95, hp: 1800, mana: 150 },
    unlocked: false,
    unlockCostGold: 1500,
    unlockCostMana: 80,
    description: "Extracted from the alpha ice bear inside the Red Gate. Possesses incredible raw durability and charge speed."
  }
]

interface GameState {
  soundEnabled: boolean
  player: Player
  skills: SkillNodeData[]
  quests: Quest[]
  dungeons: Dungeon[]
  shadows: ShadowSoldier[]
  levelUpNotification: boolean
  devLevelUpNotification: boolean
  questCompleteNotification: string | null

  toggleSound: () => void
  addStatPoint: (statName: keyof Stats) => void
  addXp: (amount: number) => boolean // returns true if leveled up
  updateQuestProgress: (taskId: string, currentVal: number) => void
  claimQuestRewards: (questId: string) => void
  resetQuest: (questId: string) => void
  unlockSkill: (skillId: string) => boolean
  unlockShadow: (shadowId: string) => boolean
  completeDungeon: (dungeonId: string) => { success: boolean; xpGained: number; goldGained: number }
  dismissLevelUp: () => void
  dismissDevLevelUp: () => void
  dismissQuestComplete: () => void
  upgradeRank: () => boolean
  checkDailyQuestExpiry: () => void
  toggleMeal: (mealId: keyof PlayerNutrition['meals']) => void
  addWater: (amount: number) => void
  addProtein: (amount: number) => void
  addFruits: (amount: number) => void
  addVegetables: (amount: number) => void
  claimFullNutritionRewards: () => void
  checkNutritionDailyReset: () => void
  updateDevQuestProgress: (taskId: string, amount: number) => void
  toggleJavaTopic: (topicId: string, category?: string) => void
  claimDevQuestRewards: () => void
  checkDevDailyReset: () => void
  resetSystem: () => Promise<void>
  logWorkout: (exercise: string, amount: number, xpEarned: number) => void
}

// Load initial state from localstorage or use defaults
const getSavedState = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return defaultValue
    }
  }
  return defaultValue
}

const defaultNutrition: PlayerNutrition = {
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

const defaultDeveloper: PlayerDeveloperQuest = {
  devLevel: 1,
  devXp: 0,
  devXpNeeded: 1000,
  dsaSolved: 0,
  codingStreak: 0,
  projectHours: 0,
  javaProgress: [],
  dsaProgress: [],
  frontendProgress: [],
  backendProgress: [],
  devopsProgress: [],
  communicationMinutes: 0,
  mockInterviewHistory: [],
  projectProgress: [],
  lastClaimedDate: '',
  achievements: [],
  dailyJavaDsaMin: 0,
  dailyFullStackMin: 0,
  dailyCodingProblems: 0,
  dailyCommMin: 0,
  dailyProjMin: 0,
  aptitudeQuestions: 0,
  dailyJavaMin: 0,
  dailyDsaSolved: 0,
  dailyAptitudeSolved: 0
}

export const useGameStore = create<GameState>((set, get) => ({
  soundEnabled: getSavedState('sl_sound_enabled', true),
  player: (() => {
    const saved = getSavedState('sl_player', defaultHunters as Player)
    if (saved && saved.stats) {
      if (saved.stats.focus === undefined) saved.stats.focus = 10
      if (saved.stats.discipline === undefined) saved.stats.discipline = 10
      if (saved.stats.health === undefined) saved.stats.health = 100
      if (saved.stats.recovery === undefined) saved.stats.recovery = 10
      if (saved.stats.energy === undefined) saved.stats.energy = 100
      if (saved.stats.problemSolving === undefined) saved.stats.problemSolving = 10
      if (saved.stats.communication === undefined) saved.stats.communication = 10
    }
    if (!saved.nutrition) {
      saved.nutrition = defaultNutrition
    }
    if (!saved.developer) {
      saved.developer = defaultDeveloper
    }
    if (saved.name !== defaultHunters.name) {
      saved.name = defaultHunters.name
      localStorage.setItem('sl_player', JSON.stringify(saved))
    }
    return saved
  })(),
  skills: getSavedState('sl_skills', defaultSkills as SkillNodeData[]),
  quests: (() => {
    const saved = getSavedState('sl_quests', null as Quest[] | null)
    const dayCount = getCurrentDayCount()
    
    if (saved && saved.length > 0) {
      const hasSitups = saved[0].tasks?.some((t) => t.id === 'situps')
      const updatedQuest = getQuestForDayCount(dayCount, hasSitups ? undefined : saved[0].tasks)
      if (hasSitups) {
        updatedQuest.status = 'active'
      } else {
        updatedQuest.status = saved[0].status
      }
      const result = [updatedQuest]
      localStorage.setItem('sl_quests', JSON.stringify(result))
      return result
    } else {
      const result = [getQuestForDayCount(dayCount)]
      localStorage.setItem('sl_quests', JSON.stringify(result))
      return result
    }
  })(),
  dungeons: getSavedState('sl_dungeons', defaultDungeons as Dungeon[]),
  shadows: getSavedState('sl_shadows', defaultShadows),
  levelUpNotification: false,
  devLevelUpNotification: false,
  questCompleteNotification: null,

  toggleSound: () => set((state) => {
    const newVal = !state.soundEnabled
    localStorage.setItem('sl_sound_enabled', JSON.stringify(newVal))
    return { soundEnabled: newVal }
  }),

  addStatPoint: (statName) => set((state) => {
    if (state.player.statPoints <= 0) return {}

    const updatedStats = {
      ...state.player.stats,
      [statName]: (state.player.stats[statName] || 0) + 1
    }

    const updatedPlayer = {
      ...state.player,
      stats: updatedStats,
      statPoints: state.player.statPoints - 1
    }

    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  }),

  addXp: (amount) => {
    let leveledUp = false
    set((state) => {
      let currentXp = state.player.xp + amount
      let level = state.player.level
      let xpNeeded = state.player.xpNeeded
      let statPoints = state.player.statPoints

      while (currentXp >= xpNeeded && level < 100) {
        leveledUp = true
        currentXp -= xpNeeded
        level += 1
        xpNeeded = Math.round(xpNeeded * 1.4)
        statPoints += 5
      }

      if (level >= 100) {
        currentXp = 0
      }

      const updatedPlayer = {
        ...state.player,
        level,
        xp: currentXp,
        xpNeeded,
        statPoints
      }

      let updatedQuests = state.quests
      if (leveledUp) {
        const dayCount = getCurrentDayCount()
        const updatedQuest = getQuestForDayCount(dayCount, state.quests[0]?.tasks)
        updatedQuest.status = state.quests[0]?.status || 'active'
        updatedQuests = state.quests.map(q => q.id === 'daily_training' ? updatedQuest : q)
        localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
      }

      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      return {
        player: updatedPlayer,
        quests: updatedQuests,
        levelUpNotification: leveledUp ? true : state.levelUpNotification
      }
    })
    return leveledUp
  },

  updateQuestProgress: (taskId, currentVal) => set((state) => {
    let focusIncremented = false
    const dailyQuest = state.quests.find(q => q.type === 'daily')
    const meditationTask = dailyQuest?.tasks.find(t => t.id === 'meditation')
    if (taskId === 'meditation' && meditationTask && currentVal >= meditationTask.target && meditationTask.current < meditationTask.target) {
      focusIncremented = true
    }

    const updatedQuests = state.quests.map((q) => {
      if (q.status !== 'active') return q

      const updatedTasks = q.tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, current: Math.min(currentVal, t.target) }
        }
        return t
      })

      const allCompleted = updatedTasks.every((t) => t.current >= t.target)

      return {
        ...q,
        tasks: updatedTasks,
        status: allCompleted ? 'completed' as const : 'active' as const
      }
    })

    const wasCompleted = state.quests.some(q => q.status === 'active') &&
      updatedQuests.some(q => q.status === 'completed')

    let player = state.player
    if (focusIncremented) {
      player = {
        ...state.player,
        stats: {
          ...state.player.stats,
          focus: state.player.stats.focus + 1
        }
      }
      localStorage.setItem('sl_player', JSON.stringify(player))
    }

    localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
    return {
      player,
      quests: updatedQuests,
      questCompleteNotification: wasCompleted ? "Daily Training Regimen Completed! Arise to claim rewards." : state.questCompleteNotification
    }
  }),

  claimQuestRewards: (questId) => {
    const state = get()
    const quest = state.quests.find((q) => q.id === questId)
    if (!quest || quest.status !== 'completed') return

    const rewards = quest.rewards

    state.addXp(rewards.xp)

    // Add other rewards
    set((state) => {
      let updatedStats = { ...state.player.stats }
      if (questId === 'daily_training') {
        updatedStats.strength = (updatedStats.strength || 10) + 5
        updatedStats.endurance = (updatedStats.endurance || 10) + 5
        updatedStats.health = (updatedStats.health || 100) + 5
        updatedStats.discipline = (updatedStats.discipline || 10) + 5
      }

      const updatedPlayer = {
        ...state.player,
        stats: updatedStats,
        statPoints: state.player.statPoints + rewards.statPoints,
        gold: state.player.gold + rewards.gold
      }

      const updatedQuests = state.quests.map((q) => {
        if (q.id === questId) {
          return { ...q, status: 'rewarded' as const }
        }
        return q
      })

      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
      return {
        player: updatedPlayer,
        quests: updatedQuests
      }
    })
  },

  resetQuest: (questId) => set((state) => {
    const updatedQuests = state.quests.map((q) => {
      if (q.id === questId) {
        const dayCount = getCurrentDayCount()
        const freshQuest = getQuestForDayCount(dayCount)
        return {
          ...freshQuest,
          status: 'active' as const
        }
      }
      return q
    })

    localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
    return { quests: updatedQuests }
  }),

  unlockSkill: (skillId) => {
    const state = get()
    const skill = state.skills.find(s => s.id === skillId)
    if (!skill || skill.unlocked) return false

    // Check level & gold/points criteria
    if (state.player.level < skill.requiredLevel) return false
    if (state.player.gold < skill.cost) return false

    set((state) => {
      const updatedPlayer = {
        ...state.player,
        gold: state.player.gold - skill.cost
      }

      const updatedSkills = state.skills.map((s) => {
        if (s.id === skillId) {
          return { ...s, unlocked: true }
        }
        return s
      })

      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      localStorage.setItem('sl_skills', JSON.stringify(updatedSkills))
      return {
        player: updatedPlayer,
        skills: updatedSkills
      }
    })
    return true
  },

  unlockShadow: (shadowId) => {
    const state = get()
    const shadow = state.shadows.find(s => s.id === shadowId)
    if (!shadow || shadow.unlocked) return false

    if (state.player.gold < shadow.unlockCostGold) return false

    // check mana requirements - user must have enough Intelligence/Mana points
    if (state.player.stats.mana < shadow.unlockCostMana) return false

    set((state) => {
      const updatedPlayer = {
        ...state.player,
        gold: state.player.gold - shadow.unlockCostGold
      }

      const updatedShadows = state.shadows.map((s) => {
        if (s.id === shadowId) {
          return { ...s, unlocked: true }
        }
        return s
      })

      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      localStorage.setItem('sl_shadows', JSON.stringify(updatedShadows))
      return {
        player: updatedPlayer,
        shadows: updatedShadows
      }
    })
    return true
  },

  completeDungeon: (dungeonId) => {
    const state = get()
    const dungeon = state.dungeons.find(d => d.id === dungeonId)
    if (!dungeon) return { success: false, xpGained: 0, goldGained: 0 }

    // Deduct mana as energy cost or check if mana is enough
    if (state.player.stats.mana < dungeon.manaRequired) {
      return { success: false, xpGained: 0, goldGained: 0 }
    }

    const goldGained = Math.round(dungeon.xpReward * 0.4)
    state.addXp(dungeon.xpReward)

    set((state) => {
      const updatedPlayer = {
        ...state.player,
        gold: state.player.gold + goldGained
      }
      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      return { player: updatedPlayer }
    })

    return { success: true, xpGained: dungeon.xpReward, goldGained }
  },

  upgradeRank: () => {
    const state = get()
    const level = state.player.level
    const currentRank = state.player.rank
    let newRank = currentRank

    if (level >= 70) newRank = 'SSS'
    else if (level >= 50) newRank = 'S'
    else if (level >= 40) newRank = 'A'
    else if (level >= 30) newRank = 'B'
    else if (level >= 20) newRank = 'C'
    else if (level >= 10) newRank = 'D'
    else newRank = 'E'

    if (newRank !== currentRank) {
      set((state) => {
        const updatedPlayer = {
          ...state.player,
          rank: newRank
        }
        localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
        return { player: updatedPlayer }
      })
      return true
    }
    return false
  },

  checkDailyQuestExpiry: () => set((state) => {
    const lastActiveDate = localStorage.getItem('sl_last_active_date')
    const todayString = new Date().toDateString()
    let updatedQuests = state.quests
    
    if (lastActiveDate && lastActiveDate !== todayString) {
      const lastDate = new Date(lastActiveDate)
      const wasSunday = lastDate.getDay() === 0

      updatedQuests = state.quests.map((q) => {
        if (q.id === 'daily_training' && q.status === 'active') {
          if (wasSunday) {
            return q
          }
          return { ...q, status: 'failed' as const }
        }
        return q
      })
      localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
    }
    
    localStorage.setItem('sl_last_active_date', todayString)
    return { quests: updatedQuests }
  }),

  toggleMeal: (mealId) => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    const currentStatus = nutrition.meals[mealId]
    
    const updatedMeals = {
      ...nutrition.meals,
      [mealId]: !currentStatus
    }
    
    let xpGain = 0
    if (!currentStatus) {
      xpGain = 20
    }
    
    const updatedPlayer = {
      ...state.player,
      nutrition: {
        ...nutrition,
        meals: updatedMeals
      }
    }
    
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    
    if (xpGain > 0) {
      setTimeout(() => {
        get().addXp(20)
      }, 50)
    }
    
    return { player: updatedPlayer }
  }),

  addWater: (amount) => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    const oldWater = nutrition.water
    const newWater = Math.max(0, Math.min(10, oldWater + amount))
    
    let xpGain = 0
    let waterDaysCount = nutrition.waterDaysCount
    const updatedBadges = [...nutrition.badges]
    
    if (oldWater < 3.0 && newWater >= 3.0) {
      xpGain = 50
      waterDaysCount += 1
      if (waterDaysCount >= 30 && !updatedBadges.includes('hydration_hunter')) {
        updatedBadges.push('hydration_hunter')
      }
    }
    
    const updatedPlayer = {
      ...state.player,
      nutrition: {
        ...nutrition,
        water: newWater,
        waterDaysCount,
        badges: updatedBadges
      }
    }
    
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    
    if (xpGain > 0) {
      setTimeout(() => {
        get().addXp(50)
      }, 50)
    }
    
    return { player: updatedPlayer }
  }),

  addProtein: (amount) => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    const oldProtein = nutrition.protein
    const newProtein = Math.max(0, Math.min(500, oldProtein + amount))
    
    let xpGain = 0
    let proteinDaysCount = nutrition.proteinDaysCount
    const updatedBadges = [...nutrition.badges]
    
    if (oldProtein < 100 && newProtein >= 100) {
      xpGain = 50
      proteinDaysCount += 1
      if (proteinDaysCount >= 30 && !updatedBadges.includes('protein_master')) {
        updatedBadges.push('protein_master')
      }
    }
    
    const updatedPlayer = {
      ...state.player,
      nutrition: {
        ...nutrition,
        protein: newProtein,
        proteinDaysCount,
        badges: updatedBadges
      }
    }
    
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    
    if (xpGain > 0) {
      setTimeout(() => {
        get().addXp(50)
      }, 50)
    }
    
    return { player: updatedPlayer }
  }),

  addFruits: (amount) => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    const newFruits = Math.max(0, Math.min(10, nutrition.fruits + amount))
    const updatedPlayer = {
      ...state.player,
      nutrition: { ...nutrition, fruits: newFruits }
    }
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  }),

  addVegetables: (amount) => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    const newVeg = Math.max(0, Math.min(10, nutrition.vegetables + amount))
    const updatedPlayer = {
      ...state.player,
      nutrition: { ...nutrition, vegetables: newVeg }
    }
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  }),

  claimFullNutritionRewards: () => set((state) => {
    const nutrition = state.player.nutrition || defaultNutrition
    let fullQuestDaysCount = nutrition.fullQuestDaysCount + 1
    const updatedBadges = [...nutrition.badges]
    
    if (fullQuestDaysCount >= 90 && !updatedBadges.includes('discipline_monarch')) {
      updatedBadges.push('discipline_monarch')
    }
    
    const updatedStats = {
      ...state.player.stats,
      health: (state.player.stats.health || 100) + 3,
      recovery: (state.player.stats.recovery || 10) + 3,
      discipline: (state.player.stats.discipline || 10) + 5,
      energy: (state.player.stats.energy || 100) + 5
    }
    
    const updatedPlayer = {
      ...state.player,
      stats: updatedStats,
      nutrition: {
        ...nutrition,
        fullQuestDaysCount,
        badges: updatedBadges
      }
    }
    
    localStorage.setItem('sl_nutrition_today_completed', 'true')
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    
    setTimeout(() => {
      get().addXp(150)
    }, 50)
    
    return { player: updatedPlayer }
  }),

  checkNutritionDailyReset: () => set((state) => {
    const todayStr = new Date().toDateString()
    const lastDate = localStorage.getItem('sl_nutrition_last_date')
    
    if (lastDate && lastDate !== todayStr) {
      const nutrition = state.player.nutrition || defaultNutrition
      const todayCompletedYesterday = localStorage.getItem('sl_nutrition_today_completed') === 'true'
      
      let newStreak = nutrition.streak
      if (todayCompletedYesterday) {
        newStreak += 1
      } else {
        newStreak = 0
      }
      
      const resetMeals = {
        morningFuel: false,
        breakfast: false,
        lunch: false,
        preWorkout: false,
        postWorkout: false,
        dinner: false,
        rewardMeal: false
      }
      
      const updatedPlayer = {
        ...state.player,
        nutrition: {
          ...nutrition,
          meals: resetMeals,
          water: 0,
          protein: 0,
          fruits: 0,
          vegetables: 0,
          streak: newStreak
        }
      }
      
      localStorage.setItem('sl_nutrition_today_completed', 'false')
      localStorage.setItem('sl_nutrition_last_date', todayStr)
      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
      
      return { player: updatedPlayer }
    }
    
    if (!lastDate) {
      localStorage.setItem('sl_nutrition_last_date', todayStr)
    }
    return {}
  }),

  dismissLevelUp: () => set({ levelUpNotification: false }),
  dismissDevLevelUp: () => set({ devLevelUpNotification: false }),
  dismissQuestComplete: () => set({ questCompleteNotification: null }),

  updateDevQuestProgress: (taskId, amount) => set((state) => {
    const dev = state.player.developer || defaultDeveloper
    let dsaDiff = 0
    let commDiff = 0
    let projDiff = 0

    const updatedDev = { ...dev }

    if (taskId === 'dailyJavaDsaMin') {
      updatedDev.dailyJavaDsaMin = Math.max(0, Math.min(90, (dev.dailyJavaDsaMin || 0) + amount))
    } else if (taskId === 'dailyFullStackMin') {
      updatedDev.dailyFullStackMin = Math.max(0, Math.min(120, (dev.dailyFullStackMin || 0) + amount))
    } else if (taskId === 'dailyCodingProblems') {
      const oldDsa = dev.dailyCodingProblems || 0
      updatedDev.dailyCodingProblems = Math.max(0, Math.min(3, (dev.dailyCodingProblems || 0) + amount))
      dsaDiff = updatedDev.dailyCodingProblems - oldDsa
    } else if (taskId === 'dailyCommMin') {
      const oldComm = dev.dailyCommMin || 0
      updatedDev.dailyCommMin = Math.max(0, Math.min(20, (dev.dailyCommMin || 0) + amount))
      commDiff = updatedDev.dailyCommMin - oldComm
    } else if (taskId === 'dailyProjMin') {
      const oldProj = dev.dailyProjMin || 0
      updatedDev.dailyProjMin = Math.max(0, Math.min(60, (dev.dailyProjMin || 0) + amount))
      projDiff = updatedDev.dailyProjMin - oldProj
    }

    // Add to lifetime stats
    updatedDev.dsaSolved = (updatedDev.dsaSolved || 0) + dsaDiff
    updatedDev.communicationMinutes = (updatedDev.communicationMinutes || 0) + commDiff
    updatedDev.projectHours = Number(((updatedDev.projectHours || 0) + (projDiff / 60)).toFixed(2))

    // Handle Achievements
    const achievements = [...(updatedDev.achievements || [])]
    if (updatedDev.dsaSolved >= 50 && !achievements.includes('code_hunter')) {
      achievements.push('code_hunter')
    }
    if (updatedDev.dsaSolved >= 100 && !achievements.includes('algorithm_knight')) {
      achievements.push('algorithm_knight')
    }
    if ((updatedDev.javaProgress?.length || 0) >= 16 && !achievements.includes('java_master')) {
      achievements.push('java_master')
    }
    const currentDay = getCurrentDayCount()
    if (currentDay >= 90 && !achievements.includes('placement_monarch')) {
      achievements.push('placement_monarch')
    }
    updatedDev.achievements = achievements

    const updatedPlayer = {
      ...state.player,
      developer: updatedDev
    }
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  }),

  toggleJavaTopic: (topicId, category = 'javaProgress') => set((state) => {
    const dev = state.player.developer || defaultDeveloper
    const catKey = category as keyof PlayerDeveloperQuest
    const currentArray = Array.isArray(dev[catKey]) ? [...(dev[catKey] as string[])] : []
    const index = currentArray.indexOf(topicId)
    if (index >= 0) {
      currentArray.splice(index, 1)
    } else {
      currentArray.push(topicId)
    }

    const updatedDev = { ...dev, [catKey]: currentArray }
    
    // Check Java Master achievement
    const achievements = [...(updatedDev.achievements || [])]
    if ((updatedDev.javaProgress?.length || 0) >= 16 && !achievements.includes('java_master')) {
      achievements.push('java_master')
    }
    updatedDev.achievements = achievements

    const updatedPlayer = {
      ...state.player,
      developer: updatedDev
    }
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  }),

  claimDevQuestRewards: () => set((state) => {
    const dev = state.player.developer || defaultDeveloper
    const todayStr = new Date().toDateString()
    if (dev.lastClaimedDate === todayStr) return {}

    let newXp = dev.devXp + 200
    let newLevel = dev.devLevel
    let newXpNeeded = dev.devXpNeeded
    let leveledUp = false

    if (newXp >= newXpNeeded) {
      newXp -= newXpNeeded
      newLevel += 1
      leveledUp = true
    }

    // Increase Stats: Intelligence +5, Problem Solving +5, Focus +5, Communication +5, Discipline +5
    const updatedStats = {
      ...state.player.stats,
      intelligence: (state.player.stats.intelligence || 10) + 5,
      problemSolving: (state.player.stats.problemSolving || 10) + 5,
      focus: (state.player.stats.focus || 10) + 5,
      communication: (state.player.stats.communication || 10) + 5,
      discipline: (state.player.stats.discipline || 10) + 5
    }

    // Set daily completed flag to keep coding streak
    localStorage.setItem('sl_dev_today_completed', 'true')

    const updatedDev = {
      ...dev,
      devLevel: newLevel,
      devXp: newXp,
      devXpNeeded: newXpNeeded,
      lastClaimedDate: todayStr
    }

    const updatedPlayer = {
      ...state.player,
      stats: updatedStats,
      developer: updatedDev
    }

    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { 
      player: updatedPlayer,
      devLevelUpNotification: leveledUp
    }
  }),

  checkDevDailyReset: () => set((state) => {
    const todayStr = new Date().toDateString()
    const lastDate = localStorage.getItem('sl_dev_last_date')

    if (lastDate && lastDate !== todayStr) {
      const dev = state.player.developer || defaultDeveloper
      const todayCompletedYesterday = localStorage.getItem('sl_dev_today_completed') === 'true'

      let newStreak = dev.codingStreak
      if (todayCompletedYesterday) {
        newStreak += 1
      } else {
        newStreak = 0
      }

      const updatedDev = {
        ...dev,
        dailyJavaDsaMin: 0,
        dailyFullStackMin: 0,
        dailyCodingProblems: 0,
        dailyCommMin: 0,
        dailyProjMin: 0,
        codingStreak: newStreak
      }

      const updatedPlayer = {
        ...state.player,
        developer: updatedDev
      }

      localStorage.setItem('sl_dev_today_completed', 'false')
      localStorage.setItem('sl_dev_last_date', todayStr)
      localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))

      return { player: updatedPlayer }
    }

    if (!lastDate) {
      localStorage.setItem('sl_dev_last_date', todayStr)
    }
    return {}
  }),

  resetSystem: async () => {
    const defaultPlayer: Player = {
      ...(defaultHunters as Player),
      stats: {
        ...(defaultHunters as Player).stats,
        focus: 10,
        discipline: 10,
        health: 100,
        recovery: 10,
        energy: 100,
        problemSolving: 10,
        communication: 10,
      },
      nutrition: defaultNutrition,
      developer: defaultDeveloper,
    }

    set({
      player: defaultPlayer,
      skills: defaultSkills as SkillNodeData[],
      quests: [getQuestForDayCount(getCurrentDayCount())],
      dungeons: defaultDungeons as Dungeon[],
      shadows: defaultShadows,
    })

    localStorage.removeItem('sl_player')
    localStorage.removeItem('sl_skills')
    localStorage.removeItem('sl_quests')
    localStorage.removeItem('sl_dungeons')
    localStorage.removeItem('sl_shadows')
    localStorage.removeItem('sl_sound_enabled')
    localStorage.removeItem('sl_dev_today_completed')
    localStorage.removeItem('sl_dev_last_date')

    await syncToDatabase()
  },

  logWorkout: (exercise, amount, xpEarned) => set((state) => {
    const newLog = {
      id: Math.random().toString(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exercise,
      amount,
      xpEarned
    }
    const updatedHistory = [newLog, ...(state.player.workoutHistory || [])]
    const updatedPlayer = {
      ...state.player,
      workoutHistory: updatedHistory
    }
    localStorage.setItem('sl_player', JSON.stringify(updatedPlayer))
    return { player: updatedPlayer }
  })
}))

// --- MongoDB Sync Middleware / Subscription ---
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/state';

// Load initial state from MongoDB
export const syncFromDatabase = async () => {
  const name = useGameStore.getState().player.name;
  try {
    const response = await fetch(`${BACKEND_URL}/${encodeURIComponent(name)}`);
    if (response.ok) {
      const data = await response.json();
      
      // Sanitize/regenerate the daily quest from the database to align with the active day & rank rules
      const dayCount = getCurrentDayCount();
      const rawQuests = data.quests || [];
      let needDbUpdate = false;
      const sanitizedQuests = rawQuests.map((q: any) => {
        if (q.id === 'daily_training') {
          const hasSitups = q.tasks?.some((t: any) => t.id === 'situps');
          if (hasSitups) {
            needDbUpdate = true;
          }
          const updated = getQuestForDayCount(dayCount, hasSitups ? undefined : q.tasks);
          if (hasSitups) {
            updated.status = 'active';
          } else {
            updated.status = q.status;
          }
          return updated;
        }
        return q;
      });

      useGameStore.setState({
        player: data.player,
        skills: data.skills,
        quests: sanitizedQuests,
        dungeons: data.dungeons,
        shadows: data.shadows
      });
      // Save locally as secondary fallback
      localStorage.setItem('sl_player', JSON.stringify(data.player));
      localStorage.setItem('sl_skills', JSON.stringify(data.skills));
      localStorage.setItem('sl_quests', JSON.stringify(sanitizedQuests));
      localStorage.setItem('sl_dungeons', JSON.stringify(data.dungeons));
      localStorage.setItem('sl_shadows', JSON.stringify(data.shadows));
      console.log('Successfully synced game state from MongoDB.');
      if (needDbUpdate) {
        console.log('Detected legacy tasks. Rewriting database backup...');
        await syncToDatabase();
      }
    } else if (response.status === 404) {
      // Not found, seed DB with current state
      console.log('No online state found for this Hunter. Initializing MongoDB record...');
      await syncToDatabase();
    }
  } catch (err) {
    console.warn('Unable to sync from MongoDB (offline or server not running). Falling back to LocalStorage.', err);
  }
};

// Save current state to MongoDB
export const syncToDatabase = async () => {
  const state = useGameStore.getState();
  const name = state.player.name;
  const payload = {
    player: state.player,
    skills: state.skills,
    quests: state.quests,
    dungeons: state.dungeons,
    shadows: state.shadows
  };
  try {
    const response = await fetch(`${BACKEND_URL}/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      console.log('Game state backed up to MongoDB.');
    }
  } catch (err) {
    console.warn('Failed to sync state to MongoDB.', err);
  }
};

// Throttle/Debounce DB saves to avoid spamming network requests
let saveTimeout: any = null;
useGameStore.subscribe((state, prevState) => {
  // Only save if actual state fields changed (ignore notifications or sound toggles)
  if (
    state.player !== prevState.player ||
    state.skills !== prevState.skills ||
    state.quests !== prevState.quests ||
    state.dungeons !== prevState.dungeons ||
    state.shadows !== prevState.shadows
  ) {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      syncToDatabase();
    }, 2000); // Debounce saves by 2 seconds
  }
});

