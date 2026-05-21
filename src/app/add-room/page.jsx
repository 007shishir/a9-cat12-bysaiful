"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../../lib/auth-client';
import AddRoomForm from '../components/add-room/AddRoomForm';

const AddRoomPage = () => {
  const router = useRouter();
  
  // 1. Instantly tap into Better-Auth's client session monitor
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // 2. Evaluate protection constraints reactively 
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login to register a study space.");
      router.push('/login?callbackUrl=/add-room');
    }
  }, [user, isPending, router]);

  // 3. Render a clean loading state while verifying the user session
  if (isPending) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-sm font-medium text-base-content/50 animate-pulse">
          Verifying your study credentials...
        </p>
      </div>
    );
  }

  // 4. Return null if no user is found to prevent the form from flashing before redirecting
  if (!user) return null;

  // 5. If authenticated, render the layout safely
  return (
    <section className="w-full bg-base-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-base-100 border border-base-content/10 shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle decorative background aura */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-8 border-b border-base-content/5 pb-4 text-center sm:text-left">
          <h1 className="text-3xl font-black text-base-content tracking-tight mb-2">
            List a Study Room
          </h1>
          <p className="text-sm text-base-content/60 font-medium">
            Configure your quiet workspace room specifications inside the library database.
          </p>
        </div>

        {/* Render the core form component and pass down the validated user data */}
        <AddRoomForm user={user} />
      </div>
    </section>
  );
};

export default AddRoomPage;