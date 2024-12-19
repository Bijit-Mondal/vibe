"use client";

import { useUserContext } from "@/store/userStore";
// import useDebounce from "@/Hooks/useDebounce";
import { Heart } from "lucide-react";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { decrypt } from "tanmayo7lock";
import Changelog from "./_Changelog";

interface LikeButtonProps {
  hearts?: string[]; // Array of heart emojis or icons
  maxSize?: number; // Maximum size for the images/hearts
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  hearts = ["❤️", "💛", "😍", "🥰", "🥳"],
  maxSize = 40,
  setIsChatOpen,
}) => {
  const { user, emitMessage, socketRef, seen } = useUserContext();
  const [users, setLikEffectUser] = useState<{ imageUrl: string }[]>([]);
  const handleHeart = useCallback((data: any) => {
    const value = decrypt(data) as { imageUrl: string };
    if (value?.imageUrl) {
      setLikEffectUser([value]);
    }
  }, []);
  useEffect(() => {
    const currentSocket = socketRef.current;
    currentSocket.on("heart", handleHeart);
    return () => {
      currentSocket.off("heart", handleHeart);
    };
  }, [socketRef, handleHeart]);
  const heartRef = useRef<SVGSVGElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      const xPos = event.clientX;
      const yPos = event.clientY;

      // Function to create and style an element
      const createElement = (
        url: string | null,
        size: number,
        left: number,
        top: number,
        isHeart: boolean
      ) => {
        const el = document.createElement("div");
        el.style.zIndex = "100";
        el.style.position = "absolute";
        el.style.left = left + "px";
        el.style.top = top + "px";
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.background = isHeart ? "none" : `url('${url}')`; // Use image URL or no background for heart
        el.style.backgroundSize = "cover"; // Ensure the image covers the div
        el.style.borderRadius = "50%"; // Make it rounded
        el.style.pointerEvents = "none"; // Disable pointer events
        el.style.animation = "heartAnimation 6s linear"; // Set the animation
        el.style.opacity = "0.5"; // Set opacity

        if (isHeart) {
          el.textContent = hearts![Math.floor(Math.random() * hearts!.length)]; // Set a random heart emoji from the array
          el.style.fontSize = size + "px"; // Set font size for heart
          el.style.color = "red"; // Set heart color
          el.style.lineHeight = `${size}px`; // Center heart vertically
          el.style.textAlign = "center"; // Center heart horizontally
        }

        return el;
      };

      // Generate a size based on the number of users or the maximum size
      const size = Math.min(maxSize, 40 / users!.length); // Adjust size based on number of users

      // Loop through users and create elements for each user's image
      users?.forEach((user) => {
        if (user.imageUrl) {
          // Generate random offsets for better spacing
          const randomXOffset = Math.random() * 80 - 40; // Random offset between -40 and 40
          const randomYOffset = Math.random() * 80 - 40; // Random offset between -40 and 40

          // Adjust yPos to create the effect of spawning above the heart
          const imageEl = createElement(
            user.imageUrl,
            size,
            xPos + randomXOffset,
            yPos - size + randomYOffset, // Change this to spawn above
            false
          );

          const heartEl = createElement(
            null,
            size / 2,
            xPos + randomXOffset + 20,
            yPos - size + randomYOffset, // Change this to spawn above
            true
          );

          // Append elements to the body
          document.body.appendChild(imageEl);
          document.body.appendChild(heartEl);

          // Remove elements after the animation completes (6 seconds)
          setTimeout(() => {
            imageEl.remove();
            heartEl.remove();
            setLikEffectUser([]);
          }, 2500);
        }
      });
    },
    [users, hearts, maxSize]
  );
  useEffect(() => {
    if (heartRef.current && users?.length > 0) {
      // Get the bounding box of the Heart component
      const heartRect = heartRef.current.getBoundingClientRect();

      // Simulate a click at the center of the Heart component
      handleClick({
        clientX: heartRect.left + heartRect.width / 2, // Center horizontally
        clientY: heartRect.top + heartRect.height / 2, // Center vertically
      } as React.MouseEvent<HTMLDivElement>); // Manually cast as a MouseEvent
    }
  }, [handleClick, users]);

  const handleEmit = useCallback(() => {
    if (user?.imageUrl) {
      setLikEffectUser([{ imageUrl: user.imageUrl }]);
      emitMessage("heart", { imageUrl: user.imageUrl });
    }
  }, [user, emitMessage]);

  return (
    <div className=" mb-0.5 flex gap-3 items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setIsChatOpen(true)}
        className=" "
      >
        <path
          d="M21.75 9.34415C21.75 8.94633 21.592 8.5648 21.3107 8.28349C21.0294 8.00219 20.6478 7.84415 20.25 7.84415H17.25V4.84415C17.25 4.44633 17.092 4.0648 16.8107 3.78349C16.5294 3.50219 16.1478 3.34415 15.75 3.34415H3.75C3.35218 3.34415 2.97064 3.50219 2.68934 3.78349C2.40804 4.0648 2.25 4.44633 2.25 4.84415V16.8442C2.25044 16.9853 2.29068 17.1234 2.36608 17.2426C2.44149 17.3619 2.54901 17.4575 2.67629 17.5184C2.80358 17.5793 2.94546 17.603 3.08564 17.5869C3.22581 17.5708 3.3586 17.5155 3.46875 17.4273L6.75 14.7817V17.5942C6.75 17.992 6.90804 18.3735 7.18934 18.6548C7.47064 18.9361 7.85218 19.0942 8.25 19.0942H17.0241L20.5312 21.9273C20.664 22.0346 20.8293 22.0935 21 22.0942C21.1989 22.0942 21.3897 22.0151 21.5303 21.8745C21.671 21.7338 21.75 21.5431 21.75 21.3442V9.34415ZM17.7609 17.761C17.6282 17.6537 17.4629 17.5948 17.2922 17.5942H8.25V14.5942H15.75C16.1478 14.5942 16.5294 14.4361 16.8107 14.1548C17.092 13.8735 17.25 13.492 17.25 13.0942V9.34415H20.25V19.7738L17.7609 17.761Z"
          className={`${
            seen ? "fill-zinc-400" : "fill-red-500"
          } size-5  hover:fill-zinc-200 `}
        />
      </svg>
      <Changelog />

      <Heart
        ref={heartRef}
        onClick={handleEmit}
        className="size-[1.27rem] text-zinc-100 hover:fill-red-500 hover:text-red-500 hover:opacity-100 opacity-70 transition-all hover:scale-125 active:scale-75 duration-100 "
      />
    </div>
  );
};
export default LikeButton;
