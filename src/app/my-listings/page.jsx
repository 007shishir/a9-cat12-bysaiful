"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../../lib/auth-client';


const MyListingsPage = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. Fetch live session states from Better-Auth client
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // 2. Direct client-side route guard safety sequence
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login to access your space dashboard.");
      router.push('/login?callbackUrl=/my-listings');
    }
  }, [user, isPending, router]);

  // 3. Fetch listings data filtered by current user.id
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user?.id) return;
      
      try {
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/my-listings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id // Send active owner reference safely down to server query execution
          },
          credentials: 'include'
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to parse listings data logs.");
        }

        setListings(result.data || []);
      } catch (error) {
        toast.error(error.message || "Could not retrieve your listings.");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (!isPending && user) {
      fetchUserListings();
    }
  }, [user, isPending]);

  // Handle application loading shell transitions
  if (isPending || isDataLoading) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-sm font-medium text-base-content/50 animate-pulse">
          Synchronizing space catalog metrics...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="w-full bg-base-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-base-content/10 pb-6 mb-10 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-black text-base-content tracking-tight mb-2">
              My Room Listings
            </h1>
            <p className="text-sm text-base-content/60 font-medium">
              Manage and track the performance data metrics of study spaces you host.
            </p>
          </div>
          <Link href="/add-room" className="btn btn-primary rounded-xl font-bold normal-case shadow-md">
            + Add New Room
          </Link>
        </div>

        {/* Empty Catalog State Area */}
        {listings.length === 0 ? (
          <div className="w-full bg-base-200/40 border border-dashed border-base-content/20 rounded-3xl p-12 text-center max-w-xl mx-auto mt-10">
            <h3 className="text-xl font-bold text-base-content mb-2">No listings registered yet</h3>
            <p className="text-sm text-base-content/60 font-medium mb-6">
              You haven't published any quiet library study cells under this profile identity.
            </p>
            <Link href="/add-room" className="btn btn-primary btn-sm rounded-lg font-bold normal-case">
              Create First Listing
            </Link>
          </div>
        ) : (
          /* Responsive Layout Flex Grid System: 3 columns desktop, 2 tablet, 1 mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((room) => {
              const maxChips = 3;
              const hasMoreChips = room.amenities?.length > maxChips;
              const runningChips = room.amenities?.slice(0, maxChips) || [];

              return (
                <div 
                  key={room._id} 
                  className="card card-compact bg-base-100 border border-base-content/10 shadow-md hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full"
                >
                  
                  {/* Uniformly Sized Room Image Frame Container */}
                  <div className="relative w-full aspect-[16/10] bg-base-300 overflow-hidden">
                    <Image 
                      src={room.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"}
                      alt={room.name}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {/* Badge Overlay */}
                    <div className="absolute top-4 right-4 badge badge-neutral font-bold rounded-lg px-3 py-2 text-xs">
                      {room.floor}
                    </div>
                  </div>

                  {/* Card Main Interactive Workspace Content */}
                  <div className="card-body p-5 flex flex-col flex-grow justify-between">
                    
                    <div>
                      {/* Name Header */}
                      <h2 className="card-title font-black text-xl text-base-content tracking-tight line-clamp-1 mb-1">
                        {room.name}
                      </h2>

                      {/* Explicit Room Capacity Information Subtitle */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-base-content/50 font-bold uppercase tracking-wider">
                        <span>Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                      </div>

                      {/* Truncated Short Description Area */}
                      <p className="text-sm font-medium text-base-content/70 leading-relaxed mb-4 line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    <div>
                      {/* Dynamic Amenities Chips Row Container Layout */}
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

                      {/* Pricing Tag and Details Redirect Button Controls */}
                      <div className="flex items-center justify-between border-t border-base-content/5 pt-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider">Hourly Cost</span>
                          <span className="text-xl font-black text-primary">${room.hourlyRate}<span className="text-xs font-medium text-base-content/60">/hr</span></span>
                        </div>
                        <Link 
                          href={`/rooms/${room._id}`}
                          className="btn btn-outline btn-primary btn-sm rounded-xl font-bold normal-case px-4"
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
        )}

      </div>
    </section>
  );
};

export default MyListingsPage;