"use client";

import { Suspense } from "react";
import ViewToggleInner from "./ViewToggleInner";

export default function ViewToggle() {
  return (
    <Suspense fallback={null}>
      <ViewToggleInner />
    </Suspense>
  );
}
