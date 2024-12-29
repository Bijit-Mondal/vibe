"use client";

import { marked } from "marked";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React from "react";

const changelogContent = `
## **What's New ⚡️**

### 🎬 **Latest Updates**

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

function ChangelogComp() {
  return (
    <Dialog>
      <DialogTrigger>
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:opacity-100 opacity-70 "
        >
          <path
            d="M22.5 12.7192C16.9785 12.7192 12.5 8.24067 12.5 2.71918C12.5 8.24067 8.0215 12.7192 2.5 12.7192C8.0215 12.7192 12.5 17.1977 12.5 22.7192C12.5 17.1977 16.9785 12.7192 22.5 12.7192Z"
            fill="#EADDFF"
          />
        </svg>
      </DialogTrigger>
      <DialogContent className=" max-w-screen-md max-md:max-w-[90vw] flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="h-[90dvh] flex items-center justify-center">
          <div className="flex backdrop-blur-xl flex-col  overflow-hidden p-0 items-center justify-center h-full border-2 border-white/15 bg-gradient-to-br from-black/45 to-black/25 rounded-[24px]">
            <div className="overflow-y-auto hide-scrollbar p-6 w-full h-full text-white">
              <div
                className="prose prose-invert max-md:prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(changelogContent),
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Changelog = React.memo(ChangelogComp);
export default Changelog;
