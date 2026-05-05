import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, ArrowRight, ChevronLeft, Download, RefreshCw, Lightbulb, Target, Users, MessageSquare as MsgIcon, Cpu, Flame, Heart } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { sendSinglePrompt } from '../lib/gemini';
import { getAssessments, setAssessments, generateId, type AssessmentResult } from '../lib/storage';
import { exportTextAsPDF } from '../lib/pdf';
import toast from 'react-hot-toast';

const QUESTIONS = [
  // Problem Solving (3)
  { category: 'Problem Solving', q: 'When faced with a complex problem, you prefer to:', options: [
    { text: 'Break it into smaller parts and solve step by step', icon: '🧩', score: { 'Problem Solving': 4, 'Technical': 2 } },
    { text: 'Brainstorm creative solutions first', icon: '💡', score: { 'Problem Solving': 3, 'Creativity': 3 } },
    { text: 'Discuss it with others to get different perspectives', icon: '👥', score: { 'Problem Solving': 2, 'Communication': 3 } },
    { text: 'Research how others solved similar problems', icon: '📚', score: { 'Problem Solving': 3, 'Technical': 1 } },
  ]},
  { category: 'Problem Solving', q: 'How do you handle unexpected challenges?', options: [
    { text: 'Stay calm and analyze the situation logically', icon: '🧠', score: { 'Problem Solving': 4, 'Leadership': 2 } },
    { text: 'Improvise and adapt quickly', icon: '⚡', score: { 'Problem Solving': 3, 'Risk Tolerance': 3 } },
    { text: 'Ask for help from experienced people', icon: '🤝', score: { 'Social Skills': 3, 'Communication': 2 } },
    { text: 'Take time to think before acting', icon: '⏳', score: { 'Problem Solving': 3, 'Creativity': 1 } },
  ]},
  { category: 'Problem Solving', q: 'Your ideal project involves:', options: [
    { text: 'Building something technical from scratch', icon: '🔧', score: { 'Technical': 4, 'Problem Solving': 3 } },
    { text: 'Designing a beautiful user experience', icon: '🎨', score: { 'Creativity': 4, 'Problem Solving': 2 } },
    { text: 'Managing a team to deliver results', icon: '📋', score: { 'Leadership': 4, 'Communication': 2 } },
    { text: 'Researching and writing a detailed analysis', icon: '📊', score: { 'Problem Solving': 3, 'Communication': 3 } },
  ]},
  // Creativity (2)
  { category: 'Creativity', q: 'When you have free time, you enjoy:', options: [
    { text: 'Creating art, music, or writing', icon: '🎵', score: { 'Creativity': 4, 'Social Skills': 1 } },
    { text: 'Learning new technologies or tools', icon: '💻', score: { 'Technical': 4, 'Problem Solving': 2 } },
    { text: 'Organizing events or social gatherings', icon: '🎉', score: { 'Social Skills': 4, 'Leadership': 2 } },
    { text: 'Reading about business and self-improvement', icon: '📖', score: { 'Leadership': 3, 'Risk Tolerance': 2 } },
  ]},
  { category: 'Creativity', q: 'Your approach to generating new ideas is:', options: [
    { text: 'Let inspiration come naturally from experiences', icon: '🌟', score: { 'Creativity': 4, 'Social Skills': 1 } },
    { text: 'Analyze data and trends for opportunities', icon: '📈', score: { 'Technical': 3, 'Problem Solving': 3 } },
    { text: 'Collaborate with others for brainstorming', icon: '🧑‍🤝‍🧑', score: { 'Communication': 3, 'Creativity': 3 } },
    { text: 'Look at what competitors are doing and improve', icon: '🔍', score: { 'Problem Solving': 3, 'Risk Tolerance': 2 } },
  ]},
  // Leadership (2)
  { category: 'Leadership', q: 'In a group project, you naturally:', options: [
    { text: 'Take charge and delegate tasks', icon: '👑', score: { 'Leadership': 4, 'Communication': 2 } },
    { text: 'Focus on your individual contribution', icon: '🎯', score: { 'Technical': 3, 'Problem Solving': 3 } },
    { text: 'Mediate conflicts and keep harmony', icon: '☮️', score: { 'Social Skills': 4, 'Communication': 2 } },
    { text: 'Come up with innovative approaches', icon: '🚀', score: { 'Creativity': 3, 'Risk Tolerance': 3 } },
  ]},
  { category: 'Leadership', q: 'How do you make important decisions?', options: [
    { text: 'Trust my gut feeling and experience', icon: '💪', score: { 'Leadership': 4, 'Risk Tolerance': 2 } },
    { text: 'Gather all data and analyze carefully', icon: '📊', score: { 'Problem Solving': 4, 'Technical': 2 } },
    { text: 'Consult with trusted advisors', icon: '🗣️', score: { 'Communication': 3, 'Social Skills': 3 } },
    { text: 'Consider creative alternatives first', icon: '🌈', score: { 'Creativity': 3, 'Problem Solving': 2 } },
  ]},
  // Communication (2)
  { category: 'Communication', q: 'You communicate best through:', options: [
    { text: 'Writing detailed documents or emails', icon: '✍️', score: { 'Communication': 4, 'Problem Solving': 1 } },
    { text: 'Visual presentations and diagrams', icon: '📽️', score: { 'Communication': 3, 'Creativity': 3 } },
    { text: 'Face-to-face conversations', icon: '😊', score: { 'Social Skills': 4, 'Communication': 2 } },
    { text: 'Building things that speak for themselves', icon: '🛠️', score: { 'Technical': 3, 'Creativity': 2 } },
  ]},
  { category: 'Communication', q: 'When explaining something complex, you:', options: [
    { text: 'Use analogies and simple language', icon: '🎈', score: { 'Communication': 4, 'Social Skills': 2 } },
    { text: 'Draw diagrams and flowcharts', icon: '📐', score: { 'Technical': 3, 'Creativity': 2 } },
    { text: 'Tell a story to make it relatable', icon: '📚', score: { 'Creativity': 3, 'Communication': 3 } },
    { text: 'Give a structured, step-by-step breakdown', icon: '📋', score: { 'Problem Solving': 3, 'Technical': 2 } },
  ]},
  // Technical (2)
  { category: 'Technical Aptitude', q: 'Your relationship with technology is:', options: [
    { text: 'I love building and coding things', icon: '👨‍💻', score: { 'Technical': 4, 'Problem Solving': 3 } },
    { text: 'I use it as a tool but prefer people', icon: '🤝', score: { 'Social Skills': 3, 'Communication': 2 } },
    { text: 'I enjoy designing digital experiences', icon: '🎨', score: { 'Creativity': 4, 'Technical': 2 } },
    { text: 'I want to understand how it can grow business', icon: '💰', score: { 'Leadership': 3, 'Risk Tolerance': 3 } },
  ]},
  { category: 'Technical Aptitude', q: 'When learning something new, you prefer:', options: [
    { text: 'Hands-on practice and experimentation', icon: '🔬', score: { 'Technical': 4, 'Problem Solving': 2 } },
    { text: 'Watching tutorials and courses', icon: '📺', score: { 'Technical': 2, 'Problem Solving': 2 } },
    { text: 'Learning from a mentor or teacher', icon: '👨‍🏫', score: { 'Social Skills': 3, 'Communication': 2 } },
    { text: 'Reading documentation and theory', icon: '📖', score: { 'Problem Solving': 3, 'Technical': 2 } },
  ]},
  // Risk Tolerance (2)
  { category: 'Risk Tolerance', q: 'Your ideal career path is:', options: [
    { text: 'Stable job with growth potential', icon: '🏢', score: { 'Technical': 2, 'Problem Solving': 2 } },
    { text: 'Start my own business or startup', icon: '🚀', score: { 'Risk Tolerance': 4, 'Leadership': 3 } },
    { text: 'Freelance with variety of projects', icon: '🌍', score: { 'Risk Tolerance': 3, 'Creativity': 3 } },
    { text: 'Research or academic career', icon: '🎓', score: { 'Problem Solving': 3, 'Technical': 2 } },
  ]},
  { category: 'Risk Tolerance', q: 'How do you feel about career changes?', options: [
    { text: 'Exciting — I embrace new opportunities', icon: '🎢', score: { 'Risk Tolerance': 4, 'Creativity': 2 } },
    { text: 'Only if well-planned and researched', icon: '📋', score: { 'Problem Solving': 3, 'Risk Tolerance': 2 } },
    { text: 'Prefer stability but open to pivots', icon: '⚖️', score: { 'Leadership': 2, 'Social Skills': 2 } },
    { text: 'I want to become expert in one field', icon: '🏆', score: { 'Technical': 4, 'Problem Solving': 2 } },
  ]},
  // Social Skills (2)
  { category: 'Social Skills', q: 'In social situations, you:', options: [
    { text: 'Love networking and meeting new people', icon: '🤗', score: { 'Social Skills': 4, 'Communication': 3 } },
    { text: 'Prefer small, meaningful conversations', icon: '💬', score: { 'Social Skills': 3, 'Communication': 2 } },
    { text: 'Enjoy leading and motivating groups', icon: '📣', score: { 'Leadership': 4, 'Social Skills': 2 } },
    { text: 'Prefer working independently', icon: '🧘', score: { 'Technical': 2, 'Problem Solving': 2 } },
  ]},
  { category: 'Social Skills', q: 'Your biggest strength is:', options: [
    { text: 'Empathy — understanding others\' feelings', icon: '❤️', score: { 'Social Skills': 4, 'Communication': 2 } },
    { text: 'Logic — solving problems efficiently', icon: '🧮', score: { 'Problem Solving': 4, 'Technical': 2 } },
    { text: 'Vision — seeing the big picture', icon: '🔭', score: { 'Leadership': 4, 'Creativity': 2 } },
    { text: 'Execution — getting things done', icon: '✅', score: { 'Technical': 3, 'Risk Tolerance': 2 } },
  ]},
];

const DIMENSIONS = ['Problem Solving', 'Creativity', 'Leadership', 'Communication', 'Technical', 'Risk Tolerance', 'Social Skills'];

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selectAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIdx;
    setAnswers(newAnswers);
  };

  const calculateResults = async () => {
    setLoading(true);
    // Calculate scores
    const scores: Record<string, number> = {};
    DIMENSIONS.forEach(d => scores[d] = 0);

    answers.forEach((ansIdx, qIdx) => {
      if (ansIdx === undefined) return;
      const option = QUESTIONS[qIdx].options[ansIdx];
      Object.entries(option.score).forEach(([dim, val]) => {
        scores[dim] = (scores[dim] || 0) + val;
      });
    });

    // Normalize to 0-100
    const maxPossible = 20;
    DIMENSIONS.forEach(d => scores[d] = Math.min(100, Math.round((scores[d] / maxPossible) * 100)));

    // Determine personality type
    const topDim = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const typeMap: Record<string, string> = {
      'Problem Solving': 'Analytical', 'Creativity': 'Creative', 'Leadership': 'Leader',
      'Communication': 'Communicator', 'Technical': 'Technical', 'Risk Tolerance': 'Entrepreneur', 'Social Skills': 'Communicator'
    };
    const personalityType = typeMap[topDim] || 'Analytical';

    // Get career matches from AI
    try {
      const prompt = `Based on these skill assessment scores (out of 100): ${JSON.stringify(scores)}, personality type: ${personalityType}.
Return EXACTLY this JSON (no markdown, no code fences):
[
  {"name": "Career 1", "matchPercent": 95, "salary": "$80,000–$150,000", "demand": "High"},
  {"name": "Career 2", "matchPercent": 88, "salary": "$70,000–$130,000", "demand": "High"},
  {"name": "Career 3", "matchPercent": 82, "salary": "$60,000–$120,000", "demand": "Medium"},
  {"name": "Career 4", "matchPercent": 75, "salary": "$55,000–$110,000", "demand": "Medium"},
  {"name": "Career 5", "matchPercent": 68, "salary": "$50,000–$100,000", "demand": "High"}
]`;
      const res = await sendSinglePrompt(prompt);
      let jsonStr = res;
      const match = res.match(/\[[\s\S]*\]/);
      if (match) jsonStr = match[0];
      const careers = JSON.parse(jsonStr);

      const assessment: AssessmentResult = {
        id: generateId(), scores, personalityType,
        careerMatches: careers, completedAt: new Date().toISOString(),
      };
      setResult(assessment);
      const existing = getAssessments();
      setAssessments([assessment, ...existing]);
      toast.success('Assessment complete!');
    } catch {
      const fallbackCareers = [
        { name: 'Software Engineer', matchPercent: 90, salary: '$80,000–$150,000', demand: 'High' },
        { name: 'Product Manager', matchPercent: 85, salary: '$90,000–$160,000', demand: 'High' },
        { name: 'Data Analyst', matchPercent: 78, salary: '$60,000–$110,000', demand: 'High' },
        { name: 'UX Designer', matchPercent: 72, salary: '$65,000–$120,000', demand: 'Medium' },
        { name: 'Business Analyst', matchPercent: 68, salary: '$55,000–$100,000', demand: 'Medium' },
      ];
      const assessment: AssessmentResult = {
        id: generateId(), scores, personalityType,
        careerMatches: fallbackCareers, completedAt: new Date().toISOString(),
      };
      setResult(assessment);
      const existing = getAssessments();
      setAssessments([assessment, ...existing]);
    }
    setLoading(false);
  };

  const radarData = result ? DIMENSIONS.map(d => ({ subject: d, value: result.scores[d] || 0, fullMark: 100 })) : [];

  if (result) {
    return (
      <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220] p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1673CA]"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
            <div className="flex gap-2">
              <button onClick={() => { exportTextAsPDF('Skills Assessment Results', `Personality Type: ${result.personalityType}\n\nScores:\n${DIMENSIONS.map(d => `${d}: ${result.scores[d]}%`).join('\n')}\n\nTop Career Matches:\n${result.careerMatches.map(c => `${c.name} (${c.matchPercent}% match) — ${c.salary}`).join('\n')}`, 'nxraahnuma-assessment.pdf'); toast.success('PDF downloaded!'); }} className="px-3 py-1.5 text-xs font-medium bg-[#1673CA] text-white rounded-lg hover:bg-[#0d4f8c] flex items-center gap-1"><Download className="w-3 h-3" /> Download PDF</button>
              <button onClick={() => { setResult(null); setAnswers([]); setCurrentQ(0); }} className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Retake</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-lg mb-4">Your Skill Profile</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Skills" dataKey="value" stroke="#1673CA" fill="#1673CA" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Personality Type */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-lg mb-4">Your Personality Type</h2>
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-2xl bg-[#1673CA]/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-[#1673CA]" />
                </div>
                <h3 className="text-3xl font-black text-[#1673CA] mb-2">{result.personalityType}</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Your assessment indicates strong {DIMENSIONS.filter(d => result.scores[d] >= 60).join(', ')} abilities.</p>
              </div>
            </div>
          </div>

          {/* Career Matches */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
            <h2 className="font-bold text-lg mb-4">Top 5 Career Matches</h2>
            <div className="space-y-4">
              {result.careerMatches.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-2xl font-black text-[#1673CA]/30">#{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.demand === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>{c.demand} Demand</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1673CA] h-2 rounded-full" style={{ width: `${c.matchPercent}%` }} />
                      </div>
                      <span className="text-sm font-bold text-[#1673CA]">{c.matchPercent}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{c.salary}/year</p>
                  </div>
                  <button onClick={() => navigate(`/chat`)} className="px-3 py-1.5 text-xs font-medium text-[#1673CA] border border-[#1673CA] rounded-lg hover:bg-[#1673CA]/5">Explore</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1673CA] flex items-center justify-center"><Compass className="w-5 h-5 text-white" /></div>
          </div>
          <h1 className="text-2xl font-bold mb-1">Skills Assessment</h1>
          <p className="text-sm text-gray-500">Discover your strengths in 5 minutes</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{QUESTIONS[currentQ].category}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div className="bg-[#1673CA] h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-fade-in">
          <h2 className="text-lg font-bold mb-6">{QUESTIONS[currentQ].q}</h2>
          <div className="space-y-3">
            {QUESTIONS[currentQ].options.map((opt, i) => (
              <button key={i} onClick={() => selectAnswer(i)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left border-2 transition-all ${answers[currentQ] === i ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700 hover:border-[#1673CA]/50'}`}>
                <span className="text-xl">{opt.icon}</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)} disabled={currentQ === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {currentQ < QUESTIONS.length - 1 ? (
            <button onClick={() => answers[currentQ] !== undefined && setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === undefined} className={`flex items-center gap-1 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${answers[currentQ] !== undefined ? 'bg-[#1673CA] text-white hover:bg-[#0d4f8c]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={calculateResults} disabled={answers[currentQ] === undefined || loading} className="px-6 py-2.5 text-sm font-semibold bg-[#1673CA] text-white rounded-lg hover:bg-[#0d4f8c] disabled:opacity-50 flex items-center gap-2">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : 'See Results ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
