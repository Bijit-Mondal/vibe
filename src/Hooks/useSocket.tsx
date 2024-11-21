"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  SetStateAction,
} from "react";
import { toast } from "sonner";
import { data, listener, searchResults, TUser } from "@/lib/types";
import { decrypt } from "@/utils/lock";
import api from "@/lib/api";
import { useUserContext } from "@/store/userStore";
import { useAudio } from "@/store/AudioContext";
import useDebounce from "./useDebounce";
import { BACKGROUND_APP_TIMEOUT, delay } from "@/utils/utils";
// Define the shape of a message
export interface Message {
  id: string;
  content: string;
  sender: string;
}

// Define the shape of the context state
interface SocketContextType {
  loading: boolean;
  total: React.MutableRefObject<number | null>;
  handleUpdateQueue: () => void;
  hiddenTimeRef: React.RefObject<number>;
  setPage: React.Dispatch<SetStateAction<number | null>>;
}

// Default context value
const SocketContext = createContext<SocketContextType | null>(null);

// Custom hook to use UserContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a socketProvider");
  }
  return context;
};

// Define props for the UserProvider
interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const {
    setQueue,
    queue,
    setListener,
    setUpNextSongs,
    setUser,
    roomId,
    isAdminOnline,
    socketRef,
  } = useUserContext();

  const isActive = useRef<boolean>(true);
  const { seek, play } = useAudio();

  const hiddenTimeRef = useRef<number>(0);
  const necessaryFetchRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number | null>(1);
  const total = useRef<number | null>(null);

  const listenerControllerRef = useRef<AbortController | null>(null);
  const queueControllerRef = useRef<AbortController | null>(null);
  const upNextSongControllerRef = useRef<AbortController | null>(null);

  const onConnect = useCallback((): void => {
    toast.dismiss("connecting");
  }, []);

  const updateListeners = useCallback(async () => {
    if (!isActive.current) return;
    if (listenerControllerRef.current) {
      listenerControllerRef.current.abort();
    }
    const controller = new AbortController();
    listenerControllerRef.current = controller;
    const data = await api.get(
      `${process.env.SOCKET_URI}/api/listeners?room=${roomId}`,
      { signal: controller.signal }
    );

    if (data.success) {
      setListener(data.data as listener);
    }
  }, [setListener, roomId]);

  const handleError = useCallback((message: string): void => {
    toast.dismiss("connecting");
    toast.error(decrypt(message), { style: { background: "#e94625" } });
  }, []);

  const handleConnectError = useCallback((error: Error): void => {
    toast.dismiss("connecting");
    toast.error(error?.message || "Unable to connect to server", {
      style: { background: "#e94625" },
    });
  }, []);

  const handleUserLeftRoom = useCallback(
    async (data: any) => {
      const user = decrypt(data) as TUser;
      if (user.username === "@someone") return;
      updateListeners();
      toast.info(`${user?.username} has left`, {
        style: { background: "#e94625" },
      });
    },
    [updateListeners]
  );

  const handleUserJoinedRoom = useCallback(
    async (data: any) => {
      const user = decrypt(data) as TUser;
      if (user.username === "@someone") return;
      updateListeners();
      toast.info(`${user?.username} has Joined`);
    },
    [updateListeners]
  );

  const updateQueue = useCallback(async () => {
    if (!isActive.current) {
      necessaryFetchRef.current = true;
      return;
    }
    if (total.current && queue.length >= total.current) return;

    setLoading(true);
    if (queueControllerRef.current) {
      queueControllerRef.current.abort();
    }
    const controller = new AbortController();
    queueControllerRef.current = controller;
    const data = await api.get(
      `${process.env.SOCKET_URI}/api/queue?page=${page}&room=${roomId}&name`,
      {
        signal: controller.signal,
      }
    );
    if (data.success) {
      const value = data.data as data;
      if (value?.results?.length > 0) {
        setQueue((prev) => {
          // Create a Set with IDs from the previous queue to track unique songs
          const songIds = new Set(prev.map((song) => song.id));

          // Filter new results to include only songs not already in the queue
          const uniqueNewSongs = (value.results || []).filter((song) => {
            if (!songIds.has(song.id)) {
              songIds.add(song.id); // Add new song ID to Set
              return true;
            }
            return false;
          });

          // Update the queue with only unique songs
          return [...prev, ...uniqueNewSongs];
        });
      }

      total.current = value?.total;
      setPage(value?.start + 1);
    }
    setLoading(false);
  }, [setQueue, page, queue, total, roomId]);
  const handleUpdateQueue = useDebounce(updateQueue);

  const upNextSong = useCallback(async () => {
    if (!isActive.current) {
      necessaryFetchRef.current = true;
      return;
    }
    if (upNextSongControllerRef.current) {
      upNextSongControllerRef.current.abort();
    }
    const controller = new AbortController();
    upNextSongControllerRef.current = controller;

    const data = await api.get(
      `${process.env.SOCKET_URI}/api/upNextSong?room=${roomId}`,
      {
        signal: controller.signal,
      }
    );
    if (data.success) {
      setUpNextSongs(data.data as searchResults[]);
    }
  }, [roomId, setUpNextSongs]);

  const getUpNextSong = useDebounce(upNextSong);

  const UpdateQueue = useCallback(async () => {
    if (!isActive.current) {
      necessaryFetchRef.current = true;
      return;
    }
    // force update user so that if scrolling then it not reset queue
    setLoading(true);
    if (queueControllerRef.current) {
      queueControllerRef.current.abort();
    }
    const controller = new AbortController();
    queueControllerRef.current = controller;
    const data = await api.get(
      `${process.env.SOCKET_URI}/api/queue?page=1&room=${roomId}&limit=${
        queue.length > 70 ? queue.length : 70
      }&name`,
      {
        headers: {
          nocache: "no-cache",
        },
        signal: controller.signal,
      }
    );
    if (data.success) {
      const value = data.data as data;
      setQueue(value.results); // Replace the queue with the full result

      total.current = value?.total;
      setPage(1);
      getUpNextSong();
    }
    setLoading(false);
  }, [setQueue, queue, roomId, getUpNextSong]);

  const handleJoined = useCallback(
    async (data: any) => {
      const value = decrypt(data) as {
        roomId: string;
        _id: string;
        progress: number;
        role: string;
      };
      if (value?.role) {
        setUser((prev): any => {
          const user = { ...prev };
          user.role = value.role;
          return user;
        });
      }
      const resetUrl = setTimeout(() => {
        window.history.replaceState(null, "", `/v?room=${roomId}`);
      }, 40000);
      seek(value?.progress || 0);
      toast.dismiss("connecting");
      updateListeners();
      handleUpdateQueue();
      upNextSong();
      return () => clearTimeout(resetUrl);
    },
    [handleUpdateQueue, seek, updateListeners, upNextSong, setUser, roomId]
  );

  const handleVisibilityChange = useCallback(async () => {
    if (!window.location.pathname.startsWith("/v")) return;
    if (document.hidden) {
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        hiddenTimeRef.current = Date.now() - startTime;
        // console.log(hiddenTimeRef.current);
        if (
          hiddenTimeRef.current > BACKGROUND_APP_TIMEOUT &&
          isActive.current
        ) {
          isActive.current = false;
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const wasAwayForTooLong = hiddenTimeRef.current > BACKGROUND_APP_TIMEOUT;

      isActive.current = true;
      if (wasAwayForTooLong && necessaryFetchRef.current) {
        await updateListeners();
        await UpdateQueue();
        await delay(200);
        necessaryFetchRef.current = false;
        hiddenTimeRef.current = 0;
        return;
      }
      hiddenTimeRef.current = 0;
    }
  }, [updateListeners, UpdateQueue]);

  useEffect(() => {
    const currentSocket = socketRef.current;
    const handleSeekable = (value: boolean) => {
      isAdminOnline.current = value;
    };

    const handleIsPlaying = (data: any) => {
      if (data) {
        play(decrypt(data));
      }
    };

    const handlePlay = (data: any) => {
      if (data) {
        play(decrypt(data));
      }
    };
    currentSocket.on("connect", onConnect);
    currentSocket.on("error", handleError);
    currentSocket.on("connect_error", handleConnectError);

    currentSocket.on("userLeftRoom", handleUserLeftRoom);
    currentSocket.on("userJoinedRoom", handleUserJoinedRoom);
    currentSocket.on("joined", handleJoined);
    currentSocket.on("update", UpdateQueue);
    currentSocket.on("seekable", handleSeekable);
    currentSocket.on("isplaying", handleIsPlaying);
    currentSocket.on("play", handlePlay);
    currentSocket.on("seek", seek);
    currentSocket.on("profile", updateListeners);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      currentSocket.off("connect", onConnect);
      currentSocket.off("error", handleError);
      currentSocket.off("connect_error", handleConnectError);
      currentSocket.off("userLeftRoom", handleUserLeftRoom);
      currentSocket.off("userJoinedRoom", handleUserJoinedRoom);
      currentSocket.off("update", UpdateQueue);
      currentSocket.off("joined", handleJoined);
      currentSocket.off("seekable", handleSeekable);
      currentSocket.off("isplaying", handleIsPlaying);
      currentSocket.off("play", handlePlay);
      currentSocket.off("seek", seek);
      currentSocket.off("profile", updateListeners);
    };
  }, [
    handleUserLeftRoom,
    onConnect,
    handleJoined,
    handleError,
    handleConnectError,
    handleUserJoinedRoom,
    UpdateQueue,
    play,
    socketRef,
    seek,
    isAdminOnline,
    updateListeners,
    handleVisibilityChange,
  ]);

  return (
    <SocketContext.Provider
      value={{
        total,
        loading,
        handleUpdateQueue,
        setPage,
        hiddenTimeRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
