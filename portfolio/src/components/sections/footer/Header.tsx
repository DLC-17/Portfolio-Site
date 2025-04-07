"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { motion } from "framer-motion";
import { FaSun } from "react-icons/fa";
import { Button } from "@/components/ui/button"



// Navbar items
const navItems = [
  { name: "About Me", link: "/About" },
  { name: "Projects", link: "/projects" },
  { name: "Photography", link: "/photography" },
];

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* DLC Logo */}
        <motion.div
          className="text-2xl font-bold text-black dark:text-white transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <Link href="/">DLC</Link>
        </motion.div>
        {/* Navigation */}
        <nav className="flex space-x-6">
  {navItems.map(({ name, link }) => {
    const isActive = pathname === link || (link.startsWith("#") && isClient && pathname + link === window.location.hash);
    return (
      <Link
        key={name}
        href={link}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          isActive ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 "
        }`}
      >
        {name}
      </Link>
    );
  })}
</nav>

        {/* Mode Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}
