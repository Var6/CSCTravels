"use client";

import React from "react";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute left-5 top-0 h-full w-0.5 bg-linear-to-b from-[#2563eb] via-[#f59e0b] to-transparent" />
      <div className="space-y-8">
        {data.map((item, index) => (
          <article key={`${item.year}-${index}`} className="relative pl-16">
            <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#d6c8ad] bg-white text-xs font-extrabold text-[#1d4ed8]">
              {item.year}
            </div>
            <div className="surface rounded-2xl p-5 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
