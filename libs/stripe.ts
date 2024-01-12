import Stripe from "stripe";

/* 
  Set up Stripe server-side library to perform operations such as creating charges, managing customers, etc. 
*/

// Create Stripe instance
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? '',
  {
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'Spotify Clone',
      version: '1.0.1'
    }
  }
);