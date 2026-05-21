"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeInspiration() {
  const [activeUsersCount, setActiveUsersCount] = useState(142);

  // Subtle real-time simulation to make the platform feel alive and inspire action
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const microTestimonials = [
    { text: "Locked in an A on my Chemistry final after pulling an all-fresher in Room 4B!", user: "Sarah K.", role: "Pre-Med Student" },
    { text: "The dual-monitor setup in the focus cells saved our group hackathon project.", user: "Alex M.", role: "CS Major" },
  ];

  return (
    <section className="w-full bg-base-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Inspirational Copy & Call To Action */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {activeUsersCount} Students Productively Focused Right Now
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-base-content">
              Your Next Big Breakthrough <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Starts With Total Focus.
              </span>
            </h2>

            <p className="text-base text-base-content/60 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop fighting for open tables or dealing with noisy coffee shops. Secure your own premium, distraction-free study cell or collaborative meeting layout designed precisely to accelerate your GPA.
            </p>

            {/* Quick-action navigational triggers */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                href="/rooms" 
                className="btn btn-primary btn-md rounded-xl font-bold normal-case px-8 shadow-lg shadow-primary/25 w-full sm:w-auto text-base"
              >
                Claim Your Study Space
              </Link>
              <Link 
                href="/my-bookings" 
                className="btn btn-ghost btn-md rounded-xl font-bold normal-case px-6 border border-base-content/10 w-full sm:w-auto"
              >
                Track My Progress
              </Link>
            </div>

            {/* Micro-Testimonial Carousel Ticker */}
            <div className="pt-6 border-t border-base-content/10 hidden sm:block">
              <p className="text-xs uppercase tracking-wider font-bold text-base-content/40 mb-3">Community Wins</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {microTestimonials.map((item, index) => (
                  <div key={index} className="bg-base-200/50 p-3.5 rounded-xl border border-base-content/5 space-y-2 text-left">
                    <p className="text-xs font-medium text-base-content/80 italic">"{item.text}"</p>
                    <div className="text-[11px] font-bold text-base-content/50">
                      — {item.user} <span className="font-medium text-primary">({item.role})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Inspiration Layout Grid */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4 items-center">
              
              {/* Main Visual Anchor Image */}
              <div className="col-span-7 relative aspect-[4/5] bg-base-200 rounded-3xl overflow-hidden shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" 
                  alt="Students collaborating productively"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <span className="absolute bottom-4 left-4 badge bg-white/20 backdrop-blur-md text-white border-none font-bold text-xs py-2 px-3 rounded-lg">
                  Collaborative Suite 2A
                </span>
              </div>

              {/* Stacked secondary image column */}
              <div className="col-span-5 space-y-4">
                <div className="relative aspect-square bg-base-200 rounded-2xl overflow-hidden shadow-md transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80" 
                    alt="Quiet focus room setup"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                {/* Floating Metrics Counter Card */}
                <div className="bg-secondary text-secondary-content p-4 rounded-2xl shadow-lg transform -translate-x-6 relative z-10 space-y-1 text-center sm:text-left">
                  <span className="text-3xl font-black block tracking-tight">98.4%</span>
                  <span className="text-[11px] font-black uppercase tracking-wider opacity-80 block leading-tight">
                    Satisfaction & Focus Rating
                  </span>
                </div>

                <div className="relative aspect-[3/4] bg-base-200 rounded-2xl overflow-hidden shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80" 
                    alt="Brainstorming session"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}