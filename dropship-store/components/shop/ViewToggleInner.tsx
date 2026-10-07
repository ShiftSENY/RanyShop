"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ViewToggleInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "grid";

  const toggleView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#E5DFD7]/60 p-1 rounded-lg">
      <button
        onClick={() => toggleView("grid")}
        className={`p-2 rounded-md transition-colors cursor-pointer ${
          currentView === "grid"
            ? "bg-white shadow-xs text-[#47522D]"
            : "text-stone-500 hover:text-[#23271A]"
        }`}
        title="Grid View"
        aria-label="Grid View"
      >
        <svg
          className="w-4.5 h-4.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => toggleView("list")}
        className={`p-2 rounded-md transition-colors cursor-pointer ${
          currentView === "list"
            ? "bg-white shadow-xs text-[#47522D]"
            : "text-stone-500 hover:text-[#23271A]"
        }`}
        title="List View"
        aria-label="List View"
      >
        <svg
          className="w-4.5 h-4.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
