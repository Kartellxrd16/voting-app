"use client";

import { useState } from 'react';
import Image from 'next/image'; // Import the Image component
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="#" className="flex items-center text-xl md:text-2xl font-bold text-[#006666]">
                    <Image
                        src="/studentvoice.png"
                        alt="SecureVote Logo"
                        width={60}
                        height={60}
                        className="h-8 md:h-10 w-auto" // Adjusted for responsive scaling
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="text-gray-600 hover:text-[#006666] transition-colors duration-300">Features</Link>
                    <Link href="#how-it-works" className="text-gray-600 hover:text-[#006666] transition-colors duration-300">How It Works</Link>
                    <Link href="#contact" className="text-gray-600 hover:text-[#006666] transition-colors duration-300">Contact</Link>
                    <Link href="/login" className="px-6 py-2 bg-[#006666] text-white rounded-full font-semibold hover:bg-[#005555] transition-colors duration-300 shadow-lg">Login</Link>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-[#006666] focus:outline-none">
                        <Menu size={28} />
                    </button>
                </div>
            </nav>
            
            {/* Mobile Menu (Hidden by default) */}
            <div className={`md:hidden bg-white shadow-lg py-4 ${isMobileMenuOpen ? '' : 'hidden'}`}>
                <Link onClick={toggleMobileMenu} href="#features" className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Features</Link>
                <Link onClick={toggleMobileMenu} href="#how-it-works" className="block px-6 py-2 text-gray-800 hover:bg-gray-100">How It Works</Link>
                <Link onClick={toggleMobileMenu} href="#contact" className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Contact</Link>
                <Link onClick={toggleMobileMenu} href="#" className="block px-6 py-2 mt-2 mx-6 bg-[#006666] text-white text-center rounded-full font-semibold hover:bg-[#005555]">Login</Link>
            </div>
        </header>
    );
}
