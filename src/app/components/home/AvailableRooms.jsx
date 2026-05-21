"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestRooms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home-rooms`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to parse available rooms.");
        }

        setRooms(result.data || []);
      } catch (error) {
        toast.error(error.message || "Could not retrieve featured rooms.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestRooms();
  }, []);

  // Skeleton Loading Grid matching identical card proportions
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-base-200 border border-base-content/5 h-[410px] rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full bg-base-200/40 border border-dashed border-base-content/20 rounded-3xl p-10 text-center max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-base-content mb-1">No featured rooms yet</h3>
        <p className="text-sm text-base-content/60 font-medium">
          Check back later as new quiet study spaces get listed!
        </p>
      </div>
    );
  }

  return (
    /* Flexible Card Grid Structure: 3 columns desktop, 2 columns tablet, 1 column mobile */
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">

      {rooms.map((room) => {
        const maxChips = 3;
        const hasMoreChips = room.amenities?.length > maxChips;
        const runningChips = room.amenities?.slice(0, maxChips) || [];

        return (
          <div 
            key={room._id} 
            className="card card-compact bg-base-100 border border-base-content/10 shadow-md hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full w-full"
          >

            {/* Uniform Size Aspect-Ratio Image Container Mask */}
            <div className="relative w-full aspect-[16/10] bg-base-300 overflow-hidden">
              <Image 
                src={room.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"}
                alt={room.name}
                fill
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Floor Badge Overlay Label */}
              <div className="absolute top-4 right-4 badge badge-neutral font-bold rounded-lg px-3 py-2 text-xs shadow-sm">
                {room.floor}
              </div>
            </div>

            {/* Main Interactive Card Content Wrapper */}
            <div className="card-body p-5 flex flex-col flex-grow justify-between">
              
              <div>
                {/* Room Name Heading */}
                <h3 className="card-title font-black text-xl text-base-content tracking-tight line-clamp-1 mb-1">
                  {room.name}
                </h3>

                {/* Seat Capacity Meta Subtitle */}
                <div className="flex items-center gap-2 mb-3 text-xs text-base-content/50 font-bold uppercase tracking-wider">
                  <span>Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                </div>

                {/* Truncated Short Description Text Block */}
                <p className="text-sm font-medium text-base-content/70 leading-relaxed mb-4 line-clamp-2">
                  {room.description}
                </p>
              </div>

              <div>
                {/* Amenities Chip Stream Array Container */}
                <div className="flex flex-wrap gap-1.5 mb-5 min-h-[26px]">
                  {runningChips.map((amenity, idx) => (
                    <span key={idx} className="badge badge-sm bg-base-200 border-none text-base-content/80 font-semibold rounded-md px-2 py-2.5">
                      {amenity}
                    </span>
                  ))}
                  {hasMoreChips && (
                    <span className="badge badge-sm badge-primary badge-outline font-bold rounded-md px-2 py-2.5">
                      +{room.amenities.length - maxChips} more
                    </span>
                  )}
                </div>

                {/* Pricing Tag Metrics and View Details Anchor Redirects */}
                <div className="flex items-center justify-between border-t border-base-content/5 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider">Hourly Cost</span>
                    <span className="text-xl font-black text-primary">
                      ${room.hourlyRate}<span className="text-xs font-medium text-base-content/60">/hr</span>
                    </span>
                  </div>
                  <Link 
                    href={`/rooms/${room._id}`}
                    className="btn btn-primary btn-sm rounded-xl font-bold normal-case px-5 shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default AvailableRooms;