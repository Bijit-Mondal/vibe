import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const RotatingDesign = () => {
  const heartControls = useAnimation();

  // Oscillation effect for the heart
  useEffect(() => {
    let isMounted = true; // Flag to ensure component is mounted

    const oscillate = async () => {
      while (isMounted) {
        await heartControls.start({ y: -10, transition: { duration: 1.2, ease: "easeInOut" } });
        await heartControls.start({ y: 10, transition: { duration: 1.2, ease: "easeInOut" } });
      }
    };

    oscillate(); // Start the oscillation loop

    return () => {
      isMounted = false; // Cleanup on unmount to stop animations
    };
  }, [heartControls]);
  const handleHoverStart = async () => {
    heartControls.start({
      rotate: 0, 
      transition: { type: "spring", stiffness: 100, duration: 0 } 
    });
  };

  return (
    <Sheet>
  <SheetTrigger>
  <motion.div
      className="relative w-72 h-72 border-4 border-[#EADDFF] rounded-full flex align-middle items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut",delay:.5}}
    >
      {/* Rotating Circular SVG */}
      <motion.img
        src="/circle.svg"
        alt="Rotating Text Circle"
        className="absolute w-[97%] will-change-transform"
        initial={{ scale: 0 }} // Start at scale 0
        animate={{
          scale: 1, // Scale to full size
          rotate: 360, // Keep rotating
        }}
        transition={{
          scale: { duration: 0.8, ease: "easeOut", delay: 0.3 }, // Scale animation with delay
          rotate: { repeat: Infinity, duration: 20, ease: "linear" }, // Continuous rotation
        }}
      />

      {/* Center Heart */}
      <div className="relative z-10 w-48 h-48 border-4  rounded-full flex items-center justify-center">
        <motion.img
          className="w-36"
          src="/heart.png"
          alt="the hungry heart"
          initial={{ rotate: -1 }}
          animate={heartControls} // Use oscillation controls
          whileHover={{
            rotate: 360, 
            transition: { type: "spring", stiffness: 100, duration: .6 } 
          }}
          onHoverEnd={handleHoverStart}
          // whileHover={{ 
          //   rotate: 360,
          //   scale:1
          //   // transition: { 
          //   //   duration: 1, 
          //   // } 
          // }} // Flip on hover
        />
      </div>
    </motion.div>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

  );
};

export default RotatingDesign;