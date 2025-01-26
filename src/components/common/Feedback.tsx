import api from "@/lib/api";
import { encryptObjectValues } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useUserContext } from "@/store/userStore";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

function Feedback() {
  const { roomId } = useUserContext();
  const [status, setStatus] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [ip, setIp] = useState<string>("");
  useEffect(() => {
    fetch("https://api.ipify.org/").then(async (r) => {
      setIp(await r.text());
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const payload: { feedback: string } | any = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      if (!payload.feedback || payload.feedback.trim().length == 0) return;
      if (payload.feedback.trim().length > 170)
        return toast.error("Message to long");
      try {
        setLoader(true);
        await api.post(
          `${process.env.SOCKET_URI}/api/feedback`,
          encryptObjectValues({
            xhr: ip,
            log: payload.feedback,
            nxt: roomId,
          }),
          {
            showErrorToast: false,
          }
        );
      } finally {
        setFeedback("");
        setLoader(false);
        setStatus("Got it 😃");
      }
    },
    [ip, roomId]
  );
  return (
    <Dialog>
      <DialogTrigger
        className=" m-0 absolute  max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden    bottom-5 right-5 z-20"
        disabled={loader || status ? true : false}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            className=" fill-lightPurple   hover:opacity-100 opacity-70  transition-all  duration-100 "
            viewBox="0 0 256 256"
          >
            <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
          </svg>
        </div>
      </DialogTrigger>
      <DialogContent className="w-96 max-md:w-[85dvw] flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className=" flex w-full items-center justify-center">
          <div className="flex w-full backdrop-blur-xl flex-col  overflow-hidden p-7 items-center justify-center h-full border-2 border-white/15 bg-gradient-to-br from-black/45 to-black/25 rounded-[24px]">
            <form onSubmit={handleSubmit} className=" w-full space-y-4">
              <p className=" font-semibold text-2xl">Love / Feedback ❤️</p>
              <textarea
                onChange={(e) => setFeedback(e.currentTarget.value)}
                value={feedback}
                maxLength={170}
                disabled={loader || status ? true : false}
                className="flex h-40 w-full rounded-md border border-white/15 outline-none bg-transparent px-3 py-2 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed text-base resize-none disabled:opacity-90"
                placeholder="She broke up with me 😭"
                name="feedback"
              />
              <Button
                disabled={loader || status ? true : false}
                variant={"default"}
                className=" w-full mt-2.5 bg-purple hover:bg-purple/80 text-white"
                type="submit"
              >
                {loader ? (
                  <LoaderCircle className=" animate-spin " />
                ) : (
                  <>{status ? status : "Smash her 👊"}</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Feedback;
