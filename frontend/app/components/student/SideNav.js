'use client';

import { FaHome, FaVoteYea, FaFileAlt, FaPoll, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome className="text-base md:text-lg" />, link: '/dashboard' },
    { name: 'Elections', icon: <FaVoteYea className="text-base md:text-lg" />, link: '/elections' },
    { name: 'Petitions', icon: <FaFileAlt className="text-base md:text-lg" />, link: '/petitions' },
    { name: 'Results', icon: <FaPoll className="text-base md:text-lg" />, link: '/results' },
    { name: 'Settings', icon: <FaCog className="text-base md:text-lg" />, link: '/settings' },
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
    <div className="w-64 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
            <Image
              src="/studentvoice.png"
              alt="StudentVoice Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain w-6 h-6 md:w-8 md:h-8"
            />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">StudentVoice</h1>
            <p className="text-xs text-gray-500">UB Voting System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 md:p-4">
        <div className="space-y-1 md:space-y-2">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.link}>
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-[#00A693] hover:text-white text-gray-700">
                <span className="text-gray-500 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span className="font-medium text-sm md:text-base">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-3 md:p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 group"
        >
          <span className="text-red-500 group-hover:text-red-600">
            <FaSignOutAlt className="text-base md:text-lg" />
          </span>
          <span className="font-medium text-sm md:text-base">Logout</span>
        </button>
      </div>
    </div>
  );
}