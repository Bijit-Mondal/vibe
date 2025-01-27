"use client";
import useCache from "@/Hooks/useCache";
import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";

function Background() {
  const { showVideo, setShowVideo } = useUserContext();
  const { currentSong, backgroundVideoRef, state } = useAudio();
  useCache();

  return (
    <div className="h-dvh relative overflow-hidden flex flex-col items-center justify-center w-full">
      {currentSong?.video ? (
        <>
          <video
            style={{ display: showVideo ? "block" : "none" }}
            ref={backgroundVideoRef}
            muted
            playsInline
            title={currentSong?.name || ""}
            height={300}
            width={300}
            preload="none" // Prevents auto-loading
            onError={() => {
              setShowVideo(false);
            }}
            onCanPlay={(e) => e?.currentTarget?.play().catch()}
            className="relative bg-cover object-cover transition-all duration-700 bg-center w-full h-full"
          />

          <div
            className=" absolute bg-cover object-cover transition-all duration-700 bg-no-repeat bg-center w-full h-full"
            style={{
              backgroundImage: `url('${
                currentSong?.image[currentSong?.image?.length - 1]?.url ||
                "/mask.svg"
              }')`,
              opacity: showVideo ? 0 : 1,
            }}
          />
        </>
      ) : (
        <div
          className="relative bg-cover object-cover transition-all duration-700 bg-no-repeat bg-center w-full h-full"
          style={{
            display: state.background ? "" : "none",
            backgroundImage: `url('${
              currentSong?.image[currentSong?.image?.length - 1]?.url ||
              "/mask.svg"
            }')`,
          }}
        />
      )}
    </div>
  );
}

export default Background;
