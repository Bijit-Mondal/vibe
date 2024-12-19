import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "./api";
import { ApiResponse } from "hmm-api";
import { uploadedImageT } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onBoarding = [
  {
    heading: "Own your vibe.",
    description:
      "Get the party started! Add a song you love, and let’s kick things off.",
    ctaText: "Save",
  },
  {
    heading: "Add & Mix",
    description:
      "Invite everyone to add songs to the queue. The more, the merrier!",
    ctaText: "Next",
    src: "/onboarding/1.mp4",
  },
  {
    heading: "Jam Together",
    description:
      "Get the party started! Add a song you love, and let’s kick things off.",
    ctaText: "Next",
    src: "/onboarding/2.mp4",
  },
  {
    heading: "Just vote, no chaos",
    description:
      "As you listen, your friends can vote on what plays next. It’s all about the music everyone loves.",
    ctaText: "Next",
    src: "/onboarding/3.mp4",
  },
  {
    heading: "Just vote, no chaos",
    description:
      "Start jamming and enjoy the music! Come back anytime to add more friends, songs, or customize the settings.",
    ctaText: "Start Listening",
    src: "/onboarding/3.mp4",
  },
];

export const uploadImage = async (
  formData: FormData
): Promise<ApiResponse<uploadedImageT>> => {
  const res = await api.post<uploadedImageT>(
    process.env.UPLOAD_URL || "",
    formData,
    {
      headers: {
        "X-Window-Location": process.env.UPLOAD_LOCATION || "",
        "X-Api-Sitekey": process.env.UPLOAD_SITE_KEY || "",
        Authorization: process.env.UPLOAD_KEY || "",
      },
    }
  );
  return res;
};
