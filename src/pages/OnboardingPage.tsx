import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import type { UserProfile } from '../lib/storage';
import toast from 'react-hot-toast';

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

const EDUCATION_LEVELS = ['High School', 'O/A Levels', 'Bachelors', 'Masters', 'PhD', 'Self-taught', 'Bootcamp Graduate'];

const INTERESTS = ['Technology', 'Medicine', 'Business', 'Law', 'Engineering', 'Design', 'Arts', 'Finance', 'Education', 'Marketing', 'Science', 'Psychology', 'Architecture', 'Media', 'Sports', 'Gaming', 'Music', 'Environment', 'Healthcare', 'Real Estate'];

const WORK_PREFS = ['Remote', 'Office', 'Hybrid', 'Freelance', 'Entrepreneur', 'Government Job', 'NGO/Non-profit'];

const BUDGETS = ['No budget', 'Under $1,000', '$1,000–$5,000', '$5,000–$20,000', '$20,000+', 'Scholarship needed'];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [form, setForm] = useState({
    name: '', age: '', country: '', photo: '',
    educationLevel: '', institution: '', gpa: '',
    interests: [] as string[],
    workPreferences: [] as string[],
    budget: '',
    dreamStatement: '',
  });

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: 'interests' | 'workPreferences', item: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item],
    }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => updateForm('photo', reader.result as string);
    reader.readAsDataURL(file);
  };

  const canNext = () => {
    switch (step) {
      case 1: return form.name.trim() && form.age && form.country;
      case 2: return form.educationLevel;
      case 3: return form.interests.length >= 3;
      case 4: return form.workPreferences.length >= 1;
      case 5: return form.budget;
      case 6: return form.dreamStatement.trim().length >= 10;
      default: return false;
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      name: form.name.trim(),
      age: parseInt(form.age),
      country: form.country,
      photo: form.photo,
      educationLevel: form.educationLevel,
      institution: form.institution,
      gpa: form.gpa,
      interests: form.interests,
      workPreferences: form.workPreferences,
      budget: form.budget,
      dreamStatement: form.dreamStatement,
      createdAt: new Date().toISOString(),
    };
    setProfile(profile);
    toast.success('Profile created! Welcome to NX RaahNuma!');
    navigate('/dashboard');
  };

  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1673CA] flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">NX <span className="text-[#1673CA]">RaahNuma</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Let's Build Your Career Profile</h1>
          <p className="text-sm text-gray-500">Step {step} of {TOTAL_STEPS}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div className="bg-[#1673CA] h-2 rounded-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>
              {/* Photo */}
              <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden group-hover:border-[#1673CA] transition-colors">
                    {form.photo ? <img src={form.photo} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-400" />}
                  </div>
                  {form.photo && <button onClick={(e) => { e.preventDefault(); updateForm('photo', ''); }} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button>}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Age *</label>
                <input type="number" value={form.age} onChange={e => updateForm('age', e.target.value)} placeholder="Enter your age" min="10" max="80" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition" />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1.5">Country *</label>
                <input type="text" value={form.country || countrySearch} onChange={e => { setCountrySearch(e.target.value); updateForm('country', ''); setShowCountryDropdown(true); }} onFocus={() => setShowCountryDropdown(true)} placeholder="Search country..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition" />
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCountries.map(c => (
                      <button key={c} onClick={() => { updateForm('country', c); setCountrySearch(''); setShowCountryDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors">{c}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Education Background</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Education Level *</label>
                <select value={form.educationLevel} onChange={e => updateForm('educationLevel', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition">
                  <option value="">Select your level</option>
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Institution Name</label>
                <input type="text" value={form.institution} onChange={e => updateForm('institution', e.target.value)} placeholder="Your school/university name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">GPA (Optional)</label>
                <input type="text" value={form.gpa} onChange={e => updateForm('gpa', e.target.value)} placeholder="e.g. 3.5/4.0" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition" />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-1">Your Interests</h2>
              <p className="text-sm text-gray-500 mb-4">Select at least 3 interests that excite you</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleArrayItem('interests', i)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.interests.includes(i) ? 'bg-[#1673CA] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1673CA]/10'}`}>
                    {i}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">{form.interests.length} selected (minimum 3)</p>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-1">Work Preference</h2>
              <p className="text-sm text-gray-500 mb-4">How do you want to work?</p>
              <div className="grid grid-cols-2 gap-3">
                {WORK_PREFS.map(w => (
                  <button key={w} onClick={() => toggleArrayItem('workPreferences', w)} className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${form.workPreferences.includes(w) ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700 hover:border-[#1673CA]/50'}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-1">Budget for Learning</h2>
              <p className="text-sm text-gray-500 mb-4">What can you invest in your career growth?</p>
              <div className="space-y-3">
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => updateForm('budget', b)} className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left border-2 transition-all ${form.budget === b ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700 hover:border-[#1673CA]/50'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold mb-1">Your Dream</h2>
              <p className="text-sm text-gray-500 mb-4">Describe your dream career or life goal in your own words</p>
              <textarea value={form.dreamStatement} onChange={e => updateForm('dreamStatement', e.target.value)} placeholder="Example: I want to become a machine learning engineer at a top tech company, working remotely while building my own AI startup on the side..." rows={6} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition resize-none" />
              <p className="text-xs text-gray-400">{form.dreamStatement.length} characters</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < TOTAL_STEPS ? (
              <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className={`flex items-center gap-1 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${canNext() ? 'bg-[#1673CA] text-white hover:bg-[#0d4f8c] shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={!canNext()} className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${canNext() ? 'bg-[#1673CA] text-white hover:bg-[#0d4f8c] shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                Complete Profile ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
