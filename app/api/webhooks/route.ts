/*
  Webhook endpoint designed to receive and process endpoints from Stripe
*/

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange
} from "@/libs/supabaseAdmin";

// Triggered by various actions within Stripe
const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

// Handle incoming webhook requests from Stripe
export async function POST(request: Request) {
  
  // Read request body and signatures
  const body = await request.text();
  const sig = headers().get('Stripe-Signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // verfiy if event was sent by Stripe
  let event: Stripe.Event;

  try {
    if ( !sig || !webhookSecret ) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret); // Represents data sent by Stripe, after being verified
  } catch (error: any) {
    console.log('Error message: ' + error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400}); // Indicate server can't process request from client
  }

  // Check if received event type is one that our application can handle
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price)
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error)
      return new NextResponse('Webhook error', { status: 400})
    }
  }
  
  // Produce JSON response, indicating successful webhook
  return NextResponse.json({ received: true }, { status: 200});
}