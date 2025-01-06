import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PiGameControllerFill } from "react-icons/pi";
import { Button } from "../ui/button";
import { ProfilePic } from "../common/Listeners";
import { useUserContext } from "@/store/userStore";
import { Input } from "../ui/input";

function GameModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { listener } = useUserContext();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled>
        <Button
          variant={"secondary"}
          className=" bg-lightPurple text-[#4F378A] p-2.5 hover:bg-lightPurple/80 "
        >
          <PiGameControllerFill size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-0rem)] border-none backdrop-blur-xl bg-black/10 w-[calc(100vw-0rem)]">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription className="h-0" />
        </DialogHeader>
        {/* <p className="font-semibold absolute top-4 right-4">Vibe x </p> */}
        <div className=" h-[calc(100vh-10rem)] px-4 w-full grid grid-cols-5 gap-1">
          <div className="col-span-1 flex flex-col gap-3">
            <div
              className=" font-bold opacity-80
             text-lg"
            >
              30
            </div>

            <div className="bg-black/5 flex-col flex items-center justify-between pt-0 max-h-[calc(100vh-12rem)] overflow-y-scroll">
              {listener?.roomUsers?.map((user, j) => (
                <div
                  key={j}
                  className=" w-full p-1.5 px-2 rounded-xl bg-muted-foreground/15 flex justify-between items-center gap-1.5"
                >
                  <p className=" text-xl font-bold">#1</p>

                  <div
                    title={user?.userId?.username}
                    className="text-sm leading-tight"
                  >
                    <p className=" font-semibold">
                      {user?.userId?.name.length > 10
                        ? user.userId.name.slice(0, 10) + "..."
                        : user.userId.name}
                    </p>
                    <p className=" text-xs w-full text-accent-foreground/80">
                      1700 points
                    </p>
                  </div>
                  <ProfilePic
                    className="size-10"
                    imageUrl={user?.userId?.imageUrl}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className=" col-span-3 flex items-center justify-center rounded-xl">
            <p className=" text-9xl font-semibold"></p>
          </div>
          <div className=" col-span-1 flx flex-col px-4 gap-1">
            <div className="flex flex-col py-2 overflow-y-scroll h-[calc(100vh-12rem)] items-start">
              <p className="text-muted-foreground/80">
                <span className=" font-semibold text-white">User :</span> Demos
              </p>
            </div>
            <Input
              placeholder="Type your guess here..."
              className=" py-5"
            ></Input>
          </div>
        </div>
        <div className=" px-4 h-fit flex text-muted-foreground/80 justify-between items-center ">
          <p className="text-xs">
            This is a beta version of the game. Please report any bugs or issues
            to the{" "}
            <a
              href="https://x.com/tanmay7_"
              className=" hover:underline hover:text-white underline-offset-2"
            >
              developer
            </a>
            . (Additional games will be available soon.)
          </p>
          <Button onClick={() => setIsOpen(false)} variant={"secondary"}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GameModal;
