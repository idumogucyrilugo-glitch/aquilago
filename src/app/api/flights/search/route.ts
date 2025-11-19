// src/app/api/flights/search/route.ts
import { NextRequest } from 'next/server';

const DUFFEL_KEY = process.env.DUFFEL_API_KEY;

export async function POST(req: NextRequest) {
  const { origin, destination, date } = await req.json();

  const response = await fetch('https://api.duffel.com/air/offer_requests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DUFFEL_KEY}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v1',
    },
    body: JSON.stringify({
      data: {
        slices: [{ origin, destination, departure_date: date }],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
      },
    }),
  });

  const data = await response.json();
  return Response.json(data);
}

// This line fixes the "not a module" error
export const dynamic = 'force-dynamic';