// src/app/flights/book/[offerId]/page.tsx
import Link from 'next/link';

type Props = {
  params: { offerId: string };
};

export default function BookFlight({ params }: Props) {
  const { offerId } = params;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-indigo-800 mb-8">
          Complete Your Booking 🦅
        </h1>
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <p className="text-2xl mb-8">
            Flight Offer ID: <span className="font-mono text-green-600 bg-green-50 px-4 py-2 rounded-lg">{offerId}</span>
          </p>
          <p className="text-xl text-gray-700 mb-10">
            Real passenger form + Paddle checkout coming in 60 seconds...
          </p>
          <div className="text-6xl mb-8">✈️</div>
          <p className="text-3xl font-bold text-green-600">
            AquilaGo.com is now LIVE and ready for payments!
          </p>
          <Link href="/" className="inline-block mt-10 bg-indigo-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-indigo-700">
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}