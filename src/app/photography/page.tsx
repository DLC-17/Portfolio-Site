"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const photos = [
  { src: "/burningpots.JPG", alt: "Burning Pots", width: 800, height: 600 },
  { src: "/chapel.JPG", alt: "Chapel", width: 900, height: 1200 },
  { src: "/dispo-ball.JPG", alt: "Disposable Ball", width: 1000, height: 1500 },
  { src: "/dispo-chapel.JPG", alt: "Disposable Chapel", width: 1200, height: 900 },
  { src: "/flame.JPG", alt: "Flame", width: 800, height: 1000 },
  { src: "/piano.JPG", alt: "Piano", width: 1000, height: 800 },
  { src: "/sea.JPG", alt: "Sea", width: 1200, height: 900 },
  { src: "/sk.JPG", alt: "Sky", width: 1200, height: 900 },
  { src: "/wallmural.JPG", alt: "Wall Mural", width: 1000, height: 800 },
  { src: "/boat.JPG", alt: "Boat", width: 1200, height: 900 },
];

export default function PhotoAlbum() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = () => setSelectedIndex(null);
  const handleNext = () => setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
  const handlePrev = () => setSelectedIndex((prev) => (prev === null ? photos.length - 1 : (prev - 1 + photos.length) % photos.length));

  // Keyboard navigation (Left & Right Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    
    <div className="px-4 py-6">
      {/* Masonry Grid Layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              quality={85}
              loading="lazy"
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal with Acrylic Glass Effect & Navigation */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative max-w-5xl w-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              
              <Image
                src={photos[selectedIndex].src}
                alt={photos[selectedIndex].alt}
                width={photos[selectedIndex].width}
                height={photos[selectedIndex].height}
                className="rounded-lg max-w-full max-h-[90vh] object-contain"
              />
              
              {/* Close Button */}
              <button onClick={handleClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black">
                <X size={24} />
              </button>

              {/* Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black"
              >
                <ChevronRight size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
