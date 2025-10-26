'use client';


import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSideNav from '../components/admin/AdminSideNav';
import { AdminProvider } from '../contexts/AdminContext';


export default function AdminLayout({ children }) {
  const { currentUser, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not admin/officer
    if (currentUser && userData?.role !== 'admin' && userData?.role !== 'officer') {
      router.push('/student');
    }
  }, [currentUser, userData, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (userData?.role !== 'admin' && userData?.role !== 'officer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">Access Denied</div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSideNav />
        <div className="flex-1 flex flex-col md:ml-0">
          <AdminNavbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}