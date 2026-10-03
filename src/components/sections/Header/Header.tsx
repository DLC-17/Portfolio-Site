"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Contact", link: "/#contact", id: "contact" },
  { name: "Experience", link: "/#experience", id: "experience" },
  { name: "Projects", link: "/#projects", id: "projects" },
  { name: "Education", link: "/#education", id: "education" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection("contact");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "about" || entry.target.id === "contact") {
              setActiveSection("contact");
            } else {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px" }
    );

    const sectionIds = ["about", "experience", "projects", "education", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [pathname]);

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (pathname === "/") {
      return activeSection === item.id;
    }
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash === "contact" || hash === "about" || hash === "top") {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveSection("contact");
        }, 100);
        return;
      }
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(hash);
        }, 150);
      }
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1) {
      const hash = href.substring(hashIndex + 1);
      if (hash === "contact" || hash === "about" || hash === "top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", pathname === "/" ? "#contact" : "/#contact");
        setActiveSection("contact");
        setIsMobileMenuOpen(false);
        return;
      }
      const el = document.getElementById(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${hash}`);
        setActiveSection(hash);
        setIsMobileMenuOpen(false);
        return;
      }
    }
    setIsMobileMenuOpen(false);
  };

  const linkClass = (active: boolean) =>
    cn(
      "relative rounded-md px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors sm:text-sm",
      active
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/");
              setActiveSection("contact");
            }
          }}
          className="text-sm font-semibold tracking-[0.12em] text-foreground transition-opacity hover:opacity-80"
        >
          DLC
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)}
                className={linkClass(active)}
              >
                {active && (
                  <motion.span
                    layoutId="header-active-section"
                    className="absolute inset-0 -z-10 rounded-md bg-muted"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 overflow-hidden border-b border-border/80 bg-background shadow-sm md:hidden"
            >
              <nav className="flex flex-col gap-0 p-2">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.name}
                      href={item.link}
                      className={cn(linkClass(active), "px-4 py-3")}
                      onClick={(e) => handleNavClick(e, item.link)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
