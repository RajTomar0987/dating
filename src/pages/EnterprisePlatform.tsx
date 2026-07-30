import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, ArrowUpRight 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const CLIENTS = [
  { name: 'Acuity Wellness Partners', segment: 'Corporate Employee Benefit', seats: '2,500 Seats', status: 'Active SLA' },
  { name: 'Stanford Family Therapy Center', segment: 'Counseling & Research', seats: '850 Seats', status: 'Active SLA' },
  { name: 'MIT Student Wellness Hub', segment: 'University Network', seats: '5,000 Seats', status: 'Active SLA' }
];

export default function EnterprisePlatform() {
  const { addToast } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Building2}>
                AuraAI Enterprise B2B Suite • White-Label Platform
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">HIPAA & SOC-2 Type II Certified</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Building2 className="text-primary shrink-0" size={38} /> AuraAI Enterprise Platform
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              White-label relationship intelligence dashboard for corporate wellness providers, marriage & family therapy networks, and university counseling hubs.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => addToast('Enterprise demo requested. Our team will contact you.', 'system')}>
            Request Enterprise SLA Demo
          </GlowButton>
        </div>

        {/* B2B Client Accounts Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Users className="text-accent" size={20} /> Active Organization Deployments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENTS.map((client, idx) => (
              <GlassCard key={idx} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="sm">{client.segment}</Badge>
                    <Badge variant="success" size="sm">{client.status}</Badge>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">{client.name}</h3>
                  <div className="text-xs font-mono text-emerald-400 font-bold">{client.seats}</div>
                </div>

                <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                  <button 
                    onClick={() => addToast(`Opening Organization Portal for ${client.name}`, 'system')}
                    className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-xs font-semibold text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Manage Org Portal</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
