"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "DC", link: "/" },
  { name: "Projects", link: "/projects" },
  { name: "Photography", link: "/photography" },
];

function Footer() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-6">
          {navItems.map(({ name, link }) => {
            const isActive =
              pathname === link ||
              (link.startsWith("#") && isClient && pathname + link === window.location.hash);
            return (
              <Link
                key={name}
                href={link}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Mode Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <button
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full px-4 pb-4">
          <nav className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-md shadow-md p-4">
            {navItems.map(({ name, link }) => {
              const isActive =
                pathname === link ||
                (link.startsWith("#") && isClient && pathname + link === window.location.hash);
              return (
                <Link
                  key={name}
                  href={link}
                  className={`px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-900 text-white"
                      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </footer>
  );
}

export default Footer;
