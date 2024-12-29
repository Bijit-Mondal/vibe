import { Browse } from "@/components/common/Browse";
import api from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: `Your Rooms`,
    description: `Democratic Music Selection:`,

    icons: { icon: "/favicon.png" },
    openGraph: {
      title: "Vibe",
      description:
        "Explore, vote, and enjoy a community-driven music experience where your votes decide the beats.",
      url: "https://getvibe.in",
      type: "website",
      images: [
        {
          url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
          width: 1200,
          height: 630,
          alt: "Vibe",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@tanmay11117",
      title: "Vibe",
      description: "Let votes decide the beat",
      images: [
        {
          url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
          width: 1200,
          height: 630,
          alt: "Vibe",
        },
        {
          url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
          width: 800,
          height: 600,
          alt: "Vibe Music Collaboration",
        },
      ],
    },
  };
}
async function page() {
  const vibeId = cookies().get("vibeId")?.value;
  if (!vibeId) redirect("/");
  const res = await api.get<any>(`${process.env.SOCKET_URI}/api/rooms/all`, {
    headers: {
      cookie: `vibeIdR=${vibeId}`,
    },
    showErrorToast: false,
  });
  if (!res.success) redirect("/");

  return <Browse data={res.data?.results.slice(0, 10)} />;
}

export default page;
