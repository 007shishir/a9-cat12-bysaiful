"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AddRoomForm = ({ user }) => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const amenitiesOptions = [
    "Whiteboard",
    "Projector",
    "Wi‑Fi",
    "Power Outlets",
    "Quiet Zone",
    "Air Conditioning"
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      image: '',
      floor: '',
      capacity: '',
      hourlyRate: '',
      amenities: []
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitLoading(true);
    try {
      const formattedPayload = {
        ...data,
        capacity: Number(data.capacity),
        hourlyRate: Number(data.hourlyRate),
        owner: user.id // Bound securely from server passed object
      };

      // Firing directly into your backend Express configuration port 5000
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id // Safe header authorization pass mapping
        },
        body: JSON.stringify(formattedPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to finalize listing file creation.");
      }

      toast.success("Room added successfully");
      router.push('/my-listings');
      router.refresh();

    } catch (error) {
      toast.error(error.message || "An error occurred while saving the room data.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Room Name Input */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text font-semibold text-base-content/80">Room Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Turing Collaborative Hub"
          className={`input input-bordered w-full rounded-xl transition-all ${errors.name ? 'input-error' : 'focus:input-primary'}`}
          {...register('name', { required: 'Room name is required' })}
        />
        {errors.name && <span className="text-xs text-error mt-1 font-medium">{errors.name.message}</span>}
      </div>

      {/* Description Textarea */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text font-semibold text-base-content/80">Description</span>
        </label>
        <textarea
          placeholder="Detail structural usage rules, noise isolation conditions, or reservation tracking insights..."
          rows={4}
          className={`textarea textarea-bordered w-full rounded-xl transition-all ${errors.description ? 'textarea-error' : 'focus:textarea-primary'}`}
          {...register('description', { required: 'Description notes are required' })}
        />
        {errors.description && <span className="text-xs text-error mt-1 font-medium">{errors.description.message}</span>}
      </div>

      {/* Image URL Input */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text font-semibold text-base-content/80">Image URL</span>
        </label>
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          className={`input input-bordered w-full rounded-xl transition-all ${errors.image ? 'input-error' : 'focus:input-primary'}`}
          {...register('image', { 
            required: 'An external image web URL link reference is required',
            pattern: {
              value: /^https?:\/\/.+/i,
              message: 'Please present a valid absolute web address link.'
            }
          })}
        />
        {errors.image && <span className="text-xs text-error mt-1 font-medium">{errors.image.message}</span>}
      </div>

      {/* Floor, Capacity, and Hourly Pricing Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Floor Location Field */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-base-content/80">Floor Location</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 3rd Floor"
            className={`input input-bordered w-full rounded-xl transition-all ${errors.floor ? 'input-error' : 'focus:input-primary'}`}
            {...register('floor', { required: 'Floor metric is required' })}
          />
          {errors.floor && <span className="text-xs text-error mt-1 font-medium">{errors.floor.message}</span>}
        </div>

        {/* Capacity Input */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-base-content/80">Max Seat Capacity</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 4"
            min="1"
            className={`input input-bordered w-full rounded-xl transition-all ${errors.capacity ? 'input-error' : 'focus:input-primary'}`}
            {...register('capacity', { 
              required: 'Seat capacity index is required',
              min: { value: 1, message: 'Must host at least 1 person' }
            })}
          />
          {errors.capacity && <span className="text-xs text-error mt-1 font-medium">{errors.capacity.message}</span>}
        </div>

        {/* Hourly Booking Rate */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-base-content/80">Hourly Rate ($)</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 5"
            min="0"
            step="0.01"
            className={`input input-bordered w-full rounded-xl transition-all ${errors.hourlyRate ? 'input-error' : 'focus:input-primary'}`}
            {...register('hourlyRate', { 
              required: 'Hourly space pricing parameters are required',
              min: { value: 0, message: 'Rate metrics cannot register below zero' }
            })}
          />
          {errors.hourlyRate && <span className="text-xs text-error mt-1 font-medium">{errors.hourlyRate.message}</span>}
        </div>

      </div>

      {/* Amenities Checkbox Layout Grid Array */}
      <div className="form-control w-full">
        <label className="label py-1">
          <span className="label-text font-semibold text-base-content/80">Available Amenities</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-base-200/50 p-5 rounded-2xl border border-base-content/5 mt-1">
          {amenitiesOptions.map((amenity, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                value={amenity}
                className="checkbox checkbox-primary checkbox-sm rounded-md transition-all"
                {...register('amenities')}
              />
              <span className="text-sm font-medium text-base-content/80 group-hover:text-primary transition-colors">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Submission Button Footer */}
      <div className="pt-4 border-t border-base-content/5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitLoading}
          className="btn btn-primary px-10 rounded-xl font-bold normal-case text-base shadow-lg shadow-primary/10 w-full sm:w-auto"
        >
          {isSubmitLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Publish Room Slot'
          )}
        </button>
      </div>

    </form>
  );
};

export default AddRoomForm;