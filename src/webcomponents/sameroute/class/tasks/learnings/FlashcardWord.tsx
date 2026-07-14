"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FlashcardProps {
  word: string;
  definition: string;
  image?: string;
  note?: string;
}

export const Flashcard = ({ word, definition, image, note }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-muted-foreground text-center">
        Tap the card to flip
      </p>

      <div
        className="w-full max-w-sm cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div
          className="relative w-full h-56 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-xl bg-primary shadow-md
              flex flex-col items-center justify-center gap-3 p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-primary-foreground/60 uppercase">
              Word
            </span>

            <p className="text-3xl font-bold text-primary-foreground text-center">
              {word}
            </p>

            {image && (
              <div className="relative w-20 h-20">
                <Image
                  src={image}
                  alt={word}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            )}
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-xl bg-card border shadow-md
              flex flex-col items-center justify-center gap-3 p-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs text-primary uppercase">
              Definition
            </span>

            {/* WORD AGAIN (as you requested) */}
            <p className="text-lg font-semibold text-center">{word}</p>

            <p className="text-sm text-center">{definition}</p>

            {note && (
              <p className="text-xs text-muted-foreground italic text-center">
                {note}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Indicator */}
      <div className="flex gap-2">
        <div className={cn("w-2 h-2 rounded-full", !flipped ? "bg-primary" : "bg-border")} />
        <div className={cn("w-2 h-2 rounded-full", flipped ? "bg-primary" : "bg-border")} />
      </div>
    </div>
  );
};