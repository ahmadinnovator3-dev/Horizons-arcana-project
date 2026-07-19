export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  priority: PriorityLevel;
  completed: boolean;
  completedAt?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  score: number; 
}

export interface CompanionCustomization {
  gender: 'boy' | 'girl'; 
  hair: string; 
  hairColor: string; 
  outfit: string; 
  outfitColor: string;
  skin: string; 
  accessory: string; 
}

export type CompanionState = 
  | 'Idle' 
  | 'Studying' 
  | 'Happy' 
  | 'Celebrating' 
  | 'Thinking' 
  | 'Relaxing' 
  | 'Tired';

export interface UserProfile {
  email: string;
  name: string;
  birthday: string;
  schoolName: string;
  grade: string;
  languages: string[];
  studyGoals: string;
  preferredTimes: string;
  companion: CompanionCustomization;
  createdAt: string;
  password?: string;
  age?: string;
  avatarUrl?: string;
  personalInfo?: string;
  gender?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'planner' | 'focus' | 'mood' | 'streak' | 'general';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  tasksCompleted: number;
  hoursStudied: number;
  focusSessions: number;
  moodCheckIns: number;
  currentStreak: number;
  lastActiveDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  lastUpdatedAt: string;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  subject: string;
  startTime: string; 
  endTime: string;   
  room?: string;
  teacher?: string;
  color: string;     
}

export interface MemoryFile {
  id: string;
  name: string;
  type: string; 
  url: string; 
  date: string;
  notes?: string;
}

export interface MemoryFolder {
  id: string;
  name: string;
  isPredefined?: boolean;
  files: MemoryFile[];
}

