'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ApplyCandidate() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    position: '',
    party: 'independent', // Default to independent
    manifesto: '',
    qualifications: '',
    achievements: '',
    campaignPromise: ''
  });
  const [loading, setLoading] = useState(false);

  const positions = [
    'SRC President',
    'SRC Vice President',
    'SRC Secretary',
    'SRC Treasurer',
    'Faculty Representative - Science',
    'Faculty Representative - Humanities',
    'Faculty Representative - Social Sciences',
    'Sports Committee Chair',
    'Cultural Committee Chair'
  ];

  const botswanaParties = [
    { value: 'independent', label: '🏛️ Independent Candidate' },
    { value: 'bdp', label: '🔵 Botswana Democratic Party (BDP)' },
    { value: 'udc', label: '🟡 Umbrella for Democratic Change (UDC)' },
    { value: 'bcp', label: '🟠 Botswana Congress Party (BCP)' },
    { value: 'ap', label: '🔴 Alliance for Progressives (AP)' },
    { value: 'bpf', label: '🟣 Botswana Patriotic Front (BPF)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const applicationData = {
        studentId: userData.studentId,
        studentName: userData.fullName,
        email: userData.email,
        position: formData.position,
        party: formData.party,
        partyName: botswanaParties.find(p => p.value === formData.party)?.label || 'Independent',
        manifesto: formData.manifesto,
        qualifications: formData.qualifications,
        achievements: formData.achievements,
        campaignPromise: formData.campaignPromise,
        status: 'pending',
        appliedAt: new Date(),
        yearOfStudy: userData.studentId.substring(0, 4),
        faculty: 'To be determined'
      };

      // Send to Python backend
      const response = await fetch('http://localhost:8000/api/candidate-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      // Show success message
      alert('Application submitted successfully! Admin will review your application.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to apply</h2>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-[#00A693] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008876] transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply as Candidate</h1>
          <p className="text-gray-600 mb-6 text-base">
            Submit your application to run in the student elections. Your application will be reviewed by the election committee.
          </p>

          {/* Student Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 text-lg mb-3">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium block mb-1">Name:</span>
                <p className="font-semibold text-gray-900 text-lg">{userData.fullName}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium block mb-1">Student ID:</span>
                <p className="font-semibold text-gray-900 text-lg">{userData.studentId}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium block mb-1">Email:</span>
                <p className="font-semibold text-gray-900 text-lg">{userData.email}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 font-medium block mb-1">Year of Study:</span>
                <p className="font-semibold text-gray-900 text-lg">20{userData.studentId.substring(2, 4)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Position Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Position Applying For *
              </label>
              <select
                required
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium placeholder-gray-500"
              >
                <option value="" className="text-gray-500">Select a position</option>
                {positions.map((position) => (
                  <option key={position} value={position} className="text-gray-900">{position}</option>
                ))}
              </select>
            </div>

            {/* Party Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Political Affiliation *
              </label>
              <select
                required
                value={formData.party}
                onChange={(e) => setFormData({...formData, party: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium"
              >
                {botswanaParties.map((party) => (
                  <option key={party.value} value={party.value} className="text-gray-900">
                    {party.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {formData.party === 'independent' 
                  ? 'You will run as an independent candidate without party affiliation.'
                  : `You will represent ${botswanaParties.find(p => p.value === formData.party)?.label}.`
                }
              </p>
            </div>

            {/* Manifesto */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Manifesto *
              </label>
              <textarea
                required
                rows={4}
                value={formData.manifesto}
                onChange={(e) => setFormData({...formData, manifesto: e.target.value})}
                placeholder="Describe your vision and what you plan to achieve..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium placeholder-gray-500 resize-vertical"
              />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Qualifications & Experience
              </label>
              <textarea
                rows={3}
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                placeholder="Relevant experience, skills, previous leadership roles..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium placeholder-gray-500 resize-vertical"
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Academic & Extracurricular Achievements
              </label>
              <textarea
                rows={3}
                value={formData.achievements}
                onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                placeholder="Notable achievements, awards, projects..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium placeholder-gray-500 resize-vertical"
              />
            </div>

            {/* Campaign Promise */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Key Campaign Promise
              </label>
              <input
                type="text"
                value={formData.campaignPromise}
                onChange={(e) => setFormData({...formData, campaignPromise: e.target.value})}
                placeholder="One key promise you want to focus on..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:border-transparent bg-white text-gray-900 font-medium placeholder-gray-500"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#00A693] bg-gray-100 border-gray-300 rounded focus:ring-[#00A693] focus:ring-2"
              />
              <label className="text-sm text-gray-700 font-medium">
                I agree to abide by the election rules and conduct myself with integrity. 
                I understand that providing false information may lead to disqualification.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00A693] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#008876] disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-md"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}