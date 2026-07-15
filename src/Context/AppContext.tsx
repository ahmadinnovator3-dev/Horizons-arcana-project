import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  MoodEntry, 
  CompanionCustomization, 
  CompanionState, 
  UserProfile, 
  Achievement, 
  UserStats, 
  ChatMessage,
  ChatSession,
  TimeTableEntry,
  MemoryFile,
  MemoryFolder
} from '../types';

interface AppContextType {
  
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  usersDb: Record<string, UserProfile>;
  signUp: (profile: Omit<UserProfile, 'companion' | 'createdAt'>) => void;
  login: (email: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  reviewerLogin: () => void;
  
  
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  tempOnboardingData: Partial<UserProfile>;
  updateTempOnboardingData: (data: Partial<UserProfile>) => void;
  completeOnboarding: (customization: CompanionCustomization) => void;

  
  tasks: Task[];
  addTask: (title: string, category: string, dueDate: string, priority: 'Low' | 'Medium' | 'High') => void;
  editTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;

  
  focusTimeToday: number; 
  focusSessionsCount: number;
  currentStreak: number;
  logFocusSession: (durationMinutes: number) => void;

  
  moodEntries: MoodEntry[];
  addMoodEntry: (score: number, note?: string) => void;

  
  companionCustomization: CompanionCustomization;
  companionState: CompanionState;
  setCompanionState: (state: CompanionState) => void;
  updateCompanionAppearance: (customization: Partial<CompanionCustomization>) => void;
  companionName: string;
  setCompanionName: (name: string) => void;

  
  achievements: Achievement[];
  stats: UserStats;
  unlockAchievement: (id: string) => void;
  activeNotification: string | null;
  setActiveNotification: (msg: string | null) => void;

  
  theme: 'hackmode' | 'fun' | 'office';
  setTheme: (theme: 'hackmode' | 'fun' | 'office') => void;
  language: string;
  setLanguage: (lang: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  
  showDailyCelebration: boolean;
  setShowDailyCelebration: (show: boolean) => void;
  triggerGraduation: () => void;

  
  savedChats: ChatSession[];
  saveChatSession: (id: string, title: string, messages: ChatMessage[]) => void;
  deleteChatSession: (id: string) => void;

  
  timetable: TimeTableEntry[];
  addTimetableEntry: (entry: Omit<TimeTableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;

  
  lastLearningActivityTime: number;
  updateLearningActivity: () => void;

  
  folders: MemoryFolder[];
  addFolder: (name: string) => void;
  renameFolder: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;
  addFileToFolder: (folderId: string, file: Omit<MemoryFile, 'id' | 'date'>) => void;
  deleteFileFromFolder: (folderId: string, fileId: string) => void;
}

const defaultCompanion: CompanionCustomization = {
  gender: 'girl',
  hair: 'wavy',
  hairColor: '#7C4A3A', 
  outfit: 'sweater',
  outfitColor: '#FAF0E6', 
  skin: 'peach',
  accessory: 'none',
};

const initialAchievements: Achievement[] = [
  { id: 'first_task', title: 'Assignment Hero', description: 'Complete your first assignment.', category: 'Planner', icon: '📝', unlocked: false },
  { id: 'first_focus', title: 'Focus Warrior', description: 'Complete your first study session.', category: 'focus', icon: '⚡', unlocked: false },
  { id: 'study_champion', title: 'Study Champion', description: 'Log a total of 10 hours of focused study.', category: 'focus', icon: '👑', unlocked: false },
  { id: 'first_week', title: 'Week Streak', description: 'Log in and stay active for 7 days in a row.', category: 'streak', icon: '🔥', unlocked: false },
  { id: 'mood_logger', title: 'Consistency Champion', description: 'Log your mood 3 days in a row.', category: 'mood', icon: '☀️', unlocked: false },
  { id: 'focus_master', title: 'Focus Master', description: 'Complete a 50-minute Pomodoro session.', category: 'focus', icon: '🧠', unlocked: false },
];

const defaultFolders: MemoryFolder[] = [
  { id: 'friends', name: 'photos with friends', isPredefined: true, files: [] },
  { id: 'certificates', name: 'achievements and certificates', isPredefined: true, files: [] },
  { id: 'results', name: 'grades and results', isPredefined: true, files: [] },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [currentView, setView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usersDb, setUsersDb] = useState<Record<string, UserProfile>>({});
  
  
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [tempOnboardingData, setTempOnboardingData] = useState<Partial<UserProfile>>({});

  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [savedChats, setSavedChats] = useState<ChatSession[]>([]);
  const [timetable, setTimetable] = useState<TimeTableEntry[]>([]);
  const [lastLearningActivityTime, setLastLearningActivityTime] = useState<number>(Date.now());
  const [folders, setFolders] = useState<MemoryFolder[]>(defaultFolders);
  
  
  const [companionCustomization, setCompanionCustomization] = useState<CompanionCustomization>(defaultCompanion);
  const [companionState, setCompanionState] = useState<CompanionState>('Idle');
  const [companionName, setCompanionName] = useState<string>('Pixel Buddy');
  const [theme, setTheme] = useState<'hackmode' | 'fun' | 'office'>('hackmode');
  const [language, setLanguage] = useState<string>('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [stats, setStats] = useState<UserStats>({
    tasksCompleted: 0,
    hoursStudied: 0,
    focusSessions: 0,
    moodCheckIns: 0,
    currentStreak: 0,
  });
  const [showDailyCelebration, setShowDailyCelebration] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  
  useEffect(() => {
    const storedUsers = localStorage.getItem('student_os_users');
    if (storedUsers) {
      try {
        setUsersDb(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Error parsing stored users", e);
      }
    }
  }, []);

  
  useEffect(() => {
    if (currentUser) {
      const userKey = `student_os_data_${currentUser.email}`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setTasks(parsed.tasks || []);
          setMoodEntries(parsed.moodEntries || []);
          setSavedChats(parsed.savedChats || []);
          setTimetable(parsed.timetable || []);
          setLastLearningActivityTime(parsed.lastLearningActivityTime || Date.now());
          setAchievements(parsed.achievements || initialAchievements);
          setFolders(parsed.folders || defaultFolders);
          
          const loadedStats = parsed.stats || {
            tasksCompleted: 0,
            hoursStudied: 0,
            focusSessions: 0,
            moodCheckIns: 0,
            currentStreak: 1,
          };

          
          const todayStr = new Date().toDateString();
          let streak = loadedStats.currentStreak || 1;
          let lastDate = loadedStats.lastActiveDate;

          if (lastDate && lastDate !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate === yesterday.toDateString()) {
              streak += 1;
            } else {
              streak = 1; 
            }
          } else if (!lastDate) {
            streak = 1;
          }

          setStats({
            ...loadedStats,
            currentStreak: streak,
            lastActiveDate: todayStr
          });

          setCompanionCustomization(parsed.companionCustomization || currentUser.companion);
          setCompanionName(parsed.companionName || 'Pixel Buddy');
          setTheme(parsed.theme || 'hackmode');
          setLanguage(parsed.language || 'English');
          setNotificationsEnabled(parsed.notificationsEnabled !== false);
        } catch (e) {
          console.error("Error loading user data", e);
        }
      } else {
        
        setTasks([]);
        setMoodEntries([]);
        setSavedChats([]);
        setTimetable([]);
        setLastLearningActivityTime(Date.now());
        setAchievements(initialAchievements);
        setFolders(defaultFolders);
        setStats({
          tasksCompleted: 0,
          hoursStudied: 0,
          focusSessions: 0,
          moodCheckIns: 0,
          currentStreak: 1,
          lastActiveDate: new Date().toDateString(),
        });
        setCompanionCustomization(currentUser.companion || defaultCompanion);
        setCompanionName('Pixel Buddy');
        setTheme('hackmode');
        setLanguage('English');
        setNotificationsEnabled(true);
      }
    } else {
      
      setTasks([]);
      setMoodEntries([]);
      setSavedChats([]);
      setTimetable([]);
      setLastLearningActivityTime(Date.now());
      setAchievements(initialAchievements);
      setFolders(defaultFolders);
      setStats({
        tasksCompleted: 0,
        hoursStudied: 0,
        focusSessions: 0,
        moodCheckIns: 0,
        currentStreak: 0,
      });
      setCompanionCustomization(defaultCompanion);
      setTheme('hackmode');
    }
  }, [currentUser]);

  
  const saveUserData = (
    updatedTasks: Task[],
    updatedMood: MoodEntry[],
    updatedSavedChats: ChatSession[],
    updatedTimetable: TimeTableEntry[],
    updatedLastActivity: number,
    updatedAchievements: Achievement[],
    updatedStats: UserStats,
    updatedCustomization: CompanionCustomization,
    updatedCompName: string,
    updatedTheme: 'hackmode' | 'fun' | 'office',
    updatedLang: string,
    updatedNotif: boolean,
    updatedFolders: MemoryFolder[]
  ) => {
    if (!currentUser) return;
    const userKey = `student_os_data_${currentUser.email}`;
    const payload = {
      tasks: updatedTasks,
      moodEntries: updatedMood,
      savedChats: updatedSavedChats,
      timetable: updatedTimetable,
      lastLearningActivityTime: updatedLastActivity,
      achievements: updatedAchievements,
      stats: updatedStats,
      companionCustomization: updatedCustomization,
      companionName: updatedCompName,
      theme: updatedTheme,
      language: updatedLang,
      notificationsEnabled: updatedNotif,
      folders: updatedFolders,
    };
    localStorage.setItem(userKey, JSON.stringify(payload));
  };

  
  useEffect(() => {
    if (currentUser) {
      saveUserData(
        tasks,
        moodEntries,
        savedChats,
        timetable,
        lastLearningActivityTime,
        achievements,
        stats,
        companionCustomization,
        companionName,
        theme,
        language,
        notificationsEnabled,
        folders
      );
    }
  }, [tasks, moodEntries, savedChats, timetable, lastLearningActivityTime, achievements, stats, companionCustomization, companionName, theme, language, notificationsEnabled, folders]);

  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'midnight', 'theme-hackmode', 'theme-fun', 'theme-office');
    if (theme === 'fun') {
      root.classList.add('theme-fun');
    } else if (theme === 'office') {
      root.classList.add('theme-office');
    } else {
      root.classList.add('theme-hackmode');
    }
  }, [theme]);

  
  const triggerNotification = (message: string) => {
    setActiveNotification(message);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  
  const signUp = (profile: Omit<UserProfile, 'companion' | 'createdAt'>) => {
    const freshUser: UserProfile = {
      ...profile,
      companion: defaultCompanion,
      createdAt: new Date().toISOString(),
    };
    const updatedDb = { ...usersDb, [profile.email]: freshUser };
    setUsersDb(updatedDb);
    localStorage.setItem('student_os_users', JSON.stringify(updatedDb));
    setTempOnboardingData(freshUser);
    setOnboardingStep(1);
    setView('onboarding');
  };

  const login = (email: string): boolean => {
    const user = usersDb[email];
    if (user) {
      setCurrentUser(user);
      
      
      const todayStr = new Date().toDateString();
      const userKey = `student_os_data_${email}`;
      const savedDataRaw = localStorage.getItem(userKey);
      let streak = 1;
      let lastDate = todayStr;
      
      if (savedDataRaw) {
        try {
          const parsed = JSON.parse(savedDataRaw);
          const currentStats = parsed.stats || {};
          streak = currentStats.currentStreak || 1;
          lastDate = currentStats.lastActiveDate || todayStr;
          
          if (lastDate !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate === yesterday.toDateString()) {
              streak += 1;
            } else {
              streak = 1; 
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      
      const updatedStats = {
        ...(stats),
        currentStreak: streak,
        lastActiveDate: todayStr
      };
      setStats(updatedStats);
      
      if (streak >= 7) {
        unlockAchievement('first_week');
      }

      setCompanionState('Idle');
      setView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const reviewerLogin = () => {
    const reviewerProfile: UserProfile = {
      email: 'reviewer@studentos.internal',
      name: 'reviewer',
      birthday: '2000-01-01',
      schoolName: 'Reviewer Academy',
      grade: '12',
      languages: ['English'],
      studyGoals: 'Evaluate all application components, test planners, companion, and retro widgets.',
      preferredTimes: 'Anytime',
      companion: defaultCompanion,
      createdAt: new Date().toISOString(),
    };
    
    
    const updatedDb = { ...usersDb, [reviewerProfile.email]: reviewerProfile };
    setUsersDb(updatedDb);
    localStorage.setItem('student_os_users', JSON.stringify(updatedDb));
    
    
    setCurrentUser(reviewerProfile);
    setCompanionState('Idle');
    setView('dashboard');
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...profile };
    setCurrentUser(updatedUser);
    const updatedDb = { ...usersDb, [currentUser.email]: updatedUser };
    setUsersDb(updatedDb);
    localStorage.setItem('student_os_users', JSON.stringify(updatedDb));
  };

  
  const completeOnboarding = (customization: CompanionCustomization) => {
    if (!tempOnboardingData.email) return;
    
    const finalProfile: UserProfile = {
      email: tempOnboardingData.email || '',
      name: tempOnboardingData.name || 'Student',
      birthday: tempOnboardingData.birthday || '',
      schoolName: tempOnboardingData.schoolName || '',
      grade: tempOnboardingData.grade || '6',
      languages: tempOnboardingData.languages || ['English'],
      studyGoals: tempOnboardingData.studyGoals || 'To master my homework and build stellar notes!',
      preferredTimes: tempOnboardingData.preferredTimes || 'Evening',
      companion: customization,
      createdAt: new Date().toISOString()
    };

    const updatedDb = { ...usersDb, [finalProfile.email]: finalProfile };
    setUsersDb(updatedDb);
    localStorage.setItem('student_os_users', JSON.stringify(updatedDb));
    
    
    setCurrentUser(finalProfile);
    setCompanionCustomization(customization);
    setCompanionState('Celebrating');
    setOnboardingStep(4); 
  };

  const updateTempOnboardingData = (data: Partial<UserProfile>) => {
    setTempOnboardingData(prev => ({ ...prev, ...data }));
  };

  
  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const alreadyUnlocked = prev.find(a => a.id === id)?.unlocked;
      if (alreadyUnlocked) return prev;

      triggerNotification(`🏆 Achievement Unlocked: ${prev.find(a => a.id === id)?.title}!`);
      setCompanionState('Celebrating');
      setTimeout(() => setCompanionState('Idle'), 4000);

      return prev.map(a => a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() } : a);
    });
  };

  const updateLearningActivity = () => {
    setLastLearningActivityTime(Date.now());
  };

  
  const addTask = (title: string, category: string, dueDate: string, priority: 'Low' | 'Medium' | 'High') => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      category,
      dueDate,
      priority,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setCompanionState('Thinking');
    updateLearningActivity();
    setTimeout(() => setCompanionState('Idle'), 2000);
  };

  const editTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      const completing = task ? !task.completed : false;

      if (completing) {
        setCompanionState('Happy');
        unlockAchievement('first_task');
        updateLearningActivity();
        setTimeout(() => setCompanionState('Idle'), 3000);
        
        
        setStats(s => ({ ...s, tasksCompleted: s.tasksCompleted + 1 }));

        
        const activeTasks = prev.filter(t => !t.completed && t.id !== id);
        if (activeTasks.length === 0 && prev.length > 0) {
          
          setTimeout(() => {
            setShowDailyCelebration(true);
            setCompanionState('Celebrating');
          }, 8000);
        }
      }

      return prev.map(t => t.id === id ? { ...t, completed: completing, completedAt: completing ? new Date().toISOString() : undefined } : t);
    });
  };

  
  const logFocusSession = (durationMinutes: number) => {
    setStats(s => {
      const sessions = s.focusSessions + 1;
      const hours = s.hoursStudied + (durationMinutes / 60);
      const isMaster = durationMinutes >= 50;

      
      setTimeout(() => {
        unlockAchievement('first_focus');
        if (hours >= 10) {
          unlockAchievement('study_champion');
        }
        if (isMaster) {
          unlockAchievement('focus_master');
        }
      }, 500);

      return {
        ...s,
        focusSessions: sessions,
        hoursStudied: parseFloat(hours.toFixed(1))
      };
    });

    setCompanionState('Relaxing');
    updateLearningActivity();
    setTimeout(() => setCompanionState('Idle'), 4000);
  };

  
  const addMoodEntry = (score: number, note?: string) => {
    const newEntry: MoodEntry = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      score,
      note,
    };
    setMoodEntries(prev => [newEntry, ...prev]);
    
    
    setStats(s => ({ ...s, moodCheckIns: s.moodCheckIns + 1 }));

    
    if (score >= 8) {
      setCompanionState('Happy');
    } else if (score <= 4) {
      setCompanionState('Tired');
    } else {
      setCompanionState('Relaxing');
    }
    setTimeout(() => setCompanionState('Idle'), 4000);

    
    
    if (moodEntries.length >= 2) {
      unlockAchievement('mood_logger');
    }
    updateLearningActivity();
  };

  
  const saveChatSession = (id: string, title: string, messages: ChatMessage[]) => {
    setSavedChats(prev => {
      const existing = prev.find(c => c.id === id);
      const nowString = new Date().toISOString();
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, title, messages, lastUpdatedAt: nowString } : c);
      } else {
        const newSession: ChatSession = {
          id,
          title,
          messages,
          createdAt: nowString,
          lastUpdatedAt: nowString,
        };
        return [newSession, ...prev];
      }
    });
    updateLearningActivity();
  };

  const deleteChatSession = (id: string) => {
    setSavedChats(prev => prev.filter(c => c.id !== id));
  };

  
  const addTimetableEntry = (entry: Omit<TimeTableEntry, 'id'>) => {
    const newEntry: TimeTableEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTimetable(prev => [...prev, newEntry]);
    updateLearningActivity();
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
  };

  const updateCompanionAppearance = (customization: Partial<CompanionCustomization>) => {
    setCompanionCustomization(prev => ({ ...prev, ...customization }));
  };

  const triggerGraduation = () => {
    setCompanionState('Celebrating');
    setView('graduation');
  };

  
  const addFolder = (name: string) => {
    const newFolder: MemoryFolder = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.toLowerCase(),
      files: [],
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName.toLowerCase() } : f));
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id || f.isPredefined));
  };

  const addFileToFolder = (folderId: string, file: Omit<MemoryFile, 'id' | 'date'>) => {
    const newFile: MemoryFile = {
      ...file,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
    };
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          files: [newFile, ...f.files],
        };
      }
      return f;
    }));
  };

  const deleteFileFromFolder = (folderId: string, fileId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          files: f.files.filter(file => file.id !== fileId),
        };
      }
      return f;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setView,
      currentUser,
      setCurrentUser,
      usersDb,
      signUp,
      login,
      logout,
      updateProfile,
      reviewerLogin,

      onboardingStep,
      setOnboardingStep,
      tempOnboardingData,
      updateTempOnboardingData,
      completeOnboarding,

      tasks,
      addTask,
      editTask,
      deleteTask,
      toggleTaskCompletion,

      focusTimeToday: stats.hoursStudied * 3600,
      focusSessionsCount: stats.focusSessions,
      currentStreak: stats.currentStreak,
      logFocusSession,

      moodEntries,
      addMoodEntry,

      companionCustomization,
      companionState,
      setCompanionState,
      updateCompanionAppearance,
      companionName,
      setCompanionName,

      achievements,
      stats,
      unlockAchievement,
      activeNotification,
      setActiveNotification,

      theme,
      setTheme,
      language,
      setLanguage,
      notificationsEnabled,
      setNotificationsEnabled,

      showDailyCelebration,
      setShowDailyCelebration,
      triggerGraduation,

      
      savedChats,
      saveChatSession,
      deleteChatSession,

      
      timetable,
      addTimetableEntry,
      deleteTimetableEntry,

      
      lastLearningActivityTime,
      updateLearningActivity,

      
      folders,
      addFolder,
      renameFolder,
      deleteFolder,
      addFileToFolder,
      deleteFileFromFolder,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};