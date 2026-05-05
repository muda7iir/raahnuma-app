import React from 'react';
import { Compass, BookOpen, Users, Settings } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight">Raahnuma</span>
          </div>
          <div className="flex gap-6 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">Home</a>
            <a href="#" className="hover:text-blue-600">Resources</a>
            <a href="#" className="hover:text-blue-600">About</a>
          </div>
          <button className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900 lg:text-6xl">
            Your Ultimate <span className="text-blue-600">Guide</span> to Success
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-600">
            Raahnuma provides comprehensive guidance and resources for education, career planning, and personal development.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">
          <div className="group rounded-2xl border bg-white p-8 transition hover:shadow-lg">
            <div className="mb-4 inline-block rounded-xl bg-blue-100 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Educational Roadmap</h3>
            <p className="text-slate-600">Detailed plans for students at all levels to achieve their academic goals.</p>
          </div>
          <div className="group rounded-2xl border bg-white p-8 transition hover:shadow-lg">
            <div className="mb-4 inline-block rounded-xl bg-green-100 p-3 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Community Support</h3>
            <p className="text-slate-600">Connect with mentors and peers who share your interests and challenges.</p>
          </div>
          <div className="group rounded-2xl border bg-white p-8 transition hover:shadow-lg">
            <div className="mb-4 inline-block rounded-xl bg-purple-100 p-3 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
              <Settings className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Smart Planning</h3>
            <p className="text-slate-600">AI-powered tools to help you track progress and adjust your roadmap dynamically.</p>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-500">
          <p>&copy; 2026 Raahnuma App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
