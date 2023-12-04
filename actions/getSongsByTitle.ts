import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";


const getSongsByTitle = async (title: string): Promise<Song[]> => {
  // create Supabase client for server operations
  const supabase = createServerComponentClient({
    cookies: cookies // used for auth or session management
  });

  // if no title is given, fetch all songs
  if (!title){
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`) // perform case-insensitive search for any song title that contains text within 'title' variable
    .order('created_at', { ascending: false}); // get all songs in descending order, newest first
    
    if (error) {
      console.log(error);
    }

    return (data as any) || [];
}

export default getSongsByTitle;