"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        ];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction: number) => {
    setActiveIndex(
      (prev) =>
        (prev + direction + displayImages.length) % displayImages.length,
    );
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[300px] md:h-[420px]">
        {/* Main Image */}
        <div
          className={`relative cursor-pointer ${displayImages.length === 1 ? "md:col-span-4" : "md:col-span-2 md:row-span-2"}`}
          onClick={() => openLightbox(0)}
        >
          <Image
            src={displayImages[0]}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        {/* Thumbnails */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative hidden md:block cursor-pointer"
            onClick={() => openLightbox(idx + 1)}
          >
            <Image
              src={img}
              alt={`${title} ${idx + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            {idx === 3 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{displayImages.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image count badge on mobile */}
      {displayImages.length > 1 && (
        <button
          onClick={() => openLightbox(0)}
          className="md:hidden mt-2 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
        >
          View all {displayImages.length} photos
        </button>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/70 text-sm">
              {activeIndex + 1} / {displayImages.length}
            </div>

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  className="absolute left-4 z-10 text-white/70 hover:text-white p-2 bg-white/10 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(1);
                  }}
                  className="absolute right-4 z-10 text-white/70 hover:text-white p-2 bg-white/10 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[activeIndex]}
                alt={`${title} ${activeIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
