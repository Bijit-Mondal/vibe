"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { roomsData } from "@/lib/types";
import { useUserContext } from "@/store/userStore";

interface RoomCardsProps {
  RoomsData: roomsData[];
  onDrop: (e: React.DragEvent, roomId: string) => void;
}

export default function RoomCards({ RoomsData, onDrop }: RoomCardsProps) {
  const { roomId } = useUserContext();
  const [rooms, setRooms] = useState<roomsData[]>([]);
  const [draggingStates, setDraggingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRooms(RoomsData);
    setDraggingStates(
      Object.fromEntries(RoomsData?.map((room) => [room.roomId, false]))
    );
  }, [RoomsData]);

  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  const handleDragEnter = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    setDraggingStates((prev) => ({ ...prev, [roomId]: true }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;

    const { clientY } = e;
    const { top, bottom, height } = container.getBoundingClientRect();
    const scrollSpeed = 15;
    const triggerZone = height * 0.3; // 30% of height for top and bottom zones

    const distanceFromTop = clientY - top;
    const distanceFromBottom = bottom - clientY;

    if (distanceFromTop < triggerZone) {
      // Scroll up when near top
      const intensity = 1 - distanceFromTop / triggerZone;
      if (!autoScrollIntervalRef.current) {
        autoScrollIntervalRef.current = window.setInterval(() => {
          container.scrollTop -= scrollSpeed * intensity;
        }, 0);
      }
    } else if (distanceFromBottom < triggerZone) {
      // Scroll down when near bottom
      const intensity = 1 - distanceFromBottom / triggerZone;
      if (!autoScrollIntervalRef.current) {
        autoScrollIntervalRef.current = window.setInterval(() => {
          container.scrollTop += scrollSpeed * intensity;
        }, 0);
      }
    } else {
      // Stop scrolling in middle zone
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    setDraggingStates((prev) => ({ ...prev, [roomId]: false }));
  };

  const handleDrop = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    setDraggingStates((prev) => ({ ...prev, [roomId]: false }));
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
    onDrop(e, roomId);
  };

  const handleDragEnd = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  return (
    <>
      <div className="fixed right-5 top-5 ">
        <div
          className="flex flex-col space-y-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onDragOver={handleDragOver}
        >
          {rooms
            ?.filter((r) => r?.roomId !== roomId)
            ?.slice(0, 3)
            ?.map((room, index) => (
              <motion.div
                key={room.roomId}
                onDragEnter={(e) => handleDragEnter(e, room?.roomId)}
                onDragOver={(e) => handleDragEnter(e, room?.roomId)}
                onDragLeave={(e) => handleDragLeave(e, room?.roomId)}
                onDrop={(e) => handleDrop(e, room?.roomId)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.1,
                }}
              >
                <Card
                  className={` aspect-square h-44 w-52 transition-all duration-200 ease-in-out flex-shrink-0 ${
                    draggingStates[room?.roomId] ? "scale-95" : "scale-100"
                  }`}
                >
                  <CardContent className="p-0 h-full">
                    <div
                      className={`relative w-full h-full border rounded-xl overflow-hidden ${
                        draggingStates[room?.roomId]
                          ? "border-primary"
                          : "border-muted"
                      }`}
                    >
                      <Image
                        height={500}
                        width={500}
                        src={room?.background}
                        alt={room?.name[0]}
                        className="w-full h-full aspect-square"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"></div>
                      <div className="absolute capitalize top-2 left-2  text-white font-medium">
                        {room?.name[0]}
                      </div>
                      <button
                        className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                        aria-label={`Drop area for ${room?.name[0]}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>

      <div className="fixed left-5 top-5 ">
        <div
          ref={scrollContainerRef}
          className="flex flex-col space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onDragOver={handleDragOver}
        >
          {rooms
            ?.filter((r) => r?.roomId !== roomId)
            ?.slice(3, rooms.length)
            ?.map((room, index) => (
              <motion.div
                key={room.roomId}
                onDragEnter={(e) => handleDragEnter(e, room?.roomId)}
                onDragOver={(e) => handleDragEnter(e, room?.roomId)}
                onDragLeave={(e) => handleDragLeave(e, room?.roomId)}
                onDrop={(e) => handleDrop(e, room?.roomId)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.1,
                }}
              >
                <Card
                  className={` aspect-square h-44 w-52 transition-all duration-200 ease-in-out flex-shrink-0 ${
                    draggingStates[room?.roomId] ? "scale-95" : "scale-100"
                  }`}
                >
                  <CardContent className="p-0 h-full">
                    <div
                      className={`relative w-full h-full border rounded-xl overflow-hidden ${
                        draggingStates[room?.roomId]
                          ? "border-primary"
                          : "border-muted"
                      }`}
                    >
                      <Image
                        height={500}
                        width={500}
                        src={room?.background}
                        alt={room?.name[0]}
                        className="w-full h-full aspect-square"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"></div>
                      <div className="absolute capitalize top-2 left-2  text-white font-medium">
                        {room?.name[0]}
                      </div>
                      <button
                        className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                        aria-label={`Drop area for ${room?.name[0]}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </>
  );
}
