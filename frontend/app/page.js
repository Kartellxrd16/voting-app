"use client";

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { ShieldCheck, Fingerprint, HandHeart } from 'lucide-react';

export default function Home() {
    return (
        <div className="font-sans antialiased">
            <Navbar />
            <main>
                <Hero />
                
                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                            We&apos;re committed to revolutionizing the voting process with cutting-edge technology and a focus on integrity.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-l-4 border-[#006666] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#006666] text-white rounded-full mx-auto mb-6">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Unmatched Security</h3>
                                <p className="text-gray-600">
                                    Our platform uses advanced encryption and blockchain technology to ensure every vote is secure and immutable.
                                </p>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-l-4 border-[#006666] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#006666] text-white rounded-full mx-auto mb-6">
                                    <Fingerprint size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Full Transparency</h3>
                                <p className="text-gray-600">
                                    Every step of the voting process is verifiable, ensuring trust and confidence in the results.
                                </p>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-l-4 border-[#006666] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#006666] text-white rounded-full mx-auto mb-6">
                                    <HandHeart size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">User-Friendly Access</h3>
                                <p className="text-gray-600">
                                    Our intuitive interface makes it easy for anyone to cast their vote from any device, anywhere.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            How It Works
                        </h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                            A simple and straightforward process to ensure everyone can participate.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-[#006666]">1</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Register & Verify</h3>
                                <p className="text-gray-600">Sign up and verify your identity through our secure process.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-[#006666]">2</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Cast Your Vote</h3>
                                <p className="text-gray-600">Log in securely and cast your vote on any active election or petition.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-[#006666]">3</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">View Results</h3>
                                <p className="text-gray-600">Access real-time, tamper-proof election results and detailed analytics.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="bg-gray-800 text-white py-16 md:py-20 text-center" id="contact">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Make Your Vote Count?
                        </h2>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                            Join thousands of students and administrators who trust our platform for transparent and efficient elections.
                        </p>
                        <a href="#" className="px-8 py-4 bg-white text-[#006666] rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                            Sign Up for Free
                        </a>
                    </div>
                </section>
            </main>
            <Footer />

            <style jsx>{`
                .hero-bg {
                    background: linear-gradient(135deg, #006666 0%, #3a7bd5 100%);
                }
                .text-gradient {
                    background-image: linear-gradient(45deg, #006666, #005555);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
