"use client";

import "@google/model-viewer";

import { useState } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "shadow-intensity"?: string;
        exposure?: string;
        "interaction-prompt"?: string;
        loading?: "auto" | "lazy" | "eager";
      };
    }
  }
}

type Props = {
  src: string;
  alt: string;
};

export default function ProductViewer({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] sm:min-h-[520px]">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#ff651e]" />

          <p className="mt-4 text-sm text-white/50">Loading 3D model...</p>
        </div>
      )}

      <model-viewer
        src={src}
        alt={alt}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        interaction-prompt="auto"
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "420px",
          background: "transparent",
        }}
        onLoad={() => setLoaded(true)}
      />

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs text-white/50 backdrop-blur-md">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
