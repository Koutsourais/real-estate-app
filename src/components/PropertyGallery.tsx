"use client";

import Image from "next/image";
import { useRef } from "react";

type MediaItem = {
  id: number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function PropertyGallery({ images }: { images: MediaItem[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLDivElement>("[data-card]");
    const w = card ? card.clientWidth + 16 /*gap*/ : el.clientWidth;
    el.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {images.map((img, idx) => (
          <div
            key={`${img.id}-${idx}`}
            data-card
            className="relative min-w-full md:min-w-[70%] lg:min-w-[60%] h-64 sm:h-80 md:h-96 snap-center rounded-xl overflow-hidden bg-gray-100"
          >
            <Image
              src={img.url}
              alt={img.alt || `Φωτογραφία ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 60vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollByCard("prev")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border shadow rounded-full w-10 h-10 items-center justify-center"
            aria-label="Προηγούμενη"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCard("next")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border shadow rounded-full w-10 h-10 items-center justify-center"
            aria-label="Επόμενη"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-white/70 border border-white" />
          ))}
        </div>
      )}
    </div>
  );
}
