# Vibe - Let Your Votes Choose the Beat

[![Website](https://img.shields.io/website-up-down-green-red/https/getvibe.in.svg)](https://getvibe.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tanmay11117/vibe/pulls)

Vibe is a **collaborative music platform** where your votes shape the playlist. Join a community-driven experience to discover and influence the music that plays. Vote for your favorite tracks and enjoy a dynamic, ever-changing listening journey!

## 🚀 Features

- **Vote-Based Playlists**: Let your votes determine the next song.
- **Trending Tracks**: Stay up-to-date with what's hot and popular in the music world.
- **Personalized Experience**: The more you engage, the more tailored the playlist becomes.
- **Real-Time Interaction**: Watch your votes make an immediate impact on the playlist.

## 🌟 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Custom hooks, Context API
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Third-Party Integrations**:
  - Google Analytics
  - Google Tag Manager
- **Real-Time Updates**: [Socket.IO](https://socket.io/) for real-time voting and playlist updates

## 💻 Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/tanmay11117/vibe.git
    cd vibe
    ```

2.  Install dependencies using pnpm:

    ```bash
    pnpm install
    ```

3.  Create a `.env.local` file in the root directory and populate it with the necessary environment variables.  You can use the `.env.sample` file as a template.

    ```
    MONGODB_URL=
    FIREBASE_API_KEY=
    BACKEND_URI=
    SOCKET_URI=
    JWT_SECRET=
    SPOTIFY_CLIENT_ID=
    SPOTIFY_CLIENT_SECRET=
    SPOTIFY_REDIRECT_URL=
    COOKIES=
    STREAM_URL=
    LOCK_SECRET=
    GLOBAL_BACKEND_URI=
    VIDEO_STREAM_URI=
    BACKGROUND_STREAM_URI=
    ```

## ⚙️ Configuration

The application relies on several environment variables for configuration. Here's a breakdown of the key variables:

- `MONGODB_URL`:  The URL for connecting to your MongoDB database.
- `FIREBASE_API_KEY`: API key for your Firebase project.
- `BACKEND_URI`: The base URI for your backend server.
- `SOCKET_URI`: The URI for the Socket.IO server.
- `JWT_SECRET`: Secret key used for signing JSON Web Tokens. Ensure this is a strong, randomly generated string.
- `SPOTIFY_CLIENT_ID`:  Your Spotify application's client ID.
- `SPOTIFY_CLIENT_SECRET`: Your Spotify application's client secret.
- `SPOTIFY_REDIRECT_URL`: The URL Spotify will redirect to after user authentication.
- `COOKIES`: String for cookie management, ensure proper setting for the application.
- `STREAM_URL`: URL for music streaming.
- `LOCK_SECRET`: Secret used with the `tanmayo7lock` library.
- `GLOBAL_BACKEND_URI`: The base URI for global backend operations.
- `VIDEO_STREAM_URI`: URI for streaming video content.
- `BACKGROUND_STREAM_URI`: URI for background streaming purposes.
- `FIREBASE_AUTH_DOMAIN`: The domain of your Firebase Authentication instance.
- `FIREBASE_PROJECT_ID`: The ID of your Firebase project.
- `FIREBASE_STORAGE_BUCKET`: The name of your Firebase Storage bucket.
- `FIREBASE_MESSAGING_SENDER_ID`: The sender ID for Firebase Cloud Messaging.
- `FIREBASE_APP_ID`: The unique ID of your Firebase app.
- `FIREBASE_MEASUREMENT_ID`: The measurement ID for Google Analytics in Firebase.
- `UPLOAD_LOCATION`: Where uploaded files are stored.
- `UPLOAD_SITE_KEY`:  Site key for upload service.
- `UPLOAD_KEY`: Key for upload service.
- `UPLOAD_URL`: URL endpoint for uploads.
- `UPLOAD_DOMAIN`:  Domain for uploads.
- `UPLOAD_SOURCE`: Source identifier for uploads.
- `MAC_DOWNLOAD_URL`: Download link for the macOS app.
- `WINDOW_DOWNLOAD_URL`: Download link for the Windows app.
- `PROXY_SERVER_URL`: URL for the proxy server, if any.
- `SEARCH_API`: URI for searching songs.

## 📋 Usage

1.  Start the development server:

    ```bash
    pnpm dev
    ```

2.  Open your browser and navigate to `http://localhost:3000` (or the address shown in the console).

## Functionality Overview

### Room Creation

The Vibe application allows users to create listening rooms.  When a user lands on the root (`/`) route, they can either create a new room or be redirected to their browse page if logged in.  Room names can be checked for availability before creation to avoid conflicts.

```typescript
// Example: Checking if a room name is available

const res = await api.get(
  `${process.env.SOCKET_URI}/api/checkroom?r=${roomName}`,
  {
    showErrorToast: false,
    signal: controller.signal,
  }
);
```

### User Authentication

Users authenticate via Firebase and their JWT Token is used to handle sessions

```typescript
//Login a User
const result = await signInWithPopup(auth, provider);
const user = result.user;

if (user) {
    const res = await api.post(`${process.env.SOCKET_URI}/api/auth`, {
        token: await user.getIdToken(),
    });
    if (res.success) {
        await api.post(`/api/login`, { token: (res.data as any)?.token });
        await signOut(auth);
        window.location.reload();
    }
}
```

### Queue Management

The application provides a robust queue management system. Administrators can add songs to the queue, and users can vote on the songs. The song with the most votes plays next.  The app uses Socket.IO for real-time updates of the queue.

```typescript
// Example: Adding a song to the queue (from SearchSongPopup.tsx)

await addSong(selectedSongs, roomId);

// Example: Emitting message to update the queue (from AddToQueue.tsx)
emitMessage("update", "update");
```

### Playing Songs

The `AudioProvider` component manages the audio playback through React Context.

```tsx
// Example: playing a song (in src/components/common/PlayButton.tsx)

<svg
    className={cn("size-4", className)}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M14.8324 9.66406C15.0735 9.47748 15.2686 9.23818 15.4029 8.9645C15.5371 8.69082 15.6069 8.39004 15.6069 8.0852C15.6069 7.78036 15.5371 7.47957 15.4029 7.20589C15.2686 6.93221 15.0735 6.69291 14.8324 6.50634C11.7106 4.09079 8.22476 2.18684 4.50523 0.86576L3.82515 0.624141C2.5254 0.162771 1.15171 1.04177 0.9757 2.38422C0.484012 6.16897 0.484012 10.0014 0.9757 13.7862C1.15275 15.1286 2.5254 16.0076 3.82515 15.5463L4.50523 15.3046C8.22476 13.9836 11.7106 12.0796 14.8324 9.66406Z"
        fill="white"
    />
</svg>
```

### Real-time Updates

Socket.IO is heavily used for real-time communication between clients and the server.  This includes:

-   **Voting:**  When a user votes, the server updates the vote count and broadcasts the changes to all connected clients.
-   **Queue updates**: Whenever the queue changes, such as adding, removing, or reordering songs.
-   **Chat**: For sending and receiving messages between users in a room.
-   **Now Playing**:  Broadcasting the currently playing song.

### Drag and Drop

The ability to drag songs around and sort and the ability to drag songs to different playlists are both done via various event handlers and passed between components.

```typescript
//in the QueueList component
const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    song: searchResults
  ) => {
    setShowDragOptions(true);
    setShowAddDragOptions(true);
    e.dataTransfer.setData("application/json", JSON.stringify(song));
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowDragOptions(false);
    setShowAddDragOptions(false);
  };
```

## 🛡️ License

This project is licensed under the MIT License - see the `LICENSE` file for details.
