import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Key, Copy, Check, Plus, Terminal 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const API_KEYS = [
  { name: 'Production Backend Key', key: 'aura_live_sk_89412xxxx', created: '2 weeks ago', status: 'Active' },
  { name: 'Staging Integration Key', key: 'aura_test_sk_11942xxxx', created: '3 days ago', status: 'Active' }
];

export default function DeveloperPlatform() {
  const { addToast } = useAppStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (k: string) => {
    navigator.clipboard.writeText(k);
    setCopiedKey(k);
    addToast('API Key copied to clipboard!', 'system');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Code}>
                Aura Open API & Developer Portal
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">v3.0 REST & Webhook Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Code className="text-accent shrink-0" size={38} /> Aura Developer Platform
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Integrate Aura neural affinity, relationship coaching, and memory vault APIs into external applications with high-speed Webhooks.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => addToast('Generated new production API Key: aura_live_sk_new...', 'system')} icon={Plus}>
            Generate New API Key
          </GlowButton>
        </div>

        {/* API Key Management */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Key className="text-amber-400" size={20} /> Active API Keys
          </h2>

          <GlassCard variant="default" className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-white/50">
                  <th className="py-3 px-4">KEY NAME</th>
                  <th className="py-3 px-4">TOKEN</th>
                  <th className="py-3 px-4">CREATED</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
                {API_KEYS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-accent">{item.key}</td>
                    <td className="py-3.5 px-4 font-mono text-white/50">{item.created}</td>
                    <td className="py-3.5 px-4"><Badge variant="success" size="sm">{item.status}</Badge></td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopy(item.key)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === item.key ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedKey === item.key ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

        {/* Code Snippet Example */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Terminal className="text-primary" size={20} /> cURL API Request Example
          </h2>

          <GlassCard variant="glow" className="p-6 bg-[#04040A] border-white/10 font-mono text-xs text-emerald-400 space-y-3">
            <div className="flex items-center justify-between text-white/40 pb-2 border-b border-white/8">
              <span>POST /v3/affinity/compute</span>
              <span>Authorization: Bearer aura_live_sk_...</span>
            </div>
            <pre className="overflow-x-auto leading-relaxed text-white/90">
{`curl -X POST https://api.aura.ai/v3/affinity/compute \\
  -H "Authorization: Bearer aura_live_sk_89412xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_mbti": "INTJ-A",
    "partner_mbti": "ENFP-T",
    "mode": "companion_coaching"
  }'`}
            </pre>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}
