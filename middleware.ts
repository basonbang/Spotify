import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// Processes incoming HTTP requests 
export async function middleware(req: NextRequest){
  const res = NextResponse.next();  // Initialize response object
  const supabase = createMiddlewareClient({ req, res });  // Create supabase client to manage authentication related tasks

  await supabase.auth.getSession(); // Retrieve current authentication session using supabase client
  return res;
}