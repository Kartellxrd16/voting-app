'use client';

import { FaVoteYea, FaFileAlt, FaPoll, FaUsers, FaCheckCircle, FaEnvelope, FaUserTie, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
  const { userData, currentUser, resendVerificationEmail } = useAuth();
  const router = useRouter();

  const stats = [
    { title: 'Active Elections', value: 3, icon: <FaVoteYea className="text-blue-600 text-xl md:text-2xl lg:text-3xl" />, color: 'blue' },
    { title: 'Petitions Signed', value: 5, icon: <FaFileAlt className="text-green-600 text-xl md:text-2xl lg:text-3xl" />, color: 'green' },
    { title: 'My Votes', value: 2, icon: <FaPoll className="text-purple-600 text-xl md:text-2xl lg:text-3xl" />, color: 'purple' },
    { title: 'Total Voters', value: '1.2K', icon: <FaUsers className="text-orange-600 text-xl md:text-2xl lg:text-3xl" />, color: 'orange' },
  ];

  const recentActivities = [
    { action: 'Voted for SRC President', time: '2 hours ago', status: 'completed' },
    { action: 'Signed Library Petition', time: '1 day ago', status: 'completed' },
    { action: 'Updated Profile', time: '2 days ago', status: 'completed' },
  ];

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      alert('Failed to send verification email. Please try again.');
    }
  };

  const handleApplyCandidate = () => {
    if (!currentUser?.emailVerified) {
      alert('Please verify your email first to apply as a candidate.');
      return;
    }
    router.push('/student/apply-candidate');
  };

  return (
    <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Email Verification Banner */}
      {currentUser && !currentUser.emailVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <FaEnvelope className="text-yellow-600 text-lg md:text-xl flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 text-sm md:text-base">Verify Your Email</h3>
                <p className="text-yellow-700 text-xs md:text-sm">
                  Please verify your email to participate in elections and apply as candidate.
                </p>
              </div>
            </div>
            <button
              onClick={handleResendVerification}
              className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 text-xs md:text-sm font-medium w-full sm:w-auto"
            >
              Resend Email
            </button>
          </div>
        </div>
      )}

      {/* Email Verified Banner */}
      {currentUser && currentUser.emailVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <FaCheckCircle className="text-green-600 text-lg md:text-xl flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 text-sm md:text-base">Email Verified</h3>
              <p className="text-green-700 text-xs md:text-sm">
                Your email is verified and you can participate in all elections and apply as candidate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section with Apply CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
              Welcome back, {userData?.fullName || 'Student'}! 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Ready to make your voice heard in student elections. Lead the change!
            </p>
          </div>
          <button
            onClick={handleApplyCandidate}
            disabled={!currentUser?.emailVerified}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 ${
              currentUser?.emailVerified
                ? 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 cursor-pointer shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaUserTie className="text-lg" />
            Apply to be Candidate
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-4 lg:p-6 flex items-center gap-2 md:gap-3 lg:gap-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}-50`}>
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 truncate">{stat.title}</h3>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <button 
              className={`py-2 md:py-3 px-3 md:px-4 rounded-lg text-center font-medium text-xs md:text-sm transition-colors ${
                currentUser?.emailVerified
                  ? 'bg-[#00A693] text-white hover:bg-[#008876] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!currentUser?.emailVerified}
            >
              View Elections
            </button>
            <button 
              className={`py-2 md:py-3 px-3 md:px-4 rounded-lg text-center font-medium text-xs md:text-sm transition-colors ${
                currentUser?.emailVerified
                  ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!currentUser?.emailVerified}
            >
              Cast Vote
            </button>
            
            {/* Apply Candidate Button in Quick Actions too */}
            <button 
              onClick={handleApplyCandidate}
              disabled={!currentUser?.emailVerified}
              className={`flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                currentUser?.emailVerified
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaUserTie className="text-sm" />
              Apply as Candidate
            </button>
            
            <button 
              className="py-2 md:py-3 px-3 md:px-4 rounded-lg text-center font-medium text-xs md:text-sm bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Recent Activity</h2>
          <div className="space-y-2 md:space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <FaCheckCircle className="text-green-500 flex-shrink-0 text-sm md:text-base" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
            
            {/* Candidate Application Status (if applied) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <FaUserTie className="text-blue-500 flex-shrink-0 text-sm md:text-base" />
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-blue-800">
                    Ready to lead? Apply as a candidate today!
                  </p>
                  <p className="text-xs text-blue-600">
                    Make a difference in student governance
                  </p>
                </div>
                <button
                  onClick={handleApplyCandidate}
                  disabled={!currentUser?.emailVerified}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    currentUser?.emailVerified
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-4 lg:p-6 mt-4 md:mt-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Your Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Student ID</p>
            <p className="font-bold text-gray-900 text-sm md:text-base lg:text-lg">{userData?.studentId || 'Not set'}</p>
          </div>
          <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Email Status</p>
            <p className={`font-bold text-sm md:text-base lg:text-lg flex items-center justify-center gap-1 ${
              currentUser?.emailVerified ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {currentUser?.emailVerified ? <FaCheckCircle className="text-sm" /> : '⏳'}
              <span className="text-xs md:text-sm">{currentUser?.emailVerified ? 'Verified' : 'Pending'}</span>
            </p>
          </div>
          <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Voting Status</p>
            <p className={`font-bold text-sm md:text-base lg:text-lg ${
              userData?.hasVoted ? 'text-green-600' : 'text-blue-600'
            }`}>
              {userData?.hasVoted ? 'Voted' : 'Ready'}
            </p>
          </div>
          <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Candidate Status</p>
            <p className="font-bold text-blue-600 text-sm md:text-base lg:text-lg flex items-center justify-center gap-1">
              <FaUserTie className="text-sm" />
              <span>Apply Now</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}