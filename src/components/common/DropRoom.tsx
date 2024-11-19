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
      Object.fromEntries(RoomsData.map((room) => [room.roomId, false]))
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

    const { clientX } = e;
    const { left, right } = container.getBoundingClientRect();
    const scrollSpeed = 5;

    if (clientX > right - 50) {
      if (!autoScrollIntervalRef.current) {
        autoScrollIntervalRef.current = window.setInterval(() => {
          container.scrollLeft += scrollSpeed;
        }, 16);
      }
    } else if (clientX < left + 50) {
      if (!autoScrollIntervalRef.current) {
        autoScrollIntervalRef.current = window.setInterval(() => {
          container.scrollLeft -= scrollSpeed;
        }, 16);
      }
    } else {
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
    <div className="fixed right-5 top-5 ">
      <div
        ref={scrollContainerRef}
        className="flex flex-col space-y-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onDragOver={handleDragOver}
      >
        {rooms
          ?.filter((r) => r.roomId !== roomId)
          ?.map((room, index) => (
            <motion.div
              key={room.roomId}
              onDragEnter={(e) => handleDragEnter(e, room.roomId)}
              onDragLeave={(e) => handleDragLeave(e, room.roomId)}
              onDrop={(e) => handleDrop(e, room.roomId)}
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
                className={`w-52 h-36 transition-all duration-200 ease-in-out flex-shrink-0 ${
                  draggingStates[room.roomId] ? "scale-95" : "scale-100"
                }`}
              >
                <CardContent className="p-0 h-full">
                  <div
                    className={`relative w-full h-full border border-dashed rounded-lg overflow-hidden ${
                      draggingStates[room.roomId]
                        ? "border-primary"
                        : "border-muted"
                    }`}
                  >
                    <Image
                      height={500}
                      width={500}
                      src={room.background}
                      alt={room.name[0]}
                      className="w-full opacity-80 h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"></div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold">
                      {room.name[0]}
                    </div>
                    <button
                      className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                      aria-label={`Drop area for ${room.name[0]}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
