"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", link: "/#about", id: "about" },
  { name: "Expertise", link: "/#expertise", id: "expertise" },
  { name: "Experience", link: "/#experience", id: "experience" },
  { name: "Projects", link: "/#projects", id: "projects" },
  { name: "Education", link: "/#education", id: "education" },
  { name: "Contact", link: "/#contact", id: "contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px" }
    );

    const sectionIds = ["about", "expertise", "experience", "projects", "education", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (pathname === "/") {
      return activeSection === item.id;
    }
    return false;
  };

  const linkClass = (active: boolean) =>
    cn(
      "rounded-md px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors sm:text-sm",
      active
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.12em] text-foreground transition-opacity hover:opacity-80"
        >
          DLC
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link key={item.name} href={item.link} className={linkClass(active)}>
                {item.name}
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
          <div className="absolute top-full left-0 right-0 border-b border-border/80 bg-background shadow-sm md:hidden">
            <nav className="flex flex-col gap-0 p-2">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={cn(linkClass(active), "px-4 py-3")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
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
