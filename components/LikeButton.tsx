"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ( {songId} ) => {

  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) return; // unmount if user is not logged in

    const fetchData = async () => {
      const { data, error} = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single()

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) return authModal.onOpen(); // Prompts log in modal if user attempts to like w/o being logged in

    // Unlike a song 💔 (Removing it from liked_songs table in database)
    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId)
      
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      // Like a song 💓 (Insert it into liked_songs table in database)
      const { error } = await supabaseClient
        .from('liked_songs')
        .insert({
          song_id: songId,
          user_id: user.id
        });
      
        if (error) {
          toast.error(error.message);
        } else {
          setIsLiked(true);
          toast.success("Liked!");
        }
    }
    router.refresh();
  }


  return ( 
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ?  '#22c55e' : 'white'} size={25}/> {/** Fill in heart with white if liked */}
    </button>
   );
}
 
export default LikeButton;