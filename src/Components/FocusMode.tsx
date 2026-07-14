import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../Context/AppContext';
import { Play, Pause, RotateCcw, HelpCircle, Award, Target, BookOpen } from 'lucide-react';

export const FocusMode: React.FC = () => {
  const { 
    setCompanionState, 
    logFocusSession, 
    stats,
    currentUser
  } = useApp();

  
  const [sessionType, setSessionType] = useState<'25' | '50' | 'custom'>('25');
  const [customMinutes, setCustomMinutes] = useState('15');

  
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [totalSessionMinutes, setTotalSessionMinutes] = useState(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const quotes = [
    "You are capable of doing amazing things!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't study to pass, study to understand and level up your mind!",
    "Your future self will thank you for the hard work you put in today.",
    "Believe you can and you're halfway there.",
    "Big accomplishments are built on tiny 25-minute blocks.",
    "Put your phone away. It's just you and your companion masterclass!"
  ];
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIdx(prev => (prev + 1) % quotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (isRunning) return; 
    if (sessionType === '25') {
      setTimeLeft(25 * 60);
      setTotalSessionMinutes(25);
    } else if (sessionType === '50') {
      setTimeLeft(50 * 60);
      setTotalSessionMinutes(50);
    } else {
      const parsed = parseInt(customMinutes, 10);
      const val = isNaN(parsed) || parsed <= 0 ? 15 : parsed;
      setTimeLeft(val * 60);
      setTotalSessionMinutes(val);
    }
  }, [sessionType, customMinutes]);

  
  useEffect(() => {
    if (isRunning) {
      
      setCompanionState('Studying');

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    setCompanionState('Idle');
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompanionState('Idle');
    if (sessionType === '25') {
      setTimeLeft(25 * 60);
    } else if (sessionType === '50') {
      setTimeLeft(50 * 60);
    } else {
      const parsed = parseInt(customMinutes, 10);
      setTimeLeft((isNaN(parsed) || parsed <= 0 ? 15 : parsed) * 60);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setCompanionState('Relaxing');
    setTimeout(() => setCompanionState('Idle'), 3000);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    logFocusSession(totalSessionMinutes);
    
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    alert(`🎉 Brilliant job! You completed your ${totalSessionMinutes} minutes study session with your companion! Logged!`);
    handleReset();
  };

  
  const formatTimeStr = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  
  const getInitialSeconds = () => {
    if (sessionType === '25') return 25 * 60;
    if (sessionType === '50') return 50 * 60;
    const parsed = parseInt(customMinutes, 10);
    return (isNaN(parsed) || parsed <= 0 ? 15 : parsed) * 60;
  };
  const initialSeconds = getInitialSeconds();
  const percentageCompleted = ((initialSeconds - timeLeft) / initialSeconds) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Focus Mode</h1>
        <p className="text-slate-500 text-sm">Block out the haters, stay locked in, and grind alongside your custom pixel buddy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center md:col-span-2 min-h-[420px] relative overflow-hidden">
          
          {}
          {isRunning && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-red-600 font-mono text-xs font-black animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" /> STUDYING ALONGSIDE PIXEL BUDDY
            </div>
          )}

          {}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl gap-1 mb-6 relative z-10">
            <button
              onClick={() => setSessionType('25')}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sessionType === '25' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 disabled:opacity-50'
              }`}
            >
              25 Mins Focus
            </button>
            <button
              onClick={() => setSessionType('50')}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sessionType === '50' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 disabled:opacity-50'
              }`}
            >
              50 Mins Focus
            </button>
            <button
              onClick={() => setSessionType('custom')}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sessionType === 'custom' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 disabled:opacity-50'
              }`}
            >
              Custom
            </button>
          </div>

          {sessionType === 'custom' && (
            <div className="flex items-center gap-2 mb-6 relative z-10" style={{ opacity: isRunning ? 0.5 : 1 }}>
              <span className="text-xs font-extrabold text-slate-400 font-mono">SET CUSTOM MINUTES:</span>
              <input
                type="number"
                disabled={isRunning}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {}
          <div className="relative w-56 h-56 flex items-center justify-center mb-8">
            {}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="95" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
              <circle 
                cx="112" 
                cy="112" 
                r="95" 
                stroke="#4f46e5" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray="596"
                strokeDashoffset={596 - (596 * percentageCompleted) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {}
            <div className="text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-black font-mono text-slate-900 tracking-tight">
                {formatTimeStr(timeLeft)}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isRunning ? "Stay Focused" : "Ready"}
              </p>
            </div>
          </div>

          {}
          <div className="flex items-center gap-4 relative z-10">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Play className="w-4 h-4" /> Start Focus
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-250 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {}
        <div className="space-y-6">
          {}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[180px] relative overflow-hidden">
            {}
            <div className="absolute bottom-0 right-0 opacity-10 select-none pointer-events-none transform translate-y-4 translate-x-4">
              <BookOpen className="w-44 h-44 text-white" />
            </div>

            <div className="relative z-10">
              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest font-mono">Focus Companion says:</span>
              <p className="text-sm font-bold mt-2 leading-relaxed transition-opacity duration-500">
                "{quotes[activeQuoteIdx]}"
              </p>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono font-bold mt-4">Level up, {currentUser.name}! 🚀</span>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-950 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-indigo-600" />
              Focus Achievements
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Hours Studied:</span>
                <span className="text-xs font-black text-slate-800 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-150">
                  {stats.hoursStudied} Hours
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Completed Sessions:</span>
                <span className="text-xs font-black text-slate-800 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-150">
                  {stats.focusSessions} Sessions
                </span>
              </div>

              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active Daily Streak:</span>
                <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  {stats.currentStreak} Days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
