import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Sparkles, Clock, MapPin, Heart, Gift, Plus, Check 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const CALENDAR_EVENTS = [
  { id: 'ev1', title: 'Candlelight Dinner & Jazz', date: 'Saturday, Aug 2', time: '7:30 PM', location: 'Benu & Black Cat Jazz, SF', type: 'date', partner: 'Elena Rostova' },
  { id: 'ev2', title: "Elena's Birthday Celebration", date: 'Tuesday, Aug 5', time: 'All Day', location: 'Oaxaca Cultural Excursion', type: 'birthday', partner: 'Elena Rostova' },
  { id: 'ev3', title: '1-Year Milestone Anniversary', date: 'Friday, Aug 15', time: '6:00 PM', location: 'Kyoto Ryokan Trip', type: 'anniversary', partner: 'Elena Rostova' }
];

export default function SmartCalendar() {
  const { addToast, setActiveTab } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={CalendarIcon}>
                Aura Smart Calendar • Integrated Event Planner
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">3 Upcoming Events</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <CalendarIcon className="text-accent shrink-0" size={38} /> Smart Calendar & Itineraries
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Synchronize upcoming dates, milestone birthdays, anniversaries, and AI venue recommendations.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => setActiveTab('planner')} icon={Plus}>
            Plan New Date Itinerary
          </GlowButton>
        </div>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CALENDAR_EVENTS.map((event) => (
            <GlassCard key={event.id} variant="glow" className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={event.type === 'birthday' ? 'accent' : 'primary'} size="sm">
                    {event.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{event.date}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-white">{event.title}</h3>
                
                <div className="space-y-1 text-xs text-white/70 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-accent" /> {event.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" /> {event.location}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/50">With {event.partner}</span>
                <GlowButton 
                  variant="glass" 
                  size="sm"
                  onClick={() => addToast(`Synced event "${event.title}" to device calendar`, 'system')}
                >
                  Sync Event
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </section>

      </main>
    </div>
  );
}
