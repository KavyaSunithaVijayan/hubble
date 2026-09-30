"use client";

import { createElement, useEffect, useRef, useState } from "react";

type Props = {
  modelUrl: string | null;
};

export default function Product3DViewer({ modelUrl }: Props) {
  const modelRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const registerModelViewer = async () => {
      try {
        await import("@google/model-viewer");

        if (!mounted || !modelRef.current) return;

        const element = modelRef.current;

        const handleLoad = () => {
          if (mounted) {
            setLoading(false);
          }
        };

        const handleError = (event: Event) => {
          console.error("Failed to load 3D model:", event);

          if (mounted) {
            setLoading(false);
            setError(true);
          }
        };

        element.addEventListener("load", handleLoad);
        element.addEventListener("error", handleError);

        return () => {
          element.removeEventListener("load", handleLoad);
          element.removeEventListener("error", handleError);
        };
      } catch (err) {
        console.error("Failed to register model-viewer:", err);

        if (mounted) {
          setLoading(false);
          setError(true);
        }
      }
    };

    registerModelViewer();

    return () => {
      mounted = false;
    };
  }, []);

  if (!modelUrl) {
    return (
      <div className="relative flex h-105 w-full items-center justify-center rounded-2xl border border-white/10 bg-[#0b1118] sm:h-125 md:h-150">
        <div className="text-center">
          <p className="text-sm font-medium text-white">3D model unavailable</p>

          <p className="mt-2 text-xs text-[#9ca9ba]">
            This product does not have a 3D model yet.
          </p>
        </div>
      </div>
    );
  }

  const modelViewer = createElement("model-viewer", {
    ref: (element: HTMLElement | null) => {
      modelRef.current = element;
    },

    src: modelUrl,

    alt: "Product 3D model",

    "camera-controls": true,

    "auto-rotate": true,

    "shadow-intensity": "1",

    exposure: "1",

    "environment-image": "neutral",

    "interaction-prompt": "auto",

    "touch-action": "pan-y",

    style: {
      width: "100%",
      height: "100%",
      display: "block",
      background: "transparent",
    },
  });

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative h-105 w-full sm:h-125 md:h-150">
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b1118]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#56D6C0]" />

              <p className="text-sm text-[#9ca9ba]">Loading 3D model...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium text-white">
                Unable to load the 3D model.
              </p>

              <p className="mt-2 text-xs text-[#9ca9ba]">
                Please check the model URL and CORS settings.
              </p>
            </div>
          </div>
        ) : (
          modelViewer
        )}

        {!loading && !error && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm">
            Drag to rotate · Scroll to zoom
          </div>
        )}
      </div>
    </div>
  );
}
