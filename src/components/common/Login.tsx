"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/config/firebase";
import api from "@/lib/api";
import { useUserContext } from "@/store/userStore";
import { LogIn } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";

function Login({ footer = false }: { footer?: boolean }) {
  const { user, roomId, isElectron, socketRef } = useUserContext();
  const [loader, setLoader] = useState<boolean>(false);
  const handleLogin = async () => {
    try {
      setLoader(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const res = await api.post(`${process.env.SOCKET_URI}/api/auth`, {
          token: await user.getIdToken(),
        });
        if (res.success) {
          await api.post(`/api/login`, { token: (res.data as any)?.token });
          await signOut(auth);
          window.location.reload();
        }
      }
    } catch (error: any) {
    } finally {
      setLoader(false);
    }
  };
  const [isOpen, setIsOpen] = useState<boolean>(
    footer ? false : user ? false : true
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!socketRef.current.connected && !user && !footer) {
          setIsOpen(true);
          return;
        }
        setIsOpen((prev) => !prev);
      }}
      key={"user Login"}
    >
      {footer ? (
        <DialogTrigger
          asChild
          className="w-fit focus:outline-none text-xs -mt-3.5 px-0.5 font-normal text-white/70 hover:text-white"
        >
          <p>Login to your account?</p>
        </DialogTrigger>
      ) : (
        <DialogTrigger className=" border focus:outline-none max-md:px-2.5 max-md:border-none border-none h-full flex justify-center items-center px-5 rounded-xl text-base md:block hover:bg-[#D0BCFF]/15 bg-[#D0BCFF]/20 text-[#D0BCFF] ">
          <p className=" max-md:hidden">Login / SignUp</p>
          <LogIn className=" size-5 text-zinc-200 hidden max-md:block" />
        </DialogTrigger>
      )}

      <DialogContent className="w-fit flex-col flex items-center justify-center bg-transparent border-none">
        <DialogHeader className=" h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="   h-[414px]  flex items-center justify-center">
          <div className="flex backdrop-blur-lg flex-col overflow-hidden p-7 items-start h-full justify-between w-[20rem] border-2 border-white/15 bg-gradient-to-br from-black/45  to-black/25 rounded-[24px]">
            <div className=" space-y-2">
              <h1 className=" font-semibold text-3xl mb-2">Login Or SignUp</h1>
              <p className=" text-zinc-300 text-2xl">
                Let&apos;s get to know <br /> each other.
              </p>
            </div>
            <div className="w-full flex flex-col items-center gap-2 justify-center">
              {!isElectron && (
                <Button
                  disabled={loader}
                  onClick={handleLogin}
                  className="gap-1.5 w-full items-center justify-center flex shadow-none px-1 py-5"
                >
                  <FcGoogle className="size-5" />
                  {loader ? "Signing in..." : "Continue with Google"}
                </Button>
              )}
              <Link
                href={`${process.env.SOCKET_URI}/api/auth/discord?login=${roomId}`}
                className=" w-full"
              >
                <Button className=" gap-1.5 w-full items-center shadow-none px-7 py-5">
                  <BsDiscord className=" size-5" />
                  Continue with Discord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Login;
