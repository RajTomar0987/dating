import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function SplashScreen() {
  const { showSplash, setShowSplash, setActiveTab, soundEnabled, toggleSound } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Aura AI Neural Core...');
  const [isCompleted, setIsCompleted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Procedural Web Audio API Chime for Brand Sound
  const playBrandChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch (err) {
      console.warn('[SplashScreen] Audio chime warning:', err);
    }
  };

  useEffect(() => {
    try {
      playBrandChime();
    } catch {
      // Ignored
    }

    const stages = [
      { p: 20, t: 'Loading Neural Weights & Emotion Vectors...' },
      { p: 45, t: 'Calibrating Compatibility Graph Engine...' },
      { p: 70, t: 'Establishing Secure Encrypted Session...' },
      { p: 90, t: 'Synchronizing Real-Time Telemetry...' },
      { p: 100, t: 'Welcome to Aura AI Flagship Experience' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].p);
        setLoadingText(stages[currentStage].t);
        currentStage++;
      } else {
        clearInterval(interval);
        setIsCompleted(true);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (!showSplash) return null;

  const handleLaunch = () => {
    console.log("Launch button clicked");
    try {
      playBrandChime();
    } catch (err) {
      console.warn("[SplashScreen] Safe chime failure handled:", err);
    }
    
    setActiveTab('home');
    setShowSplash(false);
  };

  return (
    <div 
      className="fixed inset-0 top-0 left-0 w-screen h-screen z-[100] flex flex-col items-center justify-center bg-[#030307] overflow-hidden select-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Dynamic Aurora Gradient Sphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/30 via-accent/30 to-purple-800/20 blur-[120px] animate-aurora" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-pink-600/15 blur-[100px] animate-pulse" />
      </div>

      {/* Top Sound Toggle & Skip */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          onClick={handleLaunch}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Enter App</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Center Content Container - Centered Vertically & Horizontally */}
      <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 my-auto">
        
        {/* Animated AI Pulse Logo Container */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-dashed border-accent/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-primary to-accent blur-xl"
          />

          {/* Main Brand Orb Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary via-accent to-pink-600 p-0.5 shadow-[0_0_50px_rgba(236,72,153,0.4)] relative z-10 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0A0A12] flex items-center justify-center border border-white/20">
              <Sparkles className="text-accent animate-pulse" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-mono text-accent font-bold tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck size={12} /> Aura AI V4 Flagship
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white"
          >
            AURA <span className="gradient-text-accent">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-white/60 font-sans max-w-xs mx-auto leading-relaxed"
          >
            Next-Generation Neural Relationship Intelligence & Affinity Platform
          </motion.p>
        </div>

        {/* Progress Loading Bar */}
        <div className="w-full space-y-3 pt-2 sm:pt-4">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-white/60 truncate max-w-[240px] sm:max-w-[260px]">{loadingText}</span>
            <span className="text-accent font-bold">{progress}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-pink-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Ready Action Button */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2"
          >
            <button
              onClick={handleLaunch}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-display font-extrabold text-sm shadow-[0_10px_30px_rgba(236,72,153,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play size={16} fill="white" />
              <span>Launch Flagship Dashboard</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
