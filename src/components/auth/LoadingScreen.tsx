import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[100] flex flex-col items-center justify-center bg-[#030307] overflow-hidden select-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Aurora gradient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/30 via-accent/30 to-purple-800/20 blur-[120px] animate-aurora" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-pink-600/15 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
        {/* Animated logo */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute w-36 h-36 rounded-full border border-dashed border-accent/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-28 h-28 rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent blur-xl"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-pink-600 p-0.5 shadow-[0_0_50px_rgba(236,72,153,0.4)] relative z-10 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0A0A12] flex items-center justify-center border border-white/20">
              <Sparkles className="text-accent animate-pulse" size={28} />
            </div>
          </motion.div>
        </div>

        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-mono text-accent font-bold tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck size={12} /> Secure Session
            </span>
          </div>

          <h1 className="text-3xl font-display font-black tracking-tight text-white">
            AURA <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-sm text-white/50 font-sans">
            {message || 'Establishing secure connection...'}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
