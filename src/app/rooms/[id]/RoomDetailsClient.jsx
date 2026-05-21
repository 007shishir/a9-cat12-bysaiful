"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authClient } from '../../../../lib/auth-client';

export default function RoomDetailsClient({ initialRoomData, roomId }) {
  const router = useRouter();
  
  // Initialize state directly from server-passed parameters to remove runtime render loops
  const [room, setRoom] = useState(initialRoomData);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isOwner = room && user && room.owner === user.id;

  const bookingForm = useForm();
  const editForm = useForm({ defaultValues: room });

  // Simple client helper to refresh data when updates occur
  const refreshRoomData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${roomId}`);
      if (res.ok) {
        const result = await res.json();
        setRoom(result.data);
      }
    } catch (err) {
      console.error("Error refreshing client view matrix data:", err);
    }
  };

  const onBookSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to reserve this study cell slot.");
      router.push(`/login?callbackUrl=/rooms/${roomId}`);
      return;
    }
    setIsActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ roomId, startTime: data.startTime, endTime: data.endTime })
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message || "Booking slot rejected.");
      
      toast.success(out.message || "Room booked successfully!");
      bookingForm.reset();
      refreshRoomData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(data)
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message);

      toast.success("Room updated successfully");
      setShowEditModal(false);
      refreshRoomData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm("Are you completely sure you want to permanently delete this listing asset?")) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message);

      toast.success("Room deleted successfully");
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-base-100 text-base-content">
      
      {/* Management Controls Bar */}
      {isOwner && (
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-bold text-warning-content">
            ⚙️ Hosting Dashboard: You own this active study space node listing item.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setShowEditModal(true)} className="btn btn-sm btn-neutral rounded-xl font-bold normal-case">Edit Details</button>
            <button onClick={handleDeleteRoom} disabled={isActionLoading} className="btn btn-sm btn-error rounded-xl font-bold normal-case">Delete Listing</button>
          </div>
        </div>
      )}

      {/* Main Framework Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column Data Column Display Viewport */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-[16/10] bg-base-200 rounded-3xl overflow-hidden shadow-md">
            <Image src={room.image} alt={room.name} fill className="object-cover" unoptimized />
            <span className="absolute top-4 right-4 badge badge-neutral p-3 font-bold text-xs">{room.floor}</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{room.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-base-content/60 mb-4">
              <span className="badge badge-primary badge-outline py-2.5 px-3 rounded-lg">Seats up to {room.capacity} individuals</span>
              <span className="badge bg-base-200 border-none py-2.5 px-3 rounded-lg text-base-content/80">📈 Booked {room.bookingCount || 0} times</span>
            </div>
            <p className="text-base text-base-content/80 leading-relaxed font-medium whitespace-pre-line">{room.description}</p>
          </div>

          <div className="border-t border-base-content/10 pt-6">
            <h3 className="text-lg font-black mb-3">Included Utilities & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, idx) => (
                <span key={idx} className="badge bg-base-200 border-none text-sm font-semibold rounded-lg px-3 py-3.5">{amenity}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Checkout Form Component Node Widget */}
        <div className="lg:col-span-5">
          <div className="bg-base-100 border border-base-content/10 shadow-xl rounded-3xl p-6 sticky top-6">
            <div className="flex justify-between items-baseline border-b border-base-content/5 pb-4 mb-6">
              <span className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Hourly Reservation Fee</span>
              <span className="text-3xl font-black text-primary">${room.hourlyRate}<span className="text-sm font-medium text-base-content/60"> / hour</span></span>
            </div>

            <form onSubmit={bookingForm.handleSubmit(onBookSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-bold text-base-content/70">Select Start Target Time</span></label>
                <input type="datetime-local" className="input input-bordered rounded-xl" {...bookingForm.register('startTime', { required: true })} />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-bold text-base-content/70">Select End Target Time</span></label>
                <input type="datetime-local" className="input input-bordered rounded-xl" {...bookingForm.register('endTime', { required: true })} />
              </div>

              <button type="submit" disabled={isActionLoading} className="btn btn-primary w-full rounded-xl normal-case font-bold text-base mt-4 shadow-lg shadow-primary/10">
                {isActionLoading ? <span className="loading loading-spinner"></span> : user ? "Lock In Reservation Slot" : "Login to Book"}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Edit Component Modal Block Container */}
      {showEditModal && (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm flex items-center justify-center fixed inset-0 z-50 p-4">
          <div className="modal-box max-w-2xl bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black mb-4">Modify Room Configuration</h3>
            
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="form-control"><label className="label"><span className="label-text font-bold">Room Name</span></label>
                <input type="text" className="input input-bordered rounded-xl" {...editForm.register('name', { required: true })} />
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-bold">Description</span></label>
                <textarea rows={3} className="textarea textarea-bordered rounded-xl" {...editForm.register('description', { required: true })} />
              </div>
              <div className="form-control"><label className="label"><span className="label-text font-bold">Image Web Link URL</span></label>
                <input type="url" className="input input-bordered rounded-xl" {...editForm.register('image', { required: true })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-control"><label className="label"><span className="label-text font-bold">Floor</span></label>
                  <input type="text" className="input input-bordered rounded-xl" {...editForm.register('floor', { required: true })} /></div>
                <div className="form-control"><label className="label"><span className="label-text font-bold">Capacity</span></label>
                  <input type="number" className="input input-bordered rounded-xl" {...editForm.register('capacity', { required: true })} /></div>
                <div className="form-control"><label className="label"><span className="label-text font-bold">Rate ($/hr)</span></label>
                  <input type="number" step="0.01" className="input input-bordered rounded-xl" {...editForm.register('hourlyRate', { required: true })} /></div>
              </div>

              <div className="modal-action flex justify-end gap-2 pt-4 border-t border-base-content/5">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-ghost rounded-xl normal-case">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="btn btn-primary rounded-xl px-6 normal-case font-bold">Save System Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}