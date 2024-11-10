"use client";
import { useAudio } from "@/store/AudioContext";
import { formatArtistName, formatElapsedTime } from "@/utils/utils";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VolumeControl from "./VolumeControl";
import { useUserContext } from "@/store/userStore";
import Image from "next/image";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./Chat";
import Listeners from "./Listeners";
import { Slider } from "../ui/slider";
import LikeButton from "./LinkeButton";
// import { socket } from "@/app/socket";
// import useDebounce from "@/Hooks/useDebounce";
import parse from "html-react-parser";
import PlayButton from "./PlayButton";
import UpvotedBy from "./UpvotedBy";
import UpNextSongs from "./UpNextSongs";
import { useSocket } from "@/Hooks/useSocket";
import { socket } from "@/app/socket";
import { BsPip } from "react-icons/bs";
import InviteFriends from "./InviteFriends";
function Player() {
  const { user, showVideo, setShowVideo } = useUserContext();
  const { messages } = useSocket();
  const {
    currentSong,
    progress,
    duration,
    // shuffled,
    playNext,
    playPrev,
    seek,
    volume,
    setVolume,
    setProgress,
    // isLooped,
    // setLoop,
    // setShuffled,
    videoRef,
  } = useAudio();

  const [formattedProgress, setFormattedProgress] = useState<string>("0:00");
  const [formattedDuration, setFormattedDuration] = useState<string>("0:00");
  const [isChatOpen, setIsChatOpen] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() =>
      setFormattedProgress(formatElapsedTime(progress))
    );
  }, [progress]);

  useEffect(() => {
    setFormattedDuration(formatElapsedTime(duration));
  }, [duration]);
  const handleSeek = (e: number[]) => {
    if (e[0]) {
      if (user && user.role !== "admin") {
        return toast.error("Only admin is allowed to seek");
      }
      socket.emit("seek", e[0]);
      seek(e[0]);
    }
  };

  const chatVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [seen, setSeen] = useState<boolean>(true);
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setSeen(true);
    } else {
      if (messagesEndRef.current) {
        setSeen(true);
      }
    }
  }, [messages, isChatOpen]);
  useEffect(() => {
    if (messages.length > 0) {
      setSeen(false);
    }
  }, [messages]);

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
      socket.emit("seek", newProgress);
      seek(newProgress);
    },
    [duration, seek, setProgress, user]
  );
  useEffect(() => {
    const handleCheatCodes = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("keydown", handleCheatCodes);

    return () => {
      document.removeEventListener("keydown", handleCheatCodes);
    };
  }, [isChatOpen]);
  const [pip, setPIP] = useState<boolean>(false);
  return (
    <div className=" relative hide-scrollbar max-md:w-full max-md:rounded-none max-md:border-none overflow-y-scroll w-1/2 backdrop-blur-lg h-full border border-[#49454F] flex-grow rounded-xl p-8 md:px-5 flex flex-col items-center justify-center px-4 gap-[2.5dvh]">
      <AnimatePresence key={"chat opened"}>
        {isChatOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={chatVariants}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className=" h-full z-50 flex flex-col py-2 w-full absolute  backdrop-blur-xl bg-black/10 inset-0"
          >
            <Chat
              //@ts-expect-error:ex
              messagesEndRef={messagesEndRef}
              setIsChatOpen={setIsChatOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{ opacity: isChatOpen ? 0 : 1 }}
        className="w-full h-full flex flex-col items-center justify-center gap-[2.5dvh]"
      >
        <div className=" border-2 border-white/10 relative h-auto min-h-40  overflow-hidden rounded-xl">
          {currentSong?.source !== "youtube" ? (
            <Image
              priority
              title={
                currentSong?.name
                  ? `${currentSong.name} - Added by ${
                      currentSong?.addedByUser?.username !== user?.username
                        ? `${currentSong?.addedByUser?.name} (${currentSong?.addedByUser?.username})`
                        : "You"
                    }`
                  : "No song available"
              }
              alt={currentSong?.name || ""}
              height={300}
              width={300}
              className="cover  h-full object-cover  w-full"
              src={
                currentSong?.image[currentSong.image.length - 1].url ||
                "/cache.jpg"
              }
            />
          ) : (
            <div
              onClick={() => {
                if (localStorage.getItem("v")) {
                  setShowVideo(null);
                  localStorage.removeItem("v");
                  return;
                }

                setShowVideo(true), localStorage.setItem("v", "true");
              }}
              className=" relative"
            >
              {pip && showVideo && (
                <BsPip
                  onClick={(e) => {
                    e.stopPropagation();
                    videoRef?.current &&
                      videoRef?.current?.requestPictureInPicture().catch();
                  }}
                  className=" absolute  z-10 cursor-pointer opacity-70 hover:opacity-100 size-5 top-2.5 right-2.5"
                />
              )}

              <video
                style={{ opacity: showVideo ? 1 : 0 }}
                ref={videoRef}
                muted
                playsInline
                title={
                  currentSong?.name
                    ? `${currentSong.name} - Added by ${
                        currentSong?.addedByUser?.username !== user?.username
                          ? `${currentSong?.addedByUser?.name} (${currentSong?.addedByUser?.username})`
                          : "You"
                      }`
                    : "No song available"
                }
                height={300}
                width={300}
                onLoadStart={() => {
                  setPIP(false);
                }}
                onLoadedMetadata={() => {
                  setPIP(true);
                }}
                onCanPlay={(e) => e?.currentTarget?.play().catch()}
                className="cover absolute h-full object-cover  w-full"
              ></video>

              <Image
                style={{ opacity: showVideo ? 0 : 1 }}
                priority
                title={
                  currentSong?.name
                    ? `${currentSong.name} - Added by ${
                        currentSong?.addedByUser?.username !== user?.username
                          ? `${currentSong?.addedByUser?.name} (${currentSong?.addedByUser?.username})`
                          : "You"
                      }`
                    : "No song available"
                }
                alt={currentSong?.name || ""}
                height={300}
                width={300}
                className="cover z-10  h-full object-cover  w-full"
                src={
                  currentSong?.image[currentSong.image.length - 1].url ||
                  "/cache.jpg"
                }
              />
            </div>
          )}

          <UpvotedBy />
          {currentSong?.source !== "youtube" && (
            <p className=" absolute bottom-2 right-2 text-xl mt-1 text-[#a176eb]">
              ☆
            </p>
          )}
        </div>
        <div className=" text-center w-full -mt-2 items-center justify-center flex flex-col text-sm">
          <p
            title={currentSong?.name || ""}
            className="title text-lg font-medium w-60 truncate"
          >
            {parse(currentSong?.name || "Not Playing")}
          </p>
          <p
            title={
              (currentSong &&
                formatArtistName(currentSong?.artists?.primary)) ||
              "Unknown"
            }
            className="artist text-xs w-56 text-zinc-300 truncate"
          >
            {(currentSong && formatArtistName(currentSong?.artists?.primary)) ||
              "Unknown"}
          </p>
        </div>
        <div className="flex -mt-1 items-center w-full justify-center gap-4">
          <div className=" flex items-center w-fit gap-2">
            <svg
              onClick={playPrev}
              aria-label="play prev"
              className="cursor-pointer size-5 rotate-180"
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
              />
              <path
                d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                fillOpacity="0.5"
              />
            </svg>

            <PlayButton />

            <svg
              onClick={playNext}
              aria-label="play next"
              className="cursor-pointer size-5"
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
              />
              <path
                d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                fillOpacity="0.5"
              />
            </svg>
          </div>
          <div className="text-sm cursor-pointer gap-1.5 w-[30%] items-center flex">
            {volume == 0 ? (
              <VolumeX
                onClick={() => {
                  const volume = localStorage.getItem("volume");
                  if (volume && Number(volume) !== 0) {
                    setVolume(Number(volume));
                    return;
                  }
                  setVolume(0.5);
                }}
                className=" size-6"
              />
            ) : volume < 0.5 ? (
              <Volume1 onClick={() => setVolume(0)} className="size-6" />
            ) : (
              <Volume2 onClick={() => setVolume(0)} className="size-6" />
            )}

            <VolumeControl />
          </div>
        </div>
        <div className=" select-none -my-1 flex items-center gap-4 md:px-4 w-full text-xs">
          <p className=" progress">{formattedProgress}</p>

          <Slider
            max={duration || 0}
            value={[progress]}
            step={1}
            min={0}
            disabled={user?.role !== "admin"}
            onClick={handleValueChange}
            onValueCommit={handleSeek}
            onValueChange={handleProgress}
          />

          <p className=" duration">{formattedDuration}</p>
        </div>
        <div className=" mb-0.5 flex text-zinc-600 gap-3 items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsChatOpen(true)}
            className=" cursor-pointer"
          >
            <path
              d="M21.75 9.34415C21.75 8.94633 21.592 8.5648 21.3107 8.28349C21.0294 8.00219 20.6478 7.84415 20.25 7.84415H17.25V4.84415C17.25 4.44633 17.092 4.0648 16.8107 3.78349C16.5294 3.50219 16.1478 3.34415 15.75 3.34415H3.75C3.35218 3.34415 2.97064 3.50219 2.68934 3.78349C2.40804 4.0648 2.25 4.44633 2.25 4.84415V16.8442C2.25044 16.9853 2.29068 17.1234 2.36608 17.2426C2.44149 17.3619 2.54901 17.4575 2.67629 17.5184C2.80358 17.5793 2.94546 17.603 3.08564 17.5869C3.22581 17.5708 3.3586 17.5155 3.46875 17.4273L6.75 14.7817V17.5942C6.75 17.992 6.90804 18.3735 7.18934 18.6548C7.47064 18.9361 7.85218 19.0942 8.25 19.0942H17.0241L20.5312 21.9273C20.664 22.0346 20.8293 22.0935 21 22.0942C21.1989 22.0942 21.3897 22.0151 21.5303 21.8745C21.671 21.7338 21.75 21.5431 21.75 21.3442V9.34415ZM17.7609 17.761C17.6282 17.6537 17.4629 17.5948 17.2922 17.5942H8.25V14.5942H15.75C16.1478 14.5942 16.5294 14.4361 16.8107 14.1548C17.092 13.8735 17.25 13.492 17.25 13.0942V9.34415H20.25V19.7738L17.7609 17.761Z"
              className={`${
                seen ? "fill-zinc-500" : "fill-red-500"
              } size-5 cursor-pointer hover:fill-zinc-200 `}
            />
          </svg>
          <div title="Suggestions! Coming Soon">
            <svg
              width="25"
              height="26"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-zinc-500 cursor-pointer"
                d="M22 12.92C16.4785 12.92 12 8.44154 12 2.92004C12 8.44154 7.5215 12.92 2 12.92C7.5215 12.92 12 17.3986 12 22.92C12 17.3986 16.4785 12.92 22 12.92Z"
              />
            </svg>
          </div>

          <LikeButton hearts={["❤️", "💛", "😍", "🥰", "🥳"]} />
        </div>
        <UpNextSongs />
        <Listeners className=" max-md:flex hidden mt-10 -mb-10" />
      </div>
      <InviteFriends className=" w-full md:hidden" />
    </div>
  );
}

export default Player;
