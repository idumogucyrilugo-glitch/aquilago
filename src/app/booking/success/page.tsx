// src/app/booking/success/page.tsx
import { resend } from '@/lib/resend'; // we'll create this

export default function Success() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-green-600 mb-6">Booking Confirmed! 🎉</h1>
        <p className="text-2xl mb-4">Your flight is booked with AquilaGo 🦅</p>
        <p className="text-lg text-gray-600">E-ticket sent to your email</p>
        <a href="/bookings" className="mt-8 inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl text-xl font-bold">View My Bookings</a>
      </div>
    </div>
  );
}