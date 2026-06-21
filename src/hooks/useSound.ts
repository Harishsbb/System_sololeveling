import { useGameStore } from '../store/gameStore'

let audioCtx: AudioContext | null = null

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const useSound = () => {
  const soundEnabled = useGameStore((state) => state.soundEnabled)

  const playHover = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.06)
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const playClick = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(500, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12)
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const playLevelUp = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime
      
      // Rising major scale arpeggio for epic feel
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()
        
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)
        
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1800, now + idx * 0.08)
        
        gain.gain.setValueAtTime(0.04, now + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4)
        
        osc.start(now + idx * 0.08)
        osc.stop(now + idx * 0.08 + 0.4)
      })
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const playQuestComplete = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime
      
      // Fanfare: 5th, root, 3rd, 5th, octave chord chimes
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.07)
        
        gain.gain.setValueAtTime(0.05, now + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.5)
        
        osc.start(now + idx * 0.07)
        osc.stop(now + idx * 0.07 + 0.5)
      })
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const playPortalOpen = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()
      
      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      
      osc1.type = 'sawtooth'
      osc2.type = 'square'
      
      osc1.frequency.setValueAtTime(90, now)
      osc2.frequency.setValueAtTime(92, now) // Detuned
      
      osc1.frequency.exponentialRampToValueAtTime(35, now + 1.8)
      osc2.frequency.exponentialRampToValueAtTime(36, now + 1.8)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(120, now)
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.6)
      filter.frequency.exponentialRampToValueAtTime(50, now + 1.8)
      
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.linearRampToValueAtTime(0.16, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
      
      osc1.start()
      osc2.start()
      osc1.stop(now + 1.8)
      osc2.stop(now + 1.8)
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const playUnlock = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime
      
      // Sparkly chime cascading down
      const notes = [1318.51, 1046.50, 783.99, 659.25, 523.25, 392.00]
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.05)
        
        gain.gain.setValueAtTime(0.03, now + idx * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3)
        
        osc.start(now + idx * 0.05)
        osc.stop(now + idx * 0.05 + 0.3)
      })
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  return {
    playHover,
    playClick,
    playLevelUp,
    playQuestComplete,
    playPortalOpen,
    playUnlock,
  }
}
