import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getSongsByUserId = async (): Promise<Song[]> => {
  // create Supabase client for server operations
  const supabase = createServerComponentClient({
    cookies: cookies // used for auth or session management
  });

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  // don't fetch songs if user session can't be determined
  if (sessionError){
    console.log(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', sessionData.session?.user.id)  // Filter songs by matching them with userId from session data, if there is one
    .order('created_at', {ascending: false})

  if (error) {
    console.log(error.message);    
  }

  return (data as any) || [];
}

export default getSongsByUserId;