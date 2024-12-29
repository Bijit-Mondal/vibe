"use client"; // need to be fixed  with (useReducer)
import { socket } from "@/app/socket";
import { listener, searchResults, TUser } from "@/lib/types";
import { generateRoomId } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Socket } from "socket.io-client";
import { encrypt } from "tanmayo7lock";

interface UserContextType {
  queue: searchResults[];
  setQueue: React.Dispatch<SetStateAction<searchResults[]>>;
  roomId: string | null;
  setRoomId: React.Dispatch<SetStateAction<string>>;
  user: TUser | null;
  setUser: React.Dispatch<SetStateAction<TUser | null>>;
  setListener: React.Dispatch<SetStateAction<listener | null>>;
  listener: listener | null;
  setUpNextSongs: React.Dispatch<SetStateAction<searchResults[]>>;
  upNextSongs: searchResults[];
  showVideo: boolean | null;
  setShowVideo: React.Dispatch<SetStateAction<boolean | null>>;
  isAdminOnline: React.MutableRefObject<boolean>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
  showDragOptions: boolean;
  setShowDragOptions: React.Dispatch<SetStateAction<boolean>>;
  showAddDragOptions: boolean;
  setShowAddDragOptions: React.Dispatch<SetStateAction<boolean>>;
  socketRef: React.MutableRefObject<Socket>;
  emitMessage: (emit: string, message: any) => void;
  seen: boolean;
  setSeen: React.Dispatch<SetStateAction<boolean>>;
  isElectron: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const search = useSearchParams();
  const [queue, setQueue] = React.useState<searchResults[]>([]);
  const [upNextSongs, setUpNextSongs] = React.useState<searchResults[]>([]);
  const [user, setUser] = React.useState<TUser | null>(null);
  const isAdminOnline = React.useRef<boolean>(true);
  const [isChatOpen, setIsChatOpen] = React.useState<boolean>(false);
  const [showDragOptions, setShowDragOptions] = React.useState<boolean>(false);
  const [showAddDragOptions, setShowAddDragOptions] =
    React.useState<boolean>(false);
  const [listener, setListener] = React.useState<listener | null>(null);
  const [showVideo, setShowVideo] = React.useState<boolean | null>(() => {
    const data =
      typeof window !== "undefined" ? localStorage.getItem("v") : null;
    return data ? JSON.parse(data) : null;
  });
  const [roomId, setRoomId] = React.useState<string>(
    () => search.get("room") || generateRoomId()
  );
  const socketRef = React.useRef(socket);
  const emitMessage = useCallback((emit: string, message: any) => {
    socketRef.current.emit(emit, encrypt(message));
  }, []);
  const [seen, setSeen] = React.useState<boolean>(true);
  const [isElectron, setIsElectron] = React.useState<boolean>(false);
  useEffect(() => {
    setIsElectron(window?.navigator?.userAgent.includes("Electron"));
  }, []);
  const value = useMemo(
    () => ({
      queue,
      setSeen,
      seen,
      socketRef,
      setQueue,
      roomId,
      setRoomId,
      showVideo,
      isElectron,
      setShowVideo,
      user,
      setUser,
      listener,
      setListener,
      setUpNextSongs,
      upNextSongs,
      isAdminOnline,
      isChatOpen,
      setIsChatOpen,
      showDragOptions,
      setShowDragOptions,
      showAddDragOptions,
      setShowAddDragOptions,
      emitMessage,
    }),
    [
      isElectron,
      seen,
      emitMessage,
      listener,
      queue,
      roomId,
      user,
      upNextSongs,
      showVideo,
      isAdminOnline,
      isChatOpen,
      showDragOptions,
      showAddDragOptions,
    ]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider, useUserContext };
