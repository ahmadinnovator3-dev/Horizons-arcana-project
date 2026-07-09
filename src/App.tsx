import React from 'react';
import { useApp, AppProvider } from './Context/AppContext'

import { LandingPage } from './Components/LandingPage';
import { AuthPages } from './Components/AuthPages';
import { Onboarding } from './Components/Onboarding';
import { Dashboard } from './Components/Dashboard';
import { Graduation } from './Components/Graduation';
import { PixelCompanion } from './Components/PixelCompanion';


import { Award, Trophy, Smile, Sparkles, X, Check } from 'lucide-react';

const MainAppContext: React.FC = () => {
    const {
        currentView,
        showDailyCelebration,
        setShowDailyCelebration,
        activeNotification,
        setActiveNotification,
        companionCustomization,
        companionName
    } = useApp();

    return (
    <div className="min-h-screen w-screen ambient-workspace-bg flex items-center justify-center p-0 md:p-6 overflow-hidden selection:bg-indigo-100">
      <div 
        className="w-full aspect-[16/9] aspect-16-9-viewport relative shadow-[0_0_80px_rgba(0,0,0,0.85)] border-0 md:border-4 border-slate-950 bg-slate-50 flex flex-col overflow-hidden rounded-none md:rounded-2xl"
        style={{
          maxWidth: '177.78vh',
          maxHeight: '100vh',
        }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative">
          {}
          {currentView === 'landing' && <LandingPage />}
          {(currentView === 'login' || currentView === 'signup') && <AuthPages initialMode={currentView as 'signup' | 'login'} />}
          {currentView === 'onboarding' && <Onboarding />}
          
          {}
          {(currentView === 'dashboard' || 
            currentView === 'planner' || 
            currentView === 'timetable' || 
            currentView === 'focus' || 
            currentView === 'mood' || 
            currentView === 'ai-helper' || 
            currentView === 'chat-lounge' || 
            currentView === 'memories' || 
            currentView === 'about-myself' || 
            currentView === 'profile' || 
            currentView === 'settings') && <Dashboard />}

          {currentView === 'graduation' && <Graduation />}
        </div>

        {}
        {activeNotification && (
          <div className="absolute bottom-6 right-6 z-50 animate-bounce max-w-sm w-full bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3.5 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider uppercase">QUEST UNLOCKED</span>
              <p className="text-xs font-black mt-0.5">{activeNotification}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Check your profile to view your unlocked badges!</p>
            </div>
            <button 
              onClick={() => setActiveNotification(null)}
              className="text-slate-500 hover:text-white shrink-0 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {}
        {showDailyCelebration && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative overflow-hidden">
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
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" /> QUESTS CLEAR!
                </span>
                <h3 className="text-2xl font-black text-slate-950">
                  All Targets Completed!
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Superb productivity! You and <strong className="text-slate-800 font-mono">{companionName}</strong> cleared every single active task in your planner. Take a well-deserved, comfortable study break!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowDailyCelebration(false);
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow hover:shadow-lg shadow-indigo-100 transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4.5 h-4.5" /> Outstanding, Back to Dashboard!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContext/>
    </AppProvider>
  );
}



