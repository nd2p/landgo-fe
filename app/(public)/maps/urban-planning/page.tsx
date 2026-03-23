"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPinned, Search } from "lucide-react";

import { getProvinceService } from "@/features/location/location.service";
import type { IProvince } from "@/features/location/location.type";

const DEFAULT_PLANNING_EMBED_TEMPLATE =
  "https://www.google.com/maps?q={query}&output=embed";

const buildEmbedUrl = (template: string, query: string) => {
  const encodedQuery = encodeURIComponent(query);

  if (template.includes("{query}")) {
    return template.replaceAll("{query}", encodedQuery);
  }

  const separator = template.includes("?") ? "&" : "?";
  return `${template}${separator}q=${encodedQuery}`;
};

export default function UrbanPlanningMapPage() {

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Bản đồ quy hoạch Việt Nam
        </h1>
      </header>


      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

        <div className="h-[78vh] min-h-120 w-full overflow-hidden rounded-xl border border-slate-200">
          <iframe
            title="Ban do quy hoach Viet Nam"
            src="https://bds68.com.vn/quy-hoach"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
