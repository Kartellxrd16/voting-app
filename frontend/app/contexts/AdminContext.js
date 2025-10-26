'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const { currentUser, userData } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = userData?.role === 'admin';
  const isOfficer = userData?.role === 'officer' || userData?.role === 'admin';

  useEffect(() => {
    if (currentUser && (isAdmin || isOfficer)) {
      loadAdminData();
    }
  }, [currentUser, isAdmin, isOfficer]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      // Simulate API calls - replace with actual Firestore calls
      setTimeout(() => {
        setElections([
          { id: 1, title: 'SRC President 2024', status: 'active', votes: 1247, candidates: 4 },
          { id: 2, title: 'Faculty Representatives', status: 'active', votes: 893, candidates: 8 },
          { id: 3, title: 'Sports Committee', status: 'upcoming', votes: 0, candidates: 3 },
        ]);
        setCandidates(Array(24).fill().map((_, i) => ({ id: i + 1, name: `Candidate ${i + 1}` })));
        setUsers(Array(2458).fill().map((_, i) => ({ id: i + 1, status: i < 7 ? 'pending' : 'active' })));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const adminFunctions = {
    // Election Management
    createElection: async (electionData) => {
      console.log('Creating election:', electionData);
      return { success: true, id: Date.now() };
    },
    updateElection: async (electionId, updates) => {
      console.log('Updating election:', electionId, updates);
      return { success: true };
    },
    deleteElection: async (electionId) => {
      console.log('Deleting election:', electionId);
      return { success: true };
    },
    
    // Candidate Management
    addCandidate: async (candidateData) => {
      console.log('Adding candidate:', candidateData);
      return { success: true, id: Date.now() };
    },
    updateCandidate: async (candidateId, updates) => {
      console.log('Updating candidate:', candidateId, updates);
      return { success: true };
    },
    removeCandidate: async (candidateId) => {
      console.log('Removing candidate:', candidateId);
      return { success: true };
    },
    
    // User Management
    getUsers: async () => {
      return users;
    },
    updateUserRole: async (userId, newRole) => {
      console.log('Updating user role:', userId, newRole);
      return { success: true };
    },
    
    // Analytics
    getElectionStats: async (electionId) => {
      return { votes: 1247, turnout: '65%' };
    },
    getSystemStats: async () => {
      return { totalUsers: 2458, activeElections: 3, totalVotes: 2140 };
    }
  };

  const value = {
    isAdmin,
    isOfficer,
    adminData,
    elections,
    candidates,
    users,
    loading,
    ...adminFunctions
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}