'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaKey, FaUser, FaPhoneAlt, FaUserPlus, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({});
  const router = useRouter();
  const { register, validatePassword, validateUBEmail } = useAuth();

  // Real-time password validation
  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    if (newPassword.length > 0) {
      setPasswordStrength(validatePassword(newPassword));
    } else {
      setPasswordStrength({});
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setNotification(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // UB Email validation
    if (!validateUBEmail(email)) {
      setError('Invalid UB email format. Must be: [9-digit-student-id]@ub.ac.bw or @student.ub.bw (e.g., 202207201@ub.ac.bw)');
      return;
    }

    // Strong password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(`Password must contain: ${passwordValidation.errors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      await register(fullName, email, password, phone);
      
      setNotification({ 
        type: 'success', 
        message: 'Registration successful! Verification email sent. Please check your inbox and verify your email before logging in.' 
      });
      
      setTimeout(() => {
        router.push('/verify-email');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden p-4">
      {/* Floating Bubbles Background */}
      <ul className="circles">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl"
      >
        <div className="flex justify-center mb-6">
          <Image 
            src="/studentvoice.png" 
            alt="Logo" 
            width={100} 
            height={100}
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-2">
          Student Registration
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          UB Student Voting System
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
              placeholder="Enter your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
              placeholder="e.g., 202207201@ub.ac.bw"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-gray-600 -mt-2">
            Format: 9-digit-student-id@ub.ac.bw (e.g., 202207201@ub.ac.bw)
          </p>

          {/* Phone */}
          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
              placeholder="Enter your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full py-3 pl-12 pr-12 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Password Strength Indicator */}
          {password && passwordStrength.requirements && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <div className="space-y-1">
                <PasswordRequirement met={passwordStrength.requirements.minLength} text="At least 8 characters" />
                <PasswordRequirement met={passwordStrength.requirements.hasUpperCase} text="One uppercase letter" />
                <PasswordRequirement met={passwordStrength.requirements.hasLowerCase} text="One lowercase letter" />
                <PasswordRequirement met={passwordStrength.requirements.hasNumbers} text="One number" />
                <PasswordRequirement met={passwordStrength.requirements.hasSpecialChar} text="One special character" />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full py-3 pl-12 pr-12 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <p className="text-red-700 text-sm font-medium text-center">{error}</p>
            </motion.div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00A693] text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#008876] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            <FaUserPlus className="text-lg" /> 
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#00A693] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 px-4 md:px-6 py-3 rounded-lg shadow-xl text-base md:text-lg font-semibold z-50 mx-4 ${
              notification.type === 'success' ? 'bg-[#00A693] text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubbles CSS */}
      <style jsx>{`
        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .circles li {
          position: absolute;
          display: block;
          list-style: none;
          width: 20px;
          height: 20px;
          background: rgba(0, 166, 147, 0.2);
          animation: animate 25s linear infinite;
          bottom: -150px;
        }

        .circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
        .circles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
        .circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
        .circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
        .circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
        .circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
        .circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
        .circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
        .circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
        .circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }

        @keyframes animate {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
          100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
        }
      `}</style>
    </div>
  );
}