'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { resetPassword, validateUBEmail } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setNotification(null);
    setLoading(true);

    // Validate UB email
    if (!validateUBEmail(email)) {
      setError('Please enter your valid UB email address (e.g., 202207201@ub.ac.bw)');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setEmailSent(true);
      setNotification({ 
        type: 'success', 
        message: 'Password reset email sent! Check your inbox for instructions.' 
      });
    } catch (error) {
      console.error('Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden p-4">
      {/* Floating Bubbles Background */}
      <ul className="circles">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      {/* Forgot Password Card */}
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

        {!emailSent ? (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Enter your UB email to receive reset instructions
            </p>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#00A693] bg-white placeholder-gray-500 text-gray-900 font-medium"
                  placeholder="Your UB email (e.g., 202207201@ub.ac.bw)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00A693] text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#008876] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowLeft />
                Back to Login
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                We&apos;ve sent password reset instructions to:
              </p>
              <p className="font-semibold text-[#00A693] text-lg">{email}</p>
              <p className="text-sm text-gray-500">
                Follow the link in the email to reset your password.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-[#00A693] text-white font-medium rounded-lg hover:bg-[#008876] transition-colors"
              >
                Return to Login
              </button>
              
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-[#00A693] font-medium hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        )}

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
      </motion.div>

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