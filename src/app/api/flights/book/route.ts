// src/app/api/flights/book/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const duffel = process.env.DUFFEL_API_KEY!;

export async function POST(req: NextRequest) {
  const { offerId, passengers } = await req.json();

  // Step 1: Get offer details from Duffel
  const offerRes = await fetch(`https://api.duffel.com/air/offers/${offerId}`, {
    headers: { 'Authorization': `Bearer ${duffel}`, 'Duffel-Version': 'v1' }
  });
  const offer = await offerRes.json();

  // Step 2: Create order in Duffel
  const orderRes = await fetch('https://api.duffel.com/air/orders', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${duffel}`, 'Content-Type': 'application/json', 'Duffel-Version': 'v1' },
    body: JSON.stringify({ data: { selected_offers: [offerId], passengers } })
  });
  const order = await orderRes.json();

  // Step 3: Save booking to DB
  const booking = await prisma.booking.create({
    data: {
      offerId,
      orderId: order.data.id,
      pnr: order.data.booking_reference,
      totalAmount: offer.data.total_amount,
      currency: offer.data.total_currency,
      passengers: {
        create: passengers.map((p: any) => ({
          title: p.title,
          firstName: p.firstName,
          lastName: p.lastName,
          gender: p.gender,
          bornOn: p.bornOn,
          email: p.email,
          phone: p.phone,
        }))
      }
    }
  });
}