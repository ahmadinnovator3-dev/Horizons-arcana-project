import React, { useState, useEffect } from 'react';
import { useApp } from '../Context/AppContext';
import { PixelCompanion } from './PixelCompanion';
// @ts-ignore
import logoImage from '../assets/images/studentos_logo_1782397125648.jpg';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Smile, 
  BrainCircuit, 
  MessageSquare, 
  User, 
  Settings, 
  GraduationCap, 
  LogOut,
  Plus, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Timer,
  Bell,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Music,
  Disc,
  Volume2,
  VolumeX,
  Upload,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trash2,
  FolderHeart
} from 'lucide-react';


import { SmartPlanner } from './SmartPlanner';
import { FocusMode } from './FocusMode';
import { MoodTracker } from './MoodTracker';
import { AiStudyHelper } from './AiStudyHelper';
import { ChatLounge } from './ChatLounge';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { WeeklyTimetable } from './WeeklyTimetable';
import { MemoriesVault } from './MemoriesVault';
import { AboutMyselfOverview } from './AboutMyselfOverview';
import { ProfileEditModal } from './ProfileEditModal';


const PixelPin: React.FC = () => (
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
    <svg width="24" height="32" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-8">
      {}
      <rect x="4" y="0" width="4" height="1" fill="#f43f5e" />
      <rect x="3" y="1" width="6" height="1" fill="#f43f5e" />
      <rect x="2" y="2" width="8" height="3" fill="#e11d48" />
      
      {}
      <rect x="3" y="2" width="2" height="1" fill="#fee2e2" />
      
      {}
      <rect x="7" y="2" width="3" height="3" fill="#be123c" />
      
      {}
      <rect x="4" y="5" width="4" height="1" fill="#be123c" />
      <rect x="3" y="6" width="6" height="1" fill="#9f1239" />
      
      {}
      <rect x="5" y="7" width="2" height="6" fill="#9ca3af" />
      <rect x="6" y="7" width="1" height="6" fill="#d1d5db" />
      <rect x="5" y="13" width="2" height="1" fill="#4b5563" />
      <rect x="5.5" y="14" width="1" height="1" fill="#1f2937" />
    </svg>
  </div>
);

export const Dashboard: React.FC = () => {
  const { 
    currentView, 
    setView, 
    currentUser, 
    logout,
    tasks, 
    toggleTaskCompletion, 
    moodEntries, 
    addMoodEntry,
    stats,
    companionCustomization,
    companionState,
    setCompanionState,
    companionName,
    theme,
    triggerGraduation,
    achievements,
    updateProfile,
    lastLearningActivityTime,
    updateLearningActivity,
    folders
  } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showGraduationConfirm, setShowGraduationConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [showPassNextYearModal, setShowPassNextYearModal] = useState(false);
  const [passNextYearQuote, setPassNextYearQuote] = useState('');
  const [simulatedInactivity, setSimulatedInactivity] = useState(false);
  const { addTask } = useApp();

  const handlePassToNextYear = () => {
    if (!currentUser) return;
    const currentGradeStr = currentUser.grade || '7';
    let nextGradeStr = '';
    const num = parseInt(currentGradeStr, 10);
    if (!isNaN(num)) {
      if (num >= 12) {
        nextGradeStr = 'College Freshman';
      } else {
        nextGradeStr = String(num + 1);
      }
    } else {
      nextGradeStr = currentGradeStr + ' (Advanced)';
    }

    const beautifulQuotes = [
      "\"The beautiful thing about learning is that no one can take it away from you.\" — B.B. King",
      "\"Education is the passport to the future, for tomorrow belongs to those who prepare for it today.\" — Malcolm X",
      "\"The mind is not a vessel to be filled, but a fire to be kindled.\" — Plutarch",
      "\"Strive for continuous improvement, not perfection.\" — Kim Collins",
      "\"Your education is a dress rehearsal for a life that is yours to lead.\" — Nora Ephron"
    ];
    const chosenQuote = beautifulQuotes[Math.floor(Math.random() * beautifulQuotes.length)];
    setPassNextYearQuote(chosenQuote);

    updateProfile({ grade: nextGradeStr });
    setCompanionState('Celebrating');
    setShowPassNextYearModal(true);
  };

  
  const [radioPlaylist, setRadioPlaylist] = useState<{ name: string; url: string }[]>(() => [
    { name: "Cozy Study Lofi", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Chiptune Campfire", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "8-Bit Retro Sunshine", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [isRadioMinimized, setIsRadioMinimized] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState("La la la~ 🎵");
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  
  useEffect(() => {
    if (!isRadioPlaying) return;
    const lyricsPool = [
      "La la la~ 🎵",
      "Mmm~ study time! 🎶",
      "Doo-wop, doo-wop~ 💫",
      "Yeah yeah~ 🎙️",
      "Keep pushing forward! 🚀",
      "This song is a vibe~ ✨",
      "Doodly-doo~ 🎸",
      "Lofi and chill... 🍵",
      "We are coding together! 💻",
      "Pixel companion high-five! 🐾",
      "La la lala~ 🌟",
      "Hmm-mm... 🌸"
    ];
    const interval = setInterval(() => {
      const randomLyric = lyricsPool[Math.floor(Math.random() * lyricsPool.length)];
      setCurrentLyrics(randomLyric);
    }, 4500);
    return () => clearInterval(interval);
  }, [isRadioPlaying]);

  
  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null && radioPlaylist[currentTrackIndex]) {
      audioRef.current.src = radioPlaylist[currentTrackIndex].url;
      if (isRadioPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    }
  }, [currentTrackIndex]);

  const handleTrackEnded = () => {
    if (currentTrackIndex !== null && radioPlaylist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % radioPlaylist.length;
      setCurrentTrackIndex(nextIndex);
    } else {
      setIsRadioPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (currentTrackIndex === null) {
      setCurrentTrackIndex(0);
      setIsRadioPlaying(true);
      setTimeout(() => {
        audioRef.current?.play().catch(e => console.log("Audio play error:", e));
      }, 50);
    } else {
      if (isRadioPlaying) {
        audioRef.current.pause();
        setIsRadioPlaying(false);
      } else {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
        setIsRadioPlaying(true);
      }
    }
  };

  const handleNextTrack = () => {
    if (radioPlaylist.length === 0) return;
    const nextIndex = currentTrackIndex === null ? 0 : (currentTrackIndex + 1) % radioPlaylist.length;
    setCurrentTrackIndex(nextIndex);
    setIsRadioPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(e => console.log("Audio play error:", e));
    }, 50);
  };

  const handlePrevTrack = () => {
    if (radioPlaylist.length === 0) return;
    const prevIndex = currentTrackIndex === null ? 0 : (currentTrackIndex - 1 + radioPlaylist.length) % radioPlaylist.length;
    setCurrentTrackIndex(prevIndex);
    setIsRadioPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(e => console.log("Audio play error:", e));
    }, 50);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newTracks: { name: string; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^/.]+$/, "");
      newTracks.push({ name, url });
    }
    if (newTracks.length > 0) {
      const startIdx = radioPlaylist.length;
      setRadioPlaylist(prev => [...prev, ...newTracks]);
      if (currentTrackIndex === null) {
        setCurrentTrackIndex(startIdx);
        setIsRadioPlaying(true);
        setTimeout(() => {
          audioRef.current?.play().catch(e => console.log("Audio play error:", e));
        }, 100);
      }
    }
  };

  const removeTrack = (index: number) => {
    if (radioPlaylist.length <= 1) {
      setRadioPlaylist([]);
      setCurrentTrackIndex(null);
      setIsRadioPlaying(false);
      if (audioRef.current) audioRef.current.src = "";
      return;
    }
    
    setRadioPlaylist(prev => prev.filter((_, i) => i !== index));
    if (currentTrackIndex === index) {
      const nextIndex = index % (radioPlaylist.length - 1);
      setCurrentTrackIndex(nextIndex);
    } else if (currentTrackIndex !== null && currentTrackIndex > index) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-800 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 max-w-sm border border-slate-200">
          <p className="font-bold text-slate-700">Access Denied. Please Sign In first!</p>
          <button onClick={() => setView('login')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all text-sm w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleQuickTaskAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask(quickTaskTitle, 'General', new Date().toISOString().split('T')[0], 'Medium');
    setQuickTaskTitle('');
  };

  
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'High');
  const dueTodayTasks = tasks.filter(t => {
    if (t.completed) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return t.dueDate === todayStr;
  });
  const upcomingTasks = tasks.filter(t => {
    if (t.completed) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return t.dueDate > todayStr;
  });

  
  const latestMood = moodEntries[0];

  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'planner', label: 'Smart Planner', icon: <Calendar className="w-5 h-5" /> },
    { id: 'timetable', label: 'Class Timetable', icon: <Clock className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus Mode', icon: <Timer className="w-5 h-5" /> },
    { id: 'mood', label: 'Mood Tracker', icon: <Smile className="w-5 h-5" /> },
    { id: 'ai-helper', label: 'AI Study Helper', icon: <BrainCircuit className="w-5 h-5" /> },
    { id: 'chat-lounge', label: 'The Tea Lounge', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'memories', label: 'Memories', icon: <FolderHeart className="w-5 h-5" /> },
    { id: 'about-myself', label: 'About Myself - AI', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  
  const pendingTasks = tasks.filter(t => !t.completed);
  const lastActivityDelta = Date.now() - lastLearningActivityTime;
  const isInactiveOver2Hours = lastActivityDelta >= 7200000 || simulatedInactivity;
  const hasIncompleteTasks = pendingTasks.length > 0;

  const moodLoggedToday = moodEntries.some(m => {
    try {
      return new Date(m.date).toDateString() === new Date().toDateString();
    } catch {
      return false;
    }
  });
  const unlockedAchievementsList = achievements ? achievements.filter(a => a.unlocked) : [];

  const initialAlertsList = [
    {
      id: 'welcome_alert',
      title: 'Welcome Check-in',
      text: `Hello, ${currentUser?.name || 'Student'}! Your pixel companion ${companionName || 'Buddy'} is online and eager to study.`,
      icon: '👋',
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-600'
    },
    ...(isInactiveOver2Hours && hasIncompleteTasks ? [{
      id: 'study_persuade_alert',
      title: 'Study Reminder! 📚',
      text: `Hey, you have ${pendingTasks.length} pending assignment(s) and haven't done any learning activity recently. ${companionName} is waiting for you to study!`,
      icon: '💡',
      color: 'bg-rose-500/10 border-rose-500/20 text-rose-600 animate-pulse',
      action: () => setView('planner')
    }] : []),
    ...(pendingTasks.length > 0 ? [{
      id: 'pending_tasks_alert',
      title: 'Smart Planner Check',
      text: `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''} left to conquer today!`,
      icon: '📝',
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600',
      action: () => setView('planner')
    }] : [{
      id: 'all_tasks_done_alert',
      title: 'Smart Planner Check',
      text: 'Superb! All items in your daily planner have been cleared.',
      icon: '✨',
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
    }]),
    ...(!moodLoggedToday ? [{
      id: 'mood_missing_alert',
      title: 'Mood Companion Update',
      text: `You haven't logged your mood today. Click here to check in!`,
      icon: '❤️',
      color: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
      action: () => setView('mood')
    }] : [{
      id: 'mood_logged_alert',
      title: 'Mood Companion Update',
      text: 'Mood registered! Your companion is proud of your consistency.',
      icon: '✅',
      color: 'bg-teal-500/10 border-teal-500/20 text-teal-600'
    }]),
    ...unlockedAchievementsList.map(ach => ({
      id: `ach_alert_${ach.id}`,
      title: 'Achievement Unlocked!',
      text: `Congrats on earning "${ach.title}" badge!`,
      icon: ach.icon || '🏆',
      color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
      action: () => setView('profile')
    }))
  ];

  const activeAlerts = initialAlertsList.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans selection:bg-indigo-100 overflow-x-hidden">
      
      {}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0 lg:static lg:translate-x-0' : '-translate-x-full lg:fixed lg:-translate-x-full'
      }`}>
        <div className="flex flex-col flex-1 min-h-0">
          {}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white font-mono shadow-md overflow-hidden bg-slate-800 border border-slate-700">
                <img src={logoImage} alt="StudentOS" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-white tracking-tight text-lg">StudentOS</span>
            </div>
            {}
            <button 
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center justify-center" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                   key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {}
        <div className="p-4 border-t border-slate-800/80 space-y-2 shrink-0">
          {}
          <button
            onClick={handlePassToNextYear}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all text-left"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
            Pass to Next Year 🚀
          </button>

          {}
          <button
            onClick={() => setShowGraduationConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all text-left"
          >
            <GraduationCap className="w-5 h-5" />
            Graduate Journey 🎓
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 transition-all text-left"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            {}
            {!sidebarOpen && (
              <button 
                className="text-slate-600 p-2 rounded-xl hover:bg-slate-100 flex items-center justify-center cursor-pointer" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{formattedDate}</span>
              <h2 className="text-sm font-black text-slate-900 font-mono tracking-tight mt-0.5">{formattedTime}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {}
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg shadow-sm">
              Grade {currentUser.grade} • {currentUser.schoolName}
            </span>

             {}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center border-0 outline-none focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {activeAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden font-sans">
                  {}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-indigo-600" /> Alerts ({activeAlerts.length})
                    </span>
                    {activeAlerts.length > 0 && (
                      <button 
                        onClick={() => setDismissedAlerts(prev => [...prev, ...activeAlerts.map(a => a.id)])}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {activeAlerts.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                        You're all caught up! ☕
                      </div>
                    ) : (
                      activeAlerts.map(alert => (
                        <div 
                          key={alert.id} 
                          className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50/80 transition-all group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-sm ${alert.color}`}>
                            {alert.icon}
                          </div>
                          <div 
                            className={`flex-1 min-w-0 ${alert.action ? 'cursor-pointer hover:opacity-85' : ''}`}
                            onClick={() => {
                              if (alert.action) {
                                alert.action();
                                setNotificationsOpen(false);
                              }
                            }}
                          >
                            <p className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-0.5">
                              {alert.title}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-normal font-medium">
                              {alert.text}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDismissedAlerts(prev => [...prev, alert.id]);
                            }}
                            className="text-slate-300 hover:text-slate-500 p-0.5 rounded-md hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {}
                  <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-[9px] text-slate-400 font-mono">
                    <span>Study Reminders: 2 hours</span>
                    <button
                      onClick={() => setSimulatedInactivity(prev => !prev)}
                      className={`px-2 py-0.5 rounded border transition-all font-bold ${
                        simulatedInactivity 
                          ? 'bg-rose-500 border-rose-600 text-white' 
                          : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {simulatedInactivity ? 'Inactivity Simulated' : 'Simulate Inactivity'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center border border-indigo-700 cursor-pointer hover:scale-105 transition-all overflow-hidden"
              title="Edit Profile"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                currentUser.name.substring(0, 2).toUpperCase()
              )}
            </button>
          </div>
        </header>

        {}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto relative">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {}
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-44 h-44 bg-indigo-600/30 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1 bg-indigo-800/50 px-2.5 py-1 text-xs font-semibold rounded-lg text-indigo-200">
                    <Sparkles className="w-3.5 h-3.5" /> Checked in to StudentOS
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    {getGreeting()}, {currentUser.name}!
                  </h1>
                  <p className="text-indigo-200 text-sm md:text-base max-w-md">
                    Ready to achieve your study targets today? Let's check in with <span className="font-mono text-white font-bold">{companionName}</span> and review your planner!
                  </p>
                </div>
              </div>

              {}
              <div className="relative flex flex-col gap-8 pb-12">
                
                {}
                <div className="flex items-center justify-between border-b-2 border-emerald-500/30 pb-2">
                  <span className="text-[10px] font-black text-emerald-400 font-mono uppercase tracking-widest">
                    📁 ACTIVE PHYSICAL DESKTOP WORKSPACE
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold font-mono">
                    ITEMS: 8 | THEME: FOREST LOFI
                  </span>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  
                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20 lg:col-span-1">
                    {}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-400/80 border border-amber-500/50 shadow-sm rotate-[-3deg] z-10 flex items-center justify-center">
                      <span className="text-[8px] font-black text-amber-950 tracking-wider">★ MY BUDDY ★</span>
                    </div>

                    <div className="bg-white border-4 border-slate-900 p-5 pt-7 shadow-[8px_8px_0px_0px_rgba(1,4,2,1)] transform rotate-[2deg] transition-transform duration-300">
                      {}
                      <div className="bg-[#010402] border-4 border-slate-900 p-4 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
                        
                        <div className="relative z-10 flex items-center justify-center w-full h-full">
                          <PixelCompanion 
                            customization={companionCustomization} 
                            
                            state={isRadioPlaying ? 'Celebrating' : (companionState === 'Idle' ? 'Celebrating' : companionState)} 
                            size="xl" 
                            isPlayingMusic={isRadioPlaying}
                          />
                        </div>

                        {}
                        {isRadioPlaying && (
                          <div className="absolute top-8 left-4 right-4 bg-white text-slate-900 border-2 border-slate-950 px-2 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg animate-bounce z-25 text-center font-mono text-[9px] font-black leading-tight">
                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-slate-950 transform rotate-45" />
                            🎤 {currentLyrics}
                          </div>
                        )}

                        {}
                        <div className="absolute top-2 right-2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                          {isRadioPlaying ? 'Singing 🎵' : (companionState === 'Idle' ? 'Happy 💚' : companionState)}
                        </div>
                      </div>

                      {}
                      <div className="pt-4 text-center">
                        <h4 className="font-retro uppercase text-slate-900 text-lg tracking-wide">{companionName}</h4>
                        <p className="text-[10px] font-bold text-emerald-700 italic font-mono mt-1">
                          "Class of 2026. Forever studying side-by-side with you!"
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-1.5">
                          <span className="text-[9px] font-black bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5">LVL 4</span>
                          <span className="text-[9px] font-black bg-emerald-600 border border-emerald-800 text-white px-2 py-0.5">MAX COMPANION</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20 lg:col-span-1">
                    {}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-400/80 border border-pink-500/50 shadow-sm rotate-[4deg] z-10 flex items-center justify-center">
                      <span className="text-[8px] font-black text-pink-950 tracking-wider">🌸 SWEET ESCAPE 🌸</span>
                    </div>

                    <div className="bg-white border-4 border-slate-900 p-5 pt-7 shadow-[8px_8px_0px_0px_rgba(1,4,2,1)] transform rotate-[-3deg] transition-transform duration-300">
                      {}
                      {(() => {
                        const friendsFolder = folders.find(f => f.id === 'friends');
                        const uploadedPhotos = friendsFolder ? friendsFolder.files.filter(file => file.type === 'image') : [];
                        const activePhoto = uploadedPhotos[0];

                        if (activePhoto) {
                          return (
                            <>
                              <div className="bg-[#0c0a09] border-4 border-slate-900 h-[260px] relative overflow-hidden flex items-center justify-center">
                                <img 
                                  src={activePhoto.url} 
                                  alt={activePhoto.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-300"
                                />
                              </div>
                              {}
                              <div className="pt-4 text-center">
                                <h4 className="font-retro uppercase text-slate-900 text-xs tracking-wider">🌸 MY MEMORY</h4>
                                <p className="text-[10px] font-bold text-pink-600 italic font-mono mt-1 max-h-[24px] overflow-hidden truncate px-1" title={activePhoto.notes}>
                                  "{activePhoto.notes || "remember that time with your friends!"}"
                                </p>
                              </div>
                            </>
                          );
                        }

                        return (
                          <>
                            <div className="bg-[#0c0a09] border-4 border-slate-900 h-[260px] relative overflow-hidden">
                              {}
                              <svg viewBox="0 0 100 100" className="w-full h-full bg-[#fbcfe8]">
                                {}
                                <rect x="0" y="0" width="100" height="50" fill="#fbcfe8" />
                                <rect x="8" y="6" width="30" height="6" fill="#fdf2f8" opacity="0.6" />
                                <rect x="65" y="12" width="22" height="5" fill="#fdf2f8" opacity="0.6" />
                                
                                {}
                                <rect x="44" y="10" width="12" height="12" fill="#fef08a" />
                                
                                {}
                                <polygon points="50,22 15,50 85,50" fill="#f472b6" opacity="0.8" />
                                <polygon points="75,18 40,50 100,50" fill="#ec4899" opacity="0.6" />
                                
                                {}
                                {}
                                <rect x="4" y="28" width="18" height="18" fill="#ec4899" />
                                <rect x="8" y="24" width="12" height="12" fill="#f43f5e" />
                                <rect x="12" y="30" width="14" height="10" fill="#f472b6" />
                                {}
                                <rect x="11" y="44" width="4" height="16" fill="#451a03" />

                                {}
                                <rect x="70" y="22" width="22" height="22" fill="#ec4899" />
                                <rect x="75" y="18" width="14" height="12" fill="#f43f5e" />
                                <rect x="68" y="26" width="16" height="10" fill="#f472b6" />
                                {}
                                <rect x="78" y="38" width="4" height="22" fill="#451a03" />

                                {}
                                <rect x="25" y="35" width="2" height="2" fill="#f472b6" />
                                <rect x="38" y="26" width="2" height="2" fill="#ec4899" />
                                <rect x="60" y="40" width="2" height="2" fill="#f472b6" />
                                <rect x="52" y="30" width="2" height="2" fill="#f43f5e" />

                                {}
                                <rect x="0" y="55" width="100" height="45" fill="#15803d" />
                                <rect x="0" y="55" width="100" height="3" fill="#22c55e" />
                                {}
                                <rect x="30" y="65" width="2" height="4" fill="#a855f7" />
                                <rect x="50" y="70" width="2" height="4" fill="#ec4899" />
                              </svg>
                            </div>
                            {}
                            <div className="pt-4 text-center">
                              <h4 className="font-retro uppercase text-slate-900 text-xs tracking-wider">🌸 CHERRY GROVE</h4>
                              <p className="text-[10px] font-bold text-pink-600 italic font-mono mt-1">
                                "Cozy pink petals drifting in the wind"
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.02] hover:z-20 md:col-span-2">
                    {}
                    <div className="absolute left-1 top-6 bottom-6 w-5 flex flex-col justify-between items-center z-10 pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-5 h-2.5 bg-slate-300 border-2 border-slate-800 rounded-full shadow-sm -ml-2" />
                      ))}
                    </div>

                    <div className="bg-[#fefce8] border-4 border-slate-900 pl-8 pr-6 py-6 shadow-[10px_10px_0px_0px_rgba(1,4,2,1)] transform rotate-[-1deg] relative min-h-[360px] flex flex-col justify-between text-slate-950">
                      {}
                      <PixelPin />
                      
                      {}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:100%_28px] pointer-events-none pl-8 pt-6" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3 mb-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">📓</span>
                            <h3 className="font-retro text-lg text-slate-900 uppercase tracking-tight">Today's Assignments</h3>
                          </div>
                          <button 
                            onClick={() => setView('planner')} 
                            className="text-[10px] font-black uppercase text-slate-800 hover:text-slate-950 border-2 border-slate-900 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 hover:underline flex items-center gap-0.5"
                          >
                            Open Planner <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {}
                        <form onSubmit={handleQuickTaskAdd} className="flex gap-2 mb-4">
                          <input 
                            type="text"
                            value={quickTaskTitle}
                            onChange={(e) => setQuickTaskTitle(e.target.value)}
                            placeholder="Type a target (e.g., Read Physics Ch 3)..."
                            className="flex-1 bg-white border-2 border-slate-900 text-slate-900 rounded-none px-3 py-1.5 text-xs font-bold font-mono focus:outline-none focus:border-amber-500"
                          />
                          <button type="submit" className="pixel-btn pixel-btn-primary py-1 px-4 text-xs font-black cursor-pointer">
                            <Plus className="w-4 h-4" />
                          </button>
                        </form>

                        {}
                        <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                          {tasks.length === 0 ? (
                             <div className="text-center py-8">
                               <p className="text-xs text-slate-700 font-bold">Workspace empty! No pending assignments.</p>
                               <p className="text-[10px] text-slate-500 font-mono mt-1">Draft a quick focus target using the line above.</p>
                             </div>
                          ) : (
                            tasks.filter(t => !t.completed).slice(0, 5).map(task => (
                              <div key={task.id} className="flex items-center justify-between bg-white border-2 border-slate-900 px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => toggleTaskCompletion(task.id)}
                                    className="w-5 h-5 border-2 border-slate-950 hover:bg-amber-100 flex items-center justify-center cursor-pointer text-slate-900 text-xs font-bold"
                                  >
                                    {task.completed ? '✓' : ''}
                                  </button>
                                  <span className="text-xs font-bold text-slate-900 truncate max-w-[220px] font-mono">{task.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 border font-mono ${
                                    task.priority === 'High' ? 'bg-rose-100 border-rose-400 text-rose-700' :
                                    task.priority === 'Medium' ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500 font-mono">{task.dueDate}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-300 pt-3 flex items-center justify-between mt-4">
                        <span className="text-[10px] text-slate-700 font-bold font-mono">
                          Completed: {tasks.filter(t => t.completed).length} / {tasks.length}
                        </span>
                        <div className="w-32 bg-white border-2 border-slate-900 h-2.5 overflow-hidden p-0.5">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300" 
                            style={{ width: `${tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20">
                    <div className="bg-[#fff1f2] border-4 border-slate-900 p-5 shadow-[8px_8px_0px_0px_rgba(1,4,2,1)] transform rotate-[1.5deg] min-h-[300px] flex flex-col justify-between relative text-slate-900">
                      {}
                      <PixelPin />

                      {}
                      <div className="absolute inset-2 border-2 border-dashed border-rose-200 pointer-events-none" />

                      <div>
                        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">📼</span>
                            <h3 className="font-retro text-xs text-slate-900 uppercase tracking-tight">Vibe Cassette</h3>
                          </div>
                          <button onClick={() => setView('mood')} className="text-[10px] font-black text-rose-600 hover:underline uppercase">LOGS</button>
                        </div>

                        <p className="text-[11px] text-slate-600 mb-4 leading-relaxed font-mono">
                          Tap a spool speed to sync your study vibe with {companionName}:
                        </p>

                        <div className="grid grid-cols-5 gap-1.5 my-2">
                          {[2, 4, 6, 8, 10].map(score => {
                            const emoji = score === 2 ? '😢' : score === 4 ? '🥱' : score === 6 ? '😐' : score === 8 ? '😊' : '🥳';
                            return (
                              <button
                                key={score}
                                onClick={() => addMoodEntry(score, "Quick check-in")}
                                className="bg-white hover:bg-rose-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <span className="text-lg">{emoji}</span>
                                <span className="text-[9px] font-black text-slate-800 font-mono">{score}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {}
                      <div className="bg-slate-900 border-2 border-slate-900 p-3 flex justify-center items-center gap-6 my-2">
                        <div className="w-8 h-8 rounded-full border-4 border-rose-500 border-dotted animate-spin" style={{ animationDuration: '6s' }} />
                        <div className="w-10 h-3 bg-slate-950 border border-slate-800 flex items-center justify-center text-[7px] font-bold text-slate-200 uppercase tracking-widest font-mono">TAPE A</div>
                        <div className="w-8 h-8 rounded-full border-4 border-rose-500 border-dotted animate-spin" style={{ animationDuration: '6s' }} />
                      </div>

                      <div className="border-t border-slate-200 pt-2 text-center">
                        <span className="text-[10px] text-slate-600 font-bold font-mono uppercase tracking-tight">
                          {latestMood ? `SIDE A: MOOD ${latestMood.score}/10` : "TAPE BLANK: CLICK RATINGS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20">
                    <div className="bg-[#e2e8f0] border-4 border-slate-900 rounded-b-3xl p-5 shadow-[8px_8px_0px_0px_rgba(1,4,2,1)] transform rotate-[-2deg] min-h-[300px] flex flex-col justify-between relative text-slate-900">
                      {}
                      <PixelPin />
                      
                      {}
                      <div className="bg-[#a7f3d0] border-4 border-slate-900 p-3 rounded-md text-emerald-900 font-mono relative">
                        <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" /> {/* Battery indicator */}
                        <div className="flex items-center justify-between border-b border-emerald-800/20 pb-1.5 mb-2 pl-3">
                          <h4 className="text-[10px] font-black uppercase tracking-wider">FOCUS CONSOLE</h4>
                          <button onClick={() => setView('focus')} className="text-[9px] font-black bg-emerald-200 px-1 hover:underline">RUN</button>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                          <Flame className="w-8 h-8 text-amber-500 animate-pulse shrink-0" />
                          <div>
                            <span className="text-xl font-black text-slate-900">{stats.currentStreak} DAYS</span>
                            <p className="text-[8px] text-emerald-800 font-black uppercase tracking-wider">Active Streak</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 mt-2 text-center text-[10px]">
                          <div className="bg-white/80 p-1.5 border border-slate-400">
                            <span className="font-black text-slate-900 block">{stats.hoursStudied} hr</span>
                            <span className="text-[7px] text-slate-600 font-bold uppercase">Study Time</span>
                          </div>
                          <div className="bg-white/80 p-1.5 border border-slate-400">
                            <span className="font-black text-slate-900 block">{stats.focusSessions}</span>
                            <span className="text-[7px] text-slate-600 font-bold uppercase">Sessions</span>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="grid grid-cols-2 items-center gap-2 pt-4 pb-2">
                        {}
                        <div className="relative w-16 h-16 mx-auto">
                          <div className="absolute top-5 left-1 w-14 h-4 bg-slate-800 rounded-sm" />
                          <div className="absolute top-1 left-5 w-4 h-14 bg-slate-800 rounded-sm" />
                          <div className="absolute top-5 left-5 w-4 h-4 bg-slate-900 rounded-full" />
                        </div>
                        {}
                        <div className="flex justify-center gap-3 rotate-[12deg] pl-2">
                          <div className="flex flex-col items-center">
                            <button onClick={() => setView('focus')} className="w-6 h-6 rounded-full bg-rose-600 border-2 border-slate-900 shadow-md active:bg-rose-700 cursor-pointer" />
                            <span className="text-[8px] font-black text-slate-700 mt-1">B</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <button onClick={() => setView('focus')} className="w-6 h-6 rounded-full bg-rose-600 border-2 border-slate-900 shadow-md active:bg-rose-700 cursor-pointer" />
                            <span className="text-[8px] font-black text-slate-700 mt-1">A</span>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="flex justify-center gap-6 text-[8px] font-black text-slate-500 font-mono border-t border-slate-300 pt-2">
                        <span>SELECT</span>
                        <span>START</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20">
                    {}
                    <audio 
                      ref={audioRef} 
                      onEnded={handleTrackEnded}
                      onPlay={() => setIsRadioPlaying(true)}
                      onPause={() => setIsRadioPlaying(false)}
                    />

                    <div className="bg-[#fef3c7] border-4 border-slate-900 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-[1.5deg] min-h-[300px] flex flex-col justify-between relative text-black font-mono">
                      {}
                      <PixelPin />

                      {}
                      <div>
                        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">📻</span>
                            <h3 className="font-retro text-xs font-black uppercase tracking-tight text-black">Retro Jukebox</h3>
                          </div>
                          <button 
                            onClick={() => setIsRadioMinimized(!isRadioMinimized)} 
                            className="text-[10px] font-black text-black hover:text-black hover:underline uppercase flex items-center gap-0.5 cursor-pointer"
                          >
                            {isRadioMinimized ? <Maximize2 className="w-3 h-3 text-black" /> : <Minimize2 className="w-3 h-3 text-black" />}
                            {isRadioMinimized ? "EXPAND" : "MINIMIZE"}
                          </button>
                        </div>

                        {!isRadioMinimized ? (
                          <>
                            <p className="text-[10px] text-black mb-3 leading-relaxed">
                              Eject / load any songs from your device to craft your lo-fi study playlist:
                            </p>

                            {}
                            <div className="bg-slate-900 border-2 border-slate-950 p-2.5 rounded flex items-center justify-between gap-4 my-2 text-slate-300 relative overflow-hidden">
                              {}
                              <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-750 flex items-center justify-center relative">
                                <div className={`w-6 h-6 rounded-full border border-slate-600 border-dashed ${isRadioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                              </div>

                              {}
                              <div className="flex-1 flex flex-col items-center justify-center gap-1">
                                <div className="w-full h-3 bg-amber-950/80 border border-amber-500/30 flex items-center justify-between px-1.5 text-[8px] text-amber-500 font-bold uppercase tracking-widest font-mono relative">
                                  <span>AM</span>
                                  {}
                                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 animate-pulse" />
                                  <span>FM</span>
                                </div>
                                <span className="text-[8px] text-slate-400 font-bold tracking-tight text-center truncate w-full max-w-[70px]">
                                  {currentTrackIndex !== null && radioPlaylist[currentTrackIndex] ? radioPlaylist[currentTrackIndex].name : "NO DISC"}
                                </span>
                              </div>

                              {}
                              <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-750 flex items-center justify-center relative">
                                <div className={`w-6 h-6 rounded-full border border-slate-600 border-dashed ${isRadioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                              </div>
                            </div>

                            {}
                            <div className="grid grid-cols-4 gap-1 mb-3">
                              <button 
                                onClick={handlePrevTrack}
                                className="bg-white hover:bg-amber-50 border-2 border-slate-900 py-1 flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
                                title="Previous Track"
                              >
                                <SkipBack className="w-3.5 h-3.5 text-slate-800" />
                              </button>
                              <button 
                                onClick={togglePlay}
                                className="col-span-2 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 py-1 flex items-center justify-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] font-black text-[10px] cursor-pointer"
                                title="Play / Pause"
                              >
                                {isRadioPlaying ? <Pause className="w-3.5 h-3.5 text-slate-900" /> : <Play className="w-3.5 h-3.5 text-slate-900 fill-current" />}
                                {isRadioPlaying ? "PAUSE" : "PLAY"}
                              </button>
                              <button 
                                onClick={handleNextTrack}
                                className="bg-white hover:bg-amber-50 border-2 border-slate-900 py-1 flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
                                title="Next Track"
                              >
                                <SkipForward className="w-3.5 h-3.5 text-slate-800" />
                              </button>
                            </div>

                            {}
                            <div className="flex items-center justify-between border-t border-slate-300 pt-2 mb-2">
                              <span className="text-[8px] font-black uppercase text-black">Playlist ({radioPlaylist.length})</span>
                              
                              <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white px-1.5 py-0.5 flex items-center justify-center gap-0.5 text-[8px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                <Upload className="w-2.5 h-2.5 text-white" />
                                <span>LOAD MP3</span>
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="audio/*" 
                                  onChange={handleFileUpload} 
                                  className="hidden" 
                                />
                              </label>
                            </div>

                            {}
                            <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                              {radioPlaylist.length === 0 ? (
                                <p className="text-[8px] text-center text-black py-3 italic">Playlist empty. Click LOAD to add tracks!</p>
                              ) : (
                                radioPlaylist.map((track, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`group/item flex items-center justify-between border border-dashed rounded px-1.5 py-1 text-[9px] transition-all ${
                                      currentTrackIndex === idx 
                                        ? 'border-amber-600 bg-amber-105 font-extrabold text-black' 
                                        : 'border-slate-300 bg-white/40 text-black hover:bg-white/90'
                                    }`}
                                  >
                                    <button 
                                      onClick={() => {
                                        setCurrentTrackIndex(idx);
                                        setIsRadioPlaying(true);
                                      }}
                                      className="flex-1 text-left truncate flex items-center gap-1 cursor-pointer text-black"
                                    >
                                      <span className="shrink-0">{currentTrackIndex === idx && isRadioPlaying ? "🎵" : "💿"}</span>
                                      <span className="truncate">{track.name}</span>
                                    </button>
                                    <button 
                                      onClick={() => removeTrack(idx)}
                                      className="text-black hover:text-red-600 ml-1.5 cursor-pointer"
                                      title="Remove from Playlist"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        ) : (
                          
                          <div className="flex flex-col gap-3 py-1 relative">
                            {}
                            {isRadioPlaying && (
                              <>
                                <span className="absolute -top-3 left-[15%] text-amber-600 floating-note-1 text-xs">♪</span>
                                <span className="absolute -top-3 left-[40%] text-blue-500 floating-note-2 text-sm">♫</span>
                                <span className="absolute -top-3 left-[65%] text-rose-500 floating-note-3 text-xs">♩</span>
                                <span className="absolute -top-3 left-[85%] text-indigo-500 floating-note-4 text-sm">♬</span>
                              </>
                            )}

                            {}
                            <div className="bg-slate-900 border-2 border-slate-950 p-2.5 rounded-lg text-slate-300 flex items-center justify-between gap-3 relative overflow-hidden min-h-[58px]">
                              {}
                              <div className="w-6 h-6 shrink-0 relative flex items-center justify-center">
                                <Disc className={`w-5 h-5 text-amber-400 ${isRadioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                              </div>

                              {}
                              <div className="flex-1 overflow-hidden relative">
                                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden">
                                  {currentTrackIndex !== null && radioPlaylist[currentTrackIndex] ? (
                                    <div className="inline-block animate-[marquee_10s_linear_infinite] pl-[100%] hover:[animation-play-state:paused]">
                                      Playing: {radioPlaylist[currentTrackIndex].name} • {currentLyrics}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500">JUKEBOX IDLE</span>
                                  )}
                                </div>
                              </div>

                              {}
                              <div className="flex items-end justify-center gap-0.5 h-6 w-8 shrink-0 pb-0.5">
                                <div className={`w-1 bg-amber-500 rounded-t ${isRadioPlaying ? 'music-bar-1' : 'h-1'}`} />
                                <div className={`w-1 bg-red-400 rounded-t ${isRadioPlaying ? 'music-bar-2' : 'h-[2px]'}`} />
                                <div className={`w-1 bg-rose-400 rounded-t ${isRadioPlaying ? 'music-bar-3' : 'h-[3px]'}`} />
                                <div className={`w-1 bg-blue-400 rounded-t ${isRadioPlaying ? 'music-bar-4' : 'h-1'}`} />
                                <div className={`w-1 bg-emerald-400 rounded-t ${isRadioPlaying ? 'music-bar-5' : 'h-[2px]'}`} />
                              </div>
                            </div>

                            {}
                            <div className="flex items-center justify-between gap-2 border-t border-slate-300 pt-2.5">
                              <span className="text-[8px] font-black uppercase text-slate-500">POCKET MODE</span>
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={togglePlay}
                                  className="bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 px-2 py-0.5 flex items-center justify-center text-[8px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer text-slate-900"
                                >
                                  {isRadioPlaying ? "PAUSE" : "PLAY"}
                                </button>
                                <button 
                                  onClick={() => setIsRadioMinimized(false)}
                                  className="bg-white hover:bg-amber-50 border-2 border-slate-900 px-2 py-0.5 flex items-center justify-center text-[8px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer text-slate-900"
                                >
                                  EXPAND
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {}
                      <div className="border-t border-slate-200 pt-2 text-center">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">
                          {isRadioPlaying ? "• PIXEL BUDDY SINGING •" : "RADIO STANDBY • LOAD TRACKS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="relative group transition-all duration-300 hover:scale-[1.03] hover:z-20">
                    <div className="bg-amber-400 border-4 border-slate-950 p-5 shadow-[8px_8px_0px_0px_rgba(1,4,2,1)] transform rotate-[2.5deg] min-h-[300px] flex flex-col justify-between relative text-black font-mono">
                      {}
                      <PixelPin />

                      <div>
                        <div className="border-b-2 border-slate-950 pb-2 mb-4">
                          <h3 className="font-retro text-xs uppercase tracking-tight text-black">📌 QUICK NOTES</h3>
                        </div>

                        <div className="space-y-2.5">
                          <button 
                            onClick={() => setView('planner')}
                            className="w-full py-1.5 bg-amber-100 hover:bg-white text-black border-2 border-slate-950 font-black text-[10px] flex items-center justify-between px-2.5 transition-all text-left cursor-pointer"
                          >
                            <span>📝 ADD ASSIGNMENT</span>
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => setView('focus')}
                            className="w-full py-1.5 bg-amber-100 hover:bg-white text-black border-2 border-slate-950 font-black text-[10px] flex items-center justify-between px-2.5 transition-all text-left cursor-pointer"
                          >
                            <span>🔥 FOCUS TIMER</span>
                            <Timer className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => setView('ai-helper')}
                            className="w-full py-1.5 bg-amber-100 hover:bg-white text-black border-2 border-slate-950 font-black text-[10px] flex items-center justify-between px-2.5 transition-all text-left cursor-pointer"
                          >
                            <span>🧠 AI STUDY PROMPT</span>
                            <BrainCircuit className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => setView('chat-lounge')}
                            className="w-full py-1.5 bg-amber-100 hover:bg-white text-black border-2 border-slate-950 font-black text-[10px] flex items-center justify-between px-2.5 transition-all text-left cursor-pointer"
                          >
                            <span>💬 CHAT WITH BUDDY</span>
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-950/20 pt-2 text-center text-[9px] font-black text-black">
                        *RIP OFF COMPLETED*
                      </div>
                    </div>
                  </div>

                </div>

                {}
                {}
                {}

                {/* FLOATING DECORATION: OLD SCHOOL PIXEL NOTEBOOK TILTED AT 30 DEGREES */}
                <div className="absolute -right-[150px] top-[140px] w-64 bg-[#fbf9f1] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] rotate-[22deg] p-4 font-mono text-slate-800 z-5 hidden xl:block hover:z-35 hover:scale-110 transition-all duration-300 select-none">
                  {/* Spiral Rings */}
                  <div className="absolute left-3 top-0 bottom-0 w-3 flex flex-col justify-between py-4 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-4 h-2 bg-slate-300 border border-slate-800 rounded-full -ml-1.5" />
                    ))}
                  </div>
                  
                  <div className="pl-6 space-y-2">
                    <div className="border-b-2 border-slate-400 pb-1 flex justify-between items-center">
                      <span className="text-[10px] font-black tracking-wider uppercase text-slate-900 font-retro">📓 STUDY LOG</span>
                      <span className="text-[8px] bg-red-100 border border-red-300 text-red-600 px-1 font-bold">100% DONE</span>
                    </div>
                    
                    <div className="space-y-1.5 text-[9px] leading-tight text-slate-700">
                      <p className="font-extrabold text-slate-950">• MATH: COMPLETED CH. 4</p>
                      <p className="line-through text-slate-400 opacity-60">• CHEMISTRY STUDY: OK</p>
                      <p className="font-extrabold text-slate-950">• RETRO RADIO: READY</p>
                      <p className="text-slate-500 font-semibold">• DON'T FORGET WATER! 💧</p>
                      <p className="text-emerald-700 italic font-extrabold">• BUDDY LOVES SONGS 🐾</p>
                    </div>
                    
                    {}
                    <div className="absolute bottom-3 right-3 w-10 h-10 border border-dashed border-amber-800/25 rounded-full pointer-events-none flex items-center justify-center">
                      <span className="text-[5px] text-amber-800/30 rotate-[-12deg] font-bold">COFFEE</span>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-[7px] text-slate-400 font-bold uppercase">
                      <span>STUDENT_OS_v1</span>
                      <span>PAGE 15</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="absolute -left-[140px] top-[100px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[-12deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#1e1b4b]">
                      <rect x="0" y="0" width="100" height="100" fill="#0c0a09" />
                      <rect x="0" y="20" width="100" height="80" fill="#292524" />
                      <rect x="0" y="40" width="100" height="60" fill="#7c2d12" />
                      <rect x="0" y="55" width="100" height="45" fill="#ea580c" />
                      <rect x="0" y="70" width="100" height="30" fill="#ca8a04" />
                      <rect x="40" y="50" width="20" height="20" fill="#fef08a" />
                      <rect x="10" y="30" width="30" height="8" fill="#f87171" opacity="0.6" />
                      <rect x="65" y="40" width="25" height="6" fill="#f87171" opacity="0.6" />
                      <rect x="0" y="80" width="35" height="20" fill="#065f46" />
                      <rect x="35" y="85" width="40" height="15" fill="#047857" />
                      <rect x="75" y="80" width="25" height="20" fill="#065f46" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🌅 SUNSET OVERWORLD
                  </p>
                </div>

                {}
                <div className="absolute -right-[150px] top-[410px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[15deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#090d16]">
                      <rect x="0" y="75" width="100" height="25" fill="#451a03" />
                      <rect x="25" y="50" width="18" height="25" fill="#059669" rx="1" />
                      <rect x="43" y="55" width="5" height="12" fill="none" stroke="#059669" strokeWidth="3" rx="1" />
                      <rect x="28" y="35" width="3" height="8" fill="#a7f3d0" opacity="0.6" />
                      <rect x="36" y="30" width="3" height="10" fill="#a7f3d0" opacity="0.6" />
                      <rect x="55" y="65" width="30" height="10" fill="#047857" rx="1" />
                      <rect x="58" y="60" width="24" height="5" fill="#a7f3d0" />
                      <rect x="60" y="10" width="30" height="35" fill="#030e05" rx="2" />
                      <circle cx="75" cy="22" r="6" fill="#a7f3d0" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🍵 LOFI STUDY BEATS
                  </p>
                </div>

                {}
                <div className="absolute -left-[140px] top-[390px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[-8deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#111827]">
                      <rect x="0" y="0" width="100" height="50" fill="#38bdf8" />
                      <rect x="20" y="15" width="40" height="12" fill="#ffffff" />
                      <rect x="30" y="9" width="20" height="6" fill="#ffffff" />
                      <rect x="0" y="50" width="100" height="15" fill="#22c55e" />
                      <rect x="10" y="65" width="10" height="10" fill="#22c55e" />
                      <rect x="30" y="65" width="15" height="12" fill="#15803d" />
                      <rect x="60" y="65" width="10" height="8" fill="#22c55e" />
                      <rect x="80" y="65" width="15" height="14" fill="#15803d" />
                      <rect x="0" y="65" width="100" height="35" fill="#78350f" />
                      <rect x="20" y="75" width="15" height="10" fill="#451a03" />
                      <rect x="70" y="80" width="12" height="12" fill="#451a03" />
                      <rect x="45" y="32" width="8" height="18" fill="#15803d" />
                      <rect x="41" y="22" width="16" height="10" fill="#ef4444" />
                      <rect x="45" y="18" width="8" height="4" fill="#ef4444" />
                      <rect x="47" y="24" width="4" height="4" fill="#facc15" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🌵 DESK BUDDY GRASS
                  </p>
                </div>

                {}
                <div className="absolute -right-[150px] top-[690px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[-10deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#a5f3fc]">
                      <rect x="10" y="10" width="30" height="8" fill="#f8fafc" />
                      <rect x="60" y="15" width="25" height="6" fill="#f8fafc" />
                      <rect x="0" y="75" width="100" height="25" fill="#22c55e" />
                      <rect x="0" y="75" width="100" height="4" fill="#15803d" />
                      <rect x="25" y="55" width="4" height="20" fill="#16a34a" />
                      <rect x="21" y="45" width="12" height="10" fill="#dc2626" />
                      <rect x="25" y="49" width="4" height="4" fill="#fbbf24" />
                      <rect x="44" y="26" width="36" height="24" fill="#facc15" stroke="#1e293b" strokeWidth="2" />
                      <rect x="54" y="26" width="6" height="24" fill="#78350f" />
                      <rect x="66" y="26" width="6" height="24" fill="#78350f" />
                      <rect x="48" y="32" width="4" height="6" fill="#1e293b" />
                      <rect x="46" y="38" width="6" height="4" fill="#f43f5e" />
                      <rect x="52" y="14" width="12" height="12" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" opacity="0.8" />
                      <rect x="62" y="18" width="10" height="8" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" opacity="0.8" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🐝 COZY MEADOW BEE
                  </p>
                </div>

                {}
                <div className="absolute -left-[140px] top-[670px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[12deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#1c1917]">
                      <rect x="20" y="25" width="60" height="60" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                      <rect x="30" y="40" width="40" height="45" fill="#0c0a09" />
                      <rect x="24" y="30" width="12" height="6" fill="#991b1b" />
                      <rect x="64" y="30" width="12" height="6" fill="#991b1b" />
                      <rect x="44" y="30" width="12" height="6" fill="#b91c1c" />
                      <rect x="34" y="70" width="32" height="8" fill="#78350f" transform="rotate(15 50 74)" />
                      <rect x="34" y="70" width="32" height="8" fill="#78350f" transform="rotate(-15 50 74)" />
                      <rect x="44" y="52" width="12" height="18" fill="#ea580c" />
                      <rect x="47" y="47" width="6" height="18" fill="#eab308" />
                      <rect x="41" y="58" width="4" height="10" fill="#ef4444" />
                      <rect x="55" y="58" width="4" height="10" fill="#ef4444" />
                      <rect x="48.5" y="60" width="3" height="6" fill="#ffffff" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🔥 COZY CAMPFIRE HEARTH
                  </p>
                </div>

                {}
                <div className="absolute -left-[150px] top-[950px] w-48 bg-white border-4 border-slate-900 p-2.5 pb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] rotate-[-14deg] hidden xl:block z-5 hover:z-35 hover:scale-105 transition-all duration-300 select-none">
                  <div className="w-full h-32 border-2 border-slate-900 overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full bg-[#0f172a]">
                      <rect x="15" y="15" width="2" height="2" fill="#ffffff" opacity="0.8" />
                      <rect x="75" y="22" width="3" height="3" fill="#ffffff" />
                      <rect x="48" y="35" width="2" height="2" fill="#ffffff" opacity="0.5" />
                      <rect x="25" y="25" width="18" height="18" fill="#fef08a" />
                      <rect x="29" y="29" width="14" height="14" fill="#fef9c3" />
                      <polygon points="75,35 62,55 88,55" fill="#064e3b" />
                      <polygon points="75,45 57,68 93,68" fill="#022c22" />
                      <rect x="72" y="68" width="6" height="12" fill="#451a03" />
                      <polygon points="20,45 10,65 30,65" fill="#064e3b" />
                      <polygon points="20,55 5,80 35,80" fill="#022c22" />
                      <rect x="17" y="80" width="6" height="10" fill="#451a03" />
                      <rect x="0" y="85" width="100" height="15" fill="#022c22" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-900 font-extrabold text-center mt-2.5 uppercase tracking-wider font-mono">
                    🌌 OVERWORLD MOONLIGHT
                  </p>
                </div>

              </div>

            </div>
          )}

          {}
          {currentView === 'planner' && <SmartPlanner />}
          {currentView === 'timetable' && <WeeklyTimetable />}
          {currentView === 'focus' && <FocusMode />}
          {currentView === 'mood' && <MoodTracker />}
          {currentView === 'ai-helper' && <AiStudyHelper />}
          {currentView === 'chat-lounge' && <ChatLounge />}
          {currentView === 'memories' && <MemoriesVault />}
          {currentView === 'about-myself' && <AboutMyselfOverview />}
          {currentView === 'profile' && <ProfilePage />}
          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {}
      {showGraduationConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-emerald-500 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
            {}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {}
            <div className="flex justify-center py-2">
              <PixelCompanion 
                customization={companionCustomization} 
                state="Celebrating" 
                size="lg" 
              />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" /> THE FINAL THRESHOLD
              </span>
              <h3 className="text-2xl font-black text-white font-retro uppercase tracking-wider">
                Graduate Journey?
              </h3>
              <p className="text-emerald-400/80 text-xs leading-relaxed max-w-xs mx-auto font-mono">
                Are you sure you're ready to complete your StudentOS journey and graduate? This triggers a cinematic farewell experience celebrating your hard work!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowGraduationConfirm(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold rounded-2xl border border-slate-700 text-xs cursor-pointer transition-all"
              >
                No, Stay Here
              </button>
              <button
                onClick={() => {
                  setShowGraduationConfirm(false);
                  triggerGraduation();
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl border border-emerald-400 text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40"
              >
                <CheckCircle2 className="w-4.5 h-4.5" /> Yes, Graduate! 🎓
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showPassNextYearModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-indigo-500 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {}
            <div className="flex justify-center py-2">
              <PixelCompanion 
                customization={companionCustomization} 
                state="Celebrating" 
                size="lg" 
              />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-bounce" /> Level Up! Grade {currentUser?.grade} Achieved
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                Well Done! 🚀
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
                You have officially passed to the next academic level! Your partner companion is thrilled to continue this amazing journey with you.
              </p>
            </div>

            {}
            <div className="bg-indigo-950/40 border border-indigo-500/20 p-4 rounded-2xl relative">
              <span className="absolute -top-3 left-6 px-2 bg-slate-900 text-[8px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                Inspirational Spark
              </span>
              <p className="text-xs text-indigo-200 italic leading-relaxed pt-1">
                {passNextYearQuote}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowPassNextYearModal(false);
                  setCompanionState('Idle');
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl border border-indigo-400 text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/40"
              >
                Keep Advancing! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showProfileModal && (
        <ProfileEditModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};
