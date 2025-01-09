"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserContext } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { roomsData, searchResults } from "@/lib/types";
import { toast } from "sonner";
import useAddSong from "@/Hooks/useAddSong";
import RoomCards from "./DropRoom";
import { Trash2 } from "lucide-react";
import api from "@/lib/api";

export default function DraggableOptions() {
  const {
    showDragOptions,
    setQueue,
    user,
    setShowDragOptions,
    showAddDragOptions,
    setShowAddDragOptions,
    emitMessage,
  } = useUserContext();
  const [room, setRooms] = useState<roomsData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { addSong } = useAddSong();
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDelete = useCallback(
    (song: searchResults) => {
      if (user?.role === "admin" || song.addedBy === user?._id) {
        emitMessage("deleteSong", {
          queueId: song?.queueId,
          addedBy: song?.addedBy,
        });
        setQueue((prev) => prev.filter((s) => s.id !== song.id));
      } else {
        toast.error("Only admin and user who added can delete.");
      }
    },
    [setQueue, user, emitMessage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const song = JSON.parse(jsonData);
      if (!song) return;
      setIsDragging(false);
      setShowDragOptions(false);
      setShowAddDragOptions(false);
      handleDelete(song);
    },
    [handleDelete, setShowDragOptions, setShowAddDragOptions]
  );
  const handleDropToAdd = useCallback(
    async (e: React.DragEvent, roomId?: string) => {
      e.preventDefault();
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const song = JSON.parse(jsonData);
      if (!song || !roomId) return;
      await addSong([song], roomId, false);
      setIsDragging(false);
      setShowDragOptions(false);
      setShowAddDragOptions(false);
    },
    [setShowAddDragOptions, setShowDragOptions, addSong]
  );

  useEffect(() => {
    if (!user) return;
    api
      .get<any>(`${process.env.SOCKET_URI}/api/rooms/browse`, {
        showErrorToast: false,
      })
      .then((response) => {
        if (response.success) {
          setRooms(response.data.results);
        }
      });
  }, [user]);
  return (
    <div className="fixed z-50  w-full">
      <AnimatePresence>
        {showDragOptions && (
          <motion.div
            key="delete-card"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1,
            }}
          >
            <Card
              className={`fixed right-5 bottom-5 w-52 h-36 transition-all duration-200 ease-in-out ${
                isDragging ? "scale-95" : "scale-100"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-0 h-full">
                <div
                  className={`relative w-full h-full border border-dashed rounded-lg ${
                    isDragging ? "border-red-500" : "border-muted"
                  }`}
                >
                  <Trash2
                    className={`absolute ${
                      isDragging && "text-red-500 opacity-100"
                    } inset-0 m-auto text-muted-foreground opacity-25 w-12 h-12`}
                  />
                  <button
                    className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                    aria-label="Close drop area"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddDragOptions && room && (
          <RoomCards RoomsData={room} onDrop={handleDropToAdd} />
        )}
      </AnimatePresence>
    </div>
  );
}
