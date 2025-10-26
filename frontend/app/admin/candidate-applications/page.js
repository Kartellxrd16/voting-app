
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaSearch, FaCheck, FaTimes, FaEye, FaClock, FaUserTie } from 'react-icons/fa';

export default function CandidateApplications() {
  const { userData } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userData?.role !== 'admin' && userData?.role !== 'officer') {
      router.push('/admin');
      return;
    }
    fetchApplications();
  }, [userData, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/candidate-applications');
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, rejectionReason = '') => {
    try {
      const response = await fetch(`http://localhost:8000/api/candidate-applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          reviewed_by: userData?.fullName || 'Admin',
          rejection_reason: rejectionReason
        })
      });

      if (response.ok) {
        // Refresh applications
        fetchApplications();
        setSelectedApplication(null);
        alert(`Application ${status} successfully!`);
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.party_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'approved': return <FaCheck className="text-green-600" />;
      case 'rejected': return <FaTimes className="text-red-600" />;
      default: return <FaUserTie className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Candidate Applications</h1>
          <p className="text-gray-600">Review and manage student candidate applications</p>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { key: 'pending', label: 'Pending', count: applications.filter(app => app.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: applications.filter(app => app.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length },
                { key: 'all', label: 'All', count: applications.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.key ? 'bg-gray-100' : 'bg-white'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaUserTie className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || activeTab !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'No candidate applications submitted yet'
                }
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUserTie className="text-blue-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{application.student_name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Position:</span>
                            <p>{application.position}</p>
                          </div>
                          <div>
                            <span className="font-medium">Party:</span>
                            <p>{application.party_name}</p>
                          </div>
                          <div>
                            <span className="font-medium">Applied:</span>
                            <p>{new Date(application.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {application.campaign_promise && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Campaign Promise:</span>
                            <p className="text-sm text-gray-600 line-clamp-1">{application.campaign_promise}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaCheck className="text-sm" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide a reason for rejection:');
                            if (reason) {
                              updateApplicationStatus(application.id, 'rejected', reason);
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-sm" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Student Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedApplication.student_name}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Student ID</label>
                        <p className="text-gray-900">{selectedApplication.student_id}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Year of Study</label>
                        <p className="text-gray-900">{selectedApplication.year_of_study}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Application Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="font-medium text-gray-700">Position</label>
                        <p className="text-gray-900">{selectedApplication.position}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Party</label>
                        <p className="text-gray-900">{selectedApplication.party_name}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Status</label>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusIcon(selectedApplication.status)}
                          {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">Applied On</label>
                        <p className="text-gray-900">{new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Manifesto */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Manifesto</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedApplication.manifesto}</p>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Qualifications & Experience</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedApplication.qualifications}</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Achievements</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedApplication.achievements}</p>
                    </div>
                  </div>

                  {/* Campaign Promise */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Campaign Promise</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedApplication.campaign_promise}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApplication.status === 'pending' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'approved');
                        setSelectedApplication(null);
                      }}
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) {
                          updateApplicationStatus(selectedApplication.id, 'rejected', reason);
                          setSelectedApplication(null);
                        }
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}