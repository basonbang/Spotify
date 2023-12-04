import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getSongs = async (): Promise<Song[]> => {
  // create Supabase client for server operations
  const supabase = createServerComponentClient({
    cookies: cookies // used for auth or session management
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false}); // get all songs in descending order, newest first
    
    if (error) {
      console.log(error);
    }

    return (data as any) || [];
}

export default getSongs;