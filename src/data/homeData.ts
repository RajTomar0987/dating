export interface LiveActivityItem {
  id: string;
  icon: string;
  text: string;
  timeAgo: string;
  accentColor: string;
}

export interface LargeTinderMatch {
  id: string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  location: string;
  portrait: string;
  interests: [string, string]; // exactly two shared interests
  online: boolean;
  aiReason: string;
  matchScore: number;
  verified: boolean;
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
  isAiRecommended?: boolean;
  videoUrl?: string;
}

export interface FeaturedCouple {
  id: string;
  coupleNames: string;
  timeMatched: string;
  photoBefore: string;
  photoAfter: string;
  quote: string;
  location: string;
}

export interface TrendingItem {
  id: string;
  category: 'cafes' | 'songs' | 'spots' | 'movies' | 'restaurants';
  title: string;
  subtitle: string;
  image: string;
  icon: string;
  rating?: string;
}

export interface ConversationBubble {
  id: string;
  icon: string;
  text: string;
  personName: string;
  bgGradient: string;
}

export interface CompactRecommendation {
  id: string;
  icon: string;
  headline: string;
  detail: string;
  color: string;
}

export interface SocialStreamItem {
  id: string;
  userAvatar: string;
  userName: string;
  actionText: string;
  timestamp: string;
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
// MOCK DATA
// ----------------------------------------------------

export const LIVE_ACTIVITY_TICKER: LiveActivityItem[] = [
  { id: 'lat1', icon: '❤️', text: 'Emma liked your travel photo in Kyoto', timeAgo: 'Just now', accentColor: '#EC4899' },
  { id: 'lat2', icon: '💬', text: 'Zoe replied to your spatial architecture question', timeAgo: '2m ago', accentColor: '#3B82F6' },
  { id: 'lat3', icon: '📅', text: 'Marcus accepted your coffee invitation at Sightglass', timeAgo: '5m ago', accentColor: '#10B981' },
  { id: 'lat4', icon: '🎵', text: 'Sophia shared a Bach & Nils Frahm playlist', timeAgo: '8m ago', accentColor: '#A855F7' },
  { id: 'lat5', icon: '📍', text: '14 new people joined nearby in Hayes Valley', timeAgo: '12m ago', accentColor: '#06B6D4' },
  { id: 'lat6', icon: '✨', text: 'Aura Digital Twin found 3 higher affinity matches', timeAgo: '15m ago', accentColor: '#F59E0B' }
];

export const LARGE_TINDER_MATCHES: LargeTinderMatch[] = [
  {
    id: 'ltm1',
    name: 'Elena Rostova',
    age: 26,
    distance: '2 miles away',
    occupation: 'AI Scientist & Violinist',
    location: 'San Francisco, CA',
    portrait: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    interests: ['AI Research', 'Violin Sonatas'],
    online: true,
    aiReason: '98% Synergy: You both value deep focus hours, minimalist design & classical music.',
    matchScore: 98,
    verified: true
  },
  {
    id: 'ltm2',
    name: 'Zoe Hayashi',
    age: 25,
    distance: '4 miles away',
    occupation: 'Spatial Architect & Artist',
    location: 'Oakland, CA',
    portrait: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    interests: ['Generative Art', 'Tea Ceremony'],
    online: true,
    aiReason: '96% Synergy: Perfect match for spatial VR design & quiet ambient music dates.',
    matchScore: 96,
    verified: true
  },
  {
    id: 'ltm3',
    name: 'Marcus Vance',
    age: 29,
    distance: '3 miles away',
    occupation: 'Documentary Filmmaker',
    location: 'San Francisco, CA',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    interests: ['35mm Film', 'Yosemite Climb'],
    online: true,
    aiReason: '95% Synergy: Shared passion for storytelling, documentary cinema & outdoors.',
    matchScore: 95,
    verified: true
  },
  {
    id: 'ltm4',
    name: 'Sophia Chen',
    age: 27,
    distance: '1 mile away',
    occupation: 'Neurotech Lead & Pianist',
    location: 'San Francisco, CA',
    portrait: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    interests: ['Neuroscience', 'Jazz Piano'],
    online: false,
    aiReason: '94% Synergy: Shared interest in empathetic technology & nocturnal music sessions.',
    matchScore: 94,
    verified: true
  }
];

export const STORIES_DATA: StoryItem[] = [
  { id: 'st1', name: 'Zoe Hayashi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1514626585111-d870798f8013?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '10m ago', caption: 'Sunset rooftop violins in Hayes Valley ✨ 🎻', isAiRecommended: true },
  { id: 'st2', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '25m ago', caption: 'Late night espresso & model training ☕️ 🧠', isAiRecommended: true },
  { id: 'st3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '1h ago', caption: 'Bouldering high above the Valley clouds 🧗‍♂️ 🌲' },
  { id: 'st4', name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800', hasUnviewed: false, isOnline: false, timeAgo: '3h ago', caption: 'SF MoMA modern art walkthrough 🎨' },
  { id: 'st5', name: 'Chloe Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', hasUnviewed: true, isOnline: true, timeAgo: '4h ago', caption: 'Listening to vinyls on rainy afternoons 🎶' },
  { id: 'st6', name: 'Julian Cross', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600', storyImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', hasUnviewed: false, isOnline: true, timeAgo: '5h ago', caption: 'Chef tasting menu testing session 🍷 🍽️' }
];

export const SOCIAL_STREAM: SocialStreamItem[] = [
  { id: 'ss1', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', userName: 'Marcus V.', actionText: 'posted a new Yosemite hiking photo', timestamp: '1m ago' },
  { id: 'ss2', userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', userName: 'Sophia C.', actionText: 'joined Coffee Chemistry Hub', timestamp: '3m ago' },
  { id: 'ss3', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', userName: 'Elena R.', actionText: 'started typing a voice message...', timestamp: '4m ago' },
  { id: 'ss4', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', userName: 'David L.', actionText: 'is attending Secret Speakeasy Jazz Night', timestamp: '7m ago' },
  { id: 'ss5', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', userName: 'Luna M.', actionText: 'uploaded a 28s voice intro note', timestamp: '10m ago' },
  { id: 'ss6', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', userName: 'Zoe H.', actionText: 'is checked in nearby at Sightglass', timestamp: '12m ago' }
];

export const FEATURED_COUPLES: FeaturedCouple[] = [
  {
    id: 'fc1',
    coupleNames: 'Elena & Raj',
    timeMatched: 'Matched 6 months ago through Aura',
    photoBefore: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    photoAfter: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    quote: '“We matched over a shared passion for Bach sonatas and dark roast coffee. Now we co-live in Hayes Valley!”',
    location: 'San Francisco, CA'
  },
  {
    id: 'fc2',
    coupleNames: 'Marcus & Zoe',
    timeMatched: 'Matched 8 months ago through Aura',
    photoBefore: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    photoAfter: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    quote: '“Started with a 35mm photo walk in Chinatown, now planning our trip to Kyoto together.”',
    location: 'Oakland, CA'
  }
];

export const TRENDING_THIS_WEEK: TrendingItem[] = [
  { id: 't1', category: 'cafes', title: 'Sightglass Coffee Roastery', subtitle: '8 active matches checked in today', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400', icon: '🔥', rating: '4.9 ★' },
  { id: 't2', category: 'songs', title: 'Says by Nils Frahm', subtitle: 'Top played track among 98% matches', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400', icon: '🎵' },
  { id: 't3', category: 'spots', title: 'Lands End Sunset Trail', subtitle: 'Most recommended weekend outdoor date', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=400', icon: '📸', rating: '4.8 ★' },
  { id: 't4', category: 'movies', title: 'Interstellar 35mm Screening', subtitle: 'Trending movie date choice this week', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400', icon: '🎬' },
  { id: 't5', category: 'restaurants', title: 'Bourbon & Branch Speakeasy', subtitle: 'Favorite spot for quiet cocktail dates', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400', icon: '🍜', rating: '4.9 ★' }
];

export const CONVERSATION_BUBBLES: ConversationBubble[] = [
  { id: 'cb1', icon: '💬', text: 'Ask about her Kyoto ryokan tea trip', personName: 'Elena', bgGradient: 'from-pink-600/80 to-purple-700/80' },
  { id: 'cb2', icon: '🎵', text: 'Share a Nils Frahm ambient playlist', personName: 'Sophia', bgGradient: 'from-purple-600/80 to-indigo-700/80' },
  { id: 'cb3', icon: '☕', text: 'Invite for cortados at Sightglass', personName: 'Zoe', bgGradient: 'from-amber-600/80 to-orange-700/80' },
  { id: 'cb4', icon: '🎬', text: 'Recommend the 35mm film screening', personName: 'Marcus', bgGradient: 'from-cyan-600/80 to-blue-700/80' }
];

export const COMPACT_AI_RECOMMENDATIONS: CompactRecommendation[] = [
  { id: 'cr1', icon: '✨', headline: 'Optimal Response Window', detail: 'Best time to message Elena is around 8:15 PM after focus hours.', color: '#10B981' },
  { id: 'cr2', icon: '❤️', headline: 'Music Preference Overlap', detail: 'Elena loves Nils Frahm, Bach, and Kiasmos synth pop.', color: '#EC4899' },
  { id: 'cr3', icon: '☕', headline: 'Top Date Location', detail: 'Favorite pour-over café: Sightglass Coffee on 7th St.', color: '#F59E0B' },
  { id: 'cr4', icon: '🌍', headline: 'Dream Trip Shared', detail: 'You both have Kyoto autumn tea gardens on your wishlist.', color: '#3B82F6' }
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
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
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
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600'
    ],
    spotsLeft: 2,
    hostName: 'Zoe H.',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
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
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
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
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
    ],
    activeCount: 88,
    topic: 'Autonomous agent design & spatial interfaces'
  }
];

export const AI_WINGMAN_CARDS: AIWingmanCard[] = [
  {
    id: 'wc1',
    type: 'interaction',
    personName: 'Elena Rostova',
    personAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    headline: 'Elena smiled at your last voice message about classical music.',
    timestamp: 'Just now',
    suggestedAction: 'Ask her out to the SF Symphony preview next Thursday.',
    actionType: 'coffee',
    accentColor: '#10B981'
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
  }
];
