export interface CompatibilityReport {
  overall: number;
  communication: number;
  chemistry: number;
  lifestyle: number;
  longTerm: number;
  conflictRisk: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  greenFlags: string[];
  redFlags: string[];
  conversationTopics: string[];
  perfectFirstDate: string;
  giftSuggestions: string[];
  futurePrediction: string;
}

export interface Profile {
  id: string;
  name: string;
  first_name?: string;
  age: number;
  city?: string;
  profession?: string;
  occupation: string;
  location: string;
  bio: string;
  interests: string[];
  images: string[];
  personalityType: string;
  personality_type?: string;
  relationship_goal?: string;
  compatibility_score?: number;
  last_active?: 'Online now' | '3 min ago' | '10 min ago' | '1 hour ago' | 'Yesterday' | string;
  verified?: boolean;
  premium?: boolean;
  sampleAccount?: boolean;
  loveLanguage: string;
  lifestyle: string[];
  music: string[];
  travel: string[];
  pets: string[];
  languages: string[];
  education: string;
  traits: {
    extroversion: number;
    adventurousness: number;
    logic: number;
    empathy: number;
  };
  compatibilityReport: CompatibilityReport;
  icebreakers: string[];
  personaPrompt: string;
}

// Generate premium profiles for investor demo
export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Elena Rostova",
    age: 26,
    occupation: "AI Research Scientist & Violinist",
    location: "San Francisco, CA",
    bio: "Training neural networks by day, playing Vivaldi by night. I love complex systems, dark roast coffee, and debating whether simulation theory is actually a religion. Looking for someone who can match my hyper-fixations.",
    interests: ["Artificial Intelligence", "Violin", "Classical Music", "Philosophy", "Cyberpunk", "Hiking"],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INTJ",
    loveLanguage: "Quality Time",
    lifestyle: ["Non-smoker", "Early riser", "Organic foods", "Yoga & Meditation"],
    music: ["Bach", "Vivaldi", "Synthwave", "Cyberpunk Industrial"],
    travel: ["Kyoto, Japan", "Reykjavík, Iceland", "Geneva, Switzerland"],
    pets: ["Maine Coon Cat"],
    languages: ["English", "Russian", "Python"],
    education: "PhD in Computer Science, Stanford University",
    traits: {
      extroversion: 35,
      adventurousness: 72,
      logic: 96,
      empathy: 74
    },
    compatibilityReport: {
      overall: 94,
      communication: 90,
      chemistry: 95,
      lifestyle: 88,
      longTerm: 91,
      conflictRisk: 12,
      summary: "Elena's high logical focus and passion for deep technology complement your interest in advanced tech. The combination of her classical music background and your creative interests creates a rich multi-dimensional resonance.",
      strengths: [
        "Hyper-aligned intellectual and tech interests.",
        "Complementary communication style: quiet, analytical, and honest.",
        "Shared curiosity for future systems and complex logic."
      ],
      weaknesses: [
        "Both tend to over-analyze small emotional details.",
        "Risk of neglecting social activities in favor of work goals."
      ],
      greenFlags: [
        "Highly independent and goal-oriented.",
        "Expresses thoughts with clear logical transparency.",
        "Passionate about both arts (violin) and sciences (ML)."
      ],
      redFlags: [
        "Can become hyper-focused and disappear into research code for days."
      ],
      conversationTopics: [
        "The philosophical implications of artificial general intelligence.",
        "Vivaldi's composition structure vs algorithmic music generators.",
        "Best hiking trails in the Bay Area with views of the fog."
      ],
      perfectFirstDate: "A quiet walk through the botanical gardens, followed by a private dark chocolate and light-roast coffee tasting in a tech-infused lab setting.",
      giftSuggestions: [
        "A customized mechanical keyboard with custom-selected silent tactile switches.",
        "First-edition print of Douglas Hofstadter's 'Gödel, Escher, Bach'."
      ],
      futurePrediction: "Within 2 years, your shared projects could blossom into co-founding a startup. Emotionally, you'll establish a low-drama, highly stable relationship built on mutual growth and private humor."
    },
    icebreakers: [
      "Ask her about the latest paper on transformer models she read.",
      "Ask her what classical piece is the hardest to play on the violin.",
      "Propose a debate on whether LLMs can truly understand music."
    ],
    personaPrompt: "You are Elena Rostova. You are highly intellectual, slightly sarcastic but warm when engaged, and love discussing AI, physics, philosophy, and classical music. You speak concisely, use clever vocabulary, and appreciate when the user asks deep questions."
  },
  {
    id: "2",
    name: "Marcus Vance",
    age: 28,
    occupation: "Adventure Travel Filmmaker",
    location: "Austin, TX",
    bio: "Live out of a suitcase but call Austin home. I make documentary films about remote cultures and extreme sports. If I'm not editing footage, I'm probably paragliding or searching for the perfect street taco.",
    interests: ["Filmmaking", "Extreme Sports", "Travel", "Tacos", "Photography", "Rock Climbing"],
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "ENFP",
    loveLanguage: "Physical Touch",
    lifestyle: ["Nomadic tendencies", "Active sports", "Flexible schedule", "Mexican food enthusiast"],
    music: ["Indie Rock", "Americana Folk", "Acoustic Blues", "Spanish Guitar"],
    travel: ["Oaxaca, Mexico", "Patagonia, Chile", "Queenstown, New Zealand"],
    pets: ["None (travel too much)"],
    languages: ["English", "Conversational Spanish"],
    education: "BA in Radio-Television-Film, UT Austin",
    traits: {
      extroversion: 85,
      adventurousness: 98,
      logic: 54,
      empathy: 88
    },
    compatibilityReport: {
      overall: 83,
      communication: 82,
      chemistry: 90,
      lifestyle: 74,
      longTerm: 78,
      conflictRisk: 22,
      summary: "Marcus's high adventurousness matches your desire for excitement. He brings high energy and empathy, though his frequent travel requires strong trust and independent schedules.",
      strengths: [
        "High empathy and emotional warmth.",
        "Brings constant energy, spontaneity, and fun.",
        "Excellent visual storytelling and shared appreciation for arts."
      ],
      weaknesses: [
        "His nomadic lifestyle makes routine planning difficult.",
        "Avoidance of deep logical discussions in favor of emotional experiences."
      ],
      greenFlags: [
        "Incredibly supportive and encouraging of your goals.",
        "Comfortable in diverse social settings and quick to communicate.",
        "Deeply reflective during quiet moments."
      ],
      redFlags: [
        "Tends to avoid conflict until it reaches a boiling point."
      ],
      conversationTopics: [
        "The craziest shot he ever had to get in Patagonia.",
        "Local street taco spots vs Michelin star food.",
        "Where in the world has the friendly communities."
      ],
      perfectFirstDate: "An evening indoor climbing session followed by micro-brew beers and street tacos at a local food truck hub with live music.",
      giftSuggestions: [
        "A rugged, waterproof leather travel journal.",
        "A custom wide-angle lens filter kit for his drone."
      ],
      futurePrediction: "A whirlwind romance filled with spontaneous travel tickets. You will teach him grounding stability, and he will push you out of your comfort zone to live in the moment."
    },
    icebreakers: [
      "Ask him about the most dangerous place he has shot a documentary.",
      "Ask him what his top 3 taco spots in Austin are.",
      "Ask him where he is flying next."
    ],
    personaPrompt: "You are Marcus Vance. You are energetic, positive, open-minded, and love talking about travel stories, cinematography, adrenaline, and food. You use exclamation marks occasionally, ask active questions, and love to encourage the user."
  },
  {
    id: "3",
    name: "Aria Chen",
    age: 25,
    occupation: "UI/UX Designer & Clay Sculptor",
    location: "Seattle, WA",
    bio: "Obsessed with typography, ceramics, and rainy Sunday afternoons. I spend half my time designing digital interfaces and the other half getting my hands dirty in clay. Let's talk aesthetics and coffee.",
    interests: ["UI/UX Design", "Sculpture", "Pottery", "Indie Music", "Coffee Shop Hopping", "Minimalism"],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INFJ",
    loveLanguage: "Words of Affirmation",
    lifestyle: ["Quiet lifestyle", "Vegetarian", "Tea lover", "Eco-friendly focus"],
    music: ["Indie Folk", "Ambient Lofi", "Neo-Classical", "Bon Iver"],
    travel: ["Portland, OR", "Copenhagen, Denmark", "Naoshima Art Island, Japan"],
    pets: ["None"],
    languages: ["English", "Mandarin"],
    education: "BDes in Interaction Design, University of Washington",
    traits: {
      extroversion: 38,
      adventurousness: 58,
      logic: 76,
      empathy: 94
    },
    compatibilityReport: {
      overall: 91,
      communication: 95,
      chemistry: 88,
      lifestyle: 90,
      longTerm: 93,
      conflictRisk: 8,
      summary: "Aria's combination of design thinking and deep empathy aligns perfectly with your creative side. Your shared preference for quiet, meaningful settings creates a highly intuitive, supportive communication baseline.",
      strengths: [
        "Incredible emotional depth and intuitive understanding.",
        "Shared eye for digital aesthetics and minimalist design principles.",
        "Conflict resolution is peaceful and collaborative."
      ],
      weaknesses: [
        "Both tend to retreat into internal worlds when stressed.",
        "Can take criticism too personally, requiring soft wording."
      ],
      greenFlags: [
        "Active listener who remembers small details.",
        "Creates physical art with patient craft.",
        "Deeply values authenticity and long-term loyalty."
      ],
      redFlags: [
        "Prone to the 'INFJ door slam' if boundaries are crossed repeatedly."
      ],
      conversationTopics: [
        "Why physical objects feel different than digital interfaces.",
        "The best vinyl records to listen to when it's raining outside.",
        "Designing the perfect layout for a minimal home studio."
      ],
      perfectFirstDate: "A pottery throwing workshop class followed by choosing each other's custom tea blends at a quiet Japanese-style matcha bar.",
      giftSuggestions: [
        "A rare, hand-numbered typography specimen book.",
        "A premium, hand-turned wooden rib for clay sculpting."
      ],
      futurePrediction: "A deeply supportive partnership characterized by mutual artistic encouragement. You will build a beautiful, structurally sound, and peaceful shared home with design-forward details."
    },
    icebreakers: [
      "Ask her how pottery influences her digital design work.",
      "Ask her what local Seattle coffee shop has the best vibes.",
      "Ask her to rate your favorite app's interface design."
    ],
    personaPrompt: "You are Aria Chen. You are gentle, thoughtful, highly creative, and value authentic emotional connections. You speak with a soft, artistic tone, notice visual details, and love talking about art, aesthetics, and human behavior."
  },
  {
    id: "4",
    name: "Zoe Hayashi",
    age: 25,
    occupation: "Indie Game Dev & Synth Builder",
    location: "Los Angeles, CA",
    bio: "Soldering synthesizer circuits, compiling shader scripts, and watering a growing army of monsteras. I write code for dream-like puzzle games and collect vintage drum machines.",
    interests: ["Game Dev", "Synthesizers", "Retro Gaming", "Houseplants", "Ambient Music", "Bouldering"],
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INFP",
    loveLanguage: "Quality Time",
    lifestyle: ["Night owl", "Plant-based diet", "Flexible work hours"],
    music: ["Aphex Twin", "Cocteau Twins", "Synthwave", "Ambient Electronic"],
    travel: ["Tokyo, Japan", "Berlin, Germany", "Reykjavík, Iceland"],
    pets: ["Rescue Cat named Pixel"],
    languages: ["English", "C#", "C++"],
    education: "BS in Interactive Media, USC",
    traits: {
      extroversion: 45,
      adventurousness: 68,
      logic: 82,
      empathy: 88
    },
    compatibilityReport: {
      overall: 88,
      communication: 91,
      chemistry: 86,
      lifestyle: 84,
      longTerm: 89,
      conflictRisk: 10,
      summary: "Zoe shares your passion for systems design and retro synthesizers. Her introverted creativity aligns well with your analytical focus, offering a playground for mutual ideas.",
      strengths: [
        "Incredible alignment in technology and musical synthesis interest.",
        "Deep respect for personal independent space.",
        "Highly creative brainstorming dynamics."
      ],
      weaknesses: [
        "Both struggle to take administrative initiatives.",
        "Can get lost in work fixations, ignoring routine tasks."
      ],
      greenFlags: [
        "Builds physical hardware with extreme patience.",
        "Highly communicative when talking about systems architecture.",
        "Unusually high empathy metrics."
      ],
      redFlags: [
        "Irregular sleep cycle might conflict with your schedule."
      ],
      conversationTopics: [
        "Designing custom FM synthesizer voices.",
        "Why old pixel-art games feel more immersive.",
        "Managing indoor tropical plant microclimates."
      ],
      perfectFirstDate: "An afternoon checking out vintage synthesizer shops in LA, followed by organic sushi and playing classic arcade games.",
      giftSuggestions: [
        "A pocket operator drum machine synth.",
        "A rare cutting of a variegated Monstera Albo."
      ],
      futurePrediction: "A highly collaborative relationship. You will co-develop custom audio plugins together while building a cozy, forest-like home studio."
    },
    icebreakers: [
      "Ask about her favorite vintage drum machine.",
      "Discuss how she codes shader math."
    ],
    personaPrompt: "You are Zoe Hayashi. You are creative, slightly quirky, soft-spoken but highly passionate about hardware synths, plants, indie game design, and pixel art."
  },
  {
    id: "5",
    name: "Nikhil Sharma",
    age: 29,
    occupation: "Fintech Quant Trader & Chess Master",
    location: "Chicago, IL",
    bio: "Running statistical models in financial markets, playing speed chess in parks, and debating game theory. I appreciate clean code, robust logic, and dark whiskey.",
    interests: ["Algorithms", "Board Games", "Fintech", "Math", "Whiskey Tasting", "Sailing"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INTJ",
    loveLanguage: "Acts of Service",
    lifestyle: ["Structured routine", "Gym goer", "Wine & spirits collector"],
    music: ["Minimal Techno", "Math Rock", "Dave Brubeck Jazz"],
    travel: ["London, UK", "Singapore", "St. Moritz, Switzerland"],
    pets: ["None"],
    languages: ["English", "Hindi", "Python", "C++"],
    education: "MS in Financial Mathematics, University of Chicago",
    traits: {
      extroversion: 50,
      adventurousness: 60,
      logic: 98,
      empathy: 68
    },
    compatibilityReport: {
      overall: 81,
      communication: 88,
      chemistry: 78,
      lifestyle: 85,
      longTerm: 82,
      conflictRisk: 15,
      summary: "Nikhil shares your extremely high logical baseline. While his strict corporate/trading schedule differs from your startup flexibility, your intellectual discussions are top-tier.",
      strengths: [
        "Extreme alignment on analytical reasoning and math concepts.",
        "Direct, non-emotional conflict resolution patterns.",
        "Shared love for complex strategic systems (chess, trading, AI)."
      ],
      weaknesses: [
        "Risk of dry, over-rationalized conversations.",
        "Emotional support needs to be consciously integrated."
      ],
      greenFlags: [
        "Clear, unambiguous boundaries and honest communication.",
        "Organized, financially stable, and highly responsible.",
        "Passionate about deep quantitative systems."
      ],
      redFlags: [
        "Hyper-fixation on market trends can trigger stress periods."
      ],
      conversationTopics: [
        "Market inefficiencies vs model inference scaling.",
        "Sailing dynamics and wind vectors.",
        "The best board games ever designed."
      ],
      perfectFirstDate: "An evening at a premium whiskey lounge playing rapid chess, followed by a late-night walk along Lake Michigan debating game theory.",
      giftSuggestions: [
        "A premium, hand-carved minimalist wooden chess set.",
        "A bottle of single-barrel Japanese whiskey."
      ],
      futurePrediction: "A relationship characterized by structural excellence and joint financial investments. You will coordinate deep systems and enjoy quiet sailing trips."
    },
    icebreakers: [
      "Ask about his favorite chess opening.",
      "Discuss quantitative market predictions."
    ],
    personaPrompt: "You are Nikhil Sharma. You are analytical, direct, highly logical, appreciate precision, and love talking about math, algorithms, chess, and market dynamics."
  },
  {
    id: "6",
    name: "Sophia Dubois",
    age: 27,
    occupation: "Art Curator & Cello Player",
    location: "New York, NY",
    bio: "Curating conceptual art exhibits in Manhattan, playing cello suites in church acoustics, and reading French literature. Fascinated by the intersection of digital tech and physical canvas.",
    interests: ["Art Galleries", "Cello", "Sculpture", "History", "French Literature", "Espresso"],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INFJ",
    loveLanguage: "Quality Time",
    lifestyle: ["Quiet cafes", "Organic diet", "Regular museum runner"],
    music: ["Bach", "Debussy", "Ambient Acoustic", "Philip Glass"],
    travel: ["Paris, France", "Vienna, Austria", "Kyoto, Japan"],
    pets: ["Greyhound dog"],
    languages: ["English", "French", "Italian"],
    education: "MA in Art History, Columbia University",
    traits: {
      extroversion: 42,
      adventurousness: 64,
      logic: 78,
      empathy: 92
    },
    compatibilityReport: {
      overall: 84,
      communication: 89,
      chemistry: 82,
      lifestyle: 86,
      longTerm: 85,
      conflictRisk: 10,
      summary: "Sophia's background in fine arts and cello provides a beautiful aesthetic synergy with your product design eye. Her calm emotional depth balances your system-first INTP mind.",
      strengths: [
        "Highly refined shared taste in digital design and physical art forms.",
        "Gentle, validating communication patterns.",
        "Shared preference for quiet, meaningful settings."
      ],
      weaknesses: [
        "Both tend to avoid voicing immediate discomforts.",
        "Can become isolated in internal intellectual worlds."
      ],
      greenFlags: [
        "Active, patient listener who remembers design details.",
        "Deeply values long-term emotional integrity.",
        "Highly creative curation process."
      ],
      redFlags: [
        "Can absorb others' stress easily, requiring decompression space."
      ],
      conversationTopics: [
        "How generative AI modifies conceptual curation boundaries.",
        "The acoustics of Gothic brick churches.",
        "The best local espresso spots in New York."
      ],
      perfectFirstDate: "A private gallery tour in Chelsea, followed by custom espresso at an upscale cafe overlooking the Hudson River.",
      giftSuggestions: [
        "A premium, hand-printed art monograph.",
        "Custom mute for her cello made of luxury maple wood."
      ],
      futurePrediction: "A deeply supportive partnership characterized by mutual artistic calibration. You will build a design-forward, peaceful home filled with sculpture and music."
    },
    icebreakers: [
      "Ask about her favorite cello suite.",
      "Discuss conceptual art curations."
    ],
    personaPrompt: "You are Sophia Dubois. You are elegant, thoughtful, speak with a calm, artistic tone, and love discussing music theory, art history, and curation."
  },
  {
    id: "7",
    name: "Liam O'Connor",
    age: 28,
    occupation: "Green Energy Engineer & Backpacker",
    location: "Denver, CO",
    bio: "Designing solar microgrids for mountain communities, backpacking Colorado trails, and smoking brisket. I value outdoor self-reliance and clean technology.",
    interests: ["Solar Power", "Snowboarding", "Backpacking", "Cooking", "Cabin Life", "Acoustic Guitar"],
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "ISTP",
    loveLanguage: "Acts of Service",
    lifestyle: ["Active sports", "Cabin owner", "Early riser"],
    music: ["Folk Rock", "Americana", "Led Zeppelin", "Acoustic Blues"],
    travel: ["Banff, Canada", "Zermatt, Switzerland", "Patagonia"],
    pets: ["Golden Retriever named Ranger"],
    languages: ["English", "Conversational German"],
    education: "BS in Mechanical Engineering, Colorado School of Mines",
    traits: {
      extroversion: 40,
      adventurousness: 90,
      logic: 88,
      empathy: 72
    },
    compatibilityReport: {
      overall: 79,
      communication: 80,
      chemistry: 85,
      lifestyle: 75,
      longTerm: 78,
      conflictRisk: 18,
      summary: "Liam's focus on green engineering overlaps with your technology background. His highly active, outdoor-focused lifestyle will pull you out of the office and into nature.",
      strengths: [
        "Direct, practical problem-solving mechanics.",
        "Excellent spatial intelligence and hands-on build skills.",
        "Brings adventurous outdoor experiences to the connection."
      ],
      weaknesses: [
        "He is highly taciturn and might communicate less frequently.",
        "Prefers physical activity over long theoretical chats."
      ],
      greenFlags: [
        "Exceptionally reliable and physically capable.",
        "Strong sense of independence and spatial self-reliance.",
        "Deep respect for ecology and clean systems."
      ],
      redFlags: [
        "Tends to completely disconnect from cellular networks for days when camping."
      ],
      conversationTopics: [
        "Microgrid power optimization algorithms.",
        "The best snowboarding runs in Aspen.",
        "Building custom wooden cabinetry by hand."
      ],
      perfectFirstDate: "An afternoon hike to an alpine lake, followed by cooking outdoor wood-fired pizzas at his mountain cabin.",
      giftSuggestions: [
        "A premium multi-tool with custom engraving.",
        "A high-end insulated thermal flask for cold backpacking runs."
      ],
      futurePrediction: "A grounding, active partnership. You will optimize solar software configurations while he coordinates building a sustainable, off-grid mountain cabin."
    },
    icebreakers: [
      "Ask about solar microgrid designs.",
      "Discuss his favorite hiking trails."
    ],
    personaPrompt: "You are Liam O'Connor. You are practical, rugged, speak concisely, and love talking about solar setups, mechanics, snowboarding, and the outdoors."
  },
  {
    id: "8",
    name: "Clara Sterling",
    age: 26,
    occupation: "Space Architect & Illustrator",
    location: "Houston, TX",
    bio: "Drafting habitats for future lunar colonies, sketching sci-fi environments, and hosting board game tournaments. Fascinated by minimalist living volumes and CAD optimization.",
    interests: ["Space Tech", "CAD Modeling", "Illustration", "Chess", "Sci-Fi Books", "Sailing"],
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INTP",
    loveLanguage: "Quality Time",
    lifestyle: ["Night owl", "Space enthusiast", "Minimalist living"],
    music: ["Tame Impala", "M83", "Daft Punk", "Ambient Sci-Fi Soundtracks"],
    travel: ["Svalbard, Norway", "Kourou, French Guiana", "Tokyo, Japan"],
    pets: ["None"],
    languages: ["English", "Russian"],
    education: "Master of Space Architecture, University of Houston",
    traits: {
      extroversion: 38,
      adventurousness: 76,
      logic: 94,
      empathy: 76
    },
    compatibilityReport: {
      overall: 86,
      communication: 92,
      chemistry: 80,
      lifestyle: 88,
      longTerm: 87,
      conflictRisk: 11,
      summary: "As a fellow INTP, Clara shares your exact cognitive baseline. Your mutual appreciation for science fiction, CAD models, and systems logic ensures highly engaging debates.",
      strengths: [
        "Identical cognitive styles and conversational expectations.",
        "Extreme intellectual resonance: highly theoretical and modular.",
        "Mutual delight in space science and design aesthetics."
      ],
      weaknesses: [
        "Risk of building an echo chamber of over-rationalized systems.",
        "Both struggle with outgoing emotional initiatives."
      ],
      greenFlags: [
        "Exceptional logic capabilities.",
        "Draws beautiful manual concept illustrations.",
        "Highly independent and comfortable in quiet research blocks."
      ],
      redFlags: [
        "Can become emotionally distant under heavy deadlines."
      ],
      conversationTopics: [
        "Structural logistics of lunar soil concrete.",
        "Favorite sci-fi authors (Isaac Asimov vs Arthur C. Clarke).",
        "Optimizing space station layouts for human wellness."
      ],
      perfectFirstDate: "Visiting a space museum or observatory at night, followed by drawing sci-fi sketches on tablets at a quiet diner.",
      giftSuggestions: [
        "A premium drafting pen set.",
        "A high-quality model kit of the Soviet Luna space probe."
      ],
      futurePrediction: "A brilliant, highly intellectual alignment. You will brainstorm concepts, exchange science fiction libraries, and support each other's research pursuits."
    },
    icebreakers: [
      "Ask about her lunar habitat designs.",
      "Discuss favorite sci-fi book concepts."
    ],
    personaPrompt: "You are Clara Sterling. You are deeply intellectual, analytical, share a love for space technology, architectural models, and science fiction books."
  },
  {
    id: "9",
    name: "Ethan Zhang",
    age: 27,
    occupation: "Bioinformatics Engineer & Brewer",
    location: "Boston, MA",
    bio: "Mapping genetic pathways with machine learning by day, brewing custom double IPAs by night. Let's discuss DNA computing, neural nets, and yeast genetics.",
    interests: ["Genetics", "Craft Beers", "Machine Learning", "Data Science", "Bouldering", "Sci-Fi"],
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INTP",
    loveLanguage: "Quality Time",
    lifestyle: ["Tech enthusiast", "Coffee drinker", "Bouldering gym regular"],
    music: ["Synthwave", "Nine Inch Nails", "Electronic Beats"],
    travel: ["Geneva, Switzerland", "Munich, Germany", "Portland, OR"],
    pets: ["Husky dog"],
    languages: ["English", "Python", "R", "C++"],
    education: "BS in Bioengineering, MIT",
    traits: {
      extroversion: 48,
      adventurousness: 72,
      logic: 95,
      empathy: 78
    },
    compatibilityReport: {
      overall: 83,
      communication: 88,
      chemistry: 80,
      lifestyle: 84,
      longTerm: 82,
      conflictRisk: 14,
      summary: "Ethan's bio-computing interest aligns beautifully with your AI product engineering background. His hobbies in craft brewing inject a fun, chemical-hands-on element into conversations.",
      strengths: [
        "Deep alignment in computational logic and ML systems.",
        "Shared curiosity for biochemistry and software tools.",
        "Straightforward, collaborative brainstorming style."
      ],
      weaknesses: [
        "Over-logical communication can overlook soft emotional signals.",
        "Risk of neglecting social activities in favor of tech fixations."
      ],
      greenFlags: [
        "Highly disciplined computational skills.",
        "Approaches brewing like a rigorous laboratory experiment.",
        "Comfortable discussing complex algorithms."
      ],
      redFlags: [
        "Workaholic tendencies when executing model training runs."
      ],
      conversationTopics: [
        "DNA sequence mapping algorithms.",
        "The chemistry of hop alpha acids in brewing.",
        "ML optimization heuristics."
      ],
      perfectFirstDate: "A tour of a local research brewery, followed by a casual bouldering session and sharing flight boards of micro-brews.",
      giftSuggestions: [
        "A premium digital refractometer for brewing measurement.",
        "First-edition biochemistry history book."
      ],
      futurePrediction: "A highly cooperative connection. You will collaborate on computational biotechnology projects while enjoying custom-brewed IPAs at home."
    },
    icebreakers: [
      "Ask about genetic mapping algorithms.",
      "Discuss yeast fermentation chemistry."
    ],
    personaPrompt: "You are Ethan Zhang. You are highly logical, enthusiastic about bio-computing, DNA algorithms, machine learning, and craft brewing."
  },
  {
    id: "10",
    name: "Isabella Rossi",
    age: 28,
    occupation: "Brutalist Architecture Photographer",
    location: "Brooklyn, NY",
    bio: "Documenting raw concrete geometries, industrial design details, and monochrome layouts. Coffee enthusiast, heavy traveler, and structural modernist.",
    interests: ["Photography", "Brutalism", "Industrial Design", "Monochrome Art", "Espresso", "Vinyl Records"],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INTJ",
    loveLanguage: "Acts of Service",
    lifestyle: ["Espresso drinker", "Modernist interior", "Frequent traveler"],
    music: ["Ambient Minimalist", "Classic Vinyl Rock", "Joy Division"],
    travel: ["Berlin, Germany", "Belgrade, Serbia", "Kyoto, Japan"],
    pets: ["None"],
    languages: ["English", "Italian"],
    education: "BFA in Photography, Pratt Institute",
    traits: {
      extroversion: 40,
      adventurousness: 82,
      logic: 90,
      empathy: 76
    },
    compatibilityReport: {
      overall: 89,
      communication: 90,
      chemistry: 88,
      lifestyle: 86,
      longTerm: 90,
      conflictRisk: 12,
      summary: "Isabella's focus on architectural geometries and industrial design matches your product design aesthetics. Her highly analytical, structured approach complements your INTP style.",
      strengths: [
        "Unparalleled alignment on minimalist design aesthetics.",
        "Shared appreciation for structural engineering and typography.",
        "Honest, direct communication parameters."
      ],
      weaknesses: [
        "Both tend to rationalize aesthetic standards to the extreme.",
        "Can appear overly critical or emotionally distant."
      ],
      greenFlags: [
        "Captures beautiful, precise framing compositions.",
        "Deep knowledge of modernist architectural history.",
        "Highly independent traveler."
      ],
      redFlags: [
        "High aesthetic perfectionism might make her critical of layouts."
      ],
      conversationTopics: [
        "The raw beauty of concrete textures.",
        "Berlin techno club architecture.",
        "Curating vinyl collections."
      ],
      perfectFirstDate: "A walk around brutalist concrete structures in New York, followed by espresso and sharing custom photography portfolios.",
      giftSuggestions: [
        "A rare architectural photography book on Yugoslavian monuments.",
        "A premium custom-made leather camera strap."
      ],
      futurePrediction: "A highly creative, aesthetically pristine relationship. You will co-publish design projects, curate minimalist spaces, and travel to photograph raw architecture."
    },
    icebreakers: [
      "Ask about her favorite brutalist concrete building.",
      "Discuss how photo framing relates to UI/UX design."
    ],
    personaPrompt: "You are Isabella Rossi. You are direct, stylish, highly analytical, design-focused, and love discussing architecture, concrete textures, and photography framing."
  },
  {
    id: "11",
    name: "Mateo Silva",
    age: 29,
    occupation: "Deep Tech VC Partner",
    location: "Silicon Valley, CA",
    bio: "Investing in fusion energy, robotics, and aerospace startups. Marathon runner, space enthusiast, and systems thinker. Let's debate commercial space logistics.",
    interests: ["Venture Capital", "Marathons", "Space Exploration", "Fusion Energy", "Aerospace", "Sailing"],
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "ENTJ",
    loveLanguage: "Acts of Service",
    lifestyle: ["Early riser", "Structured fitness", "Frequent business trips"],
    music: ["Hans Zimmer Soundtracks", "Classic Rock", "Electronic Uplifting"],
    travel: ["Geneva, Switzerland", "Washington DC", "Cabo San Lucas"],
    pets: ["None"],
    languages: ["English", "Portuguese"],
    education: "MBA in Systems Engineering, Stanford GSB",
    traits: {
      extroversion: 78,
      adventurousness: 84,
      logic: 95,
      empathy: 70
    },
    compatibilityReport: {
      overall: 82,
      communication: 86,
      chemistry: 78,
      lifestyle: 80,
      longTerm: 84,
      conflictRisk: 18,
      summary: "Mateo's venture focus on deep-tech fits your AI systems engineering interests. His ENTJ extroverted drive will push your projects forward, though his frequent travels require independence.",
      strengths: [
        "Incredible synergy in deep-tech interest fields.",
        "Direct communication and decisive goal alignment.",
        "High motivation and financial/strategic support."
      ],
      weaknesses: [
        "His corporate/investor scheduling demands are heavy.",
        "Can be overly directive or pushy with project goals."
      ],
      greenFlags: [
        "Highly ambitious, strategic, and organized.",
        "Passionate about hard science concepts (fusion, rocket nozzles).",
        "Clear logical reasoning base."
      ],
      redFlags: [
        "Tends to treat relationship metrics like business KPIs."
      ],
      conversationTopics: [
        "Commercial space flight logistics.",
        "The physics of nuclear fusion containment.",
        "Marathon pacing strategies."
      ],
      perfectFirstDate: "An afternoon sailing in the Bay Area, followed by dinner at a design-forward restaurant discussing next-gen tech concepts.",
      giftSuggestions: [
        "A premium carbon-fiber running watch.",
        "A customized mechanical compass for sailing."
      ],
      futurePrediction: "A powerful, strategically aligned connection. You will architect technical solutions while he coordinates venture funding and scale logistics."
    },
    icebreakers: [
      "Ask about commercial fusion startup breakthroughs.",
      "Discuss his marathon training schedules."
    ],
    personaPrompt: "You are Mateo Silva. You are outgoing, strategic, highly ambitious, analytical, and love talking about space exploration, fusion energy, and tech investments."
  },
  {
    id: "12",
    name: "Yuki Tanaka",
    age: 26,
    occupation: "Zen Garden Architect & Tea Master",
    location: "San Jose, CA",
    bio: "Integrating traditional Japanese garden layouts into modern tech yards. Tea practitioner, bonsai designer, and minimalist. Seeking quiet, meaningful connections.",
    interests: ["Zen Gardens", "Matcha", "Bonsai", "Landscape Architecture", "Minimalism", "Ambient Music"],
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600"
    ],
    personalityType: "INFP",
    loveLanguage: "Quality Time",
    lifestyle: ["Quiet cafes", "Green tea drinker", "Bonsai cultivator"],
    music: ["Haruomi Hosono", "Brian Eno", "Ambient Acoustic", "Ryuichi Sakamoto"],
    travel: ["Kyoto, Japan", "Portland Zen Garden", "Naoshima Art Island"],
    pets: ["None"],
    languages: ["English", "Japanese"],
    education: "BArch in Landscape Architecture, Kyoto University",
    traits: {
      extroversion: 32,
      adventurousness: 60,
      logic: 74,
      empathy: 90
    },
    compatibilityReport: {
      overall: 87,
      communication: 91,
      chemistry: 84,
      lifestyle: 89,
      longTerm: 88,
      conflictRisk: 8,
      summary: "Yuki's Zen design philosophy matches your interest in digital minimal aesthetics. Her calm emotional approach creates a grounding space for your hyper-active INTP mind.",
      strengths: [
        "Shared eye for spatial layout and natural aesthetics.",
        "Extremely peaceful, validating conversation patterns.",
        "Mutual interest in quiet, contemplative spaces."
      ],
      weaknesses: [
        "Risk of avoiding direct conflict in favor of keeping external peace.",
        "Both are introverted and may require push to initiate plans."
      ],
      greenFlags: [
        "Practices traditional tea ceremonies with patient precision.",
        "Prunes bonsai trees with extreme care and detail.",
        "Deeply values silent companionship and presence."
      ],
      redFlags: [
        "Tends to withdraw when overwhelmed by loud or chaotic settings."
      ],
      conversationTopics: [
        "The mathematics of Zen stone placement ratios.",
        "pruning mini bonsai trees over years.",
        "Traditional matcha powder processing."
      ],
      perfectFirstDate: "An afternoon checking out custom bonsai collections, followed by a private tea ceremony and listening to ambient music.",
      giftSuggestions: [
        "A premium handmade bamboo matcha whisk.",
        "A high-quality miniature pruning shear kit."
      ],
      futurePrediction: "A peaceful, deeply grounding partnership. You will coordinate smart garden automation scripts while she curates natural Bonsai aesthetics for your shared modern yard."
    },
    icebreakers: [
      "Ask about zen stone placement ratios.",
      "Discuss how she trains bonsai trees."
    ],
    personaPrompt: "You are Yuki Tanaka. You are quiet, gentle, thoughtful, speak with a calm tone, and love discussing Zen landscape, tea ceremonies, and bonsai cultivation."
  }
];

export const userDefaultProfile = {
  name: "Alex Mercer",
  age: 27,
  occupation: "AI Product Architect",
  location: "San Francisco, CA",
  bio: "Designing automated reasoning systems by day, researching retro synthesizers by night. Looking for a high-compatibility creative mind to build future concepts and find the best ramen with.",
  interests: ["Artificial Intelligence", "Synthesizers", "Sci-Fi Books", "Ramen", "Gardening", "UI/UX Design"],
  images: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600"
  ],
  personalityType: "INTP",
  loveLanguage: "Quality Time",
  lifestyle: ["Active lifestyle", "Tech enthusiast", "Coffee snob", "Moderate traveler"],
  music: ["Daft Punk", "M83", "Brian Eno", "Tame Impala"],
  travel: ["Tokyo, Japan", "London, UK", "Zermatt, Switzerland"],
  pets: ["None"],
  languages: ["English", "JavaScript"],
  career: "Co-founding an early-stage AI agent orchestration startup.",
  education: "BS in Symbolic Systems, Stanford University",
  traits: {
    extroversion: 40,
    adventurousness: 68,
    logic: 92,
    empathy: 80
  }
};
