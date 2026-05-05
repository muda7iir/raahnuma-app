import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, MessageSquare, Map, ClipboardCheck, GraduationCap, FileText, Settings, Plus, ArrowRight, Lightbulb, TrendingUp, BookOpen, Star } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getChats, getRoadmaps, getAssessments, getScholarships } from '../lib/storage';
import { sendSinglePrompt } from '../lib/gemini';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_LINKS = [
  { label: 'New Chat', icon: MessageSquare, path: '/chat', color: 'bg-blue-500' },
  { label: 'Roadmap', icon: Map, path: '/roadmap', color: 'bg-emerald-500' },
  { label: 'Assessment', icon: ClipboardCheck, path: '/assessment', color: 'bg-purple-500' },
  { label: 'Scholarships', icon: GraduationCap, path: '/scholarships', color: 'bg-amber-500' },
  { label: 'Resume', icon: FileText, path: '/resume', color: 'bg-rose-500' },
  { label: 'Settings', icon: Settings, path: '/settings', color: 'bg-gray-500' },
];

export default function DashboardPage() {
  const { profile } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tip, setTip] = useState('');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  const chats = getChats();
  const roadmaps = getRoadmaps();
  const assessments = getAssessments();
  const scholarships = getScholarships();

  useEffect(() => {
    const loadTip = async () => {
      try {
        const cached = sessionStorage.getItem('nxraahnuma_daily_tip');
        const cachedQuote = sessionStorage.getItem('nxraahnuma_daily_quote');
        if (cached && cachedQuote) { setTip(cached); setQuote(cachedQuote); setLoading(false); return; }
        const tipRes = await sendSinglePrompt('Give me one short, actionable career tip of the day in 2 sentences. No heading, just the tip.');
        const quoteRes = await sendSinglePrompt('Give me one short motivational career quote in 1 sentence. No attribution needed, no quotation marks.');
        setTip(tipRes);
        setQuote(quoteRes);
        sessionStorage.setItem('nxraahnuma_daily_tip', tipRes);
        sessionStorage.setItem('nxraahnuma_daily_quote', quoteRes);
      } catch { setTip('Focus on building one valuable skill this week. Consistency beats intensity.'); setQuote('Your career is a marathon, not a sprint. Keep learning.'); }
      setLoading(false);
    };
    loadTip();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      {/* Top Bar */}
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">NX <span className="text-[#1673CA]">RaahNuma</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/settings" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-full bg-[#1673CA]/10 flex items-center justify-center overflow-hidden border-2 border-[#1673CA]">
              {profile?.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : <span className="text-sm font-bold text-[#1673CA]">{profile?.name?.[0]}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, <span className="text-[#1673CA]">{profile?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{loading ? 'Loading your daily motivation...' : quote}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'AI Conversations', value: chats.length, icon: MessageSquare, color: 'text-blue-600' },
            { label: 'Roadmaps Created', value: roadmaps.length, icon: Map, color: 'text-emerald-600' },
            { label: 'Assessments', value: assessments.length, icon: ClipboardCheck, color: 'text-purple-600' },
            { label: 'Scholarships Saved', value: scholarships.length, icon: GraduationCap, color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-2xl font-black">{s.value}</span>
              </div>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Chats */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Recent Chats</h2>
                <Link to="/chat" className="text-sm text-[#1673CA] hover:underline">View all</Link>
              </div>
              {chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                  <Link to="/chat" className="text-sm text-[#1673CA] hover:underline mt-1 inline-block">Start your first chat →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {chats.slice(0, 3).map(chat => (
                    <Link key={chat.id} to={`/chat/${chat.id}`} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">{chat.title}</p>
                        <p className="text-xs text-gray-500">{new Date(chat.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Roadmaps */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Saved Roadmaps</h2>
                <Link to="/roadmap" className="text-sm text-[#1673CA] hover:underline">Create new</Link>
              </div>
              {roadmaps.length === 0 ? (
                <div className="text-center py-8">
                  <Map className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No roadmaps yet</p>
                  <Link to="/roadmap" className="text-sm text-[#1673CA] hover:underline mt-1 inline-block">Generate your first roadmap →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {roadmaps.slice(0, 3).map(rm => (
                    <div key={rm.id} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div>
                        <p className="text-sm font-medium">{rm.career}</p>
                        <p className="text-xs text-gray-500">{new Date(rm.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link to="/roadmap" className="text-xs text-[#1673CA] hover:underline">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Access */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold mb-4">Quick Access</h2>
              <div className="grid grid-cols-3 gap-3">
                {QUICK_LINKS.map(l => (
                  <Link key={l.label} to={l.path} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl ${l.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <l.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Career Tip */}
            <div className="bg-gradient-to-br from-[#1673CA] to-[#0d4f8c] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Career Tip of the Day</h3>
              </div>
              {loading ? (
                <div className="space-y-2"><div className="h-3 bg-white/20 rounded w-full" /><div className="h-3 bg-white/20 rounded w-3/4" /></div>
              ) : (
                <p className="text-sm text-blue-100 leading-relaxed">{tip}</p>
              )}
              <button onClick={() => navigate('/chat')} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors">
                Ask AI about this →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
