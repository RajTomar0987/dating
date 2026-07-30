import React from 'react';
import { motion } from 'framer-motion';

interface HolographicRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function HolographicRing({ 
  score, 
  size = 110, 
  strokeWidth = 8,
  showLabel = true 
}: HolographicRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Outer Holographic Glow Aura */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-purple-400 opacity-30 filter blur-lg pointer-events-none"
        style={{ width: size, height: size }}
      />

      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Gradient Holographic Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#holoGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />

        <defs>
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Score Label Center Overlay */}
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          >
            {score}%
          </motion.span>
          <span className="text-[9px] font-mono text-accent uppercase font-bold tracking-wider -mt-1">
            MATCH
          </span>
        </div>
      )}
    </div>
  );
}
