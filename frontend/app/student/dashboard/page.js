'use client';
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SideNav from "../../components/student/SideNav";
import NavbarDashboard from "../../components/student/NavbarDashboard";
import DashboardContent from "../../components/student/DashboardContent";

export default function DashboardLayout() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <SideNav />
      </div>
      
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-64 right-0 z-30">
        <NavbarDashboard />
      </div>
      
      {/* Main Content - Adjusted for fixed sidebar and navbar */}
      <main className="ml-64 mt-14 md:mt-16 p-3 md:p-4 lg:p-6 min-h-screen">
        <DashboardContent />
      </main>
    </div>
  );
}