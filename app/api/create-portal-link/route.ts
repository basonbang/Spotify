/*
  Handle POST requests for creating Stripe billing portal sessions
*/


import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  try {
    // Retrieve user details from database
    const supabase = createRouteHandlerClient( {cookies} );
    const { data: { user }} = await supabase.auth.getUser();

    if (!user) throw new Error('Could not get user!');

    // Retrieve customer record from database
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || ''
    });

    if (!customer) throw new Error('Could not get customer!');

    // Create Stripe billing portal session 
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account` // User is redirected to account page
    });

    return NextResponse.json({ url });

  } catch (error: any) {
    console.log(error);

    return new NextResponse('Internal Error!', {status: 500})
  } 
}