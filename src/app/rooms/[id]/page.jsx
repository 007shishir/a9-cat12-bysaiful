import React from 'react';
import { notFound } from 'next/navigation';
import RoomDetailsClient from './RoomDetailsClient';

// Next.js Server Components receive parameters directly via a clean async props layout
export default async function RoomDetailsPage({ params }) {
  // Await the routing parameters vector slot
  const resolvedParams = await params;
  const roomId = resolvedParams?.id;

  if (!roomId) {
    return notFound();
  }

  let room = null;
  try {
    // Direct server-to-server fetch eliminates layout loading flashes
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${roomId}`, {
      cache: 'no-store' // Keep data real-time for booking metric synchronization
    });

    console.log(`Attempting to fetch room data for ID: ${roomId} - Response: ${res.status}`);
    
    if (res.ok) {
      const result = await res.json();
      room = result.data;
      console.log("Fetched room data for ID:", roomId, room);
    }
  } catch (err) {
    console.error("Direct server data sync connection failure:", err);
  }

  // Handle a missing listing immediately on the server before anything is sent to the browser
  if (!room) {
    return (
      <div className="text-center py-20 max-w-md mx-auto min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-black text-base-content tracking-tight">Listing Not Found</h2>
        <p className="text-sm text-base-content/50 mt-1">
          The requested study room does not exist or has been unlisted by its owner.
        </p>
        <a href="/rooms" className="btn btn-primary btn-sm mt-6 rounded-xl normal-case font-bold px-5">
          Back to Gallery
        </a>
      </div>
    );
  }

  // Forward the pristine dataset down into our client-side interactive shell element
  return <RoomDetailsClient initialRoomData={room} roomId={roomId} />;
}