'use client';
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SideNav from "../components/SideNav";
import NavbarDashboard from "../components/NavbarDashboard";
import DashboardContent from "../components/DashboardContent";

export default function DashboardLayout() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <NavbarDashboard />
        <DashboardContent />
      </div>
    </div>
  );
}