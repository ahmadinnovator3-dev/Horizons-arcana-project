import React from 'react';
import { useApp } from '../Context/AppContext';
import { PixelCompanion } from './PixelCompanion';
import { motion } from 'motion/react';
// @ts-ignore
import logoImage from '../assets/images/studentos_logo_1782397125648.jpg';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Activity, 
  BrainCircuit, 
  MessageSquare, 
  Bot, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setView, reviewerLogin } = useApp();

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-slate-900" />,
      title: "Smart Planner",
      desc: "An intelligent, responsive planner to track assignments, set priorities, and keep you sorted by urgency."
    },
    {
      icon: <Clock className="w-6 h-6 text-slate-900" />,
      title: "Focus Mode",
      desc: "Immersive Pomodoro study sessions with motivational feedback and study streaks."
    },
    {
      icon: <Activity className="w-6 h-6 text-slate-900" />,
      title: "Mood Tracker",
      desc: "Track daily vibes and see wellbeing metrics over time. Support that promotes healthy breaks."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-slate-900" />,
      title: "AI Study Helper",
      desc: "Tailored educational explanations, quiz builders, and roadmaps adjusted to your age and grade level."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-slate-900" />,
      title: "The Tea Lounge",
      desc: "A safe, fun, and casual conversational AI lounge with your pixel buddy to reflect on goals."
    },
    {
      icon: <Bot className="w-6 h-6 text-slate-900" />,
      title: "Pixel Companion",
      desc: "A customizable 2D buddy that reacts directly to your productivity, study states, and mood."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-slate-900" />,
      title: "Memories Vault",
      desc: "Keep all your certificates, photos, achievements, and academic results beautifully cataloged, complete with AI strength-evaluation insights."
    }
  ];

  const testimonials = [
    {
      quote: "StudentOS has completely replaced three different apps for me. My planner, study timer, and journal are all in one beautiful dashboard.",
      author: "Alex Rivers",
      grade: "Grade 10 Student",
      avatar: "🎒"
    },
    {
      quote: "The Pixel Companion is so motivating! I love seeing my buddy studying along with me when I start a Pomodoro focus timer.",
      author: "Maya Lin",
      grade: "Grade 8 Student",
      avatar: "⭐"
    },
    {
      quote: "As a high-schooler, the AI Study Helper explains complex Chemistry concepts far better than standard textbook definitions.",
      author: "Leo Sterling",
      grade: "Grade 11 Student",
      avatar: "🧪"
    }
  ];

  return (
    <div className="min-h-screen pixel-bg text-slate-800 flex flex-col font-mono selection:bg-indigo-100">
      {}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-9 h-9 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-slate-50">
              <img src={logoImage} alt="StudentOS" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 font-retro uppercase">StudentOS</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('login')}
              className="pixel-btn pixel-btn-secondary text-[10px] py-1"
            >
              Sign In
            </button>
            <button 
              onClick={() => setView('signup')}
              className="pixel-btn pixel-btn-primary text-[10px] py-1"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {}
      <section className="relative overflow-hidden pt-12 pb-12 md:pt-20 md:pb-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering students worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-950 mb-4 leading-tight font-retro uppercase"
          >
            StudentOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-bold text-slate-700 mb-4 max-w-2xl mx-auto"
          >
            "Your entire student life, organized in one place."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            StudentOS is your ultimate dashboard for school, life, and everything in between. We help you balance your classes, daily habits, and personal growth in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setView('signup')}
              className="w-full sm:w-auto pixel-btn pixel-btn-primary py-3 px-8 text-xs font-extrabold flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={reviewerLogin}
              className="w-full sm:w-auto pixel-btn pixel-btn-red py-3 px-8 text-xs font-extrabold flex items-center justify-center gap-2"
              id="reviewer-bypass-btn"
            >
              REVIEWER BYPASS BUTTON
            </button>
            <a
              href="#showcase"
              className="w-full sm:w-auto pixel-btn pixel-btn-secondary py-3 px-8 text-xs font-extrabold"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative"
        >
          {}
          <div className="absolute top-4 left-5 flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 border border-slate-900" />
            <div className="w-3 h-3 bg-yellow-400 border border-slate-900" />
            <div className="w-3 h-3 bg-green-500 border border-slate-900" />
          </div>

          <div className="flex-1 space-y-4 pt-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎯 EXTREMELY CUSTOMIZABLE
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase font-retro">Meet Your Pixel Companion</h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Every student gets a customizable 2D buddy that tracks their journey. Your companion is happy when assignments are checked off, studies alongside you during focus sessions, and helps you reflect on your goals.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1.5 border-2 border-slate-900 text-slate-800">Idle</span>
              <span className="text-[10px] font-mono font-bold bg-amber-400 px-2.5 py-1.5 border-2 border-slate-900 text-slate-950">Studying</span>
              <span className="text-[10px] font-mono font-bold bg-indigo-600 px-2.5 py-1.5 border-2 border-slate-900 text-white">Celebrating</span>
              <span className="text-[10px] font-mono font-bold bg-rose-400 px-2.5 py-1.5 border-2 border-slate-900 text-slate-950">Relaxing</span>
            </div>
          </div>

          <div className="w-full md:w-72 bg-slate-100 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] py-8 flex flex-col items-center justify-center relative overflow-hidden group">
            {}
            <div className="w-32 h-32 flex items-center justify-center relative">
              <PixelCompanion 
                customization={{
                  gender: 'girl',
                  hair: 'wavy',
                  hairColor: '#7C4A3A', // Girl wavy chestnut hair
                  outfit: 'sweater',
                  outfitColor: '#FAF0E6', // Girl cozy cream sweater
                  skin: 'peach',
                  accessory: 'glasses'
                }}
                state="Idle"
                size="lg"
              />
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-500 mt-2 uppercase">PIXEL BUDDY (LEVEL 4)</p>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="showcase" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y-4 border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 uppercase font-retro">
              ALL-IN-ONE RETRO INTERFACE
            </h2>
            <p className="text-slate-600 text-xs">
              We combined crucial student workflow utilities into a single operating system. Clean, fast, responsive, and completely personalized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <div 
                key={index}
                className="pixel-card bg-slate-50 p-6 shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-black text-slate-950 mb-3 uppercase">{feat.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase font-retro">
            Loved by students worldwide
          </h2>
          <p className="text-slate-500 text-xs">
            Read how StudentOS helps students stay focused, stress less, and build consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="pixel-card bg-white p-6 shadow-sm relative flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6 text-4xl select-none pointer-events-none opacity-20 font-black">
                ”
              </div>
              <p className="text-slate-600 text-xs italic leading-relaxed mb-6 font-semibold">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl bg-slate-100 w-10 h-10 border-2 border-slate-900 flex items-center justify-center">
                  {test.avatar}
                </span>
                <div>
                  <h4 className="font-bold text-slate-950 text-xs">{test.author}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{test.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t-4 border-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase font-retro">Ready to organize your journey?</h2>
          <p className="text-indigo-200 text-xs mb-8 max-w-2xl mx-auto font-bold">
            Create your account today, design your pixel companion, and level up your grades, schedule, and habits.
          </p>
          <button
            onClick={() => setView('signup')}
            className="pixel-btn pixel-btn-accent px-8 py-4 text-xs font-extrabold inline-flex items-center gap-2"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-slate-900 flex items-center justify-center overflow-hidden bg-slate-50">
              <img src={logoImage} alt="StudentOS" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight">StudentOS</span>
          </div>

          <p className="text-[10px] text-slate-500 font-bold">
            &copy; {new Date().getFullYear()} StudentOS. Designed for students globally. Built server-side with Gemini.
          </p>

          <div className="flex gap-4 text-[10px] text-slate-500 font-bold">
            <span className="hover:text-slate-800 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms</span>
            <span className="hover:text-slate-800 cursor-pointer text-indigo-600">Level Up 🚀</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
