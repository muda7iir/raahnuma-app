import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Map, Briefcase, FileText, Settings, Users, GraduationCap } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { hasProfile } = useProfile();

  if (!hasProfile || location.pathname === '/onboarding' || location.pathname === '/') return null;

  const NAV_ITEMS = [
    { label: 'Home', icon: Compass, path: '/dashboard' },
    { label: 'Chat', icon: MessageSquare, path: '/chat' },
    { label: 'Mentors', icon: Users, path: '/mentors' },
    { label: 'Roadmap', icon: Map, path: '/roadmap' },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.label} 
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] ${isActive ? 'text-[#1673CA]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-[#1673CA]/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
