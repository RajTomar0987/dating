import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onClick?: () => void;
}

export default function AIOrb({ size = 'md', label = 'Aura AI Core', onClick }: AIOrbProps) {
  // Motion values for cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for eye-tracking effect
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const orbRotateX = useTransform(springY, [-300, 300], [15, -15]);
  const orbRotateY = useTransform(springX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44'
  }[size];

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48
  }[size];

  return (
    <div 
      className="relative flex flex-col items-center justify-center cursor-pointer group select-none surface-5"
      onClick={onClick}
    >
      <motion.div
        style={{ rotateX: orbRotateX, rotateY: orbRotateY }}
        className={`relative ${sizeClasses} rounded-full flex items-center justify-center preserve-3d`}
      >
        {/* Outer Glowing Atmospheric Aura */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-pink-500 to-accent opacity-60 filter blur-xl pointer-events-none"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Outer Glass Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20 bg-card-dark/40 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.4)] group-hover:border-accent/60 transition-colors" />

        {/* 3D Liquid Core Sphere */}
        <motion.div 
          className="w-[82%] h-[82%] rounded-full bg-gradient-to-tr from-primary via-accent to-purple-400 flex items-center justify-center shadow-2xl text-white relative overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {/* Inner Light Reflection Specular */}
          <div className="absolute top-1.5 left-2.5 w-6 h-6 rounded-full bg-white/40 filter blur-[2px]" />
          
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={iconSizes} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
          </motion.div>
        </motion.div>

        {/* Eye Tracking Iris Light Accent */}
        <motion.div 
          style={{ x: useTransform(springX, [-500, 500], [-8, 8]), y: useTransform(springY, [-500, 500], [-8, 8]) }}
          className="absolute w-3 h-3 rounded-full bg-white/90 shadow-[0_0_15px_#ffffff] pointer-events-none"
        />
      </motion.div>

      {label && (
        <span className="mt-3 text-[11px] font-mono tracking-widest uppercase text-accent font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-accent/30 shadow-lg">
          {label}
        </span>
      )}
    </div>
  );
}
