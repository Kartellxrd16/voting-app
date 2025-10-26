'use client';

import { FaUsers, FaVoteYea, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function RealTimeStats() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate active users fluctuation
      setActiveUsers(Math.floor(Math.random() * 50) + 20);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const liveStats = [
    {
      title: 'Active Users',
      value: activeUsers,
      icon: <FaUsers className="text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Votes This Hour',
      value: '47',
      icon: <FaVoteYea className="text-green-500" />,
      color: 'green'
    },
    {
      title: 'Live Elections',
      value: '2',
      icon: <FaClock className="text-orange-500" />,
      color: 'orange'
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      icon: <FaCheckCircle className="text-purple-500" />,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Real-time Statistics</h2>
          <p className="text-gray-600 text-sm">
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStats.map((stat, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-1000`}
                  style={{ 
                    width: `${Math.min(100, (parseInt(stat.value) / (index === 0 ? 100 : 50)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Authentication Service</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Database</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Voting System</span>
          </div>
        </div>
      </div>
    </div>
  );
}