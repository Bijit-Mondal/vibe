"use client";
import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";
import React, { useCallback, useState } from "react";
import { BsPip } from "react-icons/bs";
import Image from "next/image";
import UpvotedBy from "./UpvotedBy";
function PLayerCoverComp() {
  const { user, showVideo, setShowVideo } = useUserContext();
  const { currentSong, videoRef } = useAudio();
  const [pip, setPIP] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    if (localStorage.getItem("v")) {
      setShowVideo(null);
      localStorage.removeItem("v");
      return;
    }
    setShowVideo(true), localStorage.setItem("v", "true");
  }, [setShowVideo]);
  const handlePip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      videoRef?.current && videoRef?.current?.requestPictureInPicture().catch();
    },
    [videoRef]
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (currentSong) {
      e.dataTransfer.setData("application/json", JSON.stringify(currentSong));
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={handleDragEnd}
      className=" border-2 border-white/10 relative h-auto min-h-40  overflow-hidden rounded-xl"
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
          className="cover  h-full object-cover  w-full"
          src={
            currentSong?.image[currentSong.image.length - 1].url || "/cache.jpg"
          }
        />
      ) : (
        <div onClick={handleClick} className=" relative">
          {pip && showVideo && (
            <BsPip
              onClick={handlePip}
              className=" absolute  z-10  opacity-70 hover:opacity-100 size-5 top-2.5 right-2.5"
            />
          )}

          <video
            draggable="false"
            style={{ display: showVideo ? "block" : "none" }}
            ref={videoRef}
            muted
            preload="none"
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
            draggable="false"
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
      {/* {currentSong?.source !== "youtube" && (
        <p className=" absolute bottom-2 right-2 text-xl mt-1 text-[#a176eb]">
          ☆
        </p>
      )} */}
      <UpvotedBy />
    </div>
  );
}
const PLayerCover = React.memo(PLayerCoverComp);
export default PLayerCover;
