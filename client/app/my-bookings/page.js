'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
        if (!user) {
            router.push('/login');
        } else {
            fetchBookings();
        }
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
     return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
  }

  if (!user) return null; // Prevent flash before redirect

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-gray-500 text-lg mb-4">You haven't booked any events yet.</p>
            <Link href="/" className="text-indigo-600 hover:text-indigo-900 font-medium">
                Browse Events
            </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-indigo-600">{booking.event?.title || 'Event Removed'}</h2>
                        <p className="text-sm text-gray-500">
                            Date: {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                        </p>
                         <p className="text-sm text-gray-500">
                            Category: {booking.event?.category?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Booking ID: {booking._id}
                        </p>
                    </div>
                     <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                             Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
