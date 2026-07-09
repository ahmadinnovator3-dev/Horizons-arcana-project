import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { Sparkles, Mail, Lock, User, Calendar, GraduationCap, Languages, ArrowRight } from 'lucide-react';
// @ts-ignore
import logoImage from '../assets/images/studentos_logo_1782397125648.jpg';

export const AuthPages: React.FC<{ initialMode: 'login' | 'signup' }> = ({ initialMode }) => {
  const { signUp, login, usersDb, setView } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('7');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [customLanguage, setCustomLanguage] = useState('');

  const [error, setError] = useState<string | null>(null);

  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Other'];

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang) 
        : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (mode === 'signup') {
      if (!name || !birthday || !schoolName) {
        setError("Please complete all profile details.");
        return;
      }

      
      if (usersDb[email]) {
        setError("This email is already registered. Try logging in.");
        return;
      }

      
      const finalLanguages = selectedLanguages.map(l => 
        l === 'Other' ? (customLanguage.trim() || 'Other') : l
      );

      
      signUp({
        email,
        name,
        birthday,
        schoolName,
        grade,
        languages: finalLanguages,
        studyGoals: '',
        preferredTimes: '',
      });
    } else {
      
      const success = login(email);
      if (success) {
        setView('dashboard');
      } else {
        setError("Invalid email address. Please make sure you have signed up first!");
      }
    }
  };

  return (
    <div className="min-h-screen pixel-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
        
        <div className="text-center relative z-10">
          <div 
            onClick={() => setView('landing')}
            className="inline-flex items-center justify-center gap-2 cursor-pointer mb-4"
          >
            <div className="w-10 h-10 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-slate-50">
              <img src={logoImage} alt="StudentOS" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 font-retro uppercase">StudentOS</span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 uppercase font-retro tracking-wide">
            {mode === 'signup' ? "Create Student Space" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            {mode === 'signup' 
              ? "Join StudentOS to organize your studies and wellbeing." 
              : "Login to check in with your companion and view today's schedule."}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-600 text-rose-800 px-4 py-3 text-xs font-bold relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-sm"
                />
              </div>
            </div>

            {}
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jordan"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Birthday</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                      <input
                        type="date"
                        required
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">School Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <GraduationCap className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Maple Academy"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-2 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold text-xs outline-none cursor-pointer"
                    >
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-400" />
                    Languages You Study
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((lang) => {
                      const isSelected = selectedLanguages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`pixel-btn text-[10px] py-1 ${
                            isSelected 
                              ? 'pixel-btn-primary text-white' 
                              : 'bg-white text-slate-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}{lang}
                        </button>
                      );
                    })}
                  </div>

                  {selectedLanguages.includes('Other') && (
                    <div className="mt-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Type Preferred Language
                      </label>
                      <input
                        type="text"
                        required
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        placeholder="e.g. Korean, Italian..."
                        className="w-full px-3 py-2 bg-white border-2 border-slate-900 text-slate-900 font-bold focus:outline-none text-xs"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full pixel-btn pixel-btn-primary py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 group cursor-pointer"
          >
            {mode === 'signup' ? "Continue to Onboarding" : "Enter Dashboard"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="border-t-2 border-slate-900 pt-6 text-center relative z-10">
          <p className="text-xs text-slate-500">
            {mode === 'signup' ? "Already have a student profile?" : "New to StudentOS?"}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setError(null);
              }}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              {mode === 'signup' ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};