import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { 
  Send, Mic, Image, CheckCheck, Compass, MessageCircle, Sparkles, Play
} from 'lucide-react';

export default function Chat() {
  const { 
    profiles, 
    likedProfiles, 
    chatThreads, 
    sendMessage, 
    reactToMessage,
    selectedMatchId, 
    setSelectedMatchId,
    setActiveTab,
    typingMatches
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const matched = profiles.filter(p => likedProfiles.includes(p.id));
  const activeMatch = profiles.find(p => p.id === selectedMatchId);
  const activeMessages = activeMatch ? (chatThreads[activeMatch.id] || []) : [];
  const isTyping = activeMatch ? !!typingMatches[activeMatch.id] : false;

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [activeMessages.length, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;
    sendMessage(activeMatch.id, inputText);
    setInputText('');
    setShowAiDrawer(false);
  };

  const insertSuggestion = (text: string) => {
    setInputText(text);
    setShowAiDrawer(false);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        
        {/* Left Column: Match selection channels */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-3 h-full overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-1">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-accent" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Sync Channels</h3>
            </div>
            <Badge variant="primary" size="sm">
              {matched.length} Active
            </Badge>
          </div>

          {matched.length > 0 ? (
            matched.map(profile => {
              const thread = chatThreads[profile.id] || [];
              const lastMsg = thread[thread.length - 1];
              const isSelected = selectedMatchId === profile.id;
              
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    setSelectedMatchId(profile.id);
                    setShowAiDrawer(false);
                  }}
                  className={`
                    w-full p-3.5 rounded-2xl text-left border flex items-center gap-3 cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-accent/40 bg-accent/10 shadow-[0_0_20px_rgba(236,72,153,0.12)]' 
                      : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.05]'
                    }
                  `}
                >
                  <img src={profile.images[0]} className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0" alt={profile.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-display font-semibold text-sm text-white truncate">{profile.name}</span>
                      <Badge variant="accent" size="sm">
                        {profile.compatibilityReport.overall}%
                      </Badge>
                    </div>
                    <p className="text-xs text-white/50 truncate">{lastMsg ? lastMsg.text : 'Affinity matched!'}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No Active Channels"
              description="Go to the Swipe Deck to connect with matching profiles and unlock sync channels."
              actionLabel="Go to Swipe Deck"
              onAction={() => setActiveTab('deck')}
              className="py-8"
            />
          )}
        </div>

        {/* Right Column: Chat Viewport */}
        <div className="col-span-12 md:col-span-8 flex flex-col h-full bg-card-dark/60 border border-white/10 rounded-[28px] overflow-hidden relative shadow-2xl backdrop-blur-2xl">
          {activeMatch ? (
            <div className="flex flex-col h-full justify-between">
              
              {/* Active Match Header */}
              <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between bg-black/30 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <img src={activeMatch.images[0]} className="w-10 h-10 rounded-full object-cover border border-white/15" alt={activeMatch.name} />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{activeMatch.name}</h4>
                    <span className="text-[10px] text-pink-300 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      AI Telemetry Calibrated ({activeMatch.personalityType})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowAiDrawer(!showAiDrawer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-xs font-semibold text-pink-300 hover:bg-accent/25 cursor-pointer transition-all shadow-sm"
                  >
                    <Sparkles size={13} />
                    <span>Wingman Assist</span>
                  </button>
                </div>
              </div>

              {/* Message History Viewport */}
              <div ref={viewportRef} className="flex-1 overflow-y-auto p-6 space-y-4 relative">
                {activeMessages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex gap-3 max-w-[75%] group relative ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                      {!isUser && <img src={activeMatch.images[0]} className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0 self-end" alt="" />}
                      
                      <div className="space-y-1 relative">
                        {/* Emoji Reaction Selector overlay */}
                        <div className={`
                          absolute -top-7 z-20 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-white/15 shadow-xl backdrop-blur-md transition-all
                          ${isUser ? 'right-0' : 'left-0'}
                        `}>
                          {['❤️', '🔥', '👍', '😂'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => reactToMessage(activeMatch.id, msg.id, emoji)}
                              className="hover:scale-125 cursor-pointer transition-transform text-xs"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Bubble Content */}
                        <div className={`
                          p-3.5 rounded-2xl text-xs leading-relaxed relative
                          ${isUser ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-none shadow-md' : 'bg-white/6 border border-white/8 text-white/90 rounded-bl-none'}
                        `}>
                          {msg.type === 'voice' ? (
                            <div className="flex items-center gap-3 w-48">
                              <button type="button" className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
                                <Play size={10} className="fill-white ml-0.5" />
                              </button>
                              <div className="flex-1 flex items-center gap-0.5 h-6">
                                {[8, 16, 12, 20, 14, 8, 16, 10, 14, 8].map((h, idx) => (
                                  <div key={idx} className="w-0.5 bg-white/50 rounded-full" style={{ height: `${h}px` }} />
                                ))}
                              </div>
                              <span className="text-[9px] text-white/60 font-mono shrink-0">{msg.duration || '0:12'}</span>
                            </div>
                          ) : msg.type === 'photo' ? (
                            <div className="rounded-xl overflow-hidden max-w-[220px] border border-white/10 bg-black/40">
                              <img src={msg.imageUrl} className="w-full object-cover aspect-video" alt="" />
                            </div>
                          ) : (
                            <p>{msg.text}</p>
                          )}

                          {msg.reaction && (
                            <div className="absolute -bottom-2.5 right-2 px-2 py-0.5 rounded-full bg-[#0F0F18] border border-white/15 text-[10px] flex items-center gap-1 z-10 shadow-sm">
                              <span>{msg.reaction}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[9px] text-white/40 justify-end pt-1 font-mono">
                          <span>{msg.timestamp}</span>
                          {isUser && <CheckCheck size={11} className="text-accent" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[70%] mr-auto">
                    <img src={activeMatch.images[0]} className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0 self-end animate-pulse" alt="" />
                    <div className="p-3.5 rounded-2xl bg-white/6 border border-white/8 rounded-bl-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {/* AI Suggestions Drawer */}
                {showAiDrawer && (
                  <div className="absolute top-4 right-4 w-76 bg-[#070712]/95 border border-accent/30 rounded-2xl p-4 shadow-2xl z-20 space-y-4 backdrop-blur-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/8">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-accent" />
                        <span className="text-xs font-display font-bold text-white uppercase tracking-wider font-mono">AI Suggestions Engine</span>
                      </div>
                      <button 
                        onClick={() => setShowAiDrawer(false)}
                        className="text-white/40 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed italic p-2.5 bg-white/[0.03] rounded-xl border border-white/6">
                      <strong className="text-accent">AI Coach Tip:</strong> {activeMatch.name} aligns on creative pursuits & intellect. Try these icebreakers:
                    </p>
                    <div className="space-y-2">
                      {activeMatch.icebreakers.map((breaker, idx) => (
                        <button
                          key={idx}
                          onClick={() => insertSuggestion(breaker)}
                          className="w-full p-3 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-primary/15 hover:border-primary/40 text-left text-[11px] text-white/80 hover:text-white cursor-pointer transition-all leading-normal flex items-start gap-2"
                        >
                          <Compass size={13} className="text-accent shrink-0 mt-0.5" />
                          <span>"{breaker}"</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form Bar */}
              <form onSubmit={handleSend} className="px-6 py-4 border-t border-white/8 bg-black/30 backdrop-blur-md flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => sendMessage(activeMatch.id, "Voice Note (0:15)", "voice", "0:15")}
                  className="w-10 h-10 rounded-xl hover:bg-white/8 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors" 
                  aria-label="Attach voice message"
                >
                  <Mic size={18} />
                </button>
                
                <button 
                  type="button" 
                  onClick={() => sendMessage(activeMatch.id, "Photo", "photo", undefined, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400")}
                  className="w-10 h-10 rounded-xl hover:bg-white/8 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors" 
                  aria-label="Attach images"
                >
                  <Image size={18} />
                </button>
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Send message to ${activeMatch.name}...`}
                  className="glass-input flex-1 py-2.5"
                />

                <GlowButton type="submit" size="sm" className="!px-4">
                  <Send size={15} />
                </GlowButton>
              </form>

            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="Synchronized Viewport"
              description="Select an active match from the list on the left to start direct messaging."
              className="h-full border-none bg-transparent"
            />
          )}
        </div>

      </main>
    </div>
  );
}
