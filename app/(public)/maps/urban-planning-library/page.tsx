"use client";

import { useState } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UrbanPlanningMapPage() {
  const [iframeKey, setIframeKey] = useState(0);
  const [hasIframeError, setHasIframeError] = useState(false);

  const handleReloadIframe = () => {
    setHasIframeError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Kho bản đồ quy hoạch Việt Nam
        </h1>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleReloadIframe}
          >
            <RotateCw className="size-4" />
            Tải lại bản đồ
          </Button>
        </div>

        <div className="relative h-[78vh] min-h-120 w-full overflow-hidden rounded-xl border border-slate-200">
          {hasIframeError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 p-4">
              <div className="max-w-md text-center">
                <AlertTriangle className="mx-auto mb-2 size-6 text-amber-500" />
                <p className="mb-3 text-sm text-slate-700">
                  Không thể tải bản đồ lúc này. Vui lòng thử tải lại iframe.
                </p>
                <Button type="button" onClick={handleReloadIframe}>
                  Thử lại
                </Button>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            title="Kho bản đồ quy hoạch Việt Nam"
            src="https://tracuuquyhoach.com/ban-do-quy-hoach"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setHasIframeError(true)}
            onLoad={() => setHasIframeError(false)}
          />
        </div>
      </section>
    </main>
  );
}
