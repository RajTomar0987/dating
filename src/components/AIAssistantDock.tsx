import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Calendar, Gift, Heart, X, Send, Bot, User, HelpCircle, ShieldCheck, Flame, Compass } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import AIOrb from './AIOrb';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function AIAssistantDock() {
  const { addToast, setActiveTab, relosScore } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello Alex! I am your Aura AI Assistant (RelOS Score: ${relosScore}%). How can I assist your relationship journey today?`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "I've analyzed your telemetry data. Your highest synergy comes from shared intellectual curiosity and quiet architectural spaces.";
      const q = query.toLowerCase();

      if (q.includes('compatibility') || q.includes('explain')) {
        replyText = `Your compatibility with Elena stands at ${relosScore}%. Key drivers: MBTI INTJ alignment (98%), shared love language (Quality Time), and matching 2026 travel itineraries.`;
      } else if (q.includes('date') || q.includes('plan')) {
        replyText = "Recommended Date: A dusk visit to the De Young Museum tower deck followed by ceremonial Japanese tea. Click 'Plan Date Itinerary' below to launch the co-op planner.";
      } else if (q.includes('reply') || q.includes('flirt') || q.includes('suggest')) {
        replyText = "Suggested Reply: 'I love how your mind works on spatial proportions. Let's debate architecture over tea this Saturday?'";
      } else if (q.includes('summary') || q.includes('summarize')) {
        replyText = "Conversation Summary: You & Elena have exchanged 142 messages. Main topics: AI model distillation, Bach violin solos, and Oaxaca travel plans. Mood is warm & deeply engaged.";
      } else if (q.includes('improve') || q.includes('recommend')) {
        replyText = "Profile Tip: Add a 15-second intro video showing your creative audio workspace to boost match engagement by +34%.";
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (label: string, promptText: string, targetTab?: string) => {
    addToast(`AI Trigger: ${label}`, 'system');
    handleSend(promptText);
    if (targetTab) {
      setTimeout(() => setActiveTab(targetTab), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 surface-5">
      {!isOpen && (
        <AIOrb size="sm" label="Aura Assistant" onClick={() => setIsOpen(true)} />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-96 max-w-[calc(100vw-2rem)] h-[540px] rounded-3xl bg-[#0A0A14]/95 border border-accent/40 shadow-[0_25px_70px_rgba(236,72,153,0.35)] backdrop-blur-2xl text-white flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
                  <Sparkles size={16} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
                    Aura AI Assistant
                    <ShieldCheck size={14} className="text-accent" />
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-mono">🟢 Active Neural Engine V4</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Capability Shortcut Pills */}
            <div className="p-2.5 border-b border-white/8 bg-black/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {[
                { label: 'Explain Compatibility', prompt: 'Explain compatibility score with Elena', icon: Heart, tab: 'report' },
                { label: 'Suggest Reply', prompt: 'Suggest flirty reply for current chat', icon: MessageSquare, tab: 'wingman' },
                { label: 'Plan Date', prompt: 'Plan an unforgettable weekend date', icon: Calendar, tab: 'planner' },
                { label: 'Summarize Chat', prompt: 'Summarize recent conversation history', icon: HelpCircle, tab: 'chats' },
                { label: 'Improve Profile', prompt: 'Recommend profile improvements to boost matches', icon: Flame, tab: 'profile' }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(btn.label, btn.prompt, btn.tab)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 text-[10px] font-semibold text-white/80 hover:text-white flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap"
                >
                  <btn.icon size={11} className="text-accent" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Conversation Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs leading-relaxed">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0 mt-1">
                      <Bot size={13} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-accent text-white font-medium rounded-tr-none'
                        : 'bg-white/[0.05] border border-white/10 text-white/90 rounded-tl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] text-white/40 block mt-1 text-right font-mono">{m.timestamp}</span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-1">
                      <User size={13} className="text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-white/50 italic font-mono">
                  <Bot size={14} className="text-accent animate-pulse" />
                  <span>Aura AI is formulating recommendations...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Query Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 bg-black/60 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Aura anything about dating, compatibility, dates..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white disabled:opacity-40 transition-opacity cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
