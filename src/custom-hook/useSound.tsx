import { useRef, useEffect, useCallback } from "react";

type SoundType = "click" | "win" | "lose" | "draw";

interface SoundFiles {
  click: string;
  win: string;
  lose: string;
  draw: string;
}

const soundFiles: SoundFiles = {
  click: "/button-click.wav",
  win: "/win.mp3",
  lose: "/lost.wav",
  draw: "/draw.mp3",
};

export const useSound = (enabled: boolean = true) => {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    win: null,
    lose: null,
    draw: null,
  });

  const isInitialized = useRef(false);

  // Initialize audio objects
  useEffect(() => {
    if (!enabled || isInitialized.current) return;

    try {
      Object.entries(soundFiles).forEach(([key, src]) => {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.volume = 0.5; // Adjust volume as needed

        // Handle loading errors gracefully
        audio.onerror = () => {
          console.warn(`Failed to load sound: ${src}`);
        };

        audioRefs.current[key as SoundType] = audio;
      });

      isInitialized.current = true;
    } catch (error) {
      console.warn("Sound initialization failed:", error);
    }
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!enabled) return;

      const audio = audioRefs.current[soundType];
      if (!audio) return;

      try {
        // Reset audio to beginning and play
        audio.currentTime = 0;
        audio.play().catch((error) => {
          // Handle autoplay restrictions gracefully
          console.warn(`Could not play sound ${soundType}:`, error);
        });
      } catch (error) {
        console.warn(`Error playing sound ${soundType}:`, error);
      }
    },
    [enabled]
  );

  return { playSound };
};
