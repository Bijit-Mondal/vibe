import { useAudio } from "@/store/AudioContext";
import { Slider } from "../ui/slider";
import { formatElapsedTime } from "@/utils/utils";
import { useUserContext } from "@/store/userStore";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
function ProgressBar({ className }: { className?: string }) {
  const {
    audioRef,
    setProgress,

    // videoRef, backgroundVideoRef,

    seek,
  } = useAudio();
  const [currentProgress, setAudioProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { user, socketRef } = useUserContext();

  const handleSeek = (e: number[]) => {
    if (e[0]) {
      if (user && user.role !== "admin") {
        return toast.error("Only admin is allowed to seek");
      }
      socketRef.current.emit("seek", e[0]);
      seek(e[0]);
    }
  };
  const handleProgress = useCallback(
    (value: number[]) => {
      if (value && value[0] !== undefined) {
        if (user?.role !== "admin") {
          return toast.error("Only admin is allowed to seek");
        }
        setProgress(value[0]);
      }
    },
    [setProgress, user]
  );

  const handleValueChange = useCallback(
    (e: React.MouseEvent) => {
      if (user?.role !== "admin") {
        return toast.error("Only admin is allowed to seek");
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const newProgress = (clickPosition / rect.width) * duration;
      setProgress(newProgress);
      socketRef.current.emit("seek", newProgress);
      seek(newProgress);
    },
    [duration, seek, setProgress, user, socketRef]
  );
  const lastEmittedTime = useRef(0);
  // const lastEmitted = useRef(0);
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      if (Math.abs(currentTime - lastEmittedTime.current) >= 1.0) {
        lastEmittedTime.current = currentTime;
        setAudioProgress(currentTime);
      }
      // if (Math.abs(currentTime - lastEmitted.current) >= 2.5) {
      //   lastEmitted.current = currentTime;
      //   // Sync video progress with audio progress
      //   if (videoRef?.current) {
      //     videoRef.current.currentTime = currentTime;
      //   }

      //   if (backgroundVideoRef?.current) {
      //     backgroundVideoRef.current.currentTime = currentTime;
      //   }
      // }

      if (!audioRef.current.paused) {
        requestAnimationFrame(updateProgress);
      }
    }
  }, [audioRef]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const handlePlay = () => {
      requestAnimationFrame(updateProgress);
    };

    const canPlay = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    if (audioElement) {
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("canplay", canPlay);
      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("canplay", canPlay);
      };
    }
  }, [audioRef, updateProgress]);
  return (
    <div
      className={cn(
        "select-none mb-3 cursor-pointer flex items-center gap-4 md:px-4 w-full text-xs",
        className
      )}
    >
      <p className=" progress">{formatElapsedTime(currentProgress)}</p>

      <Slider
        max={duration || 0}
        value={[currentProgress]}
        step={1}
        min={0}
        disabled={user?.role !== "admin"}
        onClick={handleValueChange}
        onValueCommit={handleSeek}
        onValueChange={handleProgress}
      />

      <p className=" duration">{formatElapsedTime(duration)}</p>
    </div>
  );
}

export default ProgressBar;
