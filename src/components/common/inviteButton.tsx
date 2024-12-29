"use client";
import { QRCode } from "react-qrcode-logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";
import { getInviteLink } from "@/utils/utils";
import { toast } from "sonner";
import { useUserContext } from "@/store/userStore";
function InviteButton() {
  const { roomId, user } = useUserContext();
  const [inviteLink] = useState(
    getInviteLink(roomId ? roomId : user?.username)
  );
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: inviteLink });
        toast.success("Shared the link successfully!");
      } else {
        await navigator.clipboard.writeText(inviteLink);
        toast.success("Link copied to clipboard!");
      }
    } catch (error: any) {}
  }, [inviteLink]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-lg px-2.5 text-xs gap-1 bg-purple w-fit hover:bg-[#7140c5]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.94995 12.25C9.51245 12.25 9.14058 12.0969 8.83433 11.7906C8.52808 11.4844 8.37495 11.1125 8.37495 10.675C8.37495 10.6137 8.37933 10.5503 8.38808 10.4847C8.39683 10.4191 8.40995 10.36 8.42745 10.3075L4.7262 8.155C4.57745 8.28625 4.4112 8.38906 4.22745 8.46344C4.0437 8.53781 3.8512 8.575 3.64995 8.575C3.21245 8.575 2.84058 8.42187 2.53433 8.11562C2.22808 7.80937 2.07495 7.4375 2.07495 7C2.07495 6.5625 2.22808 6.19062 2.53433 5.88437C2.84058 5.57812 3.21245 5.425 3.64995 5.425C3.8512 5.425 4.0437 5.46219 4.22745 5.53656C4.4112 5.61094 4.57745 5.71375 4.7262 5.845L8.42745 3.6925C8.40995 3.64 8.39683 3.58094 8.38808 3.51531C8.37933 3.44969 8.37495 3.38625 8.37495 3.325C8.37495 2.8875 8.52808 2.51562 8.83433 2.20937C9.14058 1.90312 9.51245 1.75 9.94995 1.75C10.3875 1.75 10.7593 1.90312 11.0656 2.20937C11.3718 2.51562 11.525 2.8875 11.525 3.325C11.525 3.7625 11.3718 4.13437 11.0656 4.44062C10.7593 4.74687 10.3875 4.9 9.94995 4.9C9.7487 4.9 9.5562 4.86281 9.37245 4.78844C9.1887 4.71406 9.02245 4.61125 8.8737 4.48L5.17245 6.6325C5.18995 6.685 5.20308 6.74406 5.21183 6.80969C5.22058 6.87531 5.22495 6.93875 5.22495 7C5.22495 7.06125 5.22058 7.12469 5.21183 7.19031C5.20308 7.25594 5.18995 7.315 5.17245 7.3675L8.8737 9.52C9.02245 9.38875 9.1887 9.28594 9.37245 9.21156C9.5562 9.13719 9.7487 9.1 9.94995 9.1C10.3875 9.1 10.7593 9.25312 11.0656 9.55937C11.3718 9.86562 11.525 10.2375 11.525 10.675C11.525 11.1125 11.3718 11.4844 11.0656 11.7906C10.7593 12.0969 10.3875 12.25 9.94995 12.25ZM9.94995 3.85C10.0987 3.85 10.2234 3.79969 10.324 3.69906C10.4246 3.59844 10.475 3.47375 10.475 3.325C10.475 3.17625 10.4246 3.05156 10.324 2.95094C10.2234 2.85031 10.0987 2.8 9.94995 2.8C9.8012 2.8 9.67651 2.85031 9.57589 2.95094C9.47526 3.05156 9.42495 3.17625 9.42495 3.325C9.42495 3.47375 9.47526 3.59844 9.57589 3.69906C9.67651 3.79969 9.8012 3.85 9.94995 3.85ZM3.64995 7.525C3.7987 7.525 3.92339 7.47469 4.02401 7.37406C4.12464 7.27344 4.17495 7.14875 4.17495 7C4.17495 6.85125 4.12464 6.72656 4.02401 6.62594C3.92339 6.52531 3.7987 6.475 3.64995 6.475C3.5012 6.475 3.37651 6.52531 3.27589 6.62594C3.17526 6.72656 3.12495 6.85125 3.12495 7C3.12495 7.14875 3.17526 7.27344 3.27589 7.37406C3.37651 7.47469 3.5012 7.525 3.64995 7.525ZM9.94995 11.2C10.0987 11.2 10.2234 11.1497 10.324 11.0491C10.4246 10.9484 10.475 10.8237 10.475 10.675C10.475 10.5262 10.4246 10.4016 10.324 10.3009C10.2234 10.2003 10.0987 10.15 9.94995 10.15C9.8012 10.15 9.67651 10.2003 9.57589 10.3009C9.47526 10.4016 9.42495 10.5262 9.42495 10.675C9.42495 10.8237 9.47526 10.9484 9.57589 11.0491C9.67651 11.1497 9.8012 11.2 9.94995 11.2Z"
              fill="white"
            />
          </svg>

          <span>Invite Friends</span>
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit flex flex-col border-none bg-transparent p-0">
        <DialogHeader className=" h-0">
          <DialogTitle className=" w-fit" />
          <DialogDescription />
        </DialogHeader>
        <div className="  flex items-center justify-center">
          <div className="flex backdrop-blur-lg flex-col overflow-hidden p-7 items-center justify-center h-full w-[20rem] border-2 border-white/15 bg-gradient-to-br from-black/45  to-black/25 rounded-[24px]">
            <QRCode
              logoImage="/favicon.png"
              ecLevel="M"
              removeQrCodeBehindLogo
              style={{
                borderRadius: "28px",
                padding: "7px",
                height: "270px",
                width: "270px",

                marginBottom: "0.7rem",
              }}
              logoPadding={5}
              value={inviteLink}
              qrStyle="dots"
            />
            <p className=" font-semibold text-2xl text-[#EADDFF]">
              Invite Friends
            </p>
            <p className=" text-xs text-zinc-400 text-center">
              {" "}
              Share that feeling, the one when you listen to your most favorite
              songs{" "}
            </p>
            <div className="w-full relative mt-4">
              <Input
                readOnly
                onClick={async (e) => {
                  await navigator.clipboard.writeText(e.currentTarget.value);
                  toast.success("Link copied to clipboard!");
                }}
                className="pr-7 py-5 cursor-pointer hover:opacity-80 " /* Add right padding to avoid overlap with the SVG */
                value={inviteLink}
              />
              <svg
                className="absolute   top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.75 10.05V12.3C12.75 15.3 11.55 16.5 8.55 16.5H5.7C2.7 16.5 1.5 15.3 1.5 12.3V9.45C1.5 6.45 2.7 5.25 5.7 5.25H7.95"
                  stroke="#D0BCFF"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.7 1.5H11.7M5.25 3.75C5.25 2.505 6.255 1.5 7.5 1.5H9.465M16.5 6V10.6425C16.5 11.805 15.555 12.75 14.3925 12.75M16.5 6H14.25C12.5625 6 12 5.4375 12 3.75V1.5L16.5 6ZM12.75 10.05H10.35C8.55 10.05 7.95 9.45 7.95 7.65V5.25L12.75 10.05Z"
                  stroke="#D0BCFF"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <Button
              onClick={handleShare}
              className=" bg-purple w-full hover:bg-purple/80 text-white mt-4"
            >
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteButton;
