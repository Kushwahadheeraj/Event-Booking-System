'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const query = selectedCategory ? `?categoryId=${selectedCategory}` : '';
      const { data } = await api.get(`/events${query}`);
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async (eventId) => {
    if (!user) {
      toast.error('Please login to book an event');
      return;
    }
    
    if (user.role === 'admin') {
      toast.error('Admins cannot book events');
      return;
    }

    try {
      const { data } = await api.post('/bookings', { eventId });
      if (data.success) {
        toast.success('Event booked successfully!');
        fetchEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Upcoming Events
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Discover and book amazing events happening around you.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category._id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No events found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-2">
                    {event.category?.name}
                  </span>
                  <span className="text-lg font-bold text-gray-900">${event.price}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-500 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-semibold w-20">Date:</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-20">Time:</span>
                    <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                   <div className="flex items-center">
                    <span className="font-semibold w-20">Duration:</span>
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-20">Venue:</span>
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-20">Seats:</span>
                    <span className={event.availableSeats > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {event.availableSeats} available
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <button
                  onClick={() => handleBookEvent(event._id)}
                  disabled={event.availableSeats === 0 || (user && user.role === 'admin')}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    event.availableSeats === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
