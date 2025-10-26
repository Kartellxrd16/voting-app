'use client';

import { 
  FaTachometerAlt, 
  FaVoteYea, 
  FaUserTie, 
  FaChartBar, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../contexts/AdminContext';
import { useState, useEffect } from 'react';

export default function AdminSideNav() {
  const { logout, userData } = useAuth();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminMenuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, link: '/admin', badge: null },
    { name: 'Elections', icon: <FaVoteYea />, link: '/admin/elections', badge: '3' },
    { name: 'Candidates', icon: <FaUserTie />, link: '/admin/candidate-applications', badge: '12' },
    { name: 'Results', icon: <FaChartBar />, link: '/admin/results', badge: null },
    ...(isAdmin ? [{ name: 'Users', icon: <FaUsers />, link: '/admin/users', badge: '45' }] : []),
    { name: 'Settings', icon: <FaCog />, link: '/admin/settings', badge: null },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static top-0 left-0 h-screen bg-gray-800 text-white flex flex-col z-40
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-gray-700">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-[#00A693] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">
                  {isAdmin ? 'Admin Panel' : 'Officer Panel'}
                </h1>
                <p className="text-gray-400 text-xs truncate">UB Voting System</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle Button - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 bg-gray-700 text-white p-1 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
        >
          {isCollapsed ? <FaBars size={12} /> : <FaTimes size={12} />}
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {adminMenuItems.map((item, idx) => (
              <Link key={idx} href={item.link}>
                <div 
                  onClick={handleLinkClick}
                  className={`
                    flex items-center rounded-lg cursor-pointer transition-all duration-200 
                    hover:bg-gray-700 hover:text-white text-gray-300 group relative
                    ${isCollapsed ? 'justify-center p-3' : 'p-3'}
                  `}
                >
                  <span className="text-lg relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium ml-3 flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          {/* User Info */}
          <div className={`flex items-center gap-3 mb-4 p-3 bg-gray-700 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-[#00A693] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {isAdmin ? 'A' : 'O'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userData?.fullName || (isAdmin ? 'Administrator' : 'Election Officer')}
                </p>
                <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center rounded-lg cursor-pointer transition-all duration-200 
              w-full text-gray-300 hover:bg-red-600 hover:text-white
              ${isCollapsed ? 'justify-center p-3' : 'p-3'}
            `}
          >
            <FaSignOutAlt className="text-lg" />
            {!isCollapsed && <span className="font-medium ml-3">Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}