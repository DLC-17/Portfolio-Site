"use client";

import Image from "next/image";

const photos = [
  { src: "/burningpots.JPG", alt: "Burning Pots", width: 800, height: 600 },
  { src: "/chapel.JPG", alt: "Chapel", width: 900, height: 1200 },
  { src: "/clouds.JPG", alt: "Clouds", width: 1200, height: 800 },
  { src: "/dispo-ball.JPG", alt: "Disposable Ball", width: 1000, height: 1500 },
  { src: "/dispo-chapel.JPG", alt: "Disposable Chapel", width: 1200, height: 900 },
  { src: "/flame.JPG", alt: "Flame", width: 800, height: 1000 },
  { src: "/piano.JPG", alt: "Piano", width: 1000, height: 800 },
  { src: "/sea.JPG", alt: "Sea", width: 1200, height: 900 },
  { src: "/sf-streets.JPG", alt: "San Francisco Streets", width: 1000, height: 1200 },
  { src: "/sk.JPG", alt: "Sky", width: 1200, height: 900 },
  { src: "/wallmural.JPG", alt: "Wall Mural", width: 1000, height: 800 },
  { src: "/boat.JPG", alt: "Boat", width: 1200, height: 900 },
];

export default function PhotoAlbum() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 p-2">
      {photos.map((photo, index) => (
        <div key={index} className="relative w-full h-auto overflow-hidden rounded-lg">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="object-cover w-full h-auto"
            quality={100} // High but optimized quality
            loading="lazy" // Lazy load remaining images
          />
        </div>
      ))}
    </div>
  );
}
