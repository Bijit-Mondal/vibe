"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div
          className={cn(
            "absolute h-full w-full inset-0 bg-muted animate-pulse rounded-full",
            className
          )}
        />
      )}
      <AvatarPrimitive.Image
        ref={ref}
        className={cn(
          "aspect-square h-full w-full transition-opacity",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        src={
          props.src?.startsWith("https://wsrv.nl/?url")
            ? props.src
            : `https://wsrv.nl/?url=${props.src}`
        }
        onError={(e) => {
          e.currentTarget.src =
            "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg";
        }}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      " h-full w-full hidden items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
