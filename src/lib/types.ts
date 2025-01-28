export interface searchSongResult {
  success: boolean;
  data: data;
}

export interface data {
  total: number;
  start: number;
  results: searchResults[];
}

export interface searchResults {
  id: string;
  name: string;
  artists: { primary: artists[] };
  image: downloadUrl[];
  addedBy: string;
  source?: "youtube";
  downloadUrl: downloadUrl[];
  addedByUser?: TUser;
  queueId?: string;
  voteCount: number;
  topVoters?: TUser[];
  isVoted?: boolean;
  order?: number;
  video?: boolean;
}
export interface downloadUrl {
  quality: string;
  url: string;
}

export interface artists {
  id: number;
  name: string;
  role: string;
  image: [];
  type: "artist";
  url: string;
}

export interface songState {
  isPaused: boolean;
}

export interface TUser {
  _id: string;
  email: string;
  name: string;
  isBookmarked: boolean;
  username: string;
  imageUrl: string;
  role?: "admin" | "listener" | string;
  token?: string;
  imageDelUrl?: string;
  device:
    | "iPhone"
    | "iPad"
    | "Android"
    | "Windows"
    | "Mac"
    | "Linux"
    | "unknown";
}

export interface listener {
  totalUsers: number;
  currentPage: number;
  roomUsers: roomUsers[];
}

export interface roomUsers {
  _id: string;
  userId: TUser;
}

export interface queue {
  _id: string;
  roomId: string;
  songData: searchResults;
  playing: boolean;
}

export interface messages {
  user: TUser;
  message: string;
  time: string;
}

export interface spotifyToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface spotifyPlaylist {
  description: string;
  id: string;
  name: string;
  images: [
    {
      url: string;
    }
  ];
  owner: { display_name: string };
}

export interface spotifyTrack {
  name: string;
  artists: [
    {
      name: string;
    }
  ];
}

export interface spotifyUser {
  display_name: string;
  id: string;
  email: string;
  images: [
    {
      url: string;
    }
  ];
}

export interface roomsData {
  roomId: string;
  name: [string];
  background: string;
}

export interface CachedVideo {
  id: string;
  url: string;
  blob: Blob;
  timestamp: number;
}

export interface uploadedImageT {
  data: { direct_url: string; deletion_url: string };
}

export interface linkPreview {
  title: string;
  description: string;
  image: string | null;
  requestUrl: string;
}
