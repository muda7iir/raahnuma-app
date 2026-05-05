import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Volume2, Sun, Moon, Database, Trash2, Download, RotateCcw, Camera, X, Play } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { getSettings, setSettings as saveSettings, exportAllData, storageClear, type AppSettings } from '../lib/storage';
import { getVoices, speak, stopSpeaking, isSpeechSynthesisSupported } from '../lib/speech';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, setProfile, clearProfile } = useProfile();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const [settings, setSettingsState] = useState<AppSettings>(getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [editProfile, setEditProfile] = useState({
    name: profile?.name || '',
    age: profile?.age?.toString() || '',
    country: profile?.country || '',
    educationLevel: profile?.educationLevel || '',
    photo: profile?.photo || '',
    dreamStatement: profile?.dreamStatement || '',
  });
  const [showClearModal, setShowClearModal] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = getVoices();
      setVoices(v);
    };
    loadVoices();
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const saveProfile = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      name: editProfile.name,
      age: parseInt(editProfile.age) || profile.age,
      country: editProfile.country,
      educationLevel: editProfile.educationLevel,
      photo: editProfile.photo,
      dreamStatement: editProfile.dreamStatement,
    });
    toast.success('Profile updated!');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setEditProfile(prev => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nxraahnuma-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleClearChats = () => {
    localStorage.removeItem('nxraahnuma_chats');
    toast.success('Chat history cleared!');
    setShowClearModal(null);
  };

  const handleResetProfile = () => {
    clearProfile();
    toast.success('Profile reset!');
    setShowClearModal(null);
    navigate('/onboarding');
  };

  const handleClearAll = () => {
    storageClear();
    clearProfile();
    toast.success('All data cleared!');
    setShowClearModal(null);
    navigate('/');
  };

  const testVoice = () => {
    stopSpeaking();
    speak('Hello! I am NX RaahNuma, your AI career counselor. How can I help you today?', {
      voiceId: settings.voiceId,
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-bold">Settings</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-lg mb-4">Profile</h2>
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer group">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden group-hover:border-[#1673CA]">
                {editProfile.photo ? <img src={editProfile.photo} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-400" />}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input type="text" value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Age</label>
              <input type="number" value={editProfile.age} onChange={e => setEditProfile(p => ({ ...p, age: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Country</label>
              <input type="text" value={editProfile.country} onChange={e => setEditProfile(p => ({ ...p, country: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Education Level</label>
              <input type="text" value={editProfile.educationLevel} onChange={e => setEditProfile(p => ({ ...p, educationLevel: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium mb-1">Dream Statement</label>
            <textarea value={editProfile.dreamStatement} onChange={e => setEditProfile(p => ({ ...p, dreamStatement: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA] resize-none" />
          </div>
          <button onClick={saveProfile} className="mt-4 px-5 py-2 bg-[#1673CA] text-white rounded-lg text-sm font-semibold hover:bg-[#0d4f8c]">Save Changes</button>
        </div>

        {/* Voice */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Volume2 className="w-5 h-5 text-[#1673CA]" /> Voice Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Default Voice</label>
              <select value={settings.voiceId} onChange={e => updateSetting('voiceId', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]">
                <option value="">System Default</option>
                {voices.map((v, i) => <option key={i} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Speed: {settings.voiceSpeed}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={settings.voiceSpeed} onChange={e => updateSetting('voiceSpeed', parseFloat(e.target.value))} className="w-full accent-[#1673CA]" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Pitch: {settings.voicePitch}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={settings.voicePitch} onChange={e => updateSetting('voicePitch', parseFloat(e.target.value))} className="w-full accent-[#1673CA]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-play AI responses</span>
              <button onClick={() => updateSetting('autoPlayVoice', !settings.autoPlayVoice)} className={`w-12 h-6 rounded-full transition-colors ${settings.autoPlayVoice ? 'bg-[#1673CA]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.autoPlayVoice ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <button onClick={testVoice} className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-[#1673CA] text-[#1673CA] rounded-lg hover:bg-[#1673CA]/5"><Play className="w-4 h-4" /> Test Voice</button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-lg mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
                {theme === 'dark' ? <><Moon className="w-4 h-4" /> Dark</> : <><Sun className="w-4 h-4" /> Light</>}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Font Size</label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} onClick={() => setFontSize(s)} className={`px-4 py-2 rounded-lg text-sm capitalize border-2 transition-all ${fontSize === s ? 'border-[#1673CA] bg-[#1673CA]/5 text-[#1673CA]' : 'border-gray-200 dark:border-gray-700'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-[#1673CA]" /> Data Management</h2>
          <div className="space-y-3">
            <button onClick={handleExport} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"><Download className="w-4 h-4 text-[#1673CA]" /> Export All My Data</button>
            <button onClick={() => setShowClearModal('chats')} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-amber-600"><Trash2 className="w-4 h-4" /> Clear Chat History</button>
            <button onClick={() => setShowClearModal('profile')} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-amber-600"><RotateCcw className="w-4 h-4" /> Reset Profile</button>
            <button onClick={() => setShowClearModal('all')} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"><Trash2 className="w-4 h-4" /> Clear All Data</button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-lg mb-4">About</h2>
          <div className="space-y-2 text-sm text-gray-500">
            <p><span className="font-medium text-gray-700 dark:text-gray-300">App:</span> NX RaahNuma v2.0</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Built by:</span> NerithonX Technologies (Pvt.) Ltd.</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span> info@nerithonx.com</p>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 max-w-sm w-full shadow-xl animate-fade-in">
            <h3 className="font-bold text-lg mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 mb-6">
              {showClearModal === 'chats' && 'This will permanently delete all your chat conversations.'}
              {showClearModal === 'profile' && 'This will reset your profile and redirect you to onboarding.'}
              {showClearModal === 'all' && 'This will permanently delete ALL your data including chats, roadmaps, assessments, and profile. This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearModal(null)} className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={() => {
                if (showClearModal === 'chats') handleClearChats();
                if (showClearModal === 'profile') handleResetProfile();
                if (showClearModal === 'all') handleClearAll();
              }} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
