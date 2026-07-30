import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { WingmanAnalysis } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { 
  Zap, Check, Copy, Flame, Smile, BookOpen, UserCheck, ShieldAlert, Sparkles, MessageSquare
} from 'lucide-react';

export default function AIWingman() {
  const { wingmanHistory, addWingmanAnalysis } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResult: WingmanAnalysis = {
        id: Math.random().toString(),
        inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: "Curious, slightly sarcastic but intellectually engaged",
        intent: "Seeking a collaborative vibe check & testing analytical alignment",
        confidence: 94,
        replies: {
          funny: "I'll co-sign that statement, as long as it doesn't violate my local security protocols. Shall we benchmark it in person?",
          flirty: "Your personality vector seems to have a direct positive pull on mine. How about we test this alignment over coffee?",
          deep: "I agree that complex systems are beautiful when they work. The transition from random bits to order is fascinating. What drew you to study that?",
          professional: "That makes complete sense. I also prefer setting structured goals. Shall we sync coordinates for a meetup this week?"
        }
      };

      addWingmanAnalysis(mockResult);
      setIsAnalyzing(false);
      setInputText('');
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const latestAnalysis = wingmanHistory[0];

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        
        {/* Left Column: Conversation Analyzer Form */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-1">
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-accent" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">AI Wingman Telemetry</h3>
            </div>
            <Badge variant="accent" size="sm" icon={Sparkles}>
              Active Analyzer
            </Badge>
          </div>

          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            <h4 className="text-sm font-display font-bold text-white mb-2">Paste Conversation Log</h4>
            <p className="text-xs text-white/60 mb-4 leading-relaxed font-sans">
              Paste recent chat snippets. The Wingman engine decodes subtle sentiment markers and recommends high-resonance response templates.
            </p>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Match: 'I was just reading about quantum computing, but a brief respite is welcome.'&#10;Me: 'Fascinating field! Which algorithms?'"
                rows={5}
                className="glass-input w-full resize-none leading-relaxed"
              />
              <GlowButton 
                type="submit" 
                isLoading={isAnalyzing} 
                disabled={!inputText.trim()} 
                className="w-full"
                icon={Zap}
              >
                Analyze Conversation Coordinates
              </GlowButton>
            </form>
          </GlassCard>

          {/* History */}
          <div className="space-y-3">
            <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider font-mono">Analysis Telemetry Log</h5>
            {wingmanHistory.length > 1 ? (
              wingmanHistory.slice(1).map(h => (
                <div key={h.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                    <span>{h.timestamp}</span>
                    <Badge variant="glass" size="sm">Confidence: {h.confidence}%</Badge>
                  </div>
                  <p className="text-xs text-white/80 line-clamp-1 italic">"{h.inputText}"</p>
                  <span className="text-[10px] text-pink-300 font-medium">Mood: {h.emotion}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 italic">No archived calibrations yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Wingman Suggestions Output */}
        <div className="col-span-12 lg:col-span-6 h-full flex flex-col gap-4">
          {latestAnalysis ? (
            <GlassCard className="p-6 border-white/10 bg-card-dark/60 h-full overflow-y-auto flex flex-col gap-6" hoverEffect={false}>
              
              <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <h4 className="font-display font-bold text-sm text-white">Spark Strategy Diagnostic</h4>
                </div>
                <Badge variant="primary" size="sm">
                  Confidence: {latestAnalysis.confidence}%
                </Badge>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/6 rounded-2xl p-4">
                  <span className="text-[10px] text-white/50 uppercase font-mono font-semibold block mb-1">Emotion & Tone</span>
                  <span className="text-xs text-white/90 font-medium leading-relaxed">{latestAnalysis.emotion}</span>
                </div>
                <div className="bg-white/[0.03] border border-white/6 rounded-2xl p-4">
                  <span className="text-[10px] text-white/50 uppercase font-mono font-semibold block mb-1">Speaker Intent</span>
                  <span className="text-xs text-white/90 font-medium leading-relaxed">{latestAnalysis.intent}</span>
                </div>
              </div>

              {/* Response Options */}
              <div className="space-y-4 flex-1">
                <h5 className="text-[10px] text-purple-300 uppercase font-bold tracking-wider font-mono">Calibrated Response Options</h5>
                
                {[
                  { label: "Witty & Playful", icon: Smile, text: latestAnalysis.replies.funny, badgeVariant: 'warning' as const },
                  { label: "Charming & Flirtatious", icon: Flame, text: latestAnalysis.replies.flirty, badgeVariant: 'accent' as const },
                  { label: "Intellectual & Deep", icon: BookOpen, text: latestAnalysis.replies.deep, badgeVariant: 'primary' as const },
                  { label: "Direct & Structured", icon: UserCheck, text: latestAnalysis.replies.professional, badgeVariant: 'glass' as const }
                ].map((reply, i) => {
                  const Icon = reply.icon;
                  const isCopied = copiedText === reply.text;
                  return (
                    <div key={i} className="flex flex-col gap-2.5 bg-white/[0.02] border border-white/6 rounded-2xl p-4 hover:border-white/15 transition-colors">
                      <div className="flex justify-between items-center">
                        <Badge variant={reply.badgeVariant} size="sm" icon={Icon}>
                          {reply.label}
                        </Badge>
                        <button 
                          onClick={() => handleCopy(reply.text)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors flex items-center gap-1 text-[10px]"
                          aria-label="Copy response text"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-accent" />
                              <span className="text-accent">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed italic">"{reply.text}"</p>
                    </div>
                  );
                })}
              </div>

            </GlassCard>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Telemetry Viewport Ready"
              description="Paste a conversation transcript on the left to extract mood vectors and generate response templates."
              className="h-full border-white/8"
            />
          )}
        </div>

      </main>
    </div>
  );
}
