import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Plus, Trash2, Wand2, Download, ChevronDown, ChevronUp, CheckCircle2, RefreshCw } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { getResumes, setResumes, generateId, type ResumeData } from '../lib/storage';
import { exportElementAsPDF } from '../lib/pdf';
import { RESUME_SUMMARIES, RESUME_BULLETS } from '../lib/resumeTemplates';
import toast from 'react-hot-toast';

const EMPTY_RESUME: ResumeData = {
  id: '', personalInfo: { name: '', email: '', phone: '', linkedin: '', location: '', photo: '' },
  summary: '', experience: [], education: [], skills: [], projects: [], certifications: [], languages: [],
  template: 'modern', updatedAt: '',
};

export default function ResumeBuilderPage() {
  const { profile } = useProfile();
  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = getResumes();
    if (saved.length > 0) return saved[0];
    return { ...EMPTY_RESUME, id: generateId(), personalInfo: { name: profile?.name || '', email: '', phone: '', linkedin: '', location: profile?.country || '', photo: profile?.photo || '' } };
  });
  const [openSection, setOpenSection] = useState<string>('personal');
  const [loading, setLoading] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<{ score: number; tips: string[] } | null>(null);

  const update = (path: string, value: any) => {
    setResume(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      clone.updatedAt = new Date().toISOString();
      return clone;
    });
  };

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      const existing = getResumes();
      const idx = existing.findIndex(r => r.id === resume.id);
      if (idx >= 0) { existing[idx] = resume; } else { existing.unshift(resume); }
      setResumes(existing);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resume]);

  const autoWriteSummary = () => {
    setLoading('summary');
    setTimeout(() => {
      const bestMatch = RESUME_SUMMARIES.find(s => 
        resume.experience.some(e => s.category.toLowerCase().includes(e.role.split(' ')[0].toLowerCase())) ||
        s.category === 'Recent Graduate'
      );
      update('summary', bestMatch ? bestMatch.text : RESUME_SUMMARIES[RESUME_SUMMARIES.length - 1].text);
      toast.success('Summary generated!');
      setLoading(null);
    }, 400);
  };

  const autoImproveText = (index: number) => {
    setLoading(`exp-${index}`);
    setTimeout(() => {
      const role = resume.experience[index].role;
      let bullets = RESUME_BULLETS['General'];
      for (const key of Object.keys(RESUME_BULLETS)) {
        if (role.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
          bullets = RESUME_BULLETS[key];
          break;
        }
      }
      const randomBullet = bullets[Math.floor(Math.random() * bullets.length)];
      const u = [...resume.experience]; 
      u[index] = { ...u[index], description: randomBullet }; 
      update('experience', u);
      setLoading(null);
    }, 400);
  };

  const autoSuggestSkills = () => {
    setLoading('skills');
    setTimeout(() => {
      const generalSkills = ["Project Management", "Communication", "Problem Solving", "Leadership", "Data Analysis", "Agile Methodologies"];
      const newSkills = [...new Set([...resume.skills, ...generalSkills])].slice(0, 10);
      update('skills', newSkills);
      toast.success('Skills suggested!');
      setLoading(null);
    }, 400);
  };

  const checkATS = () => {
    setLoading('ats');
    setTimeout(() => {
      let score = 50;
      const tips = [];
      
      if (resume.summary.length > 50) score += 10;
      else tips.push("Add a more detailed professional summary.");
      
      if (resume.experience.length > 0) {
        score += 15;
        if (resume.experience.every(e => e.description.length > 20)) score += 10;
        else tips.push("Expand on your work experience descriptions using action verbs.");
      } else tips.push("Add at least one work experience or internship.");
      
      if (resume.skills.length >= 5) score += 10;
      else tips.push("List at least 5 key skills relevant to your target job.");
      
      if (resume.education.length > 0) score += 5;
      else tips.push("Add your educational background.");

      if (tips.length < 4) tips.push("Use standard formatting and fonts to ensure ATS readability.", "Include quantifiable metrics (e.g., 'increased sales by 20%') in your experience.");

      setAtsScore({ score, tips: tips.slice(0, 4) });
      toast.success('ATS analysis complete!');
      setLoading(null);
    }, 600);
  };

  const downloadPDF = async () => {
    try {
      await exportElementAsPDF('resume-preview', `nxraahnuma-resume-${resume.personalInfo.name.replace(/\s+/g, '-') || 'download'}.pdf`);
      toast.success('Resume downloaded!');
    } catch { toast.error('Failed to download. Try again.'); }
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpenSection(openSection === id ? '' : id)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <span className="font-semibold text-sm">{title}</span>
        {openSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {openSection === id && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );

  const Input = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold">Resume Builder</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={checkATS} disabled={loading === 'ats'} className="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-1">
              {loading === 'ats' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} ATS Check
            </button>
            <button onClick={downloadPDF} className="px-3 py-1.5 text-xs font-medium bg-[#1673CA] text-white rounded-lg hover:bg-[#0d4f8c] flex items-center gap-1"><Download className="w-3 h-3" /> Download PDF</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 sm:py-6">
        {atsScore && (
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-xl ${atsScore.score >= 80 ? 'bg-[#10b981]' : atsScore.score >= 60 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}>{atsScore.score}</div>
              <div>
                <h3 className="font-bold text-sm">ATS Compatibility Score</h3>
                <ul className="mt-1 space-y-0.5">{atsScore.tips.map((t, i) => <li key={i} className="text-xs text-gray-500">• {t}</li>)}</ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-3">
            {/* Templates */}
            <div className="flex gap-2 mb-4">
              {(['modern', 'classic', 'creative'] as const).map(t => (
                <button key={t} onClick={() => update('template', t)} className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize border-2 transition-all ${resume.template === t ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700'}`}>{t}</button>
              ))}
            </div>

            <Section id="personal" title="Personal Information">
              <Input label="Full Name" value={resume.personalInfo.name} onChange={(v: string) => update('personalInfo.name', v)} placeholder="John Doe" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Email" value={resume.personalInfo.email} onChange={(v: string) => update('personalInfo.email', v)} placeholder="john@example.com" type="email" />
                <Input label="Phone" value={resume.personalInfo.phone} onChange={(v: string) => update('personalInfo.phone', v)} placeholder="+1 234 567 890" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="LinkedIn" value={resume.personalInfo.linkedin} onChange={(v: string) => update('personalInfo.linkedin', v)} placeholder="linkedin.com/in/johndoe" />
                <Input label="Location" value={resume.personalInfo.location} onChange={(v: string) => update('personalInfo.location', v)} placeholder="New York, USA" />
              </div>
            </Section>

            <Section id="summary" title="Professional Summary">
              <textarea value={resume.summary} onChange={e => update('summary', e.target.value)} rows={4} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA] resize-none" placeholder="A brief professional summary..." />
              <button onClick={autoWriteSummary} disabled={loading === 'summary'} className="flex items-center gap-1 text-xs text-[#1673CA] hover:underline font-medium">
                {loading === 'summary' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Auto-Write Suggestion
              </button>
            </Section>

            <Section id="experience" title="Work Experience">
              {resume.experience.map((exp, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-xs font-semibold">Experience #{i+1}</span><button onClick={() => update('experience', resume.experience.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button></div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={exp.company} onChange={e => { const u = [...resume.experience]; u[i] = { ...u[i], company: e.target.value }; update('experience', u); }} placeholder="Company" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                    <input value={exp.role} onChange={e => { const u = [...resume.experience]; u[i] = { ...u[i], role: e.target.value }; update('experience', u); }} placeholder="Role" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={exp.startDate} onChange={e => { const u = [...resume.experience]; u[i] = { ...u[i], startDate: e.target.value }; update('experience', u); }} placeholder="Start (e.g. Jan 2024)" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                    <input value={exp.endDate} onChange={e => { const u = [...resume.experience]; u[i] = { ...u[i], endDate: e.target.value }; update('experience', u); }} placeholder="End (or Present)" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                  </div>
                  <textarea value={exp.description} onChange={e => { const u = [...resume.experience]; u[i] = { ...u[i], description: e.target.value }; update('experience', u); }} placeholder="Description..." rows={2} className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none resize-none" />
                  <button onClick={() => autoImproveText(i)} className="flex items-center gap-1 text-[10px] text-[#1673CA] hover:underline font-medium">
                    {loading === `exp-${i}` ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Wand2 className="w-2.5 h-2.5" />} Suggest Bullet Point
                  </button>
                </div>
              ))}
              <button onClick={() => update('experience', [...resume.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }])} className="flex items-center gap-1 text-xs text-[#1673CA] hover:underline font-medium"><Plus className="w-3 h-3" /> Add Experience</button>
            </Section>

            <Section id="education" title="Education">
              {resume.education.map((edu, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-xs font-semibold">Education #{i+1}</span><button onClick={() => update('education', resume.education.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button></div>
                  <input value={edu.institution} onChange={e => { const u = [...resume.education]; u[i] = { ...u[i], institution: e.target.value }; update('education', u); }} placeholder="Institution" className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={edu.degree} onChange={e => { const u = [...resume.education]; u[i] = { ...u[i], degree: e.target.value }; update('education', u); }} placeholder="Degree" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                    <input value={edu.startDate} onChange={e => { const u = [...resume.education]; u[i] = { ...u[i], startDate: e.target.value }; update('education', u); }} placeholder="Start" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                    <input value={edu.endDate} onChange={e => { const u = [...resume.education]; u[i] = { ...u[i], endDate: e.target.value }; update('education', u); }} placeholder="End" className="px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none" />
                  </div>
                </div>
              ))}
              <button onClick={() => update('education', [...resume.education, { institution: '', degree: '', startDate: '', endDate: '', gpa: '' }])} className="flex items-center gap-1 text-xs text-[#1673CA] hover:underline font-medium"><Plus className="w-3 h-3" /> Add Education</button>
            </Section>

            <Section id="skills" title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1673CA]/10 text-[#1673CA] rounded-full text-xs font-medium">
                    {s} <button onClick={() => update('skills', resume.skills.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input placeholder="Type a skill and press Enter" onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { update('skills', [...resume.skills, (e.target as HTMLInputElement).value.trim()]); (e.target as HTMLInputElement).value = ''; } }} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
              <button onClick={autoSuggestSkills} disabled={loading === 'skills'} className="flex items-center gap-1 text-xs text-[#1673CA] hover:underline font-medium">
                {loading === 'skills' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Auto Suggest Skills
              </button>
            </Section>
          </div>

          {/* Live Preview */}
          <div className="sticky top-20">
            <div id="resume-preview" className={`bg-white rounded-xl shadow-lg p-8 min-h-[600px] text-gray-800 ${resume.template === 'modern' ? 'border-t-4 border-[#1673CA]' : resume.template === 'creative' ? 'border-l-4 border-[#1673CA]' : 'border border-gray-300'}`}>
              {/* Header */}
              <div className={`mb-6 ${resume.template === 'creative' ? 'pl-4' : ''}`}>
                <h1 className={`text-2xl font-black ${resume.template === 'modern' ? 'text-[#1673CA]' : 'text-gray-900'}`}>{resume.personalInfo.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                  {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                  {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
                  {resume.personalInfo.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
                </div>
              </div>

              {resume.summary && (
                <div className="mb-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${resume.template === 'modern' ? 'text-[#1673CA]' : 'text-gray-900 border-b border-gray-300 pb-1'}`}>Professional Summary</h2>
                  <p className="text-xs leading-relaxed text-gray-600">{resume.summary}</p>
                </div>
              )}

              {resume.experience.length > 0 && (
                <div className="mb-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${resume.template === 'modern' ? 'text-[#1673CA]' : 'text-gray-900 border-b border-gray-300 pb-1'}`}>Experience</h2>
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between"><span className="text-xs font-bold">{exp.role}</span><span className="text-[10px] text-gray-400">{exp.startDate} – {exp.endDate}</span></div>
                      <p className="text-[10px] text-gray-500 italic">{exp.company}</p>
                      <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.education.length > 0 && (
                <div className="mb-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${resume.template === 'modern' ? 'text-[#1673CA]' : 'text-gray-900 border-b border-gray-300 pb-1'}`}>Education</h2>
                  {resume.education.map((edu, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between"><span className="text-xs font-bold">{edu.degree}</span><span className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate}</span></div>
                      <p className="text-[10px] text-gray-500 italic">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.skills.length > 0 && (
                <div>
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${resume.template === 'modern' ? 'text-[#1673CA]' : 'text-gray-900 border-b border-gray-300 pb-1'}`}>Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map((s, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function X(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
