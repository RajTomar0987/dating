import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Sparkles, Volume2, Shield, Palette, Image as ImageIcon, 
  Check, Star, Zap, Crown
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const STORE_ITEMS = [
  { id: 'st1', category: 'Themes', title: 'Obsidian Liquid Glass', price: '1,200 pts', desc: 'Ultra-dark luxury theme with violet ambient spotlights.', icon: Palette, owned: true },
  { id: 'st2', category: 'Profile Frames', title: 'Holographic VIP Ring', price: '800 pts', desc: 'Animated glowing border around your profile signature.', icon: Crown, owned: false },
  { id: 'st3', category: 'AI Voices', title: 'Serena (Warm Ambient Voice)', price: '1,500 pts', desc: 'Natural neural voice synthesis for daily voice notes.', icon: Volume2, owned: false },
  { id: 'st4', category: 'Templates', title: 'Deep Discussion Vol. 2', price: '500 pts', desc: '50+ AI prompts for co-living & architectural talks.', icon: Sparkles, owned: true },
  { id: 'st5', category: 'Backgrounds', title: 'Kyoto Sunset Sanctuary', price: '1,000 pts', desc: 'High-res atmospheric background for RelOS dashboard.', icon: ImageIcon, owned: false }
];

export default function AuraStore() {
  const { addToast } = useAppStore();
  const [ownedState, setOwnedState] = useState<Record<string, boolean>>({
    st1: true,
    st4: true
  });

  const handleBuyItem = (item: typeof STORE_ITEMS[0]) => {
    if (ownedState[item.id]) {
      addToast(`"${item.title}" is already unlocked & active`, 'system');
      return;
    }
    setOwnedState(prev => ({ ...prev, [item.id]: true }));
    addToast(`Unlocked "${item.title}" using Aura Points!`, 'system');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={ShoppingBag}>
                Aura Digital Store • Redeem Aura Points
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">9,000 Points Available</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="text-accent shrink-0" size={38} /> Aura Digital Store
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Unlock custom themes, profile frames, avatar packs, neural AI voices, conversation templates, and premium backgrounds.
            </p>
          </div>
        </div>

        {/* Catalog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isOwned = ownedState[item.id];
            return (
              <GlassCard key={item.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                      <Icon size={20} />
                    </div>
                    <Badge variant="primary" size="sm">{item.category}</Badge>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{item.title}</h3>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-1">{item.price}</div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-sans">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                  <GlowButton 
                    variant={isOwned ? 'glass' : 'accent'}
                    size="sm"
                    onClick={() => handleBuyItem(item)}
                    icon={isOwned ? Check : Zap}
                  >
                    {isOwned ? 'Unlocked' : 'Redeem Item'}
                  </GlowButton>
                </div>
              </GlassCard>
            );
          })}
        </section>

      </main>
    </div>
  );
}
