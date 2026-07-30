import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Eye, CheckCircle2, UserCheck, ShieldAlert, FileText 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

export default function SafetyCenter() {
  const { addToast } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={ShieldCheck}>
                Aura Safety & Privacy Center • Zero Trust Architecture
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">Biometric Verified</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="text-emerald-400 shrink-0" size={38} /> Safety & Privacy Center
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Manage your biometric photo verification badge, block list, data encryption keys, and privacy consent controls.
            </p>
          </div>
        </div>

        {/* Verification Status Card */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-r from-emerald-500/20 via-card-dark/95 to-primary/20 border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="success" size="sm" icon={CheckCircle2}>Biometric Photo Verified</Badge>
            <h2 className="text-2xl font-display font-bold text-white">Verified Authentic Account</h2>
            <p className="text-xs text-white/70 max-w-xl">
              Your profile has passed 3D biometric liveness verification and background identity validation.
            </p>
          </div>

          <GlowButton variant="glass" size="md" onClick={() => addToast('Verification status confirmed', 'system')}>
            View Security Badge
          </GlowButton>
        </GlassCard>

        {/* Security Controls Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="interactive" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Lock size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-white">End-to-End Encryption</h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              All memory vault records and chat messages are encrypted at rest using AES-256.
            </p>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
              <Eye size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Incognito Mode</h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Hide your profile signature from public discoverability while chatting with matches.
            </p>
          </GlassCard>

          <GlassCard variant="interactive" className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <FileText size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Export Privacy Record</h3>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Download your complete personal data archive in JSON format at any time.
            </p>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}
