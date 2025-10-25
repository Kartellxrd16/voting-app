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
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <NavbarDashboard />
      {/* Main content area - adjusted for fixed sidebar and navbar */}
      <main className="ml-64 mt-16 p-6 min-h-screen">
        <DashboardContent />
      </main>
    </div>
  );
}