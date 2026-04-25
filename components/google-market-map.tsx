"use client";

import { useEffect, useRef, useState } from "react";
import { Listing } from "@/lib/types";

type GoogleLikeWindow = Window &
  typeof globalThis & {
    google?: {
      maps?: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
      };
    };
  };

const SCRIPT_ID = "sergios-google-maps-script";

export function GoogleMarketMap({ listings }: { listings: Listing[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const windowWithGoogle = window as GoogleLikeWindow;
    if (windowWithGoogle.google?.maps) {
      setScriptReady(true);
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!scriptReady || !mapRef.current) {
      return;
    }

    const windowWithGoogle = window as GoogleLikeWindow;
    const maps = windowWithGoogle.google?.maps;
    if (!maps) {
      return;
    }

    const map = new maps.Map(mapRef.current, {
      center: { lat: 40.7608, lng: -111.891 },
      zoom: 9,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    const coordinates: Record<string, { lat: number; lng: number }> = {
      "Salt Lake City": { lat: 40.7608, lng: -111.891 },
      Murray: { lat: 40.658, lng: -111.8879 },
      Draper: { lat: 40.5247, lng: -111.8638 },
      "South Jordan": { lat: 40.5622, lng: -111.9297 },
      Lehi: { lat: 40.3916, lng: -111.8508 },
      Ogden: { lat: 41.223, lng: -111.9738 }
    };

    listings.forEach((listing) => {
      const position = coordinates[listing.city];
      if (!position) return;

      new maps.Marker({
        map,
        position,
        title: `${listing.title} - ${listing.city}`
      });
    });
  }, [listings, scriptReady]);

  if (!apiKey) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-dashed border-border bg-[#fafbfd] p-6 text-center text-sm text-muted-foreground">
        Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to render the live Google map here.
      </div>
    );
  }

  return <div ref={mapRef} className="min-h-[360px] rounded-[28px] border border-border" />;
}
