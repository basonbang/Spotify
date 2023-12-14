"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId)
  const songUrl = useLoadSongUrl(song!); // assert that the song will not be null / undefined

  // don't load player if no song, songurl, or active ID for player
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  // Rerenders Player each song change, ensuring it reflects current song, even if song properties/metadata are the same
  return ( 
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerContent key={songUrl} song={song} songUrl={songUrl}/>
    </div>
   );
}
 
export default Player;