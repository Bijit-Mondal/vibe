"use client";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import DraggableOptions from "./DraggableOptions";
import { TUser } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "@/store/userStore";
import Popups from "./Popups";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getSpotifyTrackID } from "@/utils/utils";
import useAddSong from "@/Hooks/useAddSong";
import Feedback from "./Feedback";

export default function Home({
  user,
  roomId,
}: {
  user: TUser;
  roomId?: string;
}) {
  const { socketRef } = useUserContext();
  const [designerText] = useState<string>(() => {
    const designers = ["Designed by Ajay", "by Babyo7_", "Vibe"];
    return designers[Math.floor(Math.random() * designers.length)];
  });
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const { addSong } = useAddSong();

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const droppedUrl = event?.clipboardData?.getData("text");
      if (!droppedUrl) return;

      if (
        droppedUrl.includes("youtube.com") ||
        droppedUrl.includes("youtu.be")
      ) {
        const res = await api.get(
          `${process.env.SOCKET_URI}/api/search/?name=${droppedUrl}&page=0`,
          { showErrorToast: false }
        );
        if (res.success) {
          const data = res.data as any;
          const song = data?.data;
          if (song?.results && song?.results.length > 0) {
            await addSong(song.results, roomId);
          } else {
            toast.error("No track found 😭");
          }
        }
        return;
      }

      if (droppedUrl.includes("spotify.com")) {
        const id = getSpotifyTrackID(droppedUrl);
        if (!id) {
          toast.error("No track found 😭");
          return;
        }
        const res = await api.get(
          `${process.env.SOCKET_URI}/api/spotify/${id}`,
          { showErrorToast: false }
        );
        if (res.success) {
          const data = res.data as any;
          const song = data?.data;
          if (song?.results && song?.results.length > 0) {
            await addSong(song.results, roomId);
          } else {
            toast.error("No track found 😭");
          }
        }
        return;
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [addSong, roomId]);

  useEffect(() => {
    if (socketRef.current?.connected) {
      setTimeout(() => setShowLoader(false), 700);
      return;
    }
    setShowLoader(true);
  }, [socketRef]);

  return (
    <>
      <Popups />
      <Feedback />
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="w-full inset-0 max-md:px-5 max-md:text-xl text-zinc-200 h-screen bg-black backdrop-blur-xl z-50 absolute flex items-center flex-col justify-center text-xl font-semibold"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loaderVariants}
          >
            {designerText}
          </motion.div>
        )}
      </AnimatePresence>
      <DraggableOptions />
      <div
        className={`${
          socketRef.current.connected ? "opacity-100" : "opacity-0"
        }  bg-cover absolute w-full top-0 flex flex-col items-center justify-center h-full md:py-2.5`}
      >
        <Header user={user} roomId={roomId} />

        <div className="max-md:w-full max-md:gap-0 h-full z-40 flex-wrap flex overflow-hidden max-xl:w-11/12 max-lg:w-11/12 max-sm:w-full max-md:overflow-scroll hide-scrollbar py-3 max-md:py-0 gap-3 w-7/12">
          <Player />

          <AddToQueue />
        </div>

        <Footer />
      </div>
    </>
  );
}
