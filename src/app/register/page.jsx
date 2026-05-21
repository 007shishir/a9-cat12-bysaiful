"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authClient } from '../../../lib/auth-client';



const RegisterPage = () => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      photoURL: '',
      password: '',
    }
  });

  // Handle standard Credential Registration via Better-Auth
  const onRegisterSubmit = async (data) => {
    setIsSubmitLoading(true);
    try {
      const { data: signUpData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.photoURL, // Better-Auth maps avatars to the 'image' property
        dontLogin: true,      // Tells Better-Auth NOT to auto-login so we can redirect to login route instead
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Registration successful! Please login.");
        router.push('/login');
      }
    } catch (err) {
      toast.error("An unexpected error occurred during signup.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Handle Social Google OAuth Registration/Login via Better-Auth
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackUrl: '/', // Logged in directly and redirected to Home
      });
    } catch (err) {
      toast.error("Google authentication failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="w-full bg-base-100 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Structural Card Container with max width bounds matching your site design */}
      <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-content/10 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle background glow aesthetic */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-base-content tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-sm text-base-content/60 font-medium">
            Join StudyNook to manage your workspace reservations
          </p>
        </div>

        {/* Credentials Registration Form */}
        <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
          
          {/* Full Name Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Alex Morgan"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.name ? 'input-error' : 'focus:input-primary'}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <label className="label py-1">
                <span className="label-text-alt text-error font-medium">{errors.name.message}</span>
              </label>
            )}
          </div>

          {/* Email Address Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="alex@university.edu"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.email ? 'input-error' : 'focus:input-primary'}`}
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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

          {/* Photo URL Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Photo URL</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/avatar.jpg"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.photoURL ? 'input-error' : 'focus:input-primary'}`}
              {...register('photoURL', { required: 'Photo URL is required' })}
            />
            {errors.photoURL && (
              <label className="label py-1">
                <span className="label-text-alt text-error font-medium">{errors.photoURL.message}</span>
              </label>
            )}
          </div>

          {/* Password Field with Custom Robust Inline Validation Rules */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-base-content/80">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered w-full rounded-xl transition-all ${errors.password ? 'input-error' : 'focus:input-primary'}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                validate: {
                  hasUppercase: (value) => 
                    /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                  hasLowercase: (value) => 
                    /[a-z]/.test(value) || 'Password must contain at least one lowercase letter'
                }
              })}
            />
            {errors.password && (
              <label className="label py-1">
                <span className="label-text-alt text-error font-medium">{errors.password.message}</span>
              </label>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitLoading || isGoogleLoading}
            className="btn btn-primary btn-block rounded-xl font-bold normal-case text-base shadow-lg shadow-primary/10 mt-4"
          >
            {isSubmitLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Visual Content Section Divider */}
        <div className="divider text-xs my-5 text-base-content/40 uppercase tracking-widest font-bold">OR</div>

        {/* Google OAuth Provider Entry Link */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitLoading || isGoogleLoading}
          className="btn btn-outline btn-block rounded-xl border-space border-base-content/20 font-bold normal-case text-base hover:bg-base-200 hover:text-base-content gap-3"
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

        {/* Redirect Hyperlink Segment */}
        <p className="text-center text-sm font-medium text-base-content/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-bold transition-all">
            Login
          </Link>
        </p>

      </div>
      
    </section>
  );
};

export default RegisterPage;