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
  let tasksConfig: { id: string; name: string; target: number }[] = []
  let rewards = { xp: 150, statPoints: 4, gold: 200, box: "Random Loot Box" }
  let name = ""

  if (dayCount <= 30) {
    name = "Daily Quest: E-Rank Beginner Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 30 },
      { id: 'squats', name: 'Squats', target: 50 },
      { id: 'walking', name: 'Walking (Steps)', target: 8000 },
      { id: 'plank', name: 'Plank (Minutes)', target: 3 }
    ]
    rewards = { xp: 150, statPoints: 4, gold: 200, box: "Random Loot Box" }
  } else if (dayCount <= 60) {
    name = "Daily Quest: B-Rank Intermediate Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 60 },
      { id: 'squats', name: 'Squats', target: 80 },
      { id: 'walking', name: 'Walking (Steps)', target: 10000 },
      { id: 'plank', name: 'Plank (Minutes)', target: 5 }
    ]
    rewards = { xp: 300, statPoints: 6, gold: 400, box: "Elixir of Life" }
  } else {
    name = "Daily Quest: S-Rank Monarch Regimen"
    tasksConfig = [
      { id: 'pushups', name: 'Push-ups', target: 100 },
      { id: 'squats', name: 'Squats', target: 100 },
      { id: 'running', name: 'Running (KM)', target: 5 },
      { id: 'plank', name: 'Plank (Minutes)', target: 10 }
    ]
    rewards = { xp: 500, statPoints: 10, gold: 800, box: "Monarch Chest" }
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
  dismissQuestComplete: () => void
  upgradeRank: () => boolean
  checkDailyQuestExpiry: () => void
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

export const useGameStore = create<GameState>((set, get) => ({
  soundEnabled: getSavedState('sl_sound_enabled', true),
  player: (() => {
    const saved = getSavedState('sl_player', defaultHunters as Player)
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
      const updatedQuest = getQuestForDayCount(dayCount, saved[0].tasks)
      updatedQuest.status = saved[0].status
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
      [statName]: state.player.stats[statName] + 1
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

    localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
    return {
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
      const updatedPlayer = {
        ...state.player,
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
      updatedQuests = state.quests.map((q) => {
        if (q.id === 'daily_training' && q.status === 'active') {
          return { ...q, status: 'failed' as const }
        }
        return q
      })
      localStorage.setItem('sl_quests', JSON.stringify(updatedQuests))
    }
    
    localStorage.setItem('sl_last_active_date', todayString)
    return { quests: updatedQuests }
  }),

  dismissLevelUp: () => set({ levelUpNotification: false }),
  dismissQuestComplete: () => set({ questCompleteNotification: null })
}))

// --- MongoDB Sync Middleware / Subscription ---
const BACKEND_URL = 'http://localhost:5000/api/state';

// Load initial state from MongoDB
export const syncFromDatabase = async () => {
  const name = useGameStore.getState().player.name;
  try {
    const response = await fetch(`${BACKEND_URL}/${encodeURIComponent(name)}`);
    if (response.ok) {
      const data = await response.json();
      useGameStore.setState({
        player: data.player,
        skills: data.skills,
        quests: data.quests,
        dungeons: data.dungeons,
        shadows: data.shadows
      });
      // Save locally as secondary fallback
      localStorage.setItem('sl_player', JSON.stringify(data.player));
      localStorage.setItem('sl_skills', JSON.stringify(data.skills));
      localStorage.setItem('sl_quests', JSON.stringify(data.quests));
      localStorage.setItem('sl_dungeons', JSON.stringify(data.dungeons));
      localStorage.setItem('sl_shadows', JSON.stringify(data.shadows));
      console.log('Successfully synced game state from MongoDB.');
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

