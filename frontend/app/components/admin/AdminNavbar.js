'use client';

import { FaUserCircle, FaSearch, FaCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useState, useEffect } from 'react';
import NotificationBell from '../NotificationBell'; // Add this import

export default function AdminNavbar() {
  const { userData } = useAuth();
  const { isAdmin } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section - Search & Title */}
          <div className="flex items-center flex-1">
            <div className="hidden md:block flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent"
                  placeholder="Search..."
                />
              </div>
            </div>
            
            {/* Mobile Title */}
            <div className="md:hidden">
              <h1 className="text-lg font-semibold text-gray-800">
                {isAdmin ? 'Admin' : 'Officer'}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* Time Display */}
            <div className="hidden sm:block text-sm text-gray-500">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* Notifications - Replaced with new component */}
            <NotificationBell />

            {/* Settings */}
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
              <FaCog className="text-lg" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  {userData?.fullName || (isAdmin ? 'Administrator' : 'Election Officer')}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userData?.role || 'admin'}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#00A693] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData?.fullName?.charAt(0) || (isAdmin ? 'A' : 'O')}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}