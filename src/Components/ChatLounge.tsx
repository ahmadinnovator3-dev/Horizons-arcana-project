import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../Context/AppContext';
import { PixelCompanion } from './PixelCompanion';
import { Send, Sparkles, Heart, Coffee, Trash2, Plus, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';

export const ChatLounge: React.FC = () => {
  const { 
    currentUser, 
    companionCustomization, 
    companionState, 
    setCompanionState, 
    companionName,
    savedChats,
    saveChatSession,
    deleteChatSession
  } = useApp();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (savedChats.length > 0 && !activeChatId) {
      setActiveChatId(savedChats[0].id);
    } else if (savedChats.length === 0 && !activeChatId) {
      const newId = Math.random().toString(36).substring(2, 9);
      const defaultMsg: ChatMessage = {
        id: 'lounge-welcome',
        sender: 'ai',
        text: `Hey there ${currentUser?.name || 'student'}, im your companion *${companionName}*, so tell me, anything juicy going around lately? Im all ears!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatSession(newId, "Cozy Tea Conversation", [defaultMsg]);
      setActiveChatId(newId);
    }
  }, [savedChats, activeChatId, currentUser, companionName, saveChatSession]);

  
  useEffect(() => {
    if (activeChatId) {
      const activeSession = savedChats.find(s => s.id === activeChatId);
      if (activeSession) {
        setMessages(activeSession.messages);
      }
    }
  }, [activeChatId, savedChats]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleStartNewChat = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const defaultMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'ai',
      text: `Hi ${currentUser?.name}! Ready for a brand new chat. What's on your mind today? 🌟`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    saveChatSession(newId, `Tea Chat ☕ ${new Date().toLocaleDateString()}`, [defaultMsg]);
    setActiveChatId(newId);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatSession(id);
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChatId) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    
    const userFirstMsg = updatedMessages.find(m => m.sender === 'user')?.text || '';
    const currentSession = savedChats.find(s => s.id === activeChatId);
    let title = currentSession?.title || "Tea Conversation";
    if (title === "Cozy Tea Conversation" || title.startsWith("Tea Chat ☕")) {
      title = userFirstMsg 
        ? (userFirstMsg.split(' ').slice(0, 4).join(' ') + (userFirstMsg.split(' ').length > 4 ? '...' : ''))
        : title;
    }

    saveChatSession(activeChatId, title, updatedMessages);

    
    setCompanionState('Thinking');

    try {
      const response = await fetch('/api/chat-lounge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          companionName,
          companionCustomization,
          grade: currentUser?.grade,
          history: updatedMessages
        })
      });

      const data = await response.json();

      if (userText.toLowerCase().includes('good') || userText.toLowerCase().includes('happy') || userText.toLowerCase().includes('love') || userText.toLowerCase().includes('thank')) {
        setCompanionState('Celebrating');
        setTimeout(() => setCompanionState('Idle'), 3000);
      } else {
        setCompanionState('Idle');
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: data.text || "Bleep blop! I am here and happy to hang out!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveChatSession(activeChatId, title, finalMessages);

    } catch (e) {
      console.error(e);
      setCompanionState('Idle');
      const errMsg: ChatMessage = {
        id: 'err',
        sender: 'ai',
        text: "Beep! I had a tiny glitch connecting. Remember that I'm cheering you on no matter what!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...updatedMessages, errMsg];
      setMessages(finalMessages);
      saveChatSession(activeChatId, title, finalMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Coffee className="w-8 h-8 text-amber-500" />
            Tea Lounge
          </h1>
          <p className="text-slate-500 text-sm">Got any tea to spill?</p>
        </div>
      </div>

      {}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        
        {}
        <div className="flex flex-col gap-4 md:col-span-1 min-h-0">
          
          {}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden shrink-0">
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            <PixelCompanion 
              customization={companionCustomization} 
              state={companionState} 
              size="md" 
            />

            <div className="text-center">
              <h4 className="font-extrabold text-slate-800 text-xs font-mono">{companionName}</h4>
              <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-[9px] text-amber-800 font-bold border border-amber-200 mt-0.5">
                {companionState}
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                Saved Conversations
              </span>
              <button
                onClick={handleStartNewChat}
                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg transition-all cursor-pointer"
                title="Start New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono">
              {savedChats.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[10px] text-slate-400">No chats saved yet.</p>
                </div>
              ) : (
                savedChats.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer group transition-all ${
                        isActive 
                          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-bold' 
                          : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] truncate max-w-[110px]">{chat.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {}
        <div className="bg-white border border-slate-200 rounded-3xl flex flex-col md:col-span-3 min-h-0 shadow-sm overflow-hidden">
          {}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/60 flex items-center justify-between gap-2 shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Tea Lounge with {companionName}
            </div>
            {messages.length > 0 && (
              <span className="font-mono text-[9px] text-slate-400 lowercase bg-slate-100 px-2 py-0.5 rounded">
                {messages.length} messages
              </span>
            )}
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-100 bg-slate-50/20">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-xl border shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                    isUser 
                      ? 'bg-indigo-600 border-indigo-700 text-white' 
                      : 'bg-amber-50 border-amber-200 text-amber-700 font-mono'
                  }`}>
                    {isUser ? 'ME' : '🤖'}
                  </div>

                  <div className={`rounded-2xl p-4 shadow-sm ${
                    isUser 
                      ? 'bg-indigo-50 border border-indigo-100 text-slate-800' 
                      : 'bg-white border border-slate-200/60 text-slate-700'
                  }`}>
                    <p className="text-xs font-semibold leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[8px] font-bold text-slate-400 font-mono text-right mt-1.5">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold shadow-sm animate-pulse font-mono">
                  🤖
                </div>
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 font-mono">{companionName} is typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {}
          <div className="p-4 border-t border-slate-150 shrink-0 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              placeholder={`Chat with ${companionName}... e.g. "I had a great study session today!"`}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs font-semibold outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
