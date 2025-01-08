"use client";
import { useMediaQuery } from "@react-hook/media-query";
import { motion } from "framer-motion";
import { roomsData } from "@/lib/types";
import { Button } from "../ui/button";
import React, { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function Browse({ data = [] }: { data: roomsData[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [roomLink, setRoomLink] = useState<string>("");
  const handleRedirect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomLink.trim().length === 0) return;
    const params = roomLink.startsWith("http")
      ? new URL(roomLink).searchParams
      : undefined;
    const roomName = roomLink.startsWith("http")
      ? params?.get("room")
      : roomLink;
    if (!roomName) return toast.error("Invalid Room Link or id 😼");
    const res = await api.get(
      `${process.env.SOCKET_URI}/api/checkroom?r=${roomName}`,
      {
        showErrorToast: false,
      }
    );
    if (res.status === 409) {
      window.location.href = `/${roomName}`;
    } else {
      toast.error("Room not found 😼");
    }
  };
  // const { setRoomId } = useUserContext();
  return (
    <motion.div
      style={{
        WebkitMaskImage: "linear-gradient(to top, black 95%, transparent 100%)",
        maskImage: "linear-gradient(to top, black 95%, transparent 100%)",
      }}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.5,
        delay: 0.5,
        // type: "spring",
        // stiffness: 45,
      }}
      className=" flex items-center flex-col bg-[#141414] justify-center min-h-dvh py-20  overflow-y-scroll"
    >
      <div className=" flex items-start  px-7 flex-wrap relative justify-center w-full gap-6">
        {data.map((room, index) => (
          <motion.a
            title={room?.name[0]}
            initial={{
              y: isDesktop ? "5dvh" : 0,
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: Number(`${Math.floor(index / 10) + 1}.${index % 10}`),
              // type: "spring",
              // stiffness: 45,
            }}
            href={`/v?room=${room?.roomId}`}
            exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
            key={index}
          >
            {/* <Link
              onClick={() => setRoomId(room?.roomId)}
              href={`/v?room=${room?.roomId}`}
              className=" absolute h-full w-full top-0 left-0"
            ></Link> */}
            <motion.div
              style={{
                backgroundImage: `url('${room?.background || "/bg.webp"}' ) `,
              }}
              className="  bg-no-repeat border-2 hover:border-white/70 transition-all duration-75 overflow-hidden bg-cover h-[12vw] w-[12vw] rounded-md min-h-[100px] min-w-[100px] p-4"
            ></motion.div>
            <p className="  max-md:text-[12px] max-md:w-20 text-center text-[1vw] capitalize  font-medium  tracking-tight truncate w-[12vw] mt-2">
              {room?.name[0]} • {room?.roomId}
            </p>
          </motion.a>
        ))}
        <motion.div
          initial={{
            y: isDesktop ? "5dvh" : 0,
            opacity: 0,
            filter: "blur(10px)",
          }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: Number(
              `${Math.floor(data.length / 10 + 1)}.${data.length % 10}`
            ),
            // type: "spring",
            // stiffness: 45,
          }}
          exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
          className=" flex flex-col max-md:mb-8"
        >
          <a
            href="/v"
            className="border-2 border-muted-foreground/20 border-dashed hover:bg-muted-foreground/5 transition-all duration-150 p-4 flex flex-col items-center justify-center group  h-[12vw] max-md:-mt-2 w-[12vw] rounded-md min-h-[100px] min-w-[100px] group"
          >
            <motion.svg
              initial={{
                y: isDesktop ? "5dvh" : 0,
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                // type: "spring",
                // stiffness: 45,
              }}
              className="md:h-[5vw]  md:w-[5vw] h-[10vw] w-[10vw] rounded-md "
              viewBox="0 0 68 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.5787 43.8314C29.5787 41.0462 27.3208 38.7883 24.5356 38.7883H5.63733C2.99284 38.7883 0.84906 36.6445 0.84906 34C0.84906 31.3556 2.99284 29.2118 5.63733 29.2118H24.5356C27.3208 29.2118 29.5787 26.9539 29.5787 24.1687V5.27045C29.5787 2.62596 31.7224 0.482178 34.3669 0.482178C37.0114 0.482178 39.1552 2.62596 39.1552 5.27045V24.1687C39.1552 26.9539 41.4131 29.2118 44.1983 29.2118H63.0965C65.741 29.2118 67.8848 31.3556 67.8848 34C67.8848 36.6445 65.741 38.7883 63.0965 38.7883H44.1983C41.4131 38.7883 39.1552 41.0462 39.1552 43.8314V62.7297C39.1552 65.3741 37.0114 67.5179 34.3669 67.5179C31.7224 67.5179 29.5787 65.3741 29.5787 62.7297V43.8314Z"
                className=" fill-muted-foreground  transition-all duration-150  "
              />
            </motion.svg>
          </a>
          <p className=" text-center mt-1.5 text-[1.3vw] font-medium   max-md:text-sm max-md:mt-3 tracking-tight transition-all duration-150 ">
            Create Room
          </p>
        </motion.div>
      </div>
      <motion.form
        initial={{
          y: isDesktop ? "5dvh" : 0,
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.5,
          delay: Number(
            `${Math.floor(data.length / 10 + 1)}.${data.length % 10}`
          ),
          // type: "spring",
          // stiffness: 45,
        }}
        onSubmit={handleRedirect}
        className="max-w-[340px] flex fixed bottom-5 h-auto pl-3 pr-1.5 py-1.5 bg-[#c8aeff]/0 rounded-xl border border-[#eaddff]/50 justify-between items-center "
      >
        <div className="flex items-center relative">
          <input
            autoFocus
            name="roomLink"
            value={roomLink}
            onChange={(e) => setRoomLink(e.currentTarget.value)}
            placeholder="Enter room Link or id"
            className="placeholder:animate-pulse pr-2 placeholder:opacity-55 bg-transparent outline-none top-0  text-white text-sm font-medium leading-tight tracking-tight"
          />
        </div>
        <Button
          type="submit"
          className=" bg-white rounded-lg flex-col justify-center items-center gap-2"
        >
          Join
        </Button>
      </motion.form>
    </motion.div>
  );
}
