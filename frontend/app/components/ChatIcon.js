"use client";

import { useState, useEffect } from 'react';

const ChatIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Make the chat icon appear with a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const contactInfo = {
    phone: '+267 123 4567',
    email: 'info@btu.org.bw',
    hours: 'Mon-Fri 8AM-5PM CAT'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Chat Bubble */}
      {!isOpen && (
        <div 
          className="flex items-center gap-2 bg-white px-4 py-3 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
          onClick={toggleChat}
        >
          <span className="font-medium text-sm text-gray-700">Need help?</span>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      )}

      {/* Contact Information Panel */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-72 bg-teal rounded-lg shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Contact Us</h3>
            <button 
              className="text-gray-400 hover:text-gray-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
              onClick={toggleChat}
              aria-label="Close contact panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{contactInfo.phone}</p>
                <a 
                  href={`tel:${contactInfo.phone}`} 
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  Call now
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{contactInfo.email}</p>
                <a 
                  href={`mailto:${contactInfo.email}?subject=Inquiry`} 
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  Send email
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{contactInfo.hours}</p>
                <span className="text-xs text-green-600 mt-1 inline-block flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Available now
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatIcon;