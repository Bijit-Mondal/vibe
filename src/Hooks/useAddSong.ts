import api from "@/lib/api";
import { searchResults } from "@/lib/types";
import { useUserContext } from "@/store/userStore";
import { useCallback } from "react";
import { toast } from "sonner";

function useAddSong() {
  const { queue, socketRef, emitMessage } = useUserContext();
  const addSong = useCallback(
    async (
      selectedSongs: searchResults[],
      roomId?: string | null,
      check: boolean = true
    ) => {
      if (!roomId) return;
      let uniqueSongs: searchResults[] = [];
      if (check) {
        const queuedSongIds = new Set(queue?.map((song) => song.id));
        uniqueSongs = selectedSongs.filter(
          (song) => !queuedSongIds.has(song.id)
        );

        if (uniqueSongs.length === 0) {
          toast.info("No new songs to add.");
          return;
        }
      }

      toast.loading("Adding songs to queue", { id: "adding" });
      const added = await api.post(
        `${process.env.SOCKET_URI}/api/add?room=${roomId}`,
        check ? uniqueSongs : selectedSongs
      );
      if (added.success) {
        emitMessage("update", "update");
        toast.success(
          `${selectedSongs.length == 1 ? "Song" : "Songs"} added to  ${
            check ? "queue" : roomId
          }`
        );
        if (!check) {
          socketRef.current.emit("event", roomId);
        }
      }
      toast.dismiss("adding");
    },
    [queue, socketRef, emitMessage]
  );

  return { addSong };
}

export default useAddSong;
