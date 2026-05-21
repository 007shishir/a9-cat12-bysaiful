"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../../lib/auth-client';




export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [targetBooking, setTargetBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userId = user?.id; 

  // Combined tracking effect: Handles route protection and loop-free data fetching
  useEffect(() => {
    // 1. Handle auth route redirection protection
    if (!isPending && !user) {
      toast.error("Please login to view your secured session slots.");
      router.push('/login?callbackUrl=/my-bookings');
      return;
    }

    // 2. Fetch bookings directly inside the effect to prevent render loops
    const fetchUserBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/my-bookings`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'x-user-id': userId 
          }
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        
        setBookings(result.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(err.message || "Could not retrieve booking details.");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (!isPending && userId) {
      fetchUserBookings();
    }
  }, [userId, isPending, user, router]); // Clean primitives array ensures no cyclical multi-triggers

  const handleConfirmCancellation = async () => {
    if (!targetBooking || !userId) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${targetBooking._id}/cancel`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json', 
          'x-user-id': userId 
        }
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message || "Cancellation rejected.");

      toast.success("Booking cancelled");
      setShowCancelModal(false);
      setTargetBooking(null);
      
      // Safe state refresh after action completes
      setIsDataLoading(true);
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/my-bookings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId }
      });
      const refreshResult = await refreshRes.json();
      if (refreshRes.ok) setBookings(refreshResult.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsActionLoading(false);
      setIsDataLoading(false);
    }
  };

  const isEligibleToCancel = (booking) => {
    if (booking.status === 'cancelled') return false;
    const startTimeStamp = new Date(booking.startTime).getTime();
    const currentDeviceTime = new Date().getTime();
    return startTimeStamp > currentDeviceTime;
  };

  const formatScheduleTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  if (isPending || isDataLoading) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-2">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-xs font-semibold text-base-content/40 tracking-wider uppercase">Loading Bookings...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="w-full bg-base-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-base-content">
      <div className="max-w-5xl mx-auto">
        
        <div className="border-b border-base-content/10 pb-6 mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">My Bookings</h1>
          <p className="text-sm text-base-content/60 font-medium">Manage and review your space allocation history entries.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="w-full bg-base-200/30 border border-dashed border-base-content/10 rounded-3xl p-12 text-center max-w-xl mx-auto mt-10">
            <h3 className="text-xl font-black mb-1">You have no bookings yet.</h3>
            <p className="text-sm text-base-content/50 font-medium mb-6">Explore our campus environments to place your initial quiet study slot assignment.</p>
            <Link href="/rooms" className="btn btn-primary btn-md rounded-xl font-bold normal-case px-6">Find a Room</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const activeCancelPermission = isEligibleToCancel(booking);
              const isCancelled = booking.status === 'cancelled';

              return (
                <div 
                  key={booking._id}
                  className={`bg-base-100 border rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 justify-between transition-all duration-200 ${
                    isCancelled ? 'border-base-content/5 bg-base-200/20' : 'border-base-content/10 hover:border-base-content/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="relative w-20 h-20 bg-base-200 rounded-xl overflow-hidden flex-shrink-0">
                      <Image 
                        src={booking.roomInfo?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
                        alt={booking.roomInfo?.name || "Room Image"}
                        fill
                        className={`object-cover ${isCancelled ? 'grayscale brightness-90' : ''}`}
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                        <h3 className="font-black text-lg tracking-tight text-base-content">{booking.roomInfo?.name}</h3>
                        
                        {isCancelled ? (
                          <span className="badge bg-error/10 text-error border-none text-[10px] font-black uppercase tracking-wider rounded px-2">cancelled</span>
                        ) : (
                          <span className="badge bg-success/10 text-success border-none text-[10px] font-black uppercase tracking-wider rounded px-2">confirmed</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-base-content/60 space-y-0.5">
                        <p><span className="text-primary font-bold">Start:</span> {formatScheduleTime(booking.startTime)}</p>
                        <p><span className="text-secondary font-bold">End:</span> {formatScheduleTime(booking.endTime)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-right">
                    {activeCancelPermission && (
                      <button 
                        onClick={() => { setTargetBooking(booking); setShowCancelModal(true); }}
                        className="btn btn-error btn-sm btn-outline rounded-xl font-bold normal-case px-4 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showCancelModal && targetBooking && (
        <div className="modal modal-open bg-black/60 backdrop-blur-xs flex items-center justify-center fixed inset-0 z-50 p-4">
          <div className="modal-box max-w-sm bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-xl text-center">
            <h3 className="text-lg font-black text-base-content mb-1">Cancel Booking?</h3>
            <p className="text-xs text-base-content/60 font-medium mb-5">
              Are you sure you want to release your reservation slot for <span className="font-bold text-base-content">“{targetBooking.roomInfo?.name}”</span>?
            </p>
            <div className="flex justify-center gap-2 w-full">
              <button 
                type="button" 
                onClick={() => { setShowCancelModal(false); setTargetBooking(null); }} 
                className="btn btn-sm btn-ghost rounded-lg normal-case font-bold"
                disabled={isActionLoading}
              >
                No, Keep It
              </button>
              <button 
                type="button" 
                onClick={handleConfirmCancellation} 
                className="btn btn-sm btn-error rounded-lg normal-case font-bold px-4"
                disabled={isActionLoading}
              >
                {isActionLoading ? <span className="loading loading-spinner loading-xs"></span> : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}