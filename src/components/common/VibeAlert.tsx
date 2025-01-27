import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function VibeAlert({
  action,
  className,
  title,
  confirmText,
  heading,
  confirmClassName,
  headingClassName,
  disabled,
}: {
  className?: string;
  title: string;
  heading: string;
  confirmText: string;
  confirmClassName?: string;
  headingClassName?: string;
  disabled?: boolean;
  action: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger disabled={disabled} className=" disabled:opacity-50">
        <div
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-8 rounded-lg px-3 w-fit text-xs bg-red-600/85 text-white hover:bg-red-600/70",
            className
          )}
        >
          {title}
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit min-w-max flex-col flex items-center justify-center bg-transparent border-none">
        <DialogHeader className=" h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className=" h-[414px]  flex items-center justify-center">
          <div
            className={cn(
              "flex backdrop-blur-lg flex-col overflow-hidden p-7 items-center justify-between space-y-5 text-center w-[20rem] border-2 border-white/15 bg-gradient-to-br from-black/45 text-2xl to-black/25 rounded-[24px] font-semibold",
              headingClassName
            )}
          >
            <p>{heading}</p>
            <DialogClose className="gap-2 w-full flex flex-col items-center">
              <Button
                variant={"purple"}
                className={cn(
                  " bg-red-600/85 w-full text-white hover:bg-red-600/70",
                  confirmClassName
                )}
                onClick={action}
              >
                {confirmText}
              </Button>
              <Button className="w-full">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
