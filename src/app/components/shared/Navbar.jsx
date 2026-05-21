"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '../../../../lib/auth-client';


const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Dynamically listen to the real-time Better-Auth active user session
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Sync the Better-Auth session with the backend JWT cookie dynamically
  React.useEffect(() => {
    const syncBackendSession = async () => {
      if (user?.id) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/jwt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id }),
            credentials: 'include'
          });
        } catch (err) {
          console.error("Failed to sync backend JWT session cookie:", err);
        }
      }
    };
    if (!isPending) {
      syncBackendSession();
    }
  }, [user, isPending]);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            // Clear the backend JWT cookie on logout success
            try {
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
              });
            } catch (err) {
              console.error("Failed to clear backend JWT cookie on logout:", err);
            }
            toast.success("Logged out successfully");
            router.push('/');
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to log out");
          }
        }
      });
    } catch (error) {
      toast.error("An unexpected error occurred while logging out");
    }
  };

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return `font-medium ${isActive ? 'text-primary underline decoration-2 underline-offset-4' : 'text-base-content'}`;
  };

  const navLinks = (
    <>
      <li>
        <Link href="/" className={getLinkClass('/')}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/rooms" className={getLinkClass('/rooms')}>
          Rooms
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/add-room" className={getLinkClass('/add-room')}>
              Add Room
            </Link>
          </li>
          <li>
            <Link href="/my-listings" className={getLinkClass('/my-listings')}>
              My Listings
            </Link>
          </li>
          <li>
            <Link href="/my-bookings" className={getLinkClass('/my-bookings')}>
              My Bookings
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="w-full bg-base-100 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navbar Start: Logo & Mobile Hamburger Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Open Menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-2">
              {navLinks}
            </ul>
          </div>
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <span>StudyNook</span>
          </Link>
        </div>

        {/* Navbar Center: Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6">
            {navLinks}
          </ul>
        </div>

        {/* Navbar End: Dynamic Action Buttons / Profile Dropdown */}
        <div className="navbar-end gap-2">
          {isPending ? (
            /* Elegant Skeleton Loader to prevent UI layout shift while checking session */
            <div className="w-10 h-10 rounded-full bg-base-content/10 animate-pulse" />
          ) : user ? (
            /* Private Layout: Authenticated Profile Dropdown */
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar online">
                <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                  <Image 
                    src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                    alt={user?.name || "User profile"} 
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-60 gap-1">
                <li className="px-3 py-2 border-b border-base-200 mb-1">
                  <p className="font-bold text-base-content truncate">{user?.name || "Anonymous Student"}</p>
                  <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
                </li>
                <li className="lg:hidden"><Link href="/add-room">Add Room</Link></li>
                <li className="lg:hidden"><Link href="/my-listings">My Listings</Link></li>
                <li className="lg:hidden"><Link href="/my-bookings">My Bookings</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-error btn-sm text-white mt-2 btn-block justify-start"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* Public Layout: Unauthenticated Entry Actions */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/login" 
                className="btn btn-ghost btn-sm sm:btn-md text-base font-medium normal-case"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary btn-sm sm:btn-md text-base font-medium normal-case shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;