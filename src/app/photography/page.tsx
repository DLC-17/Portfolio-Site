"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchPhotos, urlFor } from "../../../Sanity/sanity-utils";

interface Photo {
  _id: string;
  title?: string;
  image: {
    asset: {
      _ref?: string;
      _id?: string;
    };
    alt?: string;
  };
  caption?: string;
  location?: string;
  takenAt?: string;
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const allPhotos = await fetchPhotos();
      const validPhotos = allPhotos.filter(
        (photo: { _id: string }) => photo && photo._id
      );
      setPhotos(validPhotos);
    }
    fetchData();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + photos.length - 1) % photos.length);
  }, [lightboxIndex, photos.length]);

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  }, [lightboxIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, showPrev, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) showNext();
    else if (distance < -50) showPrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto space-y-10 pt-20">
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div key={photo._id}>
            <img
              src={urlFor(photo.image).url()}
              alt={photo.image.alt || photo.title || "Photo"}
              loading="lazy"
              className="rounded-lg w-full h-auto cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => openLightbox(i)}
            />
            {photo.caption && (
              <p className="text-sm mt-1 text-center text-gray-600">
                {photo.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={urlFor(photos[lightboxIndex].image).url()}
              alt={
                photos[lightboxIndex].image.alt ||
                photos[lightboxIndex].title ||
                "Photo"
              }
              className="max-w-full max-h-[80vh] rounded-lg"
              loading="lazy"
            />
            <p className="text-center text-white mt-2">
              {photos[lightboxIndex].image.alt || photos[lightboxIndex].title}
            </p>
            <button
              onClick={showPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
              aria-label="Previous photo"
            >
              &#8592;
            </button>
            <button
              onClick={showNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
              aria-label="Next photo"
            >
              &#8594;
            </button>
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
              aria-label="Close lightbox"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
