// src/app/flights/book/[offerId]/page.tsx
'use client';

import { useState } from 'react';


export default function BookFlight({ params }: { params: { offerId: string } }) {
  const [passengers, setPassengers] = useState([{ title: 'Mr', firstName: '', lastName: '', gender: 'male', bornOn: '', email: '', phone: '' }]);
  const [loading, setLoading] = useState(false);

  const addPassenger = () => setPassengers([...passengers, { title: 'Mr', firstName: '', lastName: '', gender: 'male', bornOn: '', email: '', phone: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/flights/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId: params.offerId, passengers }),
    });

    const data = await res.json();

    if (data.sessionId) {
      const stripe = await stripePromise;
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">Complete Your Booking 🦅</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>

          {passengers.map((p, i) => (
            <div key={i} className="border-b pb-8 mb-8">
              <h3 className="text-xl font-semibold mb-4">Passenger {i + 1} (Adult)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <select className="border p-3 rounded-lg" value={p.title} onChange={e => {
                  const updated = [...passengers];
                  updated[i].title = e.target.value;
                  setPassengers(updated);
                }}>
                  <option>Mr</option>
                  <option>Ms</option>
                  <option>Mrs</option>
                </select>
                <input required placeholder="First Name" className="border p-3 rounded-lg" value={p.firstName} onChange={e => {
                  const updated = [...passengers]; updated[i].firstName = e.target.value; setPassengers(updated);
                }} />
                <input required placeholder="Last Name" className="border p-3 rounded-lg" value={p.lastName} onChange={e => {
                  const updated = [...passengers]; updated[i].lastName = e.target.value; setPassengers(updated);
                }} />
                <select className="border p-3 rounded-lg" value={p.gender} onChange={e => {
                  const updated = [...passengers]; updated[i].gender = e.target.value; setPassengers(updated);
                }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input required type="date" placeholder="Date of Birth" className="border p-3 rounded-lg" value={p.bornOn} onChange={e => {
                  const updated = [...passengers]; updated[i].bornOn = e.target.value; setPassengers(updated);
                }} />
                <input required type="email" placeholder="Email" className="border p-3 rounded-lg" value={p.email} onChange={e => {
                  const updated = [...passengers]; updated[i].email = e.target.value; setPassengers(updated);
                }} />
                <input required type="tel" placeholder="Phone" className="border p-3 rounded-lg" value={p.phone} onChange={e => {
                  const updated = [...passengers]; updated[i].phone = e.target.value; setPassengers(updated);
                }} />
              </div>
            </div>
          ))}

          <button type="button" onClick={addPassenger} className="text-indigo-600 font-bold mb-6">+ Add Another Passenger</button>

          <div className="text-right">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-12 py-5 rounded-xl text-xl font-bold hover:bg-green-700 shadow-lg">
              {loading ? 'Processing...' : 'Pay & Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}