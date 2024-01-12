import { loadStripe, Stripe } from "@stripe/stripe-js";

/* 
   Set up Stripe for client-side usage
*/

let stripePromise: Promise<Stripe | null>;

// Function to get or initialize Stripe instance
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe( process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
  }

  return stripePromise;
}