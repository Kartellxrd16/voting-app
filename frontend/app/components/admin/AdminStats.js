'use client';

import { FaVoteYea, FaUsers, FaUserTie, FaChartBar, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminStats() {
  const { isAdmin } = useAdmin();

  const stats = [
    {
      title: 'Active Elections',
      value: '3',
      icon: <FaVoteYea className="text-blue-600 text-2xl" />,
      change: '+1',
      changeType: 'positive',
      description: 'Currently running'
    },
    {
      title: 'Total Candidates',
      value: '24',
      icon: <FaUserTie className="text-green-600 text-2xl" />,
      change: '+5',
      changeType: 'positive',
      description: 'Across all elections'
    },
    {
      title: 'Total Votes',
      value: '1,247',
      icon: <FaChartBar className="text-purple-600 text-2xl" />,
      change: '+89',
      changeType: 'positive',
      description: 'Cast so far'
    },
    {
      title: 'Registered Students',
      value: '2,458',
      icon: <FaUsers className="text-orange-600 text-2xl" />,
      change: '+23',
      changeType: 'positive',
      description: 'Eligible voters'
    },
    ...(isAdmin ? [{
      title: 'Pending Approvals',
      value: '7',
      icon: <FaClock className="text-yellow-600 text-2xl" />,
      change: '-2',
      changeType: 'negative',
      description: 'Require attention'
    }] : []),
    {
      title: 'Completed Elections',
      value: '12',
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
      change: '+3',
      changeType: 'positive',
      description: 'This semester'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">{stat.description}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}