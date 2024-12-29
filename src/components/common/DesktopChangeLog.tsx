// import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  //   SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const DesktopChangeLog = () => {
  const heartControls = useAnimation();

  //   // Oscillation effect for the heart
  //   useEffect(() => {
  //     let isMounted = true; // Flag to ensure component is mounted

  //     const oscillate = async () => {
  //       while (isMounted) {
  //         await heartControls.start({
  //           y: -10,
  //           transition: { duration: 1.2, ease: "easeInOut" },
  //         });
  //         await heartControls.start({
  //           y: 10,
  //           transition: { duration: 1.2, ease: "easeInOut" },
  //         });
  //       }
  //     };

  //     return () => {
  //       isMounted = false; // Cleanup on unmount to stop animations
  //     };
  //   }, [heartControls]);
  const handleHoverStart = async () => {
    heartControls.start({
      rotate: 0,
      transition: { type: "spring", stiffness: 100, duration: 0 },
    });
  };

  return;

  return (
    <Sheet>
      <SheetTrigger className=" absolute top-0 focus:outline-none overflow-hidden  right-0">
        <motion.div
          className="relative  size-12 border border-lightPurple rounded-full flex align-middle items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          {/* Rotating Circular SVG */}
          <motion.img
            src="/circle.svg"
            alt="Rotating Text Circle"
            className="absolute w-[97%] will-change-transform"
            initial={{ scale: 0 }} // Start at scale 0
            animate={{
              scale: 1, // Scale to full size
              rotate: 360, // Keep rotating
            }}
            transition={{
              scale: { duration: 0.8, ease: "easeOut", delay: 0.3 }, // Scale animation with delay
              rotate: { duration: 20, ease: "linear" }, // Continuous rotation
            }}
          />

          {/* Center Heart */}
          <div className="relative z-10  size-8 border border-lightPurple rounded-full flex items-center justify-center">
            <motion.img
              className="w-5"
              src="/heart.png"
              alt="the hungry heart"
              initial={{ rotate: -1 }}
              //   animate={heartControls} // Use oscillation controls
              whileHover={{
                rotate: 360,
                transition: { type: "spring", stiffness: 100, duration: 0.6 },
              }}
              onHoverEnd={handleHoverStart}
              // whileHover={{
              //   rotate: 360,
              //   scale:1
              //   // transition: {
              //   //   duration: 1,
              //   // }
              // }} // Flip on hover
            />
          </div>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-[440px] border-white/15 bg-black/20 backdrop-blur-xl">
        <SheetHeader className="flex flex-row justify-between items-center border-b border-white/15 w-full pb-4">
          <SheetTitle className="text-white text-xl">Vibe Log ⚡️</SheetTitle>
          <SheetClose className="focus:outline-none bg-lightPurple rounded-md text-accent p-2">
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>
        <div
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 95%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 95%, transparent 100%)",
          }}
          className=" h-[calc(100vh-100px)] overflow-y-scroll hide-scrollbar"
        >
          <Changelog />
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { marked } from "marked";

// Parse the markdown
const changelogContent = `

<video autoplay playsinline loop muted>
  <source src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/0C86F376-F67E-4778-A657-C6BDB82BF104.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video autoplay playsinline loop muted>
  <source src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/A02BB57B-F48C-421D-B8AC-B48F03C34260.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### ✨ **New Features**

- 🔖 **Copy-Paste to Add Songs**: Simply copy song URLs from platforms like **YouTube** and **Spotify**, and paste them in the app.
- 🚀 **Drag-and-Drop to Add Songs**: Effortlessly drag and drop songs from platforms like **YouTube** and **Spotify**.
- 🧹 **Drag-and-Drop for Organizing**: Move songs between rooms or delete them with drag-and-drop ease.

### 🛠️ **What’s Coming Next?**

- 🎧 **Bookmarks**: Effortlessly save links from platforms like Spotify, YouTube, and others, with seamless playlist synchronization across third-party apps.
- ✏️ **Edit Room Names**: Rename your rooms on the fly.
- 🌎 **Browse and Join Rooms**: Explore public rooms and join them effortlessly.
- 🗑️ **Delete Rooms**: Clear up your list by deleting unused rooms.
- 🔥 **Listening Streaks**: Track and celebrate your listening milestones.
- 🎵 **Fresh UI for Listening**: A new, sleek interface for an improved listening experience.
- ✍️ **Enhanced Profiles (Might Come)**: We’re considering adding support for bios and more optional details to help you personalize your profile.
  If you have any suggestions or ideas, we’d love to hear from you! Please send your feedback our way.

### 📈 **Improvements**

- ⚡️ **Faster Load Times**: Pages now load **40% faster** thanks to optimized code.
- 🧑‍💻 **Streamlined Onboarding**: New users can now get started in **50% less time**.
- 🔍 **Better Search**: Enjoy **auto-suggestions** and lightning-fast search results.

### 🐞 **Bug Fixes**

- ✅ Fixed: User profile updates now reflect immediately.

**Stay tuned!** We’re working hard to bring you more exciting features and improvements. Thank you for being a part of our journey! 💙  


`;

const Changelog = () => {
  const parsedHTML = marked(changelogContent);

  return (
    <div
      className="changelog space-y-8 py-4"
      dangerouslySetInnerHTML={{ __html: parsedHTML }}
    />
  );
};

export default DesktopChangeLog;
