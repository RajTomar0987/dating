export interface StoryHighlight {
  id: string;
  title: string;
  icon: string;
  coverImage: string;
  storyMedia: string;
  caption: string;
  timeAgo: string;
}

export interface GalleryMedia {
  id: string;
  type: 'photo' | 'video' | 'voice' | 'memory3d';
  url: string;
  caption: string;
  likes: number;
  voiceDuration?: string;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  duration: string;
  isFavorite: boolean;
}

export interface PersonalitySphere {
  id: string;
  name: string;
  score: number; // 0 - 100
  color: string;
  explanation: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  category: 'Education' | 'Career' | 'Travel' | 'Achievement' | 'Personal';
  description: string;
  icon: string;
  image?: string;
}

export interface TravelDestination {
  id: string;
  country: string;
  flag: string;
  status: 'Visited' | 'Dream' | 'Upcoming';
  year?: string;
  image: string;
}

export interface ProfileDetailData {
  name: string;
  age: number;
  distance: string;
  occupation: string;
  education: string;
  location: string;
  languages: string[];
  relationshipIntention: string;
  lastActive: string;
  isOnline: boolean;
  isVerified: boolean;
  isAiVerified: boolean;
  avatar: string;
  coverMedia: string;
  voiceIntroUrl: string;
  voiceIntroDuration: string;
  
  // About Me
  quote: string;
  lifeGoals: string;
  dreamDestination: string;
  weekendRoutine: string;
  loveLanguage: string;
  personalityType: string;
  communicationStyle: string;
  relationshipExpectations: string;

  // Social Overlap
  sharedInterests: string[];
  mutualCommunities: string[];
  favoriteCafes: string[];
  sharedPlaylists: string[];
  
  // Data Collections
  highlights: StoryHighlight[];
  gallery: GalleryMedia[];
  spotifyTracks: SpotifyTrack[];
  personalitySpheres: PersonalitySphere[];
  timeline: TimelineMilestone[];
  travel: TravelDestination[];
  aiInsights: string[];
}

export const PROFILE_DATA: ProfileDetailData = {
  name: 'Elena Rostova',
  age: 26,
  distance: '2 miles away',
  occupation: 'AI Research Scientist & Classical Violinist',
  education: 'M.S. Computer Science, Stanford University',
  location: 'Hayes Valley, San Francisco, CA',
  languages: ['English (Native)', 'Russian (Fluent)', 'Japanese (Conversational)'],
  relationshipIntention: 'Intentional Long-Term Co-Living & Creative Partnership',
  lastActive: 'Online now (2 min ago)',
  isOnline: true,
  isVerified: true,
  isAiVerified: true,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
  coverMedia: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=1200',
  voiceIntroUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
  voiceIntroDuration: '0:28',

  quote: '“Architecture is frozen music, and neural models are digital poetry.”',
  lifeGoals: 'Publishing model distillation research that makes healthcare AI accessible globally, while performing Bach sonatas at Carnegie Hall.',
  dreamDestination: 'Kyoto in autumn for a 2-week quiet ryokan tea ceremony retreat.',
  weekendRoutine: 'Early morning pour-over at Sightglass, 2 hours of violin practice, reading philosophy at SF MoMA garden, and late-night ramen.',
  loveLanguage: 'Quality Time & Acts of Service',
  personalityType: 'INTJ-A (The Architect)',
  communicationStyle: 'Direct, thoughtful, long-form active listening with low drama.',
  relationshipExpectations: 'Mutual intellectual growth, co-creating quiet daily rituals, and honest emotional transparency.',

  sharedInterests: ['AI Research', 'Violin Sonatas', 'Dark Roast Coffee', '35mm Film', 'Cyberpunk Aesthetics'],
  mutualCommunities: ['AI Researchers & Founders', 'Coffee Chemistry', '35mm Analog Film'],
  favoriteCafes: ['Sightglass Roastery (7th St)', 'Coffee Movement (Nob Hill)', 'Linea Caffe'],
  sharedPlaylists: ['Late Night Focus & Ambient Classical', 'Kyoto Synth Pop Sessions'],

  highlights: [
    { id: 'h1', title: 'Travel', icon: '✈️', coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800', caption: 'Kyoto ryokan tea ceremony at sunrise 🍵', timeAgo: '2w ago' },
    { id: 'h2', title: 'Pets', icon: '🐶', coverImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800', caption: 'Mochi reviewing model loss curves 🐱', timeAgo: '1w ago' },
    { id: 'h3', title: 'Coffee', icon: '☕', coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', caption: 'Single-origin Ethiopian Gesha pour-over ✨', timeAgo: '3d ago' },
    { id: 'h4', title: 'Music', icon: '🎧', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', caption: 'Playing Bach Chaconne at Hayes Valley studio 🎻', timeAgo: '5d ago' },
    { id: 'h5', title: 'Food', icon: '🍜', coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800', caption: 'Midnight tonkotsu ramen in Japantown 🍜', timeAgo: '4d ago' },
    { id: 'h6', title: 'Gym', icon: '🏋', coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', caption: 'Morning Pilates & reformer session 🧘‍♀️', timeAgo: '6d ago' },
    { id: 'h7', title: 'Art', icon: '🎨', coverImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800', caption: 'SF MoMA spatial installation walk 🖼️', timeAgo: '1w ago' },
    { id: 'h8', title: 'Movies', icon: '🎬', coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800', caption: 'Blade Runner 2049 35mm screening 🌌', timeAgo: '2w ago' },
    { id: 'h9', title: 'Friends', icon: '👯', coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', caption: 'Rooftop dinner party with the AI lab team 🥂', timeAgo: '3w ago' },
    { id: 'h10', title: 'Events', icon: '🎪', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400', storyMedia: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', caption: 'Outside Lands music festival sunset 🌄', timeAgo: '1m ago' }
  ],

  gallery: [
    { id: 'g1', type: 'photo', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', caption: 'Performing Bach Violin Sonatas at San Francisco Conservatory', likes: 142 },
    { id: 'g2', type: 'photo', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', caption: 'Balcony espresso breaks between model training runs', likes: 98 },
    { id: 'g3', type: 'voice', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', caption: 'Listen to my 28-second voice intro & violin snippet', likes: 215, voiceDuration: '0:28' },
    { id: 'g4', type: 'video', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', caption: 'Rehearsal snippet: Beethoven Violin Concerto in D Major', likes: 310 },
    { id: 'g5', type: 'memory3d', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800', caption: '3D Spatial Snapshot: Arashiyama Bamboo Forest in Kyoto', likes: 184 },
    { id: 'g6', type: 'photo', url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800', caption: 'Exploring modern art galleries in Hayes Valley', likes: 126 }
  ],

  spotifyTracks: [
    { id: 't1', title: 'Says', artist: 'Nils Frahm', albumCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300', duration: '8:18', isFavorite: true },
    { id: 't2', title: 'Chaconne in D Minor', artist: 'J.S. Bach / Hilary Hahn', albumCover: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=300', duration: '13:45', isFavorite: true },
    { id: 't3', title: 'Blurred', artist: 'Kiasmos', albumCover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300', duration: '5:05', isFavorite: false },
    { id: 't4', title: 'On the Nature of Daylight', artist: 'Max Richter', albumCover: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=300', duration: '6:11', isFavorite: true }
  ],

  personalitySpheres: [
    { id: 'ps1', name: 'Creativity', score: 98, color: '#EC4899', explanation: 'High artistic output across violin composition, generative AI design, and editorial photography.' },
    { id: 'ps2', name: 'Curiosity', score: 96, color: '#3B82F6', explanation: 'Deep intellectual drive exploring neural network architectures and quantum computing.' },
    { id: 'ps3', name: 'Kindness', score: 94, color: '#10B981', explanation: 'Warm active listener who values empathetic transparency in long-term relationships.' },
    { id: 'ps4', name: 'Communication', score: 95, color: '#A855F7', explanation: 'Prefers intentional long-form conversations over superficial small talk.' },
    { id: 'ps5', name: 'Adventure', score: 88, color: '#F59E0B', explanation: 'Loves spontaneous weekend road trips to Sonoma wineries and Kyoto tea gardens.' },
    { id: 'ps6', name: 'Romance', score: 92, color: '#F43F5E', explanation: 'Expresses love through physical presence, homemade cortados, and vinyl listening dates.' }
  ],

  timeline: [
    { id: 'tm1', year: '2022', title: 'M.S. Computer Science Graduation', category: 'Education', description: 'Graduated from Stanford University specializing in Neural Attention Mechanisms.', icon: '🎓', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400' },
    { id: 'tm2', year: '2023', title: 'First Violin Solo at SF Conservatory', category: 'Achievement', description: 'Performed Bach Chaconne in D Minor to a sold-out audience in Civic Center.', icon: '🎻', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400' },
    { id: 'tm3', year: '2024', title: 'NeurIPS AI Research Publication', category: 'Career', description: 'Co-authored groundbreaking research paper on efficient model distillation.', icon: '📜', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=400' },
    { id: 'tm4', year: '2025', title: 'Kyoto Ryokan & Tea Ceremony Tour', category: 'Travel', description: 'Spent 3 weeks studying traditional tea ceremonies in Kyoto and Uji.', icon: '🍵', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400' },
    { id: 'tm5', year: '2026', title: 'Joined AuraAI Co-Living Community', category: 'Personal', description: 'Calibrated AI Digital Twin for intentional long-term relationship matching.', icon: '✨', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' }
  ],

  travel: [
    { id: 'tr1', country: 'Japan', flag: '🇯🇵', status: 'Visited', year: '2025', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400' },
    { id: 'tr2', country: 'Iceland', flag: '🇮🇸', status: 'Visited', year: '2024', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=400' },
    { id: 'tr3', country: 'Austria', flag: '🇦🇹', status: 'Visited', year: '2023', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=400' },
    { id: 'tr4', country: 'Norway Fjords', flag: '🇳🇴', status: 'Dream', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400' },
    { id: 'tr5', country: 'Oaxaca, Mexico', flag: '🇲🇽', status: 'Upcoming', year: 'Nov 2026', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&q=80&w=400' }
  ],

  aiInsights: [
    '✨ You both enjoy spontaneous weekend coffee pour-overs and classical music.',
    '🌙 You both usually reply in the evening after quiet focus hours.',
    '🎨 Shared interest in spatial computing, minimalist architecture & 35mm film.',
    '🍵 High overlap in lifestyle values: early morning focus routines and zero-drama communication.'
  ]
};
