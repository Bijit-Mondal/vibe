"use client";
import Listeners from "./Listeners";
// import { PiBookmarkSimpleBold } from "react-icons/pi";
import React from "react";
import { cn } from "@/lib/utils";
import InviteButton from "./inviteButton";
// import { Dialog, DialogTrigger } from "../ui/dialog";
import Youtube from "./Youtube";
import ChatIcon from "../ChatIcon";

function InviteFriendsComp({ className }: { className?: string }) {
  return (
    <div className={cn(" flex items-center justify-between pr-4", className)}>
      <ChatIcon />
      <Listeners className=" max-md:hidden" />
      <div className=" flex items-center gap-1">
        <InviteButton />
        <Youtube />
        {/* <Dialog>
          <DialogTrigger
            disabled
            className=" items-center justify-center flex t h-8 rounded-lg px-2 text-xs bg-purple disabled:opacity-70 w-fit hover:bg-[#7140c5] hover:opacity-80 duration-300"
          >
            <PiBookmarkSimpleBold className=" size-4" />
          </DialogTrigger>
        </Dialog> */}
      </div>
    </div>
  );
}
const InviteFriends = React.memo(InviteFriendsComp);
export default InviteFriends;
