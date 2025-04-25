/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedump.vercel.app",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
      },
      {
        protocol: "https",
        hostname: "c.saavncdn.com",
      },
    ],
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    BACKEND_URI: process.env.BACKEND_URI,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URL: process.env.SPOTIFY_REDIRECT_URL,
    SOCKET_URI: process.env.SOCKET_URI,
    COOKIES: process.env.COOKIES,
    LOCK_SECRET: process.env.LOCK_SECRET,
    STREAM_URL: process.env.STREAM_URL,
    GLOBAL_BACKEND_URI: process.env.GLOBAL_BACKEND_URI,
    VIDEO_STREAM_URI: process.env.VIDEO_STREAM_URI,
    BACKGROUND_STREAM_URI: process.env.BACKGROUND_STREAM_URI,
    SEARCH_API: process.env.SEARCH_API,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    UPLOAD_LOCATION: process.env.UPLOAD_LOCATION,
    UPLOAD_SITE_KEY: process.env.UPLOAD_SITE_KEY,
    UPLOAD_KEY: process.env.UPLOAD_KEY,
    UPLOAD_URL: process.env.UPLOAD_URL,
    UPLOAD_DOMAIN: process.env.UPLOAD_DOMAIN,
    UPLOAD_SOURCE: process.env.UPLOAD_SOURCE,
    MAC_DOWNLOAD_URL: process.env.MAC_DOWNLOAD_URL,
    WINDOW_DOWNLOAD_URL: process.env.WINDOW_DOWNLOAD_URL,
    PROXY_SERVER_URL: process.env.PROXY_SERVER_URL,
    SEARCH_API: process.env.SEARCH_API,
  },
};

export default nextConfig;
