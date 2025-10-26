'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // loading, success, error, pending
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerificationEmail, currentUser } = useAuth();

  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');

  useEffect(() => {
    // Handle email verification from link
    if (mode === 'verifyEmail' && actionCode) {
      handleEmailVerification();
    } else {
      setStatus('pending');
      setMessage('Please check your email for the verification link.');
    }
  }, [mode, actionCode]);

  const handleEmailVerification = async () => {
    try {
      setStatus('loading');
      const result = await verifyEmail(actionCode);
      setStatus('success');
      setMessage('Email verified successfully! You can now login.');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed.');
    }
  };

  const handleResendVerification = async () => {
    try {
      setResending(true);
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <FaSpinner className="animate-spin text-blue-500 text-4xl" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500 text-4xl" />;
      default:
        return <FaEnvelope className="text-[#00A693] text-4xl" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl text-center"
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

        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
          {status === 'pending' && 'Check Your Email'}
        </h2>
        
        <p className={`text-sm md:text-base mb-6 ${getStatusColor()}`}>
          {message}
        </p>

        {status === 'pending' && (
          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full py-3 bg-[#00A693] text-white font-medium rounded-lg hover:bg-[#008876] transition-colors disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-[#00A693] text-white font-medium rounded-lg hover:bg-[#008876] transition-colors"
          >
            Continue to Login
          </button>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full py-3 bg-[#00A693] text-white font-medium rounded-lg hover:bg-[#008876] transition-colors disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
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