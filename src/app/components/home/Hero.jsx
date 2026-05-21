"use client";

import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    /* Full-width section container matching the background footprint */
    <section className="w-full bg-base-200 py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      
      {/* Content wrapper bound by your maximum width rules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Exact Required Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight leading-tight mb-6">
            Find Your Perfect Study Room
          </h1>

          {/* Exact Required Description */}
          <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed mb-10 max-w-2xl">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>

          {/* Prominent Explore Rooms Button */}
          <Link 
            href="/rooms" 
            className="btn btn-primary btn-md sm:btn-lg px-8 normal-case text-base font-semibold tracking-wide shadow-md"
          >
            Explore Rooms
          </Link>

        </div>
      </div>
      
    </section>
  );
};

export default Hero;