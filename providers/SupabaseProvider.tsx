'use client'; 

// This component integrates Supabase for authentication and database interactions

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Creates a Supabase client instance
import { SessionContextProvider } from "@supabase/auth-helpers-react";  // Manages authentication state and session information

import { Database } from "@/types_db";  // Typescript type definitions specific to Supabase schema

interface SupabaseProviderProps{
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {

  // Initializes Supabase client. Client is tailored to database schema defined in Database type
  const [supabaseClient] = useState( () => createClientComponentClient<Database>());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
 
export default SupabaseProvider;