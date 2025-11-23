'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User as UserIcon, LogOut, Package, ShieldCheck, Menu, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-xl shadow-md group-hover:shadow-indigo-200 transition-all">
                <Package size={24} />
              </div>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">LuxeMarket</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Shop</Link>
              <Link href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">New Arrivals</Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user?.isAdmin && (
              <Link href="/admin" className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wide">
                <ShieldCheck size={14} />
                Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-2 sm:gap-4 border-l pl-4 sm:pl-6 border-gray-200">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
                <Search size={22} />
              </button>

              <Link href="/cart" className="relative group p-2">
                <ShoppingCart className="text-gray-600 group-hover:text-indigo-600 transition-colors" size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-indigo-600 px-5 py-2.5 rounded-full transition-all shadow-lg shadow-gray-200 hover:shadow-indigo-200">
                  Login
                </Link>
              )}
            </div>

            <button className="sm:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
