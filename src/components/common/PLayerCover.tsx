"use client";
import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";
import React from "react";
import Image from "next/image";
import UpvotedBy from "./UpvotedBy";
import YouTube from "react-youtube";
import { decrypt } from "tanmayo7lock";
function PLayerCoverComp() {
  const { user, showVideo, setShowAddDragOptions, emitMessage } =
    useUserContext();
  const { currentSong, state, dispatch, playerRef } = useAudio();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (currentSong) {
      setShowAddDragOptions(true);
      e.dataTransfer.setData("application/json", JSON.stringify(currentSong));
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowAddDragOptions(false);
  };

  const getVideoId = () => {
    try {
      const data = decrypt(currentSong?.downloadUrl?.at(-1)?.url || "");
      return data;
    } catch (error) {
      return "";
    }
  };
  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    if (currentSong?.source === "youtube") {
      event.target?.loadVideoById(getVideoId(), state.currentProgress);
      event.target?.playVideo();
      event.target?.seekTo(state.currentProgress, true);
      const storedVolume = Number(localStorage.getItem("volume")) || 1;
      event.target?.setVolume(storedVolume * 200);
    }
    console.log(event.target);
  };

  return (
    <>
      <div
        style={{ aspectRatio: "1 / 1", opacity: 0 }}
        className=" -z-10 absolute"
      >
        (
        <YouTube
          opts={{
            playerVars: {
              playsinline: 1,
            },
          }}
          onEnd={() => {
            emitMessage("songEnded", "songEnded");
          }}
          videoId={
            currentSong?.source === "youtube"
              ? currentSong?.downloadUrl.at(-1)?.url?.length !== 11
                ? getVideoId()
                : currentSong?.downloadUrl?.at(-1)?.url || ""
              : "demo"
          }
          onPlay={() => {
            const duration = playerRef.current.getDuration();
            dispatch({ type: "SET_DURATION", payload: duration });
            dispatch({ type: "SET_IS_PLAYING", payload: true });
          }}
          onReady={onPlayerReady}
        />
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={handleDragEnd}
        className=" border-2 border-white/10 relative h-auto min-h-40  overflow-hidden rounded-xl "
      >
        {!currentSong?.video ? (
          <Image
            draggable="false"
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
            className="cover aspect-square h-full object-cover  w-full"
            src={
              currentSong?.image[currentSong.image.length - 1].url ||
              "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/d61488c1ddafe4606fe57013728a7e84.jpg"
            }
          />
        ) : (
          <div className=" relative">
            <Image
              draggable="false"
              style={{ opacity: showVideo ? 0 : 1, aspectRatio: "1 / 1" }}
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
              className="cover z-10  aspect-square h-full object-cover  w-full"
              src={
                currentSong?.image[currentSong.image.length - 1].url ||
                "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/d61488c1ddafe4606fe57013728a7e84.jpg"
              }
            />
          </div>
        )}

        {/* {currentSong?.source !== "youtube" && (
        <p className=" absolute bottom-2 right-2 text-xl mt-1 text-[#a176eb]">
          ☆
        </p>
      )} */}
        <UpvotedBy />
      </div>
    </>
  );
}
const PLayerCover = React.memo(PLayerCoverComp);
export default PLayerCover;
