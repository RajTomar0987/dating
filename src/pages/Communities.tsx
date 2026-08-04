import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Sparkles, Camera, Cpu, Compass, Music, Plus, Check, Calendar, ThumbsUp, MessageSquare, MapPin, Clock, Send, ShieldCheck, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const CLUBS = [
  { id: 'c1', name: 'Neural Synergy Lab & AI Creators', category: 'AI & Tech', members: '2,890 members', desc: 'Discussing neural matching algorithms, agent frameworks, and high-frequency communication.', icon: Cpu },
  { id: 'c2', name: 'Design & Architecture Connoisseurs', category: 'Design', members: '1,420 members', desc: 'Exploring spatial design, Japanese joinery, and minimalist residential architecture.', icon: Compass },
  { id: 'c3', name: 'Analog Leica & Street Photography', category: 'Photography', members: '980 members', desc: '35mm film processing, darkroom techniques, and golden hour SF photo walks.', icon: Camera },
  { id: 'c4', name: 'Bebop Jazz & Vinyl Audio Collectors', category: 'Music', members: '1,150 members', desc: 'Hi-fi tube amp listening sessions, vinyl trades, and live speakeasy nights.', icon: Music }
];

const LOCAL_EVENTS = [
  { id: 'e1', title: 'Sunset Jazz & Architecture Walk', location: 'De Young Museum SF', time: 'Tomorrow, 7:00 PM', attendees: 18, host: 'Elena R.' },
  { id: 'e2', title: 'Single Founders & Designers Coffee', location: 'Sightglass Coffee SOMA', time: 'Saturday, 11:00 AM', attendees: 32, host: 'Alex M.' },
  { id: 'e3', title: 'Oaxaca Cultural Itinerary Planning Workshop', location: 'Aura AI Virtual Studio', time: 'Sunday, 4:00 PM', attendees: 24, host: 'Sophia C.' }
];

const FEATURED_MEMBERS = [
  { id: 'm1', name: 'Zoe Hayashi', role: 'Spatial Architect', city: 'San Francisco', match: 98, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { id: 'm2', name: 'Marcus Vance', role: 'Documentary Filmmaker', city: 'Oakland', match: 94, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'm3', name: 'Aria Thorne', role: 'AI Audio Researcher', city: 'Palo Alto', match: 91, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300' }
];

export default function Communities() {
  const { 
    joinedClubIds, 
    toggleJoinClub, 
    rsvpedEventIds, 
    toggleRsvpEvent, 
    upvotedDiscussionIds, 
    upvoteDiscussion, 
    discussionPosts, 
    addDiscussionComment,
    addDiscussionPost,
    setActiveTab,
    setSelectedMatchId
  } = useAppStore();

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClub, setNewClub] = useState('Neural Synergy Lab');
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addDiscussionPost(newTitle, newClub, newContent);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addDiscussionComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      {/* Create New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#0A0A14] border border-accent/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-accent" size={18} />
                <h3 className="font-display font-bold text-sm text-white">Start New Community Discussion</h3>
              </div>
              <button onClick={() => setShowNewPostModal(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-white/60 font-bold block mb-1">Target Club</label>
                <select
                  value={newClub}
                  onChange={(e) => setNewClub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="Neural Synergy Lab" className="bg-[#0A0A14]">Neural Synergy Lab & AI Creators</option>
                  <option value="Design & Architecture" className="bg-[#0A0A14]">Design & Architecture Connoisseurs</option>
                  <option value="Street Photography" className="bg-[#0A0A14]">Analog Leica & Street Photography</option>
                  <option value="Jazz & Audio" className="bg-[#0A0A14]">Bebop Jazz & Vinyl Audio Collectors</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-white/60 font-bold block mb-1">Post Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., How AI compatibility scores changed my perspective..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-white/60 font-bold block mb-1">Content Body</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or questions with the community..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <GlowButton type="submit" variant="accent" size="sm">
                  Publish Discussion
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Users}>
                Aura Community Hub V4
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">4 Active Clubs • 3 Upcoming Events</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Users className="text-accent shrink-0" size={38} /> Ecosystem Communities
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Connect with high-intent singles and couples across AI technology, spatial design, jazz audio, and photography.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GlowButton variant="accent" size="md" onClick={() => setShowNewPostModal(true)} icon={Plus}>
              New Discussion
            </GlowButton>
          </div>
        </div>

        {/* Section 1: Clubs & Interest Groups */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="text-accent" size={20} /> Curated Interest Clubs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLUBS.map((club) => {
              const Icon = club.icon;
              const isJoined = joinedClubIds.includes(club.id);
              return (
                <GlassCard key={club.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between border-white/10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                        <Icon size={20} />
                      </div>
                      <Badge variant="primary" size="sm">{club.members}</Badge>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{club.name}</h3>
                      <span className="text-xs text-accent font-medium font-mono">{club.category}</span>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed font-sans">{club.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                    <GlowButton 
                      variant={isJoined ? 'glass' : 'primary'}
                      size="sm"
                      onClick={() => toggleJoinClub(club.id)}
                      icon={isJoined ? Check : Plus}
                    >
                      {isJoined ? 'Member ✓' : 'Join Club'}
                    </GlowButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Section 2: Local Events */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Calendar className="text-primary" size={20} /> Local Events & Date Meetups
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOCAL_EVENTS.map(event => {
              const isRsvped = rsvpedEventIds.includes(event.id);
              return (
                <GlassCard key={event.id} className="p-5 space-y-4 border-white/10 flex flex-col justify-between" hoverEffect={true}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase">Hosted by {event.host}</span>
                    <h3 className="font-bold text-sm text-white">{event.title}</h3>
                    <p className="text-xs text-white/60 flex items-center gap-1.5 font-mono">
                      <MapPin size={12} className="text-primary" /> {event.location}
                    </p>
                    <p className="text-xs text-white/60 flex items-center gap-1.5 font-mono">
                      <Clock size={12} className="text-accent" /> {event.time}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[11px] text-white/50">{event.attendees} Attending</span>
                    <button
                      onClick={() => toggleRsvpEvent(event.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isRsvped 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      }`}
                    >
                      {isRsvped ? '✓ RSVPed' : 'RSVP Now'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Section 3: Featured Members */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={20} /> Featured Community Members
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURED_MEMBERS.map(m => (
              <GlassCard key={m.id} className="p-4 space-y-3 border-white/10 text-center flex flex-col items-center" hoverEffect={true}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/15 shadow-xl">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white">{m.name}</h4>
                  <p className="text-[11px] text-accent font-medium">{m.role}</p>
                  <p className="text-[10px] text-white/50 font-mono">{m.city}</p>
                </div>
                <Badge variant="accent" size="sm">
                  {m.match}% Neural Match
                </Badge>
                <GlowButton 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedMatchId('1');
                    setActiveTab('chats');
                  }}
                >
                  Message Member
                </GlowButton>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Section 4: Trending Discussions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-accent" size={20} /> Trending Discussions
            </h2>
          </div>

          <div className="space-y-6">
            {discussionPosts.map(post => {
              const isUpvoted = upvotedDiscussionIds.includes(post.id);
              return (
                <GlassCard key={post.id} className="p-6 space-y-4 border-white/10" hoverEffect={false}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <div className="font-bold text-xs text-white">{post.author}</div>
                        <span className="text-[10px] text-accent font-mono">{post.clubName} • {post.timestamp}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => upvoteDiscussion(post.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isUpvoted 
                          ? 'bg-accent/20 text-accent border border-accent/40 shadow-md' 
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                      }`}
                    >
                      <ThumbsUp size={12} />
                      <span>{post.upvotes}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-white">{post.title}</h3>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">{post.content}</p>
                  </div>

                  {/* Comment List */}
                  {post.comments.length > 0 && (
                    <div className="pt-3 border-t border-white/8 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-white/50 font-bold">Comments ({post.comments.length})</span>
                      {post.comments.map(c => (
                        <div key={c.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/6 flex items-start gap-2.5 text-xs">
                          <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                          <div className="space-y-0.5 flex-1">
                            <span className="font-bold text-white block">{c.author} <span className="text-[10px] text-white/40 font-mono font-normal">• {c.timestamp}</span></span>
                            <p className="text-white/70">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Form */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Add a thoughtful reply to this discussion..."
                      className="glass-input flex-1 py-2 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent cursor-pointer transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
