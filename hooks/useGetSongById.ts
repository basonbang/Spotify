import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id ) return;

    setIsLoading(true);
      const fetchSong = async () => {
        // extract song that matches given ID from songs table
        const { data, error } = await supabaseClient
          .from('songs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          setIsLoading(false);
          return toast.error(error.message);
        } 

        setSong(data as Song);  // consider data as a Song type
        setIsLoading(false);
      }


      fetchSong();
  }, [id, supabaseClient])

  // memoizes isLoading and song (store in memory) if their values are changed, otherwises reuses them
  return useMemo(() => ({
    isLoading,
    song
  }), [isLoading, song]);
}

export default useGetSongById;