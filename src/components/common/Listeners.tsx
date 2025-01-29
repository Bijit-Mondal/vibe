"use client";
import { useUserContext } from "@/store/userStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import InviteButton from "./inviteButton";
import Youtube from "./Youtube";
import ChatIcon from "../ChatIcon";
import { IoLaptop } from "react-icons/io5";
import {
  MdOutlineDesktopWindows,
  MdPhoneAndroid,
  MdPhoneIphone,
} from "react-icons/md";
import { GrArchlinux, GrStatusUnknown } from "react-icons/gr";
import { TbDeviceIpad } from "react-icons/tb";
const icons = {
  iPhone: <MdPhoneIphone />,
  iPad: <TbDeviceIpad />,
  Android: <MdPhoneAndroid />,
  Windows: <MdOutlineDesktopWindows />,
  Mac: <IoLaptop />,
  Linux: <GrArchlinux />,
  unknown: <GrStatusUnknown />, // Default icon for unknown devices
};
function Listeners({ className }: { className?: string }) {
  const { listener, user: loggedInUser } = useUserContext();

  return (
    <div className=" flex items-center w-full justify-between">
      <div className=" md:hidden">
        <ChatIcon />
      </div>
      <Dialog>
        <DialogTrigger
          className={cn(
            " max-md:w-full flex items-center text-sm font-medium justify-between",
            className
          )}
        >
          {/* <div className=" flex items-center gap-1">
            <p>Listening</p> */}

          <div className=" flex items-center">
            {listener?.roomUsers
              // ?.filter(
              //   (user) => user.userId.username !== loggedInUser?.username
              // )
              ?.slice(0, 3)
              ?.map((roomUser, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={` ${i !== 0 && "-ml-2"} size-6`}>
                        <Avatar className=" size-6 border-2 border-white/80">
                          <AvatarImage
                            loading="lazy"
                            alt={roomUser?.userId?.name}
                            height={200}
                            width={200}
                            className=" rounded-full object-cover"
                            src={roomUser?.userId?.imageUrl}
                          />
                          <AvatarFallback>SX</AvatarFallback>
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                      <p className=" flex items-center gap-1">
                        {roomUser?.userId?.username} ({roomUser?.userId?.name}){" "}
                        {loggedInUser?.username === roomUser.userId.username &&
                          " - You"}{" "}
                        <span title={roomUser?.userId?.device}>
                          {icons[roomUser?.userId?.device]}
                        </span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            {listener && listener?.totalUsers > 3 && (
              <div className={` -ml-4 px-2 text-[9px] font-bold  rounded-full`}>
                <Avatar className=" size-6 border-white/80 border-2">
                  <div className=" bg-purple h-full w-full items-center justify-center rounded-full bg-muted">
                    {" "}
                    +
                    {listener?.totalUsers > 100 ? 99 : listener?.totalUsers - 3}
                  </div>
                </Avatar>
              </div>
            )}
          </div>
          {/* </div> */}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-md:max-w-[95dvw] flex-col max-md:w-full  border flex justify-center items-center bg-transparent border-none">
          <DialogHeader className=" h-0">
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <div className="flex w-full backdrop-blur-lg flex-col overflow-hidden p-0 items-center justify-center h-full border-2 border-white/15 bg-gradient-to-br from-black/45  to-black/25 rounded-[24px]">
            <div className="flex flex-col w-full overflow-hidden rounded-2xl">
              <div className="bg-black/5 w-full p-2.5 px-4">
                <p className=" font-semibold flex w-full justify-between">
                  <span className=" opacity-90">
                    Vibing {listener?.totalUsers === 1 ? "alone 🥺" : "with 😃"}
                  </span>{" "}
                  {listener && `${listener?.totalUsers}`}
                </p>
              </div>
              <div className="bg-black/5 flex-col flex items-center  justify-between p-2.5 pt-0 px-4 max-h-[50dvh] overflow-y-scroll">
                {listener?.roomUsers?.map((user, j) => (
                  <div
                    key={j}
                    className=" w-full py-1.5 flex items-center gap-2"
                  >
                    <ProfilePic imageUrl={user?.userId?.imageUrl} />
                    <div className="text-sm leading-tight">
                      <p className=" flex items-center gap-1 font-semibold">
                        {user?.userId?.name}{" "}
                        <span className=" text-lightPurple">
                          {loggedInUser?.username === user.userId.username &&
                            "(You)"}
                        </span>
                        <span title={user?.userId?.device}>
                          {icons[user?.userId?.device]}
                        </span>
                      </p>
                      <p className=" text-xs text-accent-foreground/80">
                        {user?.userId?.username}{" "}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className=" md:hidden flex items-center gap-1">
        <InviteButton />
        <Youtube />
      </div>
    </div>
  );
}

export const ProfilePic = ({
  imageUrl,
  className,
}: {
  imageUrl: string;
  className?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center gap-2">
        <Avatar className={cn(" size-12 border-2 border-white/15", className)}>
          <AvatarImage
            loading="lazy"
            className=" object-cover"
            src={imageUrl}
          />
          <AvatarFallback>SX</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="max-w-md flex-col max-md:w-full border flex justify-center items-center  bg-transparent border-none">
        <DialogHeader className=" h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className=" w-full flex items-center justify-center">
          <Avatar className=" size-72  border border-white/15">
            <AvatarImage
              loading="lazy"
              className=" object-cover"
              src={imageUrl}
            />
            <AvatarFallback>SX</AvatarFallback>
          </Avatar>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Listeners;
