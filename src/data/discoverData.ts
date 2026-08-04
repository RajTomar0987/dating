export interface CategoryChip {
  id: string;
  name: string;
  icon: string;
  count: string;
  gradient: string;
}

export interface ProfileDiscoverCard {
  type: 'profile';
  id: string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  location: string;
  image: string;
  additionalPhotos: string[];
  interests: string[];
  compatibility: number;
  mutualCommunities: string[];
  verified: boolean;
  hasVoiceIntro: boolean;
  voiceDuration: string;
  introText: string;
  favoriteMusic: string;
  favoritePlace: string;
  pets: string;
  travelHistory: string[];
  category: string;
}

export interface ReelDiscoverCard {
  type: 'reel';
  id: string;
  creatorName: string;
  creatorAge: number;
  creatorAvatar: string;
  creatorOccupation: string;
  thumbnail: string;
  videoUrl: string; // fallback image/video poster
  duration: string;
  caption: string;
  likesCount: string;
  category: string;
}

export interface PlaceEventDiscoverCard {
  type: 'experience';
  id: string;
  title: string;
  categoryName: string;
  image: string;
  location: string;
  rating: number;
  reviewsCount: number;
  price: string;
  attendeesAvatars: string[];
  aiReason: string;
  category: string;
}

export interface CommunityDiscoverCard {
  type: 'community';
  id: string;
  name: string;
  membersCount: string;
  onlineCount: number;
  bannerImage: string;
  accentColor: string;
  recentDiscussion: string;
  activeUsersAvatars: string[];
  category: string;
}

export interface AIRecommendationDiscoverCard {
  type: 'ai_recommendation';
  id: string;
  headline: string;
  subtext: string;
  relatedImage: string;
  matchAvatars: string[];
  actionLabel: string;
  category: string;
}

export type DiscoverFeedItem = 
  | ProfileDiscoverCard 
  | ReelDiscoverCard 
  | PlaceEventDiscoverCard 
  | CommunityDiscoverCard 
  | AIRecommendationDiscoverCard;

export interface MapPin {
  id: string;
  name: string;
  type: 'cafe' | 'event' | 'museum' | 'concert' | 'spot';
  latPct: number; // position percentage on custom map box
  lngPct: number;
  image: string;
  address: string;
  liveMatchesCount: number;
  matchAvatars: string[];
}

// ----------------------------------------------------
// MOCK DATA
// ----------------------------------------------------

export const CATEGORIES: CategoryChip[] = [
  { id: 'all', name: 'All Discover', icon: '✨', count: '1.2k live', gradient: 'from-pink-500 to-purple-600' },
  { id: 'serious', name: 'Serious Dating', icon: '❤️', count: '420 online', gradient: 'from-rose-500 to-red-600' },
  { id: 'coffee', name: 'Coffee Lovers', icon: '☕', count: '310 online', gradient: 'from-amber-500 to-orange-600' },
  { id: 'travel', name: 'Travelers', icon: '🌍', count: '540 online', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'gaming', name: 'Gamers', icon: '🎮', count: '280 online', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'reading', name: 'Readers', icon: '📚', count: '190 online', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'art', name: 'Artists', icon: '🎨', count: '350 online', gradient: 'from-fuchsia-500 to-pink-600' },
  { id: 'music', name: 'Music', icon: '🎧', count: '610 online', gradient: 'from-violet-500 to-purple-700' },
  { id: 'fitness', name: 'Fitness', icon: '🏋', count: '430 online', gradient: 'from-green-500 to-emerald-700' },
  { id: 'food', name: 'Foodies', icon: '🍜', count: '390 online', gradient: 'from-yellow-500 to-amber-600' },
  { id: 'pets', name: 'Pet Lovers', icon: '🐶', count: '260 online', gradient: 'from-orange-400 to-pink-500' }
];

export const DISCOVER_FEED: DiscoverFeedItem[] = [
  // 1. Profile Card
  {
    type: 'profile',
    id: 'dp1',
    name: 'Elena Rostova',
    age: 26,
    distance: '2 miles away',
    occupation: 'AI Research Scientist & Violinist',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
    ],
    interests: ['AI Research', 'Violin', 'Dark Roast Coffee', 'Cyberpunk'],
    compatibility: 98,
    mutualCommunities: ['AI Researchers & Founders', 'Coffee Chemistry'],
    verified: true,
    hasVoiceIntro: true,
    voiceDuration: '0:28',
    introText: 'Hi! I spend half my day training transformer models and the other half playing Bach sonatas on my 1920s violin.',
    favoriteMusic: 'Nils Frahm - Says & Bach Chaconne',
    favoritePlace: 'Sightglass Coffee Roastery on 7th St',
    pets: 'Mochi (2yo Maine Coon Cat)',
    travelHistory: ['Kyoto Ryokan', 'Vienna Concert Hall', 'Iceland Ring Road'],
    category: 'coffee'
  },
  // 2. Video Reel Card
  {
    type: 'reel',
    id: 'dr1',
    creatorName: 'Marcus Vance',
    creatorAge: 29,
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    creatorOccupation: 'Documentary Filmmaker',
    thumbnail: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800',
    duration: '0:10',
    caption: '3 things I look for on a first date: 1. Sourdough passion, 2. Love for 35mm film, 3. Willingness to climb Yosemite boulders 🧗‍♂️',
    likesCount: '2.4k',
    category: 'art'
  },
  // 3. Experience Place Card
  {
    type: 'experience',
    id: 'de1',
    title: 'Secret Speakeasy Jazz & Candlelight Cocktail Evening',
    categoryName: 'Music & Speakeasy',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    location: 'Bourbon & Branch, Tenderloin, SF',
    rating: 4.9,
    reviewsCount: 142,
    price: '$35 / person',
    attendeesAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
    ],
    aiReason: 'Popular date spot for 14 matches in your neighborhood this week.',
    category: 'music'
  },
  // 4. Profile Card
  {
    type: 'profile',
    id: 'dp2',
    name: 'Zoe Hayashi',
    age: 25,
    distance: '4 miles away',
    occupation: 'Spatial Architect & Generative Artist',
    location: 'Oakland, CA',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=800'
    ],
    interests: ['Spatial Design', 'Generative Art', 'Tea Ceremony', 'Synth Pop'],
    compatibility: 96,
    mutualCommunities: ['Tokyo Travelers', '35mm Film'],
    verified: true,
    hasVoiceIntro: true,
    voiceDuration: '0:35',
    introText: 'Designing eco-futuristic pavilions in VR. Looking for quiet tea ceremony dates and synth pop concerts.',
    favoriteMusic: 'Tycho & Kiasmos',
    favoritePlace: 'Japanese Tea Garden in Golden Gate Park',
    pets: 'Shiba Inu named Kiko',
    travelHistory: ['Kyoto Bamboo Forest', 'Naoshima Art Island'],
    category: 'serious'
  },
  // 5. EVERY 5th CARD: AURA AI RECOMMENDATION
  {
    type: 'ai_recommendation',
    id: 'ai_rec_1',
    headline: 'You’ll probably enjoy Sightglass Coffee today',
    subtext: '8 nearby matches (including Elena R. & Zoe H.) recently visited this café for pour-over espresso.',
    relatedImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    matchAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
    ],
    actionLabel: 'Plan Coffee Date at Sightglass',
    category: 'coffee'
  },
  // 6. Community Card
  {
    type: 'community',
    id: 'dc1',
    name: '35mm Analog Film & Visual Art',
    membersCount: '1.4k members',
    onlineCount: 42,
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    accentColor: '#EC4899',
    recentDiscussion: 'Discussing Kodak Portra 400 vs Cinestill 800T for night street portraits in Chinatown.',
    activeUsersAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'art'
  },
  // 7. Profile Card
  {
    type: 'profile',
    id: 'dp3',
    name: 'Sophia Chen',
    age: 27,
    distance: '1 mile away',
    occupation: 'Neurotech Lead & Jazz Pianist',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    ],
    interests: ['Neuroscience', 'Jazz Piano', 'Indie Cinema', 'Stargazing'],
    compatibility: 94,
    mutualCommunities: ['AI Researchers & Founders'],
    verified: true,
    hasVoiceIntro: false,
    voiceDuration: '',
    introText: 'Building brain-computer interfaces by day, jamming jazz improvisations by night.',
    favoriteMusic: 'Bill Evans & Miles Davis',
    favoritePlace: 'Black Cat Jazz Club in SF',
    pets: 'Golden Retriever named Newton',
    travelHistory: ['Montreux Jazz Festival', 'Zermatt Alps'],
    category: 'music'
  },
  // 8. Video Reel Card
  {
    type: 'reel',
    id: 'dr2',
    creatorName: 'Amara Vance',
    creatorAge: 26,
    creatorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
    creatorOccupation: 'Spatial Audio Producer',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    duration: '0:10',
    caption: 'Recording binaural ocean waves at Point Reyes for my next ambient spatial soundscapes 🎧 🌊',
    likesCount: '1.8k',
    category: 'travel'
  },
  // 9. Profile Card
  {
    type: 'profile',
    id: 'dp4',
    name: 'Julian Cross',
    age: 28,
    distance: '5 miles away',
    occupation: 'Culinary Innovator',
    location: 'Oakland, CA',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    ],
    interests: ['Molecular Gastronomy', 'Natural Wine', 'Fermentation'],
    compatibility: 92,
    mutualCommunities: ['Coffee Chemistry'],
    verified: true,
    hasVoiceIntro: true,
    voiceDuration: '0:22',
    introText: 'Crafting 7-course pop-up tasting dinners in private Oakland gardens.',
    favoriteMusic: 'Leon Bridges & Khruangbin',
    favoritePlace: 'Chez Panisse in Berkeley',
    pets: 'French Bulldog named Truffle',
    travelHistory: ['Oaxaca Culinary Tour', 'San Sebastian Pintxos Walk'],
    category: 'food'
  },
  // 10. EVERY 5th CARD: AURA AI RECOMMENDATION
  {
    type: 'ai_recommendation',
    id: 'ai_rec_2',
    headline: 'High Compatibility Outdoor Date Suggestion',
    subtext: 'You and 4 matched profiles share a passion for Lands End Coastal Sunset walks.',
    relatedImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800',
    matchAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    ],
    actionLabel: 'Invite a Match for Lands End Walk',
    category: 'travel'
  }
];

export const NEARBY_MAP_PINS: MapPin[] = [
  {
    id: 'pin1',
    name: 'Sightglass Coffee Roastery',
    type: 'cafe',
    latPct: 35,
    lngPct: 42,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400',
    address: '270 7th St, San Francisco',
    liveMatchesCount: 8,
    matchAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
    ]
  },
  {
    id: 'pin2',
    name: 'Bourbon & Branch Speakeasy',
    type: 'spot',
    latPct: 55,
    lngPct: 60,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    address: '501 Jones St, San Francisco',
    liveMatchesCount: 14,
    matchAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200'
    ]
  },
  {
    id: 'pin3',
    name: 'SF MoMA Spatial Design Exhibit',
    type: 'museum',
    latPct: 68,
    lngPct: 30,
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=400',
    address: '151 3rd St, San Francisco',
    liveMatchesCount: 6,
    matchAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    ]
  },
  {
    id: 'pin4',
    name: 'Lands End Sunset Trailhead',
    type: 'event',
    latPct: 25,
    lngPct: 75,
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=400',
    address: 'Lands End Trail, San Francisco',
    liveMatchesCount: 11,
    matchAvatars: [
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
    ]
  }
];

export const AI_SUGGESTIONS = [
  { label: 'Match Suggestion', text: 'Elena Rostova matches your interest in classical music & AI research.' },
  { label: 'Date Spot', text: 'Sightglass Coffee has 8 nearby active matches right now.' },
  { label: 'Conversation Starter', text: '"What is your favorite vintage film camera lens?" (96% response rate for Zoe)' },
  { label: 'Event Alert', text: 'Secret Speakeasy Jazz Night tomorrow has 4 open spots left.' }
];
