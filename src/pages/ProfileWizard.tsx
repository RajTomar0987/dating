import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, User, Cake, Heart, Ruler, GraduationCap, Briefcase, Languages,
  FileText, Sparkles, MapPin, Check, ArrowRight, ArrowLeft, Plus, X, Loader2,
  Upload
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../auth/useAuth';
import { supabase } from '../lib/supabase';

const TOTAL_STEPS = 6;

const INTEREST_OPTIONS = [
  'Artificial Intelligence', 'Travel', 'Photography', 'Music', 'Fitness',
  'Reading', 'Cooking', 'Art', 'Gaming', 'Hiking', 'Yoga', 'Dancing',
  'Movies', 'Sports', 'Fashion', 'Technology', 'Nature', 'Coffee',
  'Wine', 'Meditation', 'Writing', 'Volunteering', 'Architecture',
  'Astronomy', 'Surfing', 'Cycling', 'Running', 'Swimming',
  'Rock Climbing', 'Board Games', 'Podcasts', 'Anime'
];

const LIFESTYLE_OPTIONS = [
  'Early Bird', 'Night Owl', 'Active Lifestyle', 'Homebody',
  'Social Butterfly', 'Introvert', 'Vegetarian', 'Vegan',
  'Non-Smoker', 'Social Drinker', 'Non-Drinker', 'Pet Lover',
  'Dog Person', 'Cat Person', 'Minimalist', 'Adventurer'
];

const PROMPT_OPTIONS = [
  'My ideal first date is...',
  'A random fact about me...',
  'The way to my heart is...',
  'I geek out on...',
  'My biggest goal right now is...',
  'The most spontaneous thing I\'ve done...',
  'I\'m looking for someone who...',
  'My love language is...',
  'On Sundays you\'ll find me...',
  'I\'m convinced that...'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];
const INTERESTED_IN_OPTIONS = ['Men', 'Women', 'Everyone'];
const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin',
  'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian'
];

function getApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://dating-f5pp.onrender.com/api';
  }
  return 'http://localhost:5000/api';
}

export default function ProfileWizard() {
  const navigate = useNavigate();
  const { firebaseUser, jwt, setProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Step 1: Photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 2: Basic Info
  const [firstName, setFirstName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState<string[]>([]);

  // Step 3: Details
  const [heightCm, setHeightCm] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  // Step 4: Personality
  const [bio, setBio] = useState('');
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);

  // Step 5: Location
  const [locationCity, setLocationCity] = useState('');
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || photos.length >= 6) return;

    setUploadingPhoto(true);
    try {
      for (let i = 0; i < files.length && photos.length + i < 6; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${firebaseUser?.uid || 'unknown'}/${Date.now()}_${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file, { upsert: true });

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(filePath);
          setPhotos(prev => [...prev, urlData.publicUrl]);
        } else {
          // Fallback: create local preview URL
          const localUrl = URL.createObjectURL(file);
          setPhotos(prev => [...prev, localUrl]);
        }
      }
    } catch (err) {
      console.warn('Photo upload failed, using local preview:', err);
    } finally {
      setUploadingPhoto(false);
    }
  }, [photos.length, firebaseUser?.uid]);

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const requestLocation = async () => {
    setLocationLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      setLocationLat(position.coords.latitude);
      setLocationLng(position.coords.longitude);
      setLocationGranted(true);

      // Reverse geocode (simple)
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        );
        const data = await res.json();
        setLocationCity(`${data.city || data.locality || ''}, ${data.principalSubdivision || ''}`);
      } catch {
        setLocationCity('Location detected');
      }
    } catch (err) {
      console.warn('Location permission denied:', err);
      setLocationCity('Location not available');
    } finally {
      setLocationLoading(false);
    }
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  const setPromptAnswer = (prompt: string, answer: string) => {
    setPrompts(prev => {
      if (!answer.trim()) {
        const next = { ...prev };
        delete next[prompt];
        return next;
      }
      return { ...prev, [prompt]: answer };
    });
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return photos.length >= 1;
      case 2: return firstName.trim().length >= 2 && birthday !== '' && gender !== '' && interestedIn.length > 0;
      case 3: return true; // Optional fields
      case 4: return bio.trim().length >= 10;
      case 5: return true; // Location is optional
      case 6: return true;
      default: return false;
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const profileData = {
        first_name: firstName,
        display_name: firstName,
        birthday,
        gender,
        interested_in: interestedIn,
        height_cm: heightCm ? parseInt(heightCm) : null,
        education: education || null,
        occupation: occupation || null,
        languages,
        bio,
        prompts: Object.keys(prompts).length > 0 ? prompts : null,
        interests,
        lifestyle,
        location_lat: locationLat,
        location_lng: locationLng,
        location_city: locationCity || null,
        photos,
        profile_completed: true,
      };

      // Get the freshest possible JWT:
      // 1. Try current context JWT
      // 2. Fall back to localStorage
      // 3. If neither works, re-establish session from Firebase to get a fresh backend JWT
      let authToken = jwt || localStorage.getItem('aura_jwt_token') || '';

      if (!authToken && firebaseUser) {
        console.log("No JWT found, re-establishing session from Firebase user...");
        try {
          const idToken = await firebaseUser.getIdToken(true);
          const sessionRes = await fetch(`${getApiBaseUrl()}/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            authToken = sessionData.token;
            localStorage.setItem('aura_jwt_token', authToken);
            console.log("Re-established session, got fresh JWT");
          }
        } catch (sessionErr) {
          console.error("Failed to re-establish session:", sessionErr);
        }
      }

      if (!authToken) {
        throw new Error('No authentication token available. Please log in again.');
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };

      console.log('[PROFILE] Saving profile');
      console.log('[PROFILE] Endpoint:', `${getApiBaseUrl()}/profiles/complete`);

      const res = await fetch(`${getApiBaseUrl()}/profiles/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify(profileData),
      });

      const responseBody = await res.json().catch(() => ({}));
      console.log('[PROFILE] Response status:', res.status);
      console.log('[PROFILE] Response body:', responseBody);

      if (!res.ok) {
        console.error('[PROFILE] Save failed:', { status: res.status, body: responseBody });
        const errDetails = responseBody.details
          ? `${responseBody.error}: ${JSON.stringify(responseBody.details)}`
          : (responseBody.error || `HTTP ${res.status}`);
        throw new Error(errDetails);
      }

      if (responseBody.profile) {
        setProfile(responseBody.profile);
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Profile save error:', err);
      alert(`Failed to save profile: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step === TOTAL_STEPS) {
      handleFinish();
    } else {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-bg-luxury flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/15 via-accent/10 to-purple-800/10 blur-[120px] animate-aurora" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[520px] w-full relative z-10"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-mono">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-xs text-accent font-mono font-bold">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-pink-500 rounded-full"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        <GlassCard className="p-6 md:p-8 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]" hoverEffect={false}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Photos */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Camera className="mx-auto text-accent mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">Add Your Photos</h2>
                    <p className="text-xs text-white/50 mt-1">Upload at least 1 photo (up to 6)</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((url, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-rose-500/80 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-accent/80 text-[9px] font-bold text-white uppercase">Main</span>
                        )}
                      </div>
                    ))}

                    {photos.length < 6 && (
                      <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                        {uploadingPhoto ? (
                          <Loader2 size={24} className="text-white/40 animate-spin" />
                        ) : (
                          <>
                            <Plus size={24} className="text-white/30" />
                            <span className="text-[10px] text-white/30 font-medium">Add Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Basic Info */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <User className="mx-auto text-accent mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">About You</h2>
                    <p className="text-xs text-white/50 mt-1">Tell us the basics</p>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Birthday</label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Gender</label>
                    <div className="flex flex-wrap gap-2">
                      {GENDER_OPTIONS.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            gender === g
                              ? 'bg-primary/20 border border-primary/50 text-white'
                              : 'bg-white/[0.03] border border-white/10 text-white/50 hover:text-white/70'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Interested In</label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTED_IN_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleArrayItem(interestedIn, opt, setInterestedIn)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            interestedIn.includes(opt)
                              ? 'bg-accent/20 border border-accent/50 text-white'
                              : 'bg-white/[0.03] border border-white/10 text-white/50 hover:text-white/70'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Ruler className="mx-auto text-accent mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">More Details</h2>
                    <p className="text-xs text-white/50 mt-1">Optional but helps find better matches</p>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="175"
                      min="120"
                      max="230"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Education</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g., Stanford University"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Occupation</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleArrayItem(languages, lang, setLanguages)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            languages.includes(lang)
                              ? 'bg-primary/20 border border-primary/50 text-white'
                              : 'bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/60'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Personality */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Sparkles className="mx-auto text-accent mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">Express Yourself</h2>
                    <p className="text-xs text-white/50 mt-1">Let your personality shine</p>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Bio (min 10 characters)</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                    <p className="text-[10px] text-white/30 mt-1 text-right">{bio.length}/500</p>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Prompts (pick up to 3)</label>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {PROMPT_OPTIONS.map(prompt => (
                        <div key={prompt} className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (prompts[prompt] !== undefined) {
                                setPromptAnswer(prompt, '');
                              } else if (Object.keys(prompts).length < 3) {
                                setPromptAnswer(prompt, ' ');
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                              prompts[prompt] !== undefined
                                ? 'bg-accent/15 border border-accent/30 text-white'
                                : Object.keys(prompts).length >= 3
                                  ? 'bg-white/[0.02] border border-white/5 text-white/20 cursor-not-allowed'
                                  : 'bg-white/[0.03] border border-white/8 text-white/50 hover:text-white/70'
                            }`}
                          >
                            {prompt}
                          </button>
                          {prompts[prompt] !== undefined && (
                            <input
                              type="text"
                              value={prompts[prompt]?.trim() || ''}
                              onChange={(e) => setPromptAnswer(prompt, e.target.value)}
                              placeholder="Your answer..."
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/8 text-white placeholder-white/20 text-xs focus:outline-none focus:border-primary/40 transition-all"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Interests</label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {INTEREST_OPTIONS.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleArrayItem(interests, interest, setInterests)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                            interests.includes(interest)
                              ? 'bg-primary/20 border border-primary/40 text-white'
                              : 'bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/60'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Lifestyle</label>
                    <div className="flex flex-wrap gap-1.5">
                      {LIFESTYLE_OPTIONS.map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(lifestyle, item, setLifestyle)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                            lifestyle.includes(item)
                              ? 'bg-accent/20 border border-accent/40 text-white'
                              : 'bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/60'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Location */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <MapPin className="mx-auto text-accent mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">Your Location</h2>
                    <p className="text-xs text-white/50 mt-1">Help us find people near you</p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    {locationGranted ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-2"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                          <Check size={28} className="text-green-400" />
                        </div>
                        <p className="text-sm text-white font-medium">{locationCity}</p>
                        <p className="text-[10px] text-white/40">Location detected successfully</p>
                      </motion.div>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={requestLocation}
                        disabled={locationLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/12 hover:bg-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {locationLoading ? (
                          <Loader2 size={20} className="text-accent animate-spin" />
                        ) : (
                          <MapPin size={20} className="text-accent" />
                        )}
                        <span className="text-sm text-white font-medium">
                          {locationLoading ? 'Detecting location...' : 'Enable Location'}
                        </span>
                      </motion.button>
                    )}

                    <div className="w-full">
                      <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">Or enter city manually</label>
                      <input
                        type="text"
                        value={locationCity}
                        onChange={(e) => setLocationCity(e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {step === 6 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Check className="mx-auto text-green-400 mb-3" size={28} />
                    <h2 className="text-xl font-display font-bold text-white">You're All Set!</h2>
                    <p className="text-xs text-white/50 mt-1">Review your profile and launch</p>
                  </div>

                  <div className="space-y-3">
                    {/* Photo preview */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {photos.map((url, i) => (
                        <img key={i} src={url} alt="" className="w-16 h-20 rounded-xl object-cover border border-white/10 shrink-0" />
                      ))}
                    </div>

                    {/* Profile summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50">Name</span>
                        <span className="text-white font-medium">{firstName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50">Birthday</span>
                        <span className="text-white font-medium">{birthday}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50">Gender</span>
                        <span className="text-white font-medium">{gender}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50">Interested In</span>
                        <span className="text-white font-medium">{interestedIn.join(', ')}</span>
                      </div>
                      {occupation && (
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-white/50">Occupation</span>
                          <span className="text-white font-medium">{occupation}</span>
                        </div>
                      )}
                      {locationCity && (
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-white/50">Location</span>
                          <span className="text-white font-medium">{locationCity}</span>
                        </div>
                      )}
                      {interests.length > 0 && (
                        <div className="py-2">
                          <span className="text-white/50 text-xs">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {interests.slice(0, 8).map(i => (
                              <span key={i} className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-[10px] text-white/80">{i}</span>
                            ))}
                            {interests.length > 8 && <span className="text-[10px] text-white/40">+{interests.length - 8} more</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 text-sm font-medium hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={nextStep}
              disabled={!canProceed() || saving}
              whileHover={canProceed() && !saving ? { scale: 1.02, y: -1 } : undefined}
              whileTap={canProceed() && !saving ? { scale: 0.98 } : undefined}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : step === TOTAL_STEPS ? (
                <>
                  <Sparkles size={16} />
                  <span>Launch AuraAI</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
