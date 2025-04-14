"use client";
import VolumeControl from "./VolumeControl";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import PlayButton from "./PlayButton";
import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import LikeButton from "./LinkeButton";

function Controller({ className }: { className?: string }) {
  const { user, emitMessage } = useUserContext();
  const { audioRef, playerRef } = useAudio();
  const [volume, setCurrentVolume] = useState<number>(1);
  const playNext = useCallback(() => {
    audioRef.current?.pause();
    emitMessage("playNext", "playNext");
  }, [emitMessage, audioRef]);

  const playPrev = useCallback(() => {
    audioRef.current?.pause();
    emitMessage("playPrev", "playPrev");
  }, [emitMessage, audioRef]);
  const isAdmin = user?.role === "admin";

  const setVolume = useCallback(
    (value: number, save?: boolean) => {
      if (playerRef.current) {
        playerRef.current.setVolume(value * 200);
      }
      if (audioRef.current) {
        audioRef.current.volume = value;
        if (save) {
          localStorage.setItem("volume", String(value));
        }
      }

      setCurrentVolume(value);
    },
    [audioRef, playerRef]
  );

  const handlePlayPrev = () => {
    if (isAdmin) {
      playPrev();
    } else {
      toast.error("Only admin can play the previous track.");
    }
  };

  const handlePlayNext = () => {
    if (isAdmin) {
      playNext();
    } else {
      toast.error("Only admin can play the next track.");
    }
  };

  const handleVolumeClick = () => {
    if (volume === 0) {
      const storedVolume = localStorage.getItem("volume");
      setVolume(
        storedVolume && Number(storedVolume) !== 0 ? Number(storedVolume) : 0.5
      );
    } else {
      setVolume(0);
    }
  };
  useEffect(() => {
    const volume = localStorage.getItem("volume");
    if (volume && audioRef.current && audioRef?.current.volume !== 0) {
      setVolume(Number(volume));
    }
  }, [audioRef, setVolume]);
  return (
    <div
      className={cn(
        "flex -mt-1 items-center w-full justify-center gap-4",
        className
      )}
    >
      {/* Controls Section */}
      <div className="flex items-center gap-2">
        {/* Play Previous Button */}
        <svg
          onClick={handlePlayPrev}
          aria-label="Play previous track"
          className="w-5 h-5 rotate-180 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 16"
        >
          <path
            d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
            fill={isAdmin ? "#EADDFF" : "#434343"}
          />
          <path
            d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
            fill={isAdmin ? "#EADDFF" : "#434343"}
            fillOpacity="0.5"
          />
        </svg>

        {/* Play Button */}
        <PlayButton />

        {/* Play Next Button */}
        <svg
          onClick={handlePlayNext}
          aria-label="Play next track"
          className="w-5 h-5 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 16"
        >
          <path
            d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
            fill={isAdmin ? "#EADDFF" : "#434343"}
          />
          <path
            d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
            fill={isAdmin ? "#EADDFF" : "#434343"}
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-1.5 w-[30%] cursor-pointer">
        {volume === 0 ? (
          <VolumeX onClick={handleVolumeClick} className="w-6 h-6" />
        ) : volume < 0.5 ? (
          <Volume1 onClick={handleVolumeClick} className="w-6 h-6" />
        ) : (
          <Volume2 onClick={handleVolumeClick} className="w-6 h-6" />
        )}
        <VolumeControl setVolume={setVolume} volume={volume} />
      </div>
      <LikeButton />
    </div>
  );
}

export default Controller;
