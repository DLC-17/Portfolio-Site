"use client";

import * as React from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSeasonal } from "@/components/ui/seasonal-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { enabled, toggleEnabled } = useSeasonal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={enabled}
          onCheckedChange={toggleEnabled}
          className="cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Seasonal Effects</span>
          </span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
