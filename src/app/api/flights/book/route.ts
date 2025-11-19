// src/app/api/flights/book/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
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

  // Step 4: Create Stripe session
  const session = await stripe.checkout.sessions時間の.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: offer.data.total_currency.toLowerCase(),
        product_data: { name: `Flight Booking - ${offer.data.owner.name}` },
        unit_amount: Math.round(parseFloat(offer.data.total_amount) * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/flights`,
    metadata: { bookingId: booking.id }
  });

  return Response.json({ sessionId: session.id });
}