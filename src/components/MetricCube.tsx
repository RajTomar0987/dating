import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface MetricCubeProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  variant?: 'glow' | 'interactive' | 'subtle';
}

export default function MetricCube({
  title,
  value,
  change,
  icon: Icon,
  variant = 'glow'
}: MetricCubeProps) {
  return (
    <motion.div
      whileHover={{ rotateX: 8, rotateY: -8, z: 15 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className="perspective-1200 preserve-3d"
    >
      <GlassCard variant={variant} className="p-5 space-y-3 relative overflow-hidden group border-white/12 hover:border-accent/40">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 font-mono tracking-wider uppercase font-semibold">{title}</span>
          <div className="w-9 h-9 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 group-hover:scale-110 transition-transform">
            <Icon size={18} />
          </div>
        </div>

        <div className="text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          {value}
        </div>

        {change && (
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <span>↑</span> {change}
          </div>
        )}

        {/* Ambient Corner Reflection Light */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-accent/15 filter blur-xl group-hover:scale-150 transition-transform" />
      </GlassCard>
    </motion.div>
  );
}
