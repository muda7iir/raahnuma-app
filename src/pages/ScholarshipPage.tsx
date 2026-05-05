import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Search, Heart, ExternalLink, Clock, RefreshCw, Filter } from 'lucide-react';
import { getScholarships, setScholarships, generateId, type SavedScholarship } from '../lib/storage';
import { SCHOLARSHIPS } from '../lib/scholarshipsData';
import toast from 'react-hot-toast';

const COUNTRIES_LIST = Array.from(new Set(SCHOLARSHIPS.map(s => s.country)));
const FUNDING_TYPES = ['Full scholarship', 'Partial', 'Stipend', 'Grants'];

export default function ScholarshipPage() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<string[]>([]);
  const [funding, setFunding] = useState('');
  const [results, setResults] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState<SavedScholarship[]>(getScholarships());

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const findScholarships = () => {
    setLoading(true);
    setSearched(true);
    
    setTimeout(() => {
      let filtered = SCHOLARSHIPS;
      if (countries.length > 0) {
        filtered = filtered.filter(s => countries.includes(s.country) || s.country.includes('Multiple') || s.country.includes('Any'));
      }
      if (funding && funding !== 'Any') {
        filtered = filtered.filter(s => s.amount.toLowerCase().includes(funding.toLowerCase()));
      }
      
      // Select random subset if more than 6, to simulate search discovery
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 6);
      
      setResults(selected.map(s => ({ ...s, id: generateId(), savedAt: '' })));
      setLoading(false);
    }, 400); // Simulate network delay
  };

  const toggleFavorite = (scholarship: SavedScholarship) => {
    const existing = favorites.find(f => f.name === scholarship.name);
    if (existing) {
      const updated = favorites.filter(f => f.name !== scholarship.name);
      setFavorites(updated);
      setScholarships(updated);
      toast.success('Removed from favorites');
    } else {
      const saved = { ...scholarship, savedAt: new Date().toISOString() };
      const updated = [saved, ...favorites];
      setFavorites(updated);
      setScholarships(updated);
      toast.success('Saved to favorites!');
    }
  };

  const isFavorited = (name: string) => favorites.some(f => f.name === name);

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-bold">Scholarship Finder</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-20">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Country of Study</label>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                    {COUNTRIES_LIST.map(c => (
                      <button key={c} onClick={() => toggleArray(countries, c, setCountries)} className={`px-2 py-1 rounded-md text-xs transition-all ${countries.includes(c) ? 'bg-[#1673CA] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-[#1673CA]/10'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Funding</label>
                  <select value={funding} onChange={e => setFunding(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-1 focus:ring-[#1673CA]">
                    <option value="">Any</option>
                    {FUNDING_TYPES.map(f => <option key={f} value={f.split(' ')[0]}>{f}</option>)}
                  </select>
                </div>
                <button onClick={findScholarships} disabled={loading} className="w-full py-2.5 bg-[#1673CA] text-white rounded-lg font-semibold text-sm hover:bg-[#0d4f8c] disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Searching...</> : <><Search className="w-4 h-4" /> Find Scholarships</>}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Saved ({favorites.length})</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {favorites.slice(0, 4).map(f => (
                    <div key={f.id} className="min-w-[200px] bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                      <p className="text-sm font-semibold truncate">{f.name}</p>
                      <p className="text-xs text-gray-500">{f.country} • {f.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scholarship Cards */}
            {!searched && !loading && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Find Your Perfect Scholarship</h3>
                <p className="text-sm text-gray-500">Use the filters on the left to search for scholarships matching your profile</p>
              </div>
            )}

            {searched && results.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-sm text-gray-500">No scholarships found. Try adjusting your filters.</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((s, i) => (
                <div key={i} className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-sm leading-tight pr-2">{s.name}</h4>
                    <button onClick={() => toggleFavorite(s)} className={`p-1 shrink-0 ${isFavorited(s.name) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}>
                      <Heart className={`w-4 h-4 ${isFavorited(s.name) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs text-gray-500">🏛️ {s.university}</p>
                    <p className="text-xs text-gray-500">📍 {s.country}</p>
                    <p className="text-xs font-semibold text-[#10b981]">💰 {s.amount}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.deadline}</p>
                    <p className="text-xs text-gray-400">{s.eligibility}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-[#1673CA] rounded-lg hover:bg-[#0d4f8c] transition-colors">
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={() => navigate('/chat')} className="px-3 py-2 text-xs font-medium border border-[#1673CA] text-[#1673CA] rounded-lg hover:bg-[#1673CA]/5">Write Essay</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
