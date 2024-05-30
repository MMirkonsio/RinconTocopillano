// Assuming that the "cn" function is imported from a file named "utils" in a directory named "lib".
import { cn } from "./lib/utils.tsx";
import { CSSProperties, FC, ReactNode } from "react";

export default function AnimatedGradientText({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={cn(
          "group relative mx-auto flex max-w-fit flex-row items-center justify-center  px-4 py-1.5 font-bold  transition-shadow duration-500 ease-out [--bg-size:300%]",
          className,
        )}
      >
        
   
        {children}
      </div>
    );
  }