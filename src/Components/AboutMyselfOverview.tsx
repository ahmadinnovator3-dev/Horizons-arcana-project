import React, { useState, useEffect } from 'react';
import { useApp } from '../Context/AppContext';
import { Sparkles, Brain, Award, ChevronRight, MessageSquare, Send, RefreshCw, AlertCircle, FileText } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AboutMyselfOverview: React.FC = () => {
  const { 
    currentUser, 
    folders, 
    stats = { tasksCompleted: 0, hoursStudied: 0, currentStreak: 1, focusSessions: 0, moodCheckIns: 0 }, 
    achievements = [], 
    companionName = 'Buddy' 
  } = useApp();

  const safeFolders = Array.isArray(folders) ? folders : [];
  
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  if (!currentUser) return null;

  
  const parseBoldText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-slate-900">{part}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = parseBoldText(headerMatch[2]);
        if (level === 1) return <h1 key={i} className="text-xl font-black text-slate-900 mt-5 mb-2.5 border-b pb-1">{content}</h1>;
        if (level === 2) return <h2 key={i} className="text-lg font-black text-slate-900 mt-4 mb-2">{content}</h2>;
        return <h3 key={i} className="text-base font-black text-slate-900 mt-3 mb-1">{content}</h3>;
      }

      
      const bulletMatch = line.match(/^[\-\*]\s+(.*)$/);
      if (bulletMatch) {
        return (
          <div key={i} className="flex items-start gap-2 pl-4 my-1">
            <span className="text-indigo-500 font-bold">•</span>
            <span className="text-xs text-slate-700 leading-relaxed">{parseBoldText(bulletMatch[1])}</span>
          </div>
        );
      }

      
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        return (
          <div key={i} className="pl-4 my-2 text-xs text-slate-700 leading-relaxed">
            <span className="font-extrabold text-indigo-600 mr-2">{numberedMatch[1]}.</span>
            {parseBoldText(numberedMatch[2])}
          </div>
        );
      }

      
      if (trimmed === '') {
        return <div key={i} className="h-2" />;
      }

      
      return <p key={i} className="text-xs text-slate-700 leading-relaxed my-1.5">{parseBoldText(line)}</p>;
    });
  };

  
  const compilePortfolioData = () => {
    const unlockedBadges = (achievements || [])
      .filter(a => a?.unlocked)
      .map(a => `${a?.title || 'Badge'}: ${a?.description || 'Unlocked'}`)
      .join(', ');
    
    
    const folderSummaries = safeFolders.map(f => {
      const fileNamesAndNotes = (f?.files || [])
        .map(file => `- ${file?.name || 'File'} ${file?.notes ? `(Note: "${file?.notes}")` : ''}`)
        .join('\n');
      return `Folder "${f?.name || 'Unnamed Folder'}":\n${fileNamesAndNotes || '(No items uploaded yet)'}`;
    }).join('\n\n');

    return {
      name: currentUser.name || 'Student',
      grade: currentUser.grade || 'Not specified',
      age: currentUser.age || 'Not specified',
      school: currentUser.schoolName || 'Not specified',
      studyGoals: currentUser.studyGoals || 'Not specified',
      personalInfo: currentUser.personalInfo || 'Not specified',
      stats: `Completed Tasks: ${stats?.tasksCompleted || 0}, Focus Hours: ${stats?.hoursStudied || 0}, Study Streak: ${stats?.currentStreak || 1} days`,
      unlockedBadges: unlockedBadges || 'None yet',
      portfolio: folderSummaries
    };
  };

  const generateOverview = async () => {
    setLoading(true);
    setError(null);
    const data = compilePortfolioData();

    const systemPrompt = `Analyze this student's profile, stats, unlocked badges, and uploaded folder documents/images (portfolio) to write a personalized, supportive "AI Student Overview".
    
    Student Name: ${data.name}
    Grade: ${data.grade}
    Age: ${data.age}
    School: ${data.school}
    Core Study Goals: ${data.studyGoals}
    Personal Summary: ${data.personalInfo}
    Stats: ${data.stats}
    Unlocked Achievements: ${data.unlockedBadges}
    
    Uploaded Portfolio/Vault Folders:
    ${data.portfolio}

    Structure your response into 3 concise sections:
    1. **My Dynamic Strengths & Superpowers** (Highlight what they excel at based on achievements, folder logs, or files)
    2. **Growth Opportunities & Fields I Lack In** (Point out areas that need focus or have empty folders/low stats)
    3. **Actionable Roadmap & Recommendations** (Specific actionable tips to protect their aura and level up)
    
    Write in an inspiring, encouraging, and highly student-friendly style. Make use of elegant markdown formatting.`;

    try {
      const response = await fetch('/api/study-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt,
          option: 'explain',
          grade: currentUser.grade,
          companionName
        })
      });

      const result = await response.json();
      if (result.text) {
        setAnalysis(result.text);
      } else {
        throw new Error('No content returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not compile AI analysis. Please verify your Gemini API Key in Settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateOverview();
  }, [folders]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || chatLoading) return;

    const userText = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    const portfolioContext = compilePortfolioData();
    const fullPrompt = `You are discussing the student's personal profile, strengths, and weaknesses with them. Keep your response helpful, conversational, and direct.
    
    Student Context:
    - Name: ${portfolioContext.name}
    - Grade: ${portfolioContext.grade}
    - Study Goals: ${portfolioContext.studyGoals}
    - Portfolio folders details: ${portfolioContext.portfolio}
    
    Student query: "${userText}"`;

    try {
      const response = await fetch('/api/chat-lounge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullPrompt,
          companionName,
          grade: currentUser.grade
        })
      });

      const result = await response.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: result.text || "I'm always here to help you study and plan!" }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Beep boop! I had a connection hiccup, but keep doing your best!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          About Myself - AI Overview
        </h1>
        <p className="text-slate-500 text-sm">
          A smart, deep-dive evaluation of your strengths, certificates, grades, and areas for improvement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base">Student Portfolio Summary</h3>
            
            <div className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Scholar Name</span>
                <strong className="text-slate-900">{currentUser.name}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Class Grade</span>
                <strong className="text-slate-900">Grade {currentUser.grade}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">School</span>
                <strong className="text-slate-900">{currentUser.schoolName}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Self Age</span>
                <strong className="text-slate-900">{currentUser.age || 'Not specified'}</strong>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest font-mono">
                VAULT FILES COUNT
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                {safeFolders.map(f => (
                  <div key={f?.id || Math.random().toString()} className="bg-white border rounded-xl p-2">
                    <span className="text-lg font-black text-slate-800 font-mono">{f?.files?.length || 0}</span>
                    <p className="text-[8px] text-slate-400 font-black truncate capitalize">{(f?.name || '').split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col h-[350px]">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Ask AI About Myself
            </h3>

            {}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">
                  Ask me questions like:<br/>
                  <span className="text-indigo-600 font-bold">"What careers fit my certificates?"</span> or<br/>
                  <span className="text-indigo-600 font-bold">"How can I improve my grades?"</span>
                </p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl leading-relaxed max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white ml-auto'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="bg-slate-50 text-slate-400 p-3 rounded-2xl w-fit animate-pulse">
                  Analyzing profile...
                </div>
              )}
            </div>

            {}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask your companion..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[450px] relative flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest font-mono">
                  Compiling Achievements, Grades & certificates...
                </p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <h4 className="font-black text-slate-900 text-sm">Failed to generate AI overview</h4>
                <p className="text-xs text-slate-500 max-w-sm">{error}</p>
                <button
                  onClick={generateOverview}
                  className="pixel-btn pixel-btn-primary text-xs py-1.5 px-3"
                >
                  Retry Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    AI Overview & Growth Recommendation
                  </h3>
                  <button
                    onClick={generateOverview}
                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50"
                    title="Refresh analysis"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="prose prose-indigo max-w-none text-xs leading-relaxed text-slate-700">
                  {renderMarkdown(analysis)}
                </div>
              </div>
            )}

            <div className="mt-6 border-t pt-4 text-[10px] text-slate-400 flex justify-between items-center font-mono">
              <span>Analysis updated in real time based on active records</span>
              <span>StudentOS AI Tutor Companion v2.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
