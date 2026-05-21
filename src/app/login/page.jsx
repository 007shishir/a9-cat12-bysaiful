"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authClient } from '../../../lib/auth-client';



const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get the intended destination route if redirected from a private route safeguard
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Handle standard Credential Login via Better-Auth
  const onEmailLoginSubmit = async (data) => {
    setIsEmailLoading(true);
    try {
      const { data: session, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
      } else {
        toast.success("Welcome back to StudyNook!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Handle Social Google OAuth Login via Better-Auth
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackUrl: callbackUrl,
      });
    } catch (err) {
      toast.error("Google authentication failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="w-full bg-base-100 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Outer grid boundaries mapped cleanly with proper scannability design constraints */}
      <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-content/10 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle background visual flair to match the application aesthetic */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-base-content tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-base-content/60 font-medium">
            Secure your quiet library slot in seconds
          </p>
        </div>

        {/* Credentials Authentication Form */}
        <form onSubmit={handleSubmit(onEmailLoginSubmit)} className="space-y-5">
          
          {/* Email Field Column */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.email ? 'input-error' : 'focus:input-primary'}`}
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-0._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please provide a valid email format'
                }
              })}
            />
            {errors.email && (
              <label className="label py-1">
                <span className="label-text-alt text-error font-medium">{errors.email.message}</span>
              </label>
            )}
          </div>

          {/* Password Field Column */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.password ? 'input-error' : 'focus:input-primary'}`}
              {...register('password', { 
                required: 'Password is required' 
              })}
            />
            {errors.password && (
              <label className="label py-1">
                <span className="label-text-alt text-error font-medium">{errors.password.message}</span>
              </label>
            )}
          </div>

          {/* Submit Standard Credentials Action Button */}
          <button
            type="submit"
            disabled={isEmailLoading || isGoogleLoading}
            className="btn btn-primary btn-block rounded-xl font-bold normal-case text-base shadow-lg shadow-primary/10 mt-2"
          >
            {isEmailLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Visual Structural Divider */}
        <div className="divider text-xs my-6 text-base-content/40 uppercase tracking-widest font-bold">OR</div>

        {/* Google OAuth Access Button Option */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isEmailLoading || isGoogleLoading}
          className="btn btn-outline btn-block rounded-xl border-base-content/20 font-bold normal-case text-base hover:bg-base-200 hover:text-base-content gap-3"
        >
          {isGoogleLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Dynamic Client Transition Hyperlink Footer */}
        <p className="text-center text-sm font-medium text-base-content/60 mt-8">
          Don’t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-bold transition-all">
            Register
          </Link>
        </p>

      </div>
      
    </section>
  );
};

export default LoginPage;