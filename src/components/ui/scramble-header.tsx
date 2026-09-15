"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const chars = "!<>-_\\\\/[]{}—=+*^?#________";

interface ScrambleHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
}

export function ScrambleHeader({ text, className, ...props }: ScrambleHeaderProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <h2
      className={cn("cursor-default", className)}
      onMouseEnter={scramble}
      {...props}
    >
      {displayText}
    </h2>
  );
}
