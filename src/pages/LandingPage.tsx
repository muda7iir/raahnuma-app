import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MapPin, Brain, DollarSign, GraduationCap, FileText, Compass, ArrowRight, ChevronDown, ChevronUp, Star, Zap, Globe, Users, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useProfile } from '../contexts/ProfileContext';
import toast from 'react-hot-toast';

/* ---------- Counter hook ---------- */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/* ---------- Scroll reveal hook ---------- */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ---------- Data ---------- */
const FEATURES = [
  { icon: Mic, title: 'Voice Conversations', desc: 'Speak naturally, get spoken career guidance in real time', color: 'bg-blue-500' },
  { icon: MapPin, title: 'Personalized Roadmaps', desc: 'AI-generated step-by-step career plans tailored to you', color: 'bg-emerald-500' },
  { icon: Brain, title: 'Skills Assessment', desc: 'Discover your strengths and best-fit careers in 5 minutes', color: 'bg-purple-500' },
  { icon: DollarSign, title: 'Salary Insights', desc: 'Real salary data across countries and experience levels', color: 'bg-amber-500' },
  { icon: GraduationCap, title: 'Scholarship Finder', desc: 'Find scholarships matching your profile worldwide', color: 'bg-rose-500' },
  { icon: FileText, title: 'AI Resume Builder', desc: 'Build ATS-optimized resumes with AI-powered suggestions', color: 'bg-cyan-500' },
];

const STEPS = [
  { num: '01', title: 'Fill Your Profile', desc: 'Tell us about your education, interests, and goals' },
  { num: '02', title: 'Chat with AI', desc: 'Ask anything via text or voice, get expert guidance' },
  { num: '03', title: 'Get Your Roadmap', desc: 'Download your personalized career plan as PDF' },
];

const TESTIMONIALS = [
  { name: 'Sarah Johnson', loc: 'USA', role: 'Computer Science Student', text: 'NX RaahNuma helped me choose between Software Engineering and Data Science. Best decision ever.', rating: 5 },
  { name: 'Ahmed Al-Rashid', loc: 'UAE', role: 'Recent Graduate', text: 'The voice feature is incredible. It feels like talking to a real counselor.', rating: 5 },
  { name: 'Priya Sharma', loc: 'India', role: 'MBA Student', text: 'Found 3 scholarships I never knew existed. Got one too!', rating: 5 },
  { name: 'Michael Chen', loc: 'Canada', role: 'Career Changer', text: 'Changed careers at 32 with NX RaahNuma\'s roadmap. Now earning 2x.', rating: 5 },
  { name: 'Fatima Al-Hassan', loc: 'Saudi Arabia', role: 'High School Student', text: 'Helped me decide my university major. Very detailed and accurate.', rating: 5 },
  { name: 'James Okonkwo', loc: 'Nigeria', role: 'Freelancer', text: 'The resume builder alone is worth it. My applications went from ignored to interviews.', rating: 5 },
];

const PRICING = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 AI queries/day', 'Basic roadmap', 'Skills assessment', 'Community access'], highlight: false, cta: 'Start Free' },
  { name: 'Pro', price: '$9', period: '/month', features: ['Unlimited queries', 'Voice input + output', 'PDF downloads', 'Scholarship finder', 'Resume builder'], highlight: true, cta: 'Upgrade to Pro', badge: 'Most Popular' },
  { name: 'Premium', price: '$19', period: '/month', features: ['Everything in Pro', 'Priority AI responses', 'Roadmap sharing', 'ATS resume scoring', 'Email support'], highlight: false, cta: 'Go Premium' },
];

const FAQ_DATA = [
  { q: 'Is NX RaahNuma free to use?', a: 'Yes! NX RaahNuma offers a free tier with 5 AI queries per day, basic roadmaps, and skills assessment. For unlimited access, voice features, and premium tools, check our Pro and Premium plans.' },
  { q: 'How does the AI voice feature work?', a: 'NX RaahNuma uses your browser\'s built-in Web Speech API. Click the microphone icon to speak your question — the AI understands you in real time and can read back its response aloud. Works on Chrome, Edge, and Safari.' },
  { q: 'How accurate are the career recommendations?', a: 'Our AI is powered by Google Gemini and trained on vast career data. While no AI is perfect, our recommendations are based on real market trends, salary data, and skill requirements. We continuously improve accuracy based on user feedback.' },
  { q: 'Can I download my career roadmap?', a: 'Absolutely! You can download your personalized career roadmap as a professionally formatted PDF with NerithonX branding. Pro and Premium users get unlimited downloads.' },
  { q: 'What countries and careers does it support?', a: 'NX RaahNuma supports 180+ countries and 200+ career paths across all major industries including Technology, Medicine, Business, Engineering, Arts, Law, and more.' },
  { q: 'Is my data safe and private?', a: 'Your data is stored locally on your device using browser localStorage. We do not store any personal information on our servers. Your conversations with the AI are processed securely through Google\'s Gemini API.' },
  { q: 'How is this different from Google or ChatGPT?', a: 'NX RaahNuma is purpose-built for career counseling. Unlike general AI, every response includes structured action plans, salary data, resource links, and skill requirements. Plus, it offers voice conversations, roadmap generation, scholarship finding, and resume building — all in one platform.' },
  { q: 'Who built NX RaahNuma?', a: 'NX RaahNuma is a product of NerithonX Technologies (Pvt.) Ltd., a technology company focused on building innovative AI-powered solutions for education and career development.' },
];

/* ---------- Component ---------- */
export default function LandingPage() {
  const { hasProfile } = useProfile();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const stat1 = useCountUp(50000);
  const stat2 = useCountUp(200);
  const stat3 = useCountUp(49);
  const stat4 = useCountUp(180);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1220] text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* ===== HERO ===== */}
      <section id="home" className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f2fc] via-white to-[#f4f8fd] dark:from-[#0a1220] dark:via-[#111827] dark:to-[#0a1220]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231673CA\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1673CA]/10 text-[#1673CA] text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Powered by Google Gemini AI
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 animate-fade-in-up">
                Discover Your Perfect{' '}
                <span className="text-[#1673CA] relative">
                  Career Path
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"><path d="M2 10C50 2 100 2 150 6C200 10 250 4 298 8" stroke="#1673CA" strokeWidth="3" strokeLinecap="round" opacity="0.3"/></svg>
                </span>
                {' '}with AI
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                NX RaahNuma analyzes your skills, interests, and goals to deliver personalized career roadmaps, voice guidance, and expert advice — available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  to={hasProfile ? '/dashboard' : '/onboarding'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-[#1673CA] rounded-lg hover:bg-[#0d4f8c] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
                >
                  Start Free — No Signup Needed
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-[#1673CA] border-2 border-[#1673CA] rounded-lg hover:bg-[#1673CA]/5 transition-all"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right — Chat Mockup */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md ml-auto animate-float">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
                    <span className="font-semibold text-sm">NX RaahNuma AI</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#1673CA] text-white px-4 py-2.5 rounded-2xl rounded-tr-md text-sm ml-12">How do I become a Software Engineer?</div>
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-md text-sm mr-8">
                      <p className="font-semibold text-[#1673CA] mb-1">Great question! Here's your path:</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">1. Learn fundamentals (3-6 months)<br/>2. Build projects (2-3 months)<br/>3. Master a tech stack...</p>
                    </div>
                    <div className="flex gap-1 pl-2">
                      <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-medium">AI-Powered Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-[#1673CA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div ref={stat1.ref}><div className="text-3xl sm:text-4xl font-black">{stat1.count.toLocaleString()}+</div><div className="text-sm text-blue-100 mt-1">Students Guided</div></div>
            <div ref={stat2.ref}><div className="text-3xl sm:text-4xl font-black">{stat2.count}+</div><div className="text-sm text-blue-100 mt-1">Career Paths Covered</div></div>
            <div ref={stat3.ref}><div className="text-3xl sm:text-4xl font-black">{(stat3.count / 10).toFixed(1)}/5</div><div className="text-sm text-blue-100 mt-1">Student Rating</div></div>
            <div ref={stat4.ref}><div className="text-3xl sm:text-4xl font-black">{stat4.count}+</div><div className="text-sm text-blue-100 mt-1">Countries Supported</div></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 bg-[#f4f8fd] dark:bg-[#0a1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Everything You Need for Career Success" subtitle="Powerful AI tools designed to guide you every step of the way" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {FEATURES.map((f, i) => {
              const r = useScrollReveal();
              return (
                <div key={i} ref={r.ref} className={`bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${r.visible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="How It Works" subtitle="Three simple steps to your dream career" />
          <div className="grid md:grid-cols-3 gap-8 mt-12 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#1673CA] via-[#1673CA] to-[#1673CA]/30" />
            {STEPS.map((s, i) => {
              const r = useScrollReveal();
              return (
                <div key={i} ref={r.ref} className={`text-center relative ${r.visible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="w-14 h-14 rounded-full bg-[#1673CA] text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg shadow-blue-500/20">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[#f4f8fd] dark:bg-[#0a1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Loved by Students Worldwide" subtitle="See how NX RaahNuma has changed careers and lives" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.map((t, i) => {
              const r = useScrollReveal();
              return (
                <div key={i} ref={r.ref} className={`bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 ${r.visible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1673CA]/10 flex items-center justify-center text-[#1673CA] font-bold text-sm">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role} — {t.loc}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 bg-white dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Simple, Transparent Pricing" subtitle="Choose the plan that fits your career journey" />
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {PRICING.map((p, i) => (
              <div key={i} className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 ${
                p.highlight
                  ? 'border-[#1673CA] bg-white dark:bg-[#111827] shadow-xl shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827]'
              }`}>
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1673CA] text-white text-xs font-bold rounded-full shadow-md">
                    {p.badge}
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#1673CA]">{p.price}</span>
                  <span className="text-gray-500 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    toast('Coming soon! Stay tuned.', { icon: '🚀' });
                  }}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                    p.highlight
                      ? 'bg-[#1673CA] text-white hover:bg-[#0d4f8c] shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 bg-[#f4f8fd] dark:bg-[#0a1220]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Frequently Asked Questions" subtitle="Got questions? We've got answers" />
          <div className="mt-12 space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#1673CA] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-[#1673CA] to-[#0d4f8c]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Discover Your Career Path?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 50,000+ students and professionals who found their perfect career with NX RaahNuma.
          </p>
          <Link
            to={hasProfile ? '/dashboard' : '/onboarding'}
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-[#1673CA] bg-white rounded-lg hover:bg-gray-50 transition-all shadow-xl hover:scale-[1.02]"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

/* ---------- Helper ---------- */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-black mb-3">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}
