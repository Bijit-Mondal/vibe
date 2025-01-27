"use client";
import { cn } from "@/lib/utils";
import React from "react";

function Blur({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute h-dvh w-dvw bg-black/80 backdrop-blur-sm max-md:backdrop-blur-lg top-0",
        className
      )}
    ></div>
  );
}

export default Blur;
