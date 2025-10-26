"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative text-white py-24 md:py-32 flex flex-col items-center justify-center text-center px-6 lg:px-0 pt-32 animate-fadeIn bg-gradient-to-br from-[#006666] via-[#1f7a7a] to-[#3a7bd5]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Your Voice. Your Vote. <br className="hidden sm:inline" /> Our Future.
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 opacity-90">
          A secure, transparent, and accessible online voting platform for your community.
        </p>
        <Link
          href="/auth/register"
          className="px-8 py-4 bg-white text-[#006666] rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
        >
          Get Started Today
        </Link>
      </div>
    </section>
  );
}