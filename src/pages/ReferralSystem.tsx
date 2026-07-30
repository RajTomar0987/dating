import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Gift, Award, Copy, Check, Share2, Sparkles, TrendingUp, Crown, Star
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const REFERRAL_LEADERBOARD = [
  { rank: 1, name: 'Elena Rostova', code: 'ELENA-VIP-99', invites: 42, points: '21,000 pts', bonus: '6 Mo Pro+' },
  { rank: 2, name: 'Marcus Vance', code: 'MARCUS-CLIMB', invites: 34, points: '17,000 pts', bonus: '4 Mo Pro+' },
  { rank: 3, name: 'Alex Rivers (You)', code: 'ALEX-AURA-2026', invites: 18, points: '9,000 pts', bonus: '2 Mo Pro+' },
  { rank: 4, name: 'Zoe Hayashi', code: 'ZOE-DESIGN-01', invites: 14, points: '7,000 pts', bonus: '1 Mo Pro+' }
];

export default function ReferralSystem() {
  const { addToast } = useAppStore();
  const [copied, setCopied] = useState(false);
  const referralCode = 'ALEX-AURA-2026';
  const referralLink = `https://aura.ai/invite/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast('Referral link copied to clipboard!', 'system');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Gift}>
                Aura Referral Engine • Growth Program
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">9,000 Aura Points Earned</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Gift className="text-accent shrink-0" size={38} /> Aura Referral Program
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Invite friends to join AuraAI. Earn Aura Points for every friend who registers and unlock free months of AuraAI Pro+.
            </p>
          </div>
        </div>

        {/* Unique Referral Code Banner */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-r from-primary/20 via-card-dark/95 to-accent/20 border-primary/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-accent font-bold uppercase">YOUR UNIQUE REFERRAL CODE</div>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-white font-mono tracking-wider">
                {referralCode}
              </div>
              <p className="text-xs text-white/70">Share your link to give friends 1 month free and earn 500 Aura Points per invite.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="glass-input text-xs font-mono text-white/80 w-64 hidden sm:block"
              />
              <GlowButton variant="accent" onClick={handleCopyLink} icon={copied ? Check : Copy}>
                {copied ? 'Link Copied!' : 'Copy Invite Link'}
              </GlowButton>
            </div>
          </div>
        </GlassCard>

        {/* Progress Card to Unlock Pro+ Month */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Award className="text-amber-400" size={20} /> Pro+ Unlock Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="glow" className="p-6 space-y-3 border-emerald-500/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>TIER 1 UNLOCK</span>
                <Badge variant="success" size="sm">UNLOCKED</Badge>
              </div>
              <h3 className="text-lg font-bold text-white">1 Free Month Pro+</h3>
              <p className="text-xs text-white/60">Achieved at 5 Successful Invites (You: 18 Invites)</p>
            </GlassCard>

            <GlassCard variant="glow" className="p-6 space-y-3 border-accent/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>TIER 2 UNLOCK</span>
                <Badge variant="accent" size="sm">UNLOCKED</Badge>
              </div>
              <h3 className="text-lg font-bold text-white">3 Free Months Pro+</h3>
              <p className="text-xs text-white/60">Achieved at 15 Successful Invites</p>
            </GlassCard>

            <GlassCard variant="interactive" className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>TIER 3 UNLOCK</span>
                <span className="text-white/40">7 Invites Away</span>
              </div>
              <h3 className="text-lg font-bold text-white">Lifetime Pro+ Pass</h3>
              <p className="text-xs text-white/60">Achieved at 25 Successful Invites</p>
            </GlassCard>
          </div>
        </section>

        {/* Global Leaderboard */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Crown className="text-amber-400" size={20} /> Global Referrer Leaderboard
          </h2>

          <GlassCard variant="default" className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-white/50">
                  <th className="py-3 px-4">RANK</th>
                  <th className="py-3 px-4">MEMBER</th>
                  <th className="py-3 px-4">REFERRAL CODE</th>
                  <th className="py-3 px-4">INVITES</th>
                  <th className="py-3 px-4">POINTS</th>
                  <th className="py-3 px-4 text-right">PRO+ BONUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                {REFERRAL_LEADERBOARD.map((item) => (
                  <tr key={item.rank} className={`hover:bg-white/[0.02] ${item.rank === 3 ? 'bg-primary/10' : ''}`}>
                    <td className="py-3.5 px-4 font-bold text-amber-400">#{item.rank}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-white/60">{item.code}</td>
                    <td className="py-3.5 px-4 font-bold text-accent">{item.invites} Users</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{item.points}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-primary">{item.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}
