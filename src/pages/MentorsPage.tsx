import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Search, Star, Clock, Calendar, Video, CheckCircle2, X } from 'lucide-react';
import { MENTORS, type Mentor } from '../lib/mentorsData';
import { addBooking, generateId } from '../lib/storage';
import toast from 'react-hot-toast';

const INDUSTRIES = Array.from(new Set(MENTORS.map(m => m.industry)));

export default function MentorsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const filteredMentors = MENTORS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || m.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleBooking = () => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select a date and time');
      return;
    }
    if (!selectedMentor) return;

    setIsBooking(true);
    
    setTimeout(() => {
      addBooking({
        id: generateId(),
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorPhoto: selectedMentor.photoColor,
        date: bookingDate,
        time: bookingTime,
        duration: 45,
        status: 'upcoming',
        meetLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
        bookedAt: new Date().toISOString()
      });
      
      setIsBooking(false);
      setSelectedMentor(null);
      setBookingDate('');
      setBookingTime('');
      toast.success('Session booked successfully!');
      navigate('/dashboard');
    }, 1000);
  };

  // Get available dates (next 5 days)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Skip weekends
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const AVAILABLE_TIMES = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'];

  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220]">
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-bold">Mentor Marketplace</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24 sm:py-8">
        {/* Search & Filter Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Find Your Perfect Mentor</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, role, or company..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] outline-none focus:border-[#1673CA]"
              />
            </div>
            <select 
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] outline-none focus:border-[#1673CA] sm:w-48"
            >
              <option value="All">All Industries</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
        </div>

        {/* Mentor Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No mentors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <div key={mentor.id} className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:border-[#1673CA]/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full ${mentor.photoColor} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                    {mentor.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{mentor.name}</h3>
                    <p className="text-sm text-[#1673CA] font-medium">{mentor.role}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{mentor.company} • {mentor.experience}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-current" /> <span className="font-medium text-gray-900 dark:text-white">{mentor.rating}</span> ({mentor.reviews})</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 45 min</div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {mentor.expertise.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium">{skill}</span>
                  ))}
                  {mentor.expertise.length > 3 && <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium">+{mentor.expertise.length - 3}</span>}
                </div>

                <div className="mt-auto">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">${mentor.hourlyRate}/session</p>
                  <button onClick={() => setSelectedMentor(mentor)} className="w-full py-2.5 bg-[#1673CA]/10 text-[#1673CA] font-semibold rounded-xl hover:bg-[#1673CA] hover:text-white transition-colors">
                    View & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            <button onClick={() => {setSelectedMentor(null); setBookingDate(''); setBookingTime('');}} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full ${selectedMentor.photoColor} flex items-center justify-center text-white text-2xl font-bold`}>
                  {selectedMentor.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedMentor.name}</h2>
                  <p className="text-[#1673CA] font-medium">{selectedMentor.role} at {selectedMentor.company}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-amber-400 fill-current" /> <span className="font-medium text-gray-900 dark:text-white">{selectedMentor.rating}</span> ({selectedMentor.reviews} reviews) • {selectedMentor.industry}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{selectedMentor.bio}</p>
              
              <h3 className="font-bold mb-3">Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedMentor.expertise.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">{skill}</span>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#1673CA]" /> Book a 45-min Session</h3>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Date</label>
                    <select 
                      value={bookingDate}
                      onChange={e => {setBookingDate(e.target.value); setBookingTime('');}}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111827] outline-none focus:border-[#1673CA]"
                    >
                      <option value="">Choose a date...</option>
                      {getAvailableDates().map(d => (
                        <option key={d} value={d}>{new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_TIMES.map(t => (
                        <button
                          key={t}
                          disabled={!bookingDate}
                          onClick={() => setBookingTime(t)}
                          className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all ${!bookingDate ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' : bookingTime === t ? 'border-[#1673CA] bg-[#1673CA] text-white' : 'border-gray-300 dark:border-gray-600 hover:border-[#1673CA] text-gray-700 dark:text-gray-300'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${selectedMentor.hourlyRate}</p>
                  </div>
                  <button 
                    onClick={handleBooking}
                    disabled={isBooking || !bookingDate || !bookingTime}
                    className="px-8 py-3 bg-[#1673CA] text-white font-bold rounded-xl hover:bg-[#0d4f8c] disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {isBooking ? 'Processing...' : <><Video className="w-5 h-5" /> Confirm Booking</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
