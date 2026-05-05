import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ScholarshipPage = lazy(() => import('./pages/ScholarshipPage'));
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MentorsPage = lazy(() => import('./pages/MentorsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd] dark:bg-[#0a1220]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1673CA] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Protected route — redirects to onboarding if no profile
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { hasProfile } = useProfile();
  if (!hasProfile) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
        <Route path="/scholarships" element={<ProtectedRoute><ScholarshipPage /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><MentorsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <MobileBottomNav />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProfileProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1f2937', color: '#f9fafb', fontSize: '14px', borderRadius: '12px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </ProfileProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
