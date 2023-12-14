"use client";

import { Song } from "@/types";
import  { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2"
import { useEffect, useState } from "react";

import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ( {song, songUrl} ) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // dynamically set play and volume icons based on their respective states
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    // Check if playlist is empty
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId) // Get ID of current song
    const nextSong = player.ids[currentIndex + 1]; // Retrieve ID of the next song

    if (!nextSong) return player.setId(player.ids[0]); // End of playlist: Return to first song in the playlist

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    // Check if playlist is empty
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId) 
    const prevSong = player.ids[currentIndex - 1];  // Retrieve ID of previous song

    if (!prevSong) return player.setId(player.ids[player.ids.length - 1]);  // Beginning of playlist: Go to last song from playlist

    player.setId(prevSong);
  }

  // Returns function to play sound & an object with the pause function and sound instance
  const [play, { pause, sound }] = useSound(
    songUrl,
    {
      volume : volume,
      onplay: () => setIsPlaying(true), // Called when sound starts playing
      onend: () => {                    // Called when sound ends, automatically plays next song
        setIsPlaying(false);            
        onPlayNext();
      },
      onpause: () => setIsPlaying(false), // Called when sound is paused
      format: ['mp3'] // Specifies audio format to .mp3 files
    }
  );

  useEffect(() => {
    sound?.play();  // When 'sound' object is available, play sound

    // Clean-up function
    return () => {
      sound?.unload();  // Unload song from memory when component unmounts / effect reruns
    }
  }, [sound]);

  // Toggles playback state of audio
  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  // Toggles mute state of audio
  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }
  

  return (  
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      {/** Song information & Like Button */}
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song}/>
          <LikeButton songId={song.id}/>
        </div>
      </div>

      {/** Mobile View: Play/Pause Button */}
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
      </div>

      {/** Desktop: Playback Controls */}
      <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" onClick={onPlayPrevious}/>
        <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition"  />
      </div>

      {/** Desktop: Volume Controls */}
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34}/>
          <Slider value={volume} onChange={(value) => setVolume(value)}/>
        </div>
      </div>
    </div>
  );
}
 
export default PlayerContent;