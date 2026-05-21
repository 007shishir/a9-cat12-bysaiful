"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    /* Full-width section canvas with background grid accents */
    <section className="relative w-full bg-base-100 overflow-hidden py-12 sm:py-20 lg:py-28 transition-colors duration-300">
      
      {/* Modern Grid and Light Glow Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Structural Layout Area bounded by max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Layout Block: Typography & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Core Header */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content leading-[1.1] mb-6">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Study Room
              </span>
            </h1>

            {/* Core Description Text */}
            <p className="text-base sm:text-lg lg:text-xl text-base-content/70 leading-relaxed font-medium mb-10 max-w-xl">
              Browse and book quiet, private study rooms in your library. List your own room and earn.
            </p>

            {/* Premium Pill-shaped Action Button */}
            <Link 
              href="/rooms" 
              className="btn btn-primary btn-md sm:btn-lg px-10 normal-case text-base font-bold tracking-wide rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 group w-full sm:w-auto"
            >
              Explore Rooms
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

          </div>

          {/* Right Layout Block: Image Canvas */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end relative">
            
            {/* Ambient colorful backdrop shadow for the image frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-2xl opacity-20 transform scale-95 translate-x-4 translate-y-4" />
            
            {/* Modern Image Container Frame */}
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-base-content/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                alt="Modern quiet library study room setup"
                fill
                priority
                sizes="(max-w-1024px) 100vw, 450px"
                className="object-cover"
              />
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;