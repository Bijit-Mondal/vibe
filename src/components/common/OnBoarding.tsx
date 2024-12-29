import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useUserContext } from "@/store/userStore";
import { onBoarding } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { encryptObjectValues } from "@/utils/utils";
import api from "@/lib/api";
import { AtSign, LoaderCircle, Sun } from "lucide-react";
import confetti from "canvas-confetti";
function OnBoarding() {
  const { user, setUser, socketRef } = useUserContext();
  const [inputValue, setInputValue] = useState(user?.username);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(() => {
    const data =
      typeof window !== "undefined" ? localStorage.getItem("o") : false;
    return data ? JSON.parse(data) : true;
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboarding = async () => {
    if (currentStep == 0 && formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
      return;
    }
    if (currentStep !== onBoarding.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    localStorage.setItem("o", "false");
    setShowOnboarding(false);
  };

  const handleUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const payload: { name: string; username: string } | any = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      // if (user && payload.username == user.username) {
      //   setCurrentStep((prev) => prev + 1);
      //   return;
      // }

      setLoader(true);
      const res = await api.patch(
        `${process.env.SOCKET_URI}/api/update`,
        encryptObjectValues(payload),
        {
          credentials: "include",
        }
      );
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        socketRef.current.emit("profile");
        setError(null);
        setCurrentStep((prev) => prev + 1);
        if (user) {
          setUser(() => ({
            ...user,
            username: payload.username,
            name: payload.name,
          }));
        }
      }
      setLoader(false);
    },
    [user, setUser, socketRef]
  );

  // Animation variants text

  //Onboarding video
  const contentVariants = {
    enter: () => ({
      opacity: 0,
      filter: "blur(10px)",
    }),
    center: {
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: () => ({
      opacity: 0,
      filter: "blur(0px)",
    }),
  };
  return (
    <Dialog key="user Login" open={showOnboarding || false}>
      <DialogTrigger className="absolute h-0 w-0 p-0" />
      <DialogContent className="w-fit flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="  h-[414px]  flex items-center justify-center">
          <motion.div className="flex backdrop-blur-lg flex-col overflow-hidden p-0 items-center justify-center h-full w-[20rem] border-2 border-white/15 bg-gradient-to-br from-black/45  to-black/25 rounded-[24px]">
            {user && showOnboarding && (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    delay: 0.1,
                    duration: 0.4,
                  }}
                  className="flex flex-col h-full"
                >
                  <div
                    className={`${
                      currentStep == 4
                        ? "h-1/3 mb-2"
                        : currentStep == 0
                        ? ""
                        : "bg-black h-1/2 "
                    } `}
                  >
                    {currentStep == 4 ? (
                      <motion.div
                        key={currentStep}
                        custom={currentStep}
                        variants={contentVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          delay: 0.1,
                          duration: 0.4,
                        }}
                        className="p-7 pb-0"
                      >
                        <Avatar className="size-32 ">
                          <AvatarImage
                            width={500}
                            height={500}
                            alt="Profile"
                            className="rounded-full object-cover"
                            src={
                              user?.imageUrl ||
                              "https://imagedump.vercel.app/notFound.jpg"
                            }
                          />
                          <AvatarFallback>SX</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    ) : (
                      <>
                        {currentStep !== 0 && (
                          <video
                            preload="true"
                            playsInline
                            src={onBoarding[currentStep].src}
                            className="h-full w-full object-cover"
                            muted
                            loop
                            autoPlay
                          />
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <motion.div className="px-7 mt-5">
                      <motion.p
                        initial={{
                          y: 15,
                          opacity: 0,
                          filter: "blur(10px)",
                        }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: 0.2,
                          duration: 0.4,
                        }}
                        className="font-semibold text-2xl pb-1"
                      >
                        {currentStep == 4
                          ? `${user.name.split(" ")[0]}, Set your vibe`
                          : onBoarding[currentStep].heading}
                      </motion.p>
                      <motion.p
                        initial={{
                          y: 15,
                          opacity: 0,
                          filter: "blur(10px)",
                        }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: 0.25,
                          duration: 0.4,
                        }}
                        className="text-sm text-zinc-400"
                      >
                        {onBoarding[currentStep].description}
                      </motion.p>
                      {currentStep == 0 && (
                        <form
                          ref={formRef}
                          onChange={() => error && setError(null)}
                          onSubmit={handleUpdate}
                          className="w-full space-y-3 my-5"
                        >
                          <motion.div
                            initial={{
                              y: 15,
                              opacity: 0,
                              filter: "blur(10px)",
                            }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{
                              delay: 0.5,
                              duration: 0.4,
                            }}
                          >
                            <div className=" relative flex items-center">
                              <Sun className=" size-4 ml-2 text-zinc-400 absolute" />
                              <Input
                                maxLength={25}
                                max={25}
                                min={4}
                                placeholder="name"
                                name="name"
                                className="py-5 pl-7"
                                defaultValue={user?.name}
                              />
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{
                              y: 15,
                              opacity: 0,
                              filter: "blur(10px)",
                            }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{
                              delay: 0.6,
                              duration: 0.4,
                            }}
                          >
                            <div className=" relative flex items-center">
                              <AtSign className=" size-4 ml-2 text-zinc-400 absolute" />
                              <Input
                                maxLength={15}
                                max={15}
                                min={4}
                                value={inputValue}
                                onChange={(e) =>
                                  setInputValue(e.target.value.toLowerCase())
                                }
                                placeholder="username"
                                name="username"
                                className="py-5 pl-7"
                                defaultValue={user?.username}
                              />
                            </div>
                          </motion.div>

                          {error && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs p-0.5 text-red-400"
                            >
                              {error}
                            </motion.p>
                          )}
                        </form>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="flex w-full items-center justify-between p-7"
                    >
                      {currentStep == 1 && (
                        <p
                          onClick={() => setCurrentStep((prev) => prev - 1)}
                          className="text-zinc-400 text-base "
                        >
                          Back
                        </p>
                      )}
                      {currentStep !== 4 && (
                        <p
                          onClick={() => {
                            localStorage.setItem("o", "false");
                            setShowOnboarding(false);
                          }}
                          style={{
                            opacity:
                              currentStep == 0 || currentStep == 1 ? 0 : 1,
                          }}
                          className="text-zinc-300 text-base "
                        >
                          Skip
                        </p>
                      )}
                      <div
                        onClick={handleOnboarding}
                        className=" flex w-full items-end justify-end"
                      >
                        {currentStep !== 3 && (
                          <Button
                            disabled={loader}
                            className={`${
                              currentStep == 4
                                ? " w-full bg-[#9747FF] py-5 hover:bg-[#9747FF]/80 text-white focus:outline-none outline-none"
                                : ""
                            }`}
                          >
                            {loader ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              onBoarding[currentStep].ctaText
                            )}
                          </Button>
                        )}
                        {currentStep == 3 && (
                          <ConfettiSideCannons currentStep={currentStep} />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConfettiSideCannons({ currentStep }: { currentStep: number }) {
  const handleClick = () => {
    const end = Date.now() + 1.5 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#fac800"];

    const frame = async () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div className="relative">
      <Button onClick={handleClick}>{onBoarding[currentStep].ctaText}</Button>
    </div>
  );
}

export default OnBoarding;
