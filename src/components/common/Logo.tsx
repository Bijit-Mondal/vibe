"use client";

import { cn } from "@/lib/utils";
import { useUserContext } from "@/store/userStore";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function Logo({ className }: { className?: string }) {
  const { user } = useUserContext();
  return (
    <div
      onClick={() => {
        if (!user) {
          window.location.href = "/";
        }
      }}
      className={!user ? "cursor-pointer" : ""}
    >
      <VibeLogoText text="Vibe" className={className} />
      {/* <p className=" text-xl md:hidden font-semibold">Vibe </p> */}
      {/* <Image
        src={"/logo.svg"}
        className={cn(
          `size-12 max-md:hidden max-md:size-10 ${!user && ""}`,
          className
        )}
        alt="logo"
        height={500}
        width={500}
      /> */}
    </div>
  );
}

export const VibeLogoText = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  return (
    <p
      className={cn(
        "bg-clip-text text-3xl text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 ",
        pacifico.className,
        className
      )}
    >
      {text}
    </p>
  );
};
export default Logo;
