import React, {useState, useRef, useEffect} from 'react';
import { useApp } from '../Context/AppContext';
import { BrainCircuit, Send, Sparkles, BookOpen, ClipboardList, PenTool, Bot } from 'lucide-react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string
}

export const AiStudyHelper: React.FC = () => {
    const { currentUser, setCompanionState } = useApp();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: `Hello ${currentUser?.name}! I am your AI study helper. 🎓\n\nI can help explain difficult subjects, summarize notes, generate practice quizzes, or map out custom study plans. Everything i explain is customized to **Grade ${currentUser?.grade}** level!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSubject, setActiveSubject] = useState('General');

    const chatBottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (customPrompt?: string, actionOption?: 'explain' | 'quiz' | 'summarize' | 'studyplan') => {
        const query = customPrompt || input;
        if (!query.trim()) return;


        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setCompanionState('Thinking');

        try {
            const response = await fetch('/api/study-helper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: query,
                    option: actionOption || 'explain',
                    grade: currentUser?.grade,
                    schoolSubject: activeSubject
                })
            });

            const data = await response.json();

            const aiMsg: ChatMessage = {
                id: Math.random().toString(36).substring(2, 9),
                sender: 'ai',
                text: data.text || "I apologize, I encountered a temporary network issue. Could you please try again?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, {
                id: 'err',
                sender: 'ai',
                text: "Oops! I failed to connect to the tutoring engine. Please make sure the backend is active.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
            setCompanionState('Idle');
        }
    };


    const triggerQuickAction = (action: 'explain' | 'quiz' | 'summarize' | 'studyplan', placeholder: string) => {
        handleSend(placeholder, action)
    };


    const renderMessageContent = (text: string) => {
        const lines = text.split('/n');
        return lines.map((line, idx) => {

            let formattedLine = line;
            const boldRegex = /\*\*(.*?)\*\*/g;
            const matches = [...line.matchAll(boldRegex)];


            if (line.trim().startsWith('* ') || line.trim().startsWith("- ")) {
                const content = line.trim().substring(2);
                return (
                    <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed font-semibold my-1">
                        {content.replace(/\*\*/g, '')}
                    </li>
                );
            }


            if (line.startsWith('#')) {
                const level = line.indexOf(' ');
                const content = line.substring(level + 1);
                if (level === 1) return <h3 key={idx} className="text-base font-black text-slate-900 mt-3 mb-1">{content}</h3>;
                return <h4 key={idx} className="text-sm font-extrabold text-indigo-700 mt-2 mb-1">{content}</h4>;
            }


            if(line.trim() === '') return <div key={idx} className="h-2" />;

            return (
                <p key={idx} className="text-xs text-slate-700 font-semibold leading-relaxed mb-1.5 break-words">
                    {formattedLine.replace(/\*\*/g, '')}
                </p>
            );
        });
    };

    const quickActionsList = [
        {
            id: 'explain',
            label: 'Explain This',
            icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
            placeholder: 'Explain the water cycle using a space colony analogy',
            hint: 'Simplifies heavy concepts'
        },
        {
            id: 'quiz',
            label: 'Create Quiz',
            icon: <PenTool className="w-4 h-4 text-purple-500" />,
            placeholder: 'Create a 5-question quiz about photosynthesis',
            hint: 'Generate review questions'
        },
        {
            id: 'summarize',
            label: 'Summarize',
            icon: <ClipboardList className="w-4 h-4 text-amber-500" />,
            placeholder: 'Summarize the causes of world war 1',
            hint: 'Creates study sheets'
        },
        {
            id: 'studyplan',
            label: 'Study Plan',
            icon: <BrainCircuit className="w-4 h-4 text-indigo-500" />,
            placeholder: 'Create a 3-phase study plan to learn fractions',
            hint: 'Build schedules'
        }
    ];

     return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            AI Study Helper
          </h1>
          <p className="text-slate-500 text-sm">Helps you with your homework, gives you quizzes and helps with all kinds of stuff</p>
        </div>

        {}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {['General', 'Science', 'Math', 'History', 'English'].map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubject === sub 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col min-h-0 shadow-sm">
        
        {}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-100">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {}
                <div className={`w-8 h-8 rounded-xl shrink-0 border flex items-center justify-center text-sm font-bold shadow-sm ${
                  isUser 
                    ? 'bg-indigo-600 border-indigo-700 text-white' 
                    : 'bg-indigo-50 border-indigo-150 text-indigo-600'
                }`}>
                  {isUser ? 'ME' : 'AI'}
                </div>

                <div className={`rounded-2xl p-4 shadow-sm relative ${
                  isUser 
                    ? 'bg-indigo-50 border border-indigo-100 text-slate-800' 
                    : 'bg-slate-50 border border-slate-200/60'
                }`}>
                  {}
                  <div className="prose prose-sm max-w-none">
                    {renderMessageContent(msg.text)}
                  </div>
                  <span className="block text-[8px] font-bold text-slate-400 font-mono text-right mt-2">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm animate-pulse">
                AI
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">Pixel companion is typing study sheets...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {}
        {messages.length === 1 && !loading && (
          <div className="p-4 border-t border-slate-150/60 bg-slate-50/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-2.5">Suggested Actions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {quickActionsList.map(action => (
                <button
                  key={action.id}
                  onClick={() => triggerQuickAction(action.id as any, action.placeholder)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-2xl text-left transition-all hover:border-indigo-200 group flex items-start gap-2.5 cursor-pointer shadow-sm"
                >
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 border border-slate-100 transition-all shrink-0">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-800 text-xs">{action.label}</h5>
                    <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{action.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {}
        <div className="p-4 border-t border-slate-150/80 shrink-0 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            placeholder={`Ask a subject question... (Grade ${currentUser?.grade} level explanations)`}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs font-semibold outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 shadow-md shadow-indigo-100 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};