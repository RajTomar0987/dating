import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Zap, DollarSign, CheckCircle2, Server, Globe, Radio, Shield, 
  Sparkles, Layers, ArrowUpRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const MODEL_PROVIDERS = [
  {
    provider: 'Google Gemini',
    activeModel: 'Gemini 3.1 Pro (Flagship)',
    models: [
      { name: 'Gemini 3.1 Pro', latency: '18ms', cost: '$0.0015', cap: ['Vision', 'Audio', 'Long-Context 2M', 'Reasoning'] },
      { name: 'Gemini 3.6 Flash', latency: '9ms', cost: '$0.0003', cap: ['Realtime Voice', 'High Throughput'] }
    ],
    status: 'Operational',
    icon: Sparkles,
    badgeColor: 'primary'
  },
  {
    provider: 'OpenAI',
    activeModel: 'GPT-4o Omni',
    models: [
      { name: 'GPT-4o', latency: '35ms', cost: '$0.0025', cap: ['Vision', 'Voice Mode', 'Function Calling'] },
      { name: 'GPT-4o-mini', latency: '14ms', cost: '$0.00015', cap: ['Fast Classification', 'Lightweight'] }
    ],
    status: 'Operational',
    icon: Cpu,
    badgeColor: 'accent'
  },
  {
    provider: 'Anthropic',
    activeModel: 'Claude 3.5 Sonnet',
    models: [
      { name: 'Claude 3.5 Sonnet', latency: '42ms', cost: '$0.0030', cap: ['Nuanced Writing', 'Code', 'Empathy'] },
      { name: 'Claude 3 Opus', latency: '95ms', cost: '$0.0150', cap: ['Complex Reasoning', 'Philosophy'] }
    ],
    status: 'Operational',
    icon: Layers,
    badgeColor: 'warning'
  },
  {
    provider: 'OpenRouter',
    activeModel: 'DeepSeek R1 & Llama 3.3',
    models: [
      { name: 'DeepSeek R1', latency: '28ms', cost: '$0.0005', cap: ['Open Weights', 'Math Reasoning'] },
      { name: 'Llama 3.3 70B', latency: '22ms', cost: '$0.0004', cap: ['Custom Fine-Tune', 'Low Cost'] }
    ],
    status: 'Operational',
    icon: Globe,
    badgeColor: 'success'
  },
  {
    provider: 'Local Ollama',
    activeModel: 'Qwen 2.5 14B (Zero-Knowledge)',
    models: [
      { name: 'Qwen 2.5 14B', latency: '12ms', cost: '$0.0000', cap: ['100% Offline', 'Private Hardware'] },
      { name: 'Llama 3.2 3B', latency: '4ms', cost: '$0.0000', cap: ['Edge Device', 'Zero Overhead'] }
    ],
    status: 'Active Local Cluster',
    icon: Server,
    badgeColor: 'primary'
  }
];

export default function AIModelHub() {
  const { addToast } = useAppStore();
  const [selectedProvider, setSelectedProvider] = useState('Google Gemini');
  const [selectedModel, setSelectedModel] = useState('Gemini 3.1 Pro');

  const handleSwitchModel = (provName: string, modelName: string) => {
    setSelectedProvider(provName);
    setSelectedModel(modelName);
    addToast(`Switched active inference model to ${modelName} (${provName})`, 'system');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Cpu}>
                AuraAI Multi-LLM Model Hub • Router Matrix
              </Badge>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Radio size={12} className="animate-pulse" /> Live Inference Ready
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Cpu className="text-primary shrink-0" size={38} /> Multi-Provider AI Hub
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Dynamically route neural affinity workloads across OpenAI, Anthropic, Google Gemini, OpenRouter, and Local Ollama instances.
            </p>
          </div>

          <GlassCard className="p-4 bg-card-dark/90 border-primary/30 flex items-center gap-4 shrink-0 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <div>
              <div className="text-[10px] text-white/40 font-mono uppercase">Active AI Routing Node</div>
              <div className="text-sm font-bold text-white">{selectedModel}</div>
              <div className="text-xs text-accent font-mono mt-0.5">{selectedProvider}</div>
            </div>
          </GlassCard>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODEL_PROVIDERS.map((prov) => {
            const Icon = prov.icon;
            const isSelectedProv = selectedProvider === prov.provider;
            return (
              <GlassCard 
                key={prov.provider}
                variant={isSelectedProv ? 'glow' : 'interactive'}
                className={`p-6 space-y-4 flex flex-col justify-between ${
                  isSelectedProv ? 'border-primary/60 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-display font-bold text-lg text-white">{prov.provider}</h3>
                    </div>
                    <Badge variant="success" size="sm">{prov.status}</Badge>
                  </div>

                  <div className="space-y-3 pt-2">
                    {prov.models.map((m) => {
                      const isSelected = selectedModel === m.name;
                      return (
                        <div 
                          key={m.name}
                          onClick={() => handleSwitchModel(prov.provider, m.name)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                              : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.05] text-white/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white flex items-center gap-1.5">
                              {isSelected && <CheckCircle2 size={14} className="text-accent shrink-0" />}
                              {m.name}
                            </span>
                            <span className="text-xs font-mono text-emerald-400">{m.latency}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mt-1">
                            <span>Cost: {m.cost} / 1k tokens</span>
                          </div>

                          <div className="flex items-center gap-1 flex-wrap mt-2">
                            {m.cap.map((c, i) => (
                              <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </main>
    </div>
  );
}
