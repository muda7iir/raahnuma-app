import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1673CA] flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NX <span className="text-[#1673CA]">RaahNuma</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your AI-Powered Career Counselor — by NerithonX Technologies. Helping students and professionals find their perfect career path.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="/#features" className="text-sm hover:text-[#1673CA] transition-colors">Features</a></li>
              <li><a href="/#pricing" className="text-sm hover:text-[#1673CA] transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="text-sm hover:text-[#1673CA] transition-colors">FAQ</a></li>
              <li><Link to="/onboarding" className="text-sm hover:text-[#1673CA] transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-[#1673CA] transition-colors">About NerithonX</a></li>
              <li><a href="#" className="text-sm hover:text-[#1673CA] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-[#1673CA] transition-colors">Terms of Service</a></li>
              <li><a href="mailto:info@nerithonx.com" className="text-sm hover:text-[#1673CA] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-[#1673CA] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-[#1673CA] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-[#1673CA] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-[#1673CA] flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by NerithonX Technologies (Pvt.) Ltd. © 2026 — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
