import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Package size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">LuxeMarket</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the future of e-commerce. Curated premium products with an AI-powered shopping experience designed just for you.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Shop All</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">New Arrivals</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Featured Brands</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Order Status</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2024 LuxeMarket, Inc. All rights reserved.</p>
          <div className="flex gap-6 text-gray-500 text-xs">
            <Link to="#" className="hover:text-white">Privacy</Link>
            <Link to="#" className="hover:text-white">Terms</Link>
            <Link to="#" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};