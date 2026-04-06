"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", link: "/#about" },
  { name: "Projects", link: "/projects" },
];

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const linkClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors",
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-zinc-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.12em] text-foreground transition-opacity hover:opacity-80"
        >
          DLC
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ name, link }) => {
            const hash = link.includes("#") ? link.slice(link.indexOf("#")) : "";
            const isActive =
              pathname === link ||
              (link === "/projects" && pathname === "/projects") ||
              (link.startsWith("/#") &&
                pathname === "/" &&
                isClient &&
                (hash === "" || window.location.hash === hash));
            return (
              <Link key={name} href={link} className={linkClass(!!isActive)}>
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="absolute top-full left-0 right-0 border-b border-zinc-200/80 bg-background shadow-sm dark:border-zinc-800/80 md:hidden">
            <nav className="flex flex-col gap-0 p-2">
              {navItems.map(({ name, link }) => {
                const isActive =
                  pathname === link ||
                  (link === "/projects" && pathname === "/projects");
                return (
                  <Link
                    key={name}
                    href={link}
                    className={cn(linkClass(!!isActive), "px-4 py-3")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
