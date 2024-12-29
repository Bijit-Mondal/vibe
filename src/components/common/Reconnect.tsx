// "use client";
// import { useSocket } from "@/Hooks/useSocket";
// import { BACKGROUND_APP_TIMEOUT, getRandom } from "@/utils/utils";
// import { LoaderCircleIcon } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// const message = [
//   {
//     msg: "Welcome back",
//     gif: "https://media.tenor.com/xAXxRsuJG9QAAAAj/white-rabbit.gif",
//   },
//   {
//     msg: "Missed you",
//     gif: "https://media.tenor.com/8bUmBbKU618AAAAi/cony-and.gif",
//   },
//   {
//     msg: "oops, i was just hiding",
//     gif: "https://media.tenor.com/LMuHrXvRHLQAAAAi/the-simpsons-homer-simpson.gif",
//   },
// ];

// function Reconnect() {
//   const { hiddenTimeRef } = useSocket();
//   const [emotion] = useState(getRandom(message));
//   if (!hiddenTimeRef.current) return;
//   if (hiddenTimeRef.current < BACKGROUND_APP_TIMEOUT) return;
//   return (
//     <div className=" w-full inset-0 max-md:px-5 max-md:text-xl text-zinc-200 h-screen bg-black/40 backdrop-blur-sm z-[100] absolute flex items-center flex-col justify-center font-semibold text-2xl">
//       {/* <p>{emotion.msg}</p> */}
//       <div className=" my-4 rounded-xl overflow-hidden">
//         <Image alt={emotion.msg} src={emotion.gif} height={280} width={280} />
//       </div>
//       <p className=" text-base">Loading latest snaps...</p>
//       <LoaderCircleIcon className=" my-2 size-7 animate-spin" />
//     </div>
//   );
// }

// export default Reconnect;
