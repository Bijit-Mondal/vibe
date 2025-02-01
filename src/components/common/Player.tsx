"use client";
import { useAudio } from "@/store/AudioContext";
import { formatArtistName } from "@/utils/utils";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./Chat";
import Listeners from "./Listeners";

import parse from "html-react-parser";
import UpNextSongs from "./UpNextSongs";
import ProgressBar from "./ProgressBar";
import Controller from "./Controller";
import PLayerCover from "./PLayerCover";
import { useUserContext } from "@/store/userStore";
import Changelog from "./Changelog";
import DesktopChangeLog from "./DesktopChangeLog";
function MemoPLayer() {
  const { isChatOpen, setIsChatOpen } = useUserContext();

  const { currentSong } = useAudio();

  const chatVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

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
  }, [isChatOpen, setIsChatOpen]);

  return (
    <div className=" relative hide-scrollbar max-md:w-full max-md:rounded-none max-md:border-none overflow-y-scroll w-1/2 backdrop-blur-lg md:h-full border border-white/15 flex-grow rounded-2xl p-8 pt-11 md:px-5 flex flex-col items-center justify-between px-4 gap-[2.5dvh]">
      <AnimatePresence key={"chat opened"}>
        <motion.div
          style={{
            opacity: isChatOpen ? 1 : 0,

            zIndex: isChatOpen ? 10 : -10,
          }}
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
          <Chat setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen} />
        </motion.div>
      </AnimatePresence>

      <div
        style={{ opacity: isChatOpen ? 0 : 1 }}
        className="w-full h-full flex flex-col items-center justify-center gap-[2.5dvh]"
      >
        <PLayerCover />

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
        <Controller />
        <ProgressBar />

        <UpNextSongs />
        <div className=" absolute top-4 right-4">
          <Changelog />
          <DesktopChangeLog />
        </div>
        <Listeners className=" max-md:flex hidden " />
      </div>
    </div>
  );
}
const Player = React.memo(MemoPLayer);
export default Player;
