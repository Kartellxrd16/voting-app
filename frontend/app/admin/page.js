'use client';

import { useAdmin } from '../contexts/AdminContext';
import AdminStats from '../components/admin/AdminStats';
import RealTimeStats from '../components/admin/RealTimeStats';

export default function AdminDashboard() {
  const { isAdmin, isOfficer } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {isAdmin ? 'Admin Dashboard' : 'Election Officer Dashboard'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isAdmin 
            ? 'Manage elections, candidates, and system settings' 
            : 'Monitor election progress and voting statistics'
          }
        </p>
      </div>

      {/* Statistics Cards */}
      <AdminStats />

      {/* Real-time Statistics */}
      <RealTimeStats />

      {/* Quick Actions for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#00A693]">
            <div className="text-3xl mb-3 text-[#00A693]">📊</div>
            <h3 className="font-semibold text-gray-800">Create Election</h3>
            <p className="text-sm text-gray-600 mt-1">Start new voting process</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#00A693]">
            <div className="text-3xl mb-3 text-[#00A693]">👥</div>
            <h3 className="font-semibold text-gray-800">Manage Candidates</h3>
            <p className="text-sm text-gray-600 mt-1">Add/Edit candidates</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#00A693]">
            <div className="text-3xl mb-3 text-[#00A693]">📈</div>
            <h3 className="font-semibold text-gray-800">View Results</h3>
            <p className="text-sm text-gray-600 mt-1">Election analytics</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#00A693]">
            <div className="text-3xl mb-3 text-[#00A693]">⚙️</div>
            <h3 className="font-semibold text-gray-800">System Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Configure system</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'New election "SRC Elections 2024" created', time: '2 hours ago', user: 'Admin' },
            { action: 'Candidate John Doe added to SRC President', time: '1 hour ago', user: 'Admin' },
            { action: 'User registration: 202207201@ub.ac.bw', time: '30 minutes ago', user: 'System' },
            { action: 'Election "Faculty Rep" started', time: '15 minutes ago', user: 'Admin' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-[#00A693] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <span className="text-gray-300">•</span>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}