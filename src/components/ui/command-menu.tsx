"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, FileText, Mail, Code2, User, Wrench, Briefcase, GraduationCap, Bot } from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <Command
        className="w-full max-w-[640px] rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command.Input 
          autoFocus 
          placeholder="Type a command or search..." 
          className="w-full border-b border-border bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted-foreground text-foreground"
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>
          
          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
            <Command.Item 
              onSelect={() => { window.dispatchEvent(new Event('open-chat')); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Bot className="h-4 w-4" /> Ask David AI
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#about"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <User className="h-4 w-4" /> About
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#expertise"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Wrench className="h-4 w-4" /> Expertise
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#experience"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Briefcase className="h-4 w-4" /> Experience
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#projects"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Code2 className="h-4 w-4" /> Projects
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#education"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <GraduationCap className="h-4 w-4" /> Education
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/blog"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <FileText className="h-4 w-4" /> Blog
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push("/#contact"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Mail className="h-4 w-4" /> Contact
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
            <Command.Item 
              onSelect={() => { setTheme("light"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Sun className="h-4 w-4" /> Light Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => { setTheme("dark"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Moon className="h-4 w-4" /> Dark Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => { setTheme("system"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted"
            >
              <Monitor className="h-4 w-4" /> System Theme
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
