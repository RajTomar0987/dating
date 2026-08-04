export interface HeroMatch {
  id: string;
  name: string;
  age: number;
  avatar: string;
  online: boolean;
  matchScore: number;
  tag: string;
}

export interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  storyImage: string;
  hasUnviewed: boolean;
  isOnline: boolean;
  timeAgo: string;
  caption: string;
}

export interface FeaturedMatch {
  id: string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  location: string;
  bio: string;
  image: string;
  interests: string[];
  compatibility: number;
  activeNow: boolean;
  aiReason: string;
  verified: boolean;
}

export interface DiscoverCard {
  id: string;
  name: string;
  age: number;
  occupation: string;
  image: string;
  aspectRatio: string; // for masonry layout
  conversationStarter: string;
  location: string;
  distance: string;
  interests: string[];
}

export interface TrendingEvent {
  id: string;
  title: string;
  category: 'Coffee' | 'Travel' | 'Music' | 'Art' | 'Photography' | 'Cooking';
  date: string;
  location: string;
  image: string;
  attendees: string[];
  spotsLeft: number;
  hostName: string;
  hostAvatar: string;
}

export interface CommunityBubble {
  id: string;
  name: string;
  membersCount: string;
  bgGradient: string;
  accentColor: string;
  avatarList: string[];
  activeCount: number;
  topic: string;
}

export interface RecentMessage {
  id: string;
  senderName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTyping: boolean;
  hasVoiceMessage: boolean;
  voiceDuration?: string;
  hasPhoto: boolean;
  photoUrl?: string;
  isOnline: boolean;
}

export interface AIWingmanCard {
  id: string;
  type: 'interaction' | 'recommendation' | 'alert';
  personName: string;
  personAvatar: string;
  headline: string;
  timestamp: string;
  suggestedAction: string;
  actionType: 'coffee' | 'message' | 'like' | 'view';
  accentColor: string;
}

export interface UpcomingDate {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  partnerAge: number;
  type: 'Restaurant' | 'Cinema' | 'Video Call' | 'Coffee' | 'Museum';
  locationName: string;
  address: string;
  date: string;
  time: string;
  countdown: string;
  weather: { temp: string; condition: string; icon: string };
  mapImage: string;
  bgImage: string;
}

// ----------------------------------------------------
// MOCK DATA (60+ VISIBLE HUMAN FACES)
// ----------------------------------------------------

export const HERO_MATCHES: HeroMatch[] = [
  { id: 'hm1', name: 'Zoe', age: 25, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 99, tag: 'High Sync' },
  { id: 'hm2', name: 'Elena', age: 26, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 98, tag: 'AI Curated' },
  { id: 'hm3', name: 'Marcus', age: 29, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 96, tag: 'Creative Vibe' },
  { id: 'hm4', name: 'Sophia', age: 27, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600', online: false, matchScore: 95, tag: 'Nearby' },
  { id: 'hm5', name: 'Devon', age: 28, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 94, tag: 'Shared Music' },
  { id: 'hm6', name: 'Aria', age: 24, avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 93, tag: 'Art Lover' },
  { id: 'hm7', name: 'Lucas', age: 30, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600', online: false, matchScore: 92, tag: 'Tech Founder' },
  { id: 'hm8', name: 'Maya', age: 26, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600', online: true, matchScore: 91, tag: 'New Profile' }
];

export const STORIES_DATA: StoryItem[] = [
  { id: 'st1', name: 'Zoe Hayashi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1514626585111-d870798f8013?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '10m ago', caption: 'Sunset rooftop violins in Hayes Valley ✨ 🎻' },
  { id: 'st2', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '25m ago', caption: 'Late night espresso & model training ☕️ 🧠' },
  { id: 'st3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '1h ago', caption: 'Bouldering high above the Valley clouds 🧗‍♂️ 🌲' },
  { id: 'st4', name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800', hasUnviewed: false, isOnline: false, timeAgo: '3h ago', caption: 'SF MoMA modern art walkthrough 🎨' },
  { id: 'st5', name: 'Chloe Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '4h ago', caption: 'Listening to vinyls on rainy afternoons 🎶' },
  { id: 'st6', name: 'Julian Cross', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', hasUnviewed: false, isOnline: true, timeAgo: '5h ago', caption: 'Chef tasting menu testing session 🍷 🍽️' },
  { id: 'st7', name: 'Freya Lindquist', avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: false, timeAgo: '6h ago', caption: 'Tokyo photo walk highlights 📷 ✨' },
  { id: 'st8', name: 'Noah Bennett', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '7h ago', caption: 'Morning surf session at Ocean Beach 🏄‍♂️' }
];

export const FEATURED_MATCHES: FeaturedMatch[] = [
  {
    id: 'fm1',
    name: 'Elena Rostova',
    age: 26,
    distance: '2 miles away',
    occupation: 'AI Scientist & Classical Violinist',
    location: 'San Francisco, CA',
    bio: 'Training neural architectures by day, performing Bach sonatas by night. Looking for deep conversations, dark roast pour-overs, and spontaneous gallery strolls.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    interests: ['AI Research', 'Violin', 'Dark Roast Coffee', 'Cyberpunk Aesthetics'],
    compatibility: 98,
    activeNow: true,
    aiReason: '98% Synergy: You both love deep focus work, minimalist design, and classical music.',
    verified: true
  },
  {
    id: 'fm2',
    name: 'Zoe Hayashi',
    age: 25,
    distance: '4 miles away',
    occupation: 'Architect & Generative Artist',
    location: 'Oakland, CA',
    bio: 'Designing eco-futuristic pavilions in VR. Passionate about Japanese tea ceremonies, ambient synth pop, and weekend coastal road trips.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    interests: ['Spatial Design', 'Generative Art', 'Tea Ceremony', 'Synth Pop'],
    compatibility: 96,
    activeNow: true,
    aiReason: '96% Synergy: Perfect match for spatial computing, aesthetics, and quiet dates.',
    verified: true
  },
  {
    id: 'fm3',
    name: 'Marcus Vance',
    age: 29,
    distance: '3 miles away',
    occupation: 'Documentary Director & Boulderer',
    location: 'San Francisco, CA',
    bio: 'Capturing human resilience across the globe. Off camera, you will find me bouldering in Yosemite or experimenting with sourdough fermentation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    interests: ['Cinematography', 'Climbing', 'Analog Film', 'Sourdough'],
    compatibility: 95,
    activeNow: true,
    aiReason: '95% Synergy: High adventurous resonance and shared passion for storytelling.',
    verified: true
  },
  {
    id: 'fm4',
    name: 'Sophia Chen',
    age: 27,
    distance: '1 mile away',
    occupation: 'Neurotech Lead & Pianist',
    location: 'San Francisco, CA',
    bio: 'Building brain-computer interfaces to amplify human empathy. Big fan of jazz clubs, indie films, and rooftop stargazing with hot chocolate.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    interests: ['Neuroscience', 'Jazz Piano', 'Indie Cinema', 'Stargazing'],
    compatibility: 94,
    activeNow: false,
    aiReason: '94% Synergy: Shared passion for empathetic tech and nocturnal creative pursuits.',
    verified: true
  }
];

export const DISCOVER_MASONRY: DiscoverCard[] = [
  {
    id: 'dm1',
    name: 'Amara Vance',
    age: 26,
    occupation: 'Sound Designer',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
    conversationStarter: 'Ask about her spatial audio installation at De Young Museum 🎧',
    location: 'San Francisco, CA',
    distance: '3 miles away',
    interests: ['Spatial Audio', 'Modular Synths', 'Botanical Gardens']
  },
  {
    id: 'dm2',
    name: 'Julian Cross',
    age: 28,
    occupation: 'Culinary Innovator',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[4/5]',
    conversationStarter: 'Break the ice with his favorite secret ramen bar in Japan Town 🍜',
    location: 'Oakland, CA',
    distance: '5 miles away',
    interests: ['Molecular Gastronomy', 'Natural Wine', 'Fermentation']
  },
  {
    id: 'dm3',
    name: 'Camila Santos',
    age: 25,
    occupation: 'Fashion Creative Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
    conversationStarter: 'Mention your favorite vintage thrift spot in Mission District 👗',
    location: 'San Francisco, CA',
    distance: '1 mile away',
    interests: ['Vintage Fashion', 'Editorial Styling', 'Film Photography']
  },
  {
    id: 'dm4',
    name: 'Noah Bennett',
    age: 29,
    occupation: 'Oceanographer & Surfer',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[4/5]',
    conversationStarter: 'Ask about his recent marine conservation expedition to Fiji 🌊',
    location: 'Pacifica, CA',
    distance: '8 miles away',
    interests: ['Surfing', 'Marine Biology', 'Sunset Campfires']
  },
  {
    id: 'dm5',
    name: 'Freya Lindquist',
    age: 27,
    occupation: 'Nordic Interior Architect',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
    conversationStarter: 'Discuss mid-century modern furniture design over matcha lattes 🛋️',
    location: 'San Francisco, CA',
    distance: '2 miles away',
    interests: ['Minimalism', 'Ceramics', 'Matcha', 'Scandi Design']
  },
  {
    id: 'dm6',
    name: 'Mateo Rossi',
    age: 30,
    occupation: 'Industrial Designer',
    image: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[4/5]',
    conversationStarter: 'Ask about his handmade leather bag craftsmanship project 🎒',
    location: 'Oakland, CA',
    distance: '4 miles away',
    interests: ['Leatherwork', 'Espresso Machines', 'Italian Cinema']
  },
  {
    id: 'dm7',
    name: 'Hana Tanaka',
    age: 24,
    occupation: 'Ceramic Sculptor & Illustrator',
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
    conversationStarter: 'Comment on her hand-painted pottery studio collection 🏺',
    location: 'Berkeley, CA',
    distance: '6 miles away',
    interests: ['Pottery', 'Manga Art', 'Tea Culture']
  },
  {
    id: 'dm8',
    name: 'Nora Sterling',
    age: 27,
    occupation: 'Astrophysicist & Poet',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
    aspectRatio: 'aspect-[4/5]',
    conversationStarter: 'Ask about her observatory telescope night session 🌌',
    location: 'San Francisco, CA',
    distance: '3 miles away',
    interests: ['Cosmology', 'Spoken Word', 'Boba Tea']
  }
];

export const TRENDING_EVENTS: TrendingEvent[] = [
  {
    id: 'te1',
    title: 'Secret Speakeasy & Jazz Piano Night',
    category: 'Music',
    date: 'Tomorrow • 8:00 PM',
    location: 'Bourbon & Branch, SF',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    attendees: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600'
    ],
    spotsLeft: 4,
    hostName: 'Elena R.',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'te2',
    title: 'Artisan Matcha Tasting & Clay Workshop',
    category: 'Coffee',
    date: 'Saturday • 11:00 AM',
    location: 'Mission Clay Studio, SF',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    attendees: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=600'
    ],
    spotsLeft: 2,
    hostName: 'Zoe H.',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'te3',
    title: 'Golden Gate Sunset Film & Analog Photo Walk',
    category: 'Photography',
    date: 'Sunday • 5:30 PM',
    location: 'Lands End Trail, SF',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    attendees: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600'
    ],
    spotsLeft: 6,
    hostName: 'Marcus V.',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'te4',
    title: 'Sonoma Organic Wine & Tapas Pairing',
    category: 'Travel',
    date: 'Next Weekend • All Day',
    location: 'Sonoma Valley Estate',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    attendees: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600'
    ],
    spotsLeft: 3,
    hostName: 'Julian C.',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
  }
];

export const COMMUNITY_BUBBLES: CommunityBubble[] = [
  {
    id: 'cb1',
    name: '35mm Film & Visual Art',
    membersCount: '1.4k members',
    bgGradient: 'from-purple-900/60 via-indigo-900/40 to-pink-900/60',
    accentColor: '#EC4899',
    avatarList: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 42,
    topic: 'Leica M6 vs Contax T2 for street portraits'
  },
  {
    id: 'cb2',
    name: 'AI Researchers & Founders',
    membersCount: '2.1k members',
    bgGradient: 'from-blue-900/60 via-cyan-900/40 to-emerald-900/60',
    accentColor: '#3B82F6',
    avatarList: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 88,
    topic: 'Autonomous agent design & spatial interfaces'
  },
  {
    id: 'cb3',
    name: 'Tokyo & Kyoto Travelers',
    membersCount: '980 members',
    bgGradient: 'from-rose-900/60 via-purple-900/40 to-amber-900/60',
    accentColor: '#F43F5E',
    avatarList: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 31,
    topic: 'Hidden ryokans in Arashiyama bamboo forest'
  },
  {
    id: 'cb4',
    name: 'Coffee Chemistry & Pour Overs',
    membersCount: '1.8k members',
    bgGradient: 'from-amber-900/60 via-orange-900/40 to-yellow-900/60',
    accentColor: '#F59E0B',
    avatarList: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 56,
    topic: 'Single-origin Ethiopian Gesha brewing ratios'
  },
  {
    id: 'cb5',
    name: 'Anime & Cyberpunk Aesthetics',
    membersCount: '3.4k members',
    bgGradient: 'from-fuchsia-900/60 via-purple-900/40 to-cyan-900/60',
    accentColor: '#D946EF',
    avatarList: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 112,
    topic: 'Ghost in the Shell & Akira architectural analysis'
  },
  {
    id: 'cb6',
    name: 'Mindful Bouldering & Outdoors',
    membersCount: '1.2k members',
    bgGradient: 'from-emerald-900/60 via-teal-900/40 to-cyan-900/60',
    accentColor: '#10B981',
    avatarList: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 29,
    topic: 'Weekend V7 boulder session in Bishop'
  }
];

export const RECENT_MESSAGES: RecentMessage[] = [
  {
    id: 'rm1',
    senderName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    lastMessage: 'Listen to this Bach violin excerpt I recorded! Let me know if you want to get coffee before the gallery exhibit.',
    timestamp: '2m ago',
    unreadCount: 2,
    isTyping: true,
    hasVoiceMessage: true,
    voiceDuration: '0:42',
    hasPhoto: false,
    isOnline: true
  },
  {
    id: 'rm2',
    senderName: 'Zoe Hayashi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    lastMessage: 'Here is the 3D pavilion render I mentioned yesterday ✨',
    timestamp: '15m ago',
    unreadCount: 1,
    isTyping: false,
    hasVoiceMessage: false,
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=600',
    isOnline: true
  },
  {
    id: 'rm3',
    senderName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    lastMessage: 'Just finished editing the Yosemite documentary preview! When are you free to grab tacos in Mission?',
    timestamp: '1h ago',
    unreadCount: 0,
    isTyping: false,
    hasVoiceMessage: false,
    hasPhoto: false,
    isOnline: true
  },
  {
    id: 'rm4',
    senderName: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    lastMessage: 'That jazz piano spot on Friday sounds perfect. I reserved a corner table for us!',
    timestamp: '3h ago',
    unreadCount: 0,
    isTyping: false,
    hasVoiceMessage: false,
    hasPhoto: false,
    isOnline: false
  }
];

export const AI_WINGMAN_CARDS: AIWingmanCard[] = [
  {
    id: 'wc1',
    type: 'interaction',
    personName: 'Emily Rostova',
    personAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    headline: 'Emily smiled at your last voice message about classical music.',
    timestamp: 'Just now',
    suggestedAction: 'Ask her out to the SF Symphony preview next Thursday.',
    actionType: 'coffee',
    accentColor: '#10B981'
  },
  {
    id: 'wc2',
    type: 'interaction',
    personName: 'Marcus Vance',
    personAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    headline: 'Marcus viewed your profile photos and liked your Yosemite trip highlight.',
    timestamp: '12m ago',
    suggestedAction: 'Send Marcus a recommendation for the new climbing gym in Dogpatch.',
    actionType: 'message',
    accentColor: '#3B82F6'
  },
  {
    id: 'wc3',
    type: 'interaction',
    personName: 'Sophia Chen',
    personAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    headline: 'Sophia liked your photo at the De Young Art Exhibition.',
    timestamp: '45m ago',
    suggestedAction: 'Send Sophia an invite for oat cortados at Sightglass Coffee.',
    actionType: 'coffee',
    accentColor: '#EC4899'
  },
  {
    id: 'wc4',
    type: 'recommendation',
    personName: 'Zoe Hayashi',
    personAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    headline: 'Recommended: Send Zoe a coffee invite for Saturday morning.',
    timestamp: 'AI Insight',
    suggestedAction: 'High 99% compatibility match detected in your neighborhood.',
    actionType: 'coffee',
    accentColor: '#F59E0B'
  }
];

export const UPCOMING_DATES: UpcomingDate[] = [
  {
    id: 'ud1',
    partnerName: 'Elena Rostova',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    partnerAge: 26,
    type: 'Coffee',
    locationName: 'Sightglass Coffee & Roastery',
    address: '270 7th St, San Francisco, CA',
    date: 'Friday, Aug 7',
    time: '4:30 PM',
    countdown: 'In 2 days',
    weather: { temp: '68°F', condition: 'Sunny & Crisp', icon: '☀️' },
    mapImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600',
    bgImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ud2',
    partnerName: 'Zoe Hayashi',
    partnerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    partnerAge: 25,
    type: 'Museum',
    locationName: 'SF MoMA Spatial Design Exhibit',
    address: '151 3rd St, San Francisco, CA',
    date: 'Sunday, Aug 9',
    time: '2:00 PM',
    countdown: 'In 4 days',
    weather: { temp: '72°F', condition: 'Clear Sky', icon: '🌤️' },
    mapImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600',
    bgImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800'
  }
];
