'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,onAuthStateChanged,sendPasswordResetEmail,updateProfile,sendEmailVerification,applyActionCode,checkActionCode} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, writeBatch, increment } from 'firebase/firestore';

const AuthContext = createContext();

// Rate limiting with expiration
let loginAttempts = {};
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo accounts - only for admin/officer
  const demoAccounts = {
    'admin@ub.ac.bw': {
      password: 'admin123',
      userData: {
        uid: 'demo-admin-001',
        email: 'admin@ub.ac.bw',
        fullName: 'System Administrator',
        role: 'admin',
        studentId: '202400001',
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        isDemo: true
      }
    },
    'officer@ub.ac.bw': {
      password: 'officer123', 
      userData: {
        uid: 'demo-officer-001',
        email: 'officer@ub.ac.bw',
        fullName: 'Election Officer',
        role: 'officer',
        studentId: '202400002',
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        isDemo: true
      }
    }
  };

  // Strong Password Validation
  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const errors = [];
    if (!requirements.minLength) errors.push('at least 8 characters');
    if (!requirements.hasUpperCase) errors.push('one uppercase letter');
    if (!requirements.hasLowerCase) errors.push('one lowercase letter');
    if (!requirements.hasNumbers) errors.push('one number');
    if (!requirements.hasSpecialChar) errors.push('one special character');

    return {
      isValid: Object.values(requirements).every(Boolean),
      errors,
      requirements
    };
  };

  // Strict UB Email validation
  const validateUBEmail = (email) => {
    const ubDomains = ['@ub.ac.bw', '@student.ub.bw'];
    const isValidDomain = ubDomains.some(domain => email.toLowerCase().endsWith(domain));
    
    if (!isValidDomain) {
      return false;
    }

    // Extract potential student ID from email (part before @)
    const emailPrefix = email.toLowerCase().split('@')[0];
    
    // Validate format: should start with year (2020-2025) and be 9 digits total
    const studentIdRegex = /^(202[0-5]\d{5})$/;
    return studentIdRegex.test(emailPrefix);
  };

  // Extract student ID from email
  const extractStudentIdFromEmail = (email) => {
    return email.toLowerCase().split('@')[0];
  };

  // Check duplicate student ID
  async function checkDuplicateStudentId(studentId) {
    const q = query(collection(db, 'users'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Check duplicate email
  async function checkDuplicateEmail(email) {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Clean expired login attempts
  const cleanExpiredAttempts = () => {
    const now = Date.now();
    Object.keys(loginAttempts).forEach(key => {
      if (now - loginAttempts[key].lastAttempt > LOCKOUT_TIME) {
        delete loginAttempts[key];
      }
    });
  };

  // Secure registration with email verification
  async function register(fullName, email, password, phone) {
    // Validate UB email format
    if (!validateUBEmail(email)) {
      throw new Error('Invalid UB email format. Must be: [9-digit-student-id]@ub.ac.bw or @student.ub.bw (e.g., 202207201@ub.ac.bw)');
    }

    // Validate strong password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password must contain: ${passwordValidation.errors.join(', ')}`);
    }

    // Extract and validate student ID from email
    const studentId = extractStudentIdFromEmail(email);

    // Check duplicate student ID
    const isDuplicateId = await checkDuplicateStudentId(studentId);
    if (isDuplicateId) {
      throw new Error('This Student ID is already registered');
    }

    // Check duplicate email
    const isDuplicateEmail = await checkDuplicateEmail(email);
    if (isDuplicateEmail) {
      throw new Error('This email is already registered');
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName: fullName });

    // Send email verification - Let Firebase handle the email template
    await sendEmailVerification(user);

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      studentId,
      email: email.toLowerCase(),
      phone,
      fullName,
      role: 'student',
      createdAt: new Date(),
      emailVerified: false,
      isActive: true,
      hasVoted: false,
      votedElections: [],
      lastLogin: null,
      loginCount: 0
    });

    return userCredential;
  }

  // Verify email action
  async function verifyEmail(actionCode) {
    try {
      // Check the action code
      const info = await checkActionCode(auth, actionCode);
      
      // Apply the email verification
      await applyActionCode(auth, actionCode);
      
      // Update user's email verified status in Firestore
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          emailVerified: true
        }, { merge: true });
      }
      
      return { success: true, email: info.data.email };
    } catch (error) {
      throw new Error('Email verification failed. The link may be expired or invalid.');
    }
  }

  // Resend verification email
  async function resendVerificationEmail() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in');
    }
  }

  // Secure login with rate limiting and email verification check
  async function login(email, password) {
    const now = Date.now();
    const attemptKey = email.toLowerCase();
    
    // Clean expired attempts first
    cleanExpiredAttempts();
    
    // Rate limiting check
    if (loginAttempts[attemptKey] && 
        loginAttempts[attemptKey].count >= MAX_LOGIN_ATTEMPTS) {
      throw new Error('Too many failed attempts. Account locked for 15 minutes.');
    }

    try {
      // Check if it's a demo account first
      const demoAccount = demoAccounts[email];
      if (demoAccount && demoAccount.password === password) {
        // Demo account login - set user data directly
        setCurrentUser(demoAccount.userData);
        setUserData(demoAccount.userData);
        
        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(demoAccount.userData));
        localStorage.setItem('userData', JSON.stringify(demoAccount.userData));
        
        // Reset attempts on success
        delete loginAttempts[attemptKey];
        
        return { user: demoAccount.userData };
      }

      // Regular Firebase login for students
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified - DON'T logout, just throw error
      if (!result.user.emailVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      // Reset attempts on success
      delete loginAttempts[attemptKey];
      
      // Update login stats
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date(),
        loginCount: increment(1)
      }, { merge: true });

      return result;
    } catch (error) {
      // Track failed attempts
      if (!loginAttempts[attemptKey]) {
        loginAttempts[attemptKey] = { count: 0, lastAttempt: now };
      }
      loginAttempts[attemptKey].count++;
      loginAttempts[attemptKey].lastAttempt = now;
      
      throw error;
    }
  }

  // Voting system
  async function castVote(electionId, candidateId) {
    if (!currentUser) throw new Error('Not authenticated');
    
    // Demo users cannot vote
    if (currentUser.isDemo) {
      throw new Error('Demo accounts cannot vote in elections');
    }
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    // Check if email is verified
    if (!userData.emailVerified) {
      throw new Error('Please verify your email before voting');
    }

    // Prevent multiple votes
    if (userData.votedElections && userData.votedElections.includes(electionId)) {
      throw new Error('You have already voted in this election');
    }

    // Record vote transaction
    const batch = writeBatch(db);
    
    batch.update(doc(db, 'users', currentUser.uid), {
      votedElections: [...(userData.votedElections || []), electionId],
      hasVoted: true
    });
    
    const voteRef = doc(collection(db, `elections/${electionId}/votes`));
    batch.set(voteRef, {
      voterId: currentUser.uid,
      studentId: userData.studentId,
      candidateId: candidateId,
      votedAt: new Date()
    });
    
    const candidateRef = doc(db, `elections/${electionId}/candidates`, candidateId);
    batch.update(candidateRef, {
      voteCount: increment(1),
      lastUpdated: new Date()
    });
    
    await batch.commit();
    return true;
  }

  // Check if user can vote in election
  async function canVote(electionId) {
    if (!currentUser) return false;
    
    // Demo users cannot vote
    if (currentUser.isDemo) {
      return false;
    }
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    return userData.emailVerified && 
           !(userData.votedElections && userData.votedElections.includes(electionId));
  }

  // Logout
  function logout() {
    setCurrentUser(null);
    setUserData(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
    return signOut(auth);
  }

  // Fetch user data
  async function fetchUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verify token validity
          await user.getIdToken(true);
          setCurrentUser(user);
          await fetchUserData(user.uid);
        } catch (error) {
          console.error('Auth token invalid:', error);
          await logout();
        }
      } else {
        // Check for demo user in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const demoUser = JSON.parse(storedUser);
          if (demoUser.isDemo) {
            setCurrentUser(demoUser);
            setUserData(demoUser);
          } else {
            setCurrentUser(null);
            setUserData(null);
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    resetPassword, 
    castVote,
    canVote,
    validatePassword,
    validateUBEmail,
    verifyEmail,
    resendVerificationEmail,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}