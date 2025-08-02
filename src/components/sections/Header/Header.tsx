"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

// Navbar items
const navItems = [
  { name: "Projects", link: "/projects" },
  { name: "Photography", link: "/photography" },
];

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header
      className="w-full fixed top-0 left-0 shadow-md z-50 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70
"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* DLC Logo */}
        <motion.div
          className="text-xl sm:text-2xl font-bold text-black dark:text-white transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <Link href="/">DLC</Link>
        </motion.div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex max-w-xl space-x-4 lg:space-x-6">
          {navItems.map(({ name, link }) => {
            const isActive =
              pathname === link ||
              (link.startsWith("#") &&
                isClient &&
                pathname + link === window.location.hash);
            return (
              <Link
                key={name}
                href={link}
                className={`px-2 sm:px-3 py-2 sm:py-2 rounded-md text-large font-medium ${
                  isActive
                    ? "bg-blue-900 text-white dark:bg-accent dark:text-white"
                    : "text-gray-700 hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mode Toggle */}
          <ModeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - shown only when open */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map(({ name, link }) => {
                const isActive =
                  pathname === link ||
                  (link.startsWith("#") &&
                    isClient &&
                    pathname + link === window.location.hash);
                return (
                  <Link
                    key={name}
                    href={link}
                    className={`px-4 py-3 rounded-md text-base font-medium ${
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
      </div>
    </header>
  );
}
