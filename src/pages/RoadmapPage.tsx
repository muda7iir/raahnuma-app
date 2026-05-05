import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Download, RefreshCw, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { getRoadmaps, setRoadmaps, generateId, type RoadmapData } from '../lib/storage';
import { exportTextAsPDF } from '../lib/pdf';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ROADMAPS } from '../lib/roadmapsData';
import toast from 'react-hot-toast';

const EDUCATION_LEVELS = ['High School', 'O/A Levels', 'Bachelors', 'Masters', 'PhD', 'Self-taught', 'Bootcamp Graduate'];
const STARTING_POINTS = ['Complete beginner', 'Some knowledge', 'Intermediate'];

export default function RoadmapPage() {
  const { profile } = useProfile();
  const [career, setCareer] = useState(ROADMAPS[0].career);
  const [education, setEducation] = useState(profile?.educationLevel || '');
  const [hours, setHours] = useState(10);
  const [startingPoint, setStartingPoint] = useState('Complete beginner');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const generateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const template = ROADMAPS.find(r => r.career === career);
        if (!template) throw new Error("Roadmap not found");

        const rmData: RoadmapData = {
          id: generateId(),
          career: template.career,
          educationLevel: education,
          hoursPerWeek: hours,
          startingPoint,
          milestones: template.milestones.map(m => ({
            month: m.month,
            title: m.title,
            tasks: m.tasks.map(t => ({ text: t.text, completed: false })),
            resources: m.resources,
            skills: m.skills,
          })),
          salaryProgression: template.salaryProgression,
          createdAt: new Date().toISOString(),
        };
        setRoadmap(rmData);
        const existing = getRoadmaps();
        setRoadmaps([rmData, ...existing]);
        toast.success('Roadmap generated!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to generate roadmap.');
      }
      setLoading(false);
    }, 500); // Simulate brief loading
  };

  const toggleTask = (milestoneIdx: number, taskIdx: number) => {
    if (!roadmap) return;
    const updated = { ...roadmap };
    updated.milestones = updated.milestones.map((m, mi) =>
      mi === milestoneIdx ? { ...m, tasks: m.tasks.map((t, ti) => ti === taskIdx ? { ...t, completed: !t.completed } : t) } : m
    );
    setRoadmap(updated);
    const all = getRoadmaps().map(r => r.id === updated.id ? updated : r);
    setRoadmaps(all);
  };

  const completedTasks = roadmap ? roadmap.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0) : 0;
  const totalTasks = roadmap ? roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0) : 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const downloadPDF = () => {
    if (!roadmap) return;
    const content = roadmap.milestones.map(m =>
      `${m.month} — ${m.title}\n${m.tasks.map(t => `  ${t.completed ? '✓' : '○'} ${t.text}`).join('\n')}\nResources: ${m.resources.join(', ')}\nSkills: ${m.skills.join(', ')}`
    ).join('\n\n');
    exportTextAsPDF(`Career Roadmap: ${roadmap.career}`, content, `nxraahnuma-roadmap-${roadmap.career.replace(/\s+/g, '-')}.pdf`);
    toast.success('PDF downloaded!');
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      {/* Header */}
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold">Career Roadmap</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24 sm:py-8">
        {!roadmap ? (
          /* Input Form */
          <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6">Generate Your Career Roadmap</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Target Career *</label>
                  <select value={career} onChange={e => setCareer(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] outline-none">
                    {ROADMAPS.map(r => <option key={r.career} value={r.career}>{r.career}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Current Education</label>
                  <select value={education} onChange={e => setEducation(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] outline-none">
                    <option value="">Select level...</option>
                    {EDUCATION_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Hours Per Week: {hours}</label>
                  <input type="range" min="1" max="40" value={hours} onChange={e => setHours(parseInt(e.target.value))} className="w-full accent-[#1673CA]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Starting Point</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STARTING_POINTS.map(s => (
                      <button key={s} onClick={() => setStartingPoint(s)} className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${startingPoint === s ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <button onClick={generateRoadmap} disabled={loading} className="w-full py-3 bg-[#1673CA] text-white rounded-lg font-semibold hover:bg-[#0d4f8c] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Roadmap'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Roadmap Display */
          <div>
            {/* Progress */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">{roadmap.career} Roadmap</h2>
                <div className="flex gap-2">
                  <button onClick={downloadPDF} className="px-3 py-1.5 text-xs font-medium bg-[#1673CA] text-white rounded-lg hover:bg-[#0d4f8c] flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button>
                  <button onClick={() => setRoadmap(null)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> New</button>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-[#10b981] h-3 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">{completedTasks}/{totalTasks} tasks completed ({progressPercent}%)</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Milestones */}
              <div className="lg:col-span-2 space-y-4">
                {roadmap.milestones.map((m, mi) => {
                  const mCompleted = m.tasks.every(t => t.completed);
                  return (
                    <div key={mi} className={`bg-white dark:bg-[#111827] rounded-xl border-2 p-5 transition-all ${mCompleted ? 'border-[#10b981]' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${mCompleted ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#1673CA]/10 text-[#1673CA]'}`}>{m.month}</span>
                        <h3 className="font-bold">{m.title}</h3>
                      </div>
                      <div className="space-y-2 mb-3">
                        {m.tasks.map((t, ti) => (
                          <button key={ti} onClick={() => toggleTask(mi, ti)} className="flex items-center gap-2 text-sm w-full text-left hover:text-[#1673CA] transition-colors">
                            {t.completed ? <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" /> : <Circle className="w-4 h-4 text-gray-300 shrink-0" />}
                            <span className={t.completed ? 'line-through text-gray-400' : ''}>{t.text}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.skills.map((s, si) => <span key={si} className="px-2 py-0.5 bg-[#1673CA]/10 text-[#1673CA] rounded-full text-[10px] font-medium">{s}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Salary Chart */}
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#10b981]" /> Salary Progression</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={roadmap.salaryProgression}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Years', position: 'bottom', fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Salary']} />
                      <Line type="monotone" dataKey="salary" stroke="#1673CA" strokeWidth={2} dot={{ fill: '#1673CA' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
