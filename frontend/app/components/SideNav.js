'use client';

import { useState } from 'react';
import { FaHome, FaVoteYea, FaFileAlt, FaPoll, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome className="text-lg" />, link: '/dashboard' },
    { name: 'Elections', icon: <FaVoteYea className="text-lg" />, link: '/elections' },
    { name: 'Petitions', icon: <FaFileAlt className="text-lg" />, link: '/petitions' },
    { name: 'Results', icon: <FaPoll className="text-lg" />, link: '/results' },
    { name: 'Settings', icon: <FaCog className="text-lg" />, link: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-40">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00A693] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SV</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">StudentVoice</h1>
            <p className="text-xs text-gray-500">UB Voting System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.link}>
              <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-[#00A693] hover:text-white text-gray-700">
                <span className="text-gray-500 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 group"
        >
          <span className="text-red-500 group-hover:text-red-600">
            <FaSignOutAlt className="text-lg" />
          </span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}