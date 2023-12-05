import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getLikedSongs = async (): Promise<Song[]> => {
  // create Supabase client for server operations
  const supabase = createServerComponentClient({
    cookies: cookies // used for auth or session management
  });

  const { data: { session } } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')  // Select all fields from liked_songs table and related data in songs table
    .eq('user_id', session?.user?.id) // Only include songs whose userId matches current user's ID
    .order('created_at', { ascending: false}); 
    
    if (error) {
      console.log(error);
      return [];
    }

    if (!data) return []; // empty array if no liked songs are found from current user

    return data.map((item) => ({...item.songs})); // return Song array that contains Song objects from each item in data array 
}

export default getLikedSongs;