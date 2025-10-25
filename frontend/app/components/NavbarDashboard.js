'use client';

import { useState, useRef, useEffect } from 'react';
import { FaBell, FaEdit, FaUser, FaEnvelope, FaIdCard, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function NavbarDashboard() {
  const { userData, currentUser, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const profileRef = useRef(null);
  const router = useRouter();

  // Initialize edited data when userData changes
  useEffect(() => {
    if (userData) {
      setEditedData({
        fullName: userData.fullName || '',
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
        setEditMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for the circle
  const getUserInitials = () => {
    if (!userData?.fullName) return 'U';
    return userData.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // Here you would typically save to Firebase
    console.log('Saving data:', editedData);
    setEditMode(false);
    // Add your Firebase update logic here
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="ml-64 w-[calc(100%-16rem)] h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 z-30">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome to Student Voting System</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-[#00A693] transition-colors rounded-lg hover:bg-gray-100">
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile Circle */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-end">
                <span className="font-medium text-gray-800 text-sm">
                  {userData?.fullName || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {userData?.studentId || 'Student ID'}
                </span>
              </div>
              <div className="w-10 h-10 bg-[#00A693] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#00A693] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {userData?.fullName || 'User'}
                      </h3>
                      <p className="text-gray-600 text-sm">{userData?.studentId || 'Student ID'}</p>
                      <p className="text-gray-500 text-xs">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className="p-2 text-gray-500 hover:text-[#00A693] transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {editMode ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editedData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-[#00A693] text-white py-2 rounded-lg hover:bg-[#008876] transition-colors font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaUser className="text-[#00A693] flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-800">{userData?.fullName || 'Not set'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaIdCard className="text-[#00A693] flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Student ID</p>
                          <p className="font-medium text-gray-800">{userData?.studentId || 'Not set'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaEnvelope className="text-[#00A693] flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-800">{currentUser?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaPhone className="text-[#00A693] flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-800">{userData?.phone || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when profile is open */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-40" onClick={() => setShowProfile(false)} />
      )}
    </>
  );
}