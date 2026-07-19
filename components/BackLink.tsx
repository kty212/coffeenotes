"use client";

import { useRouter } from "next/navigation";

// Returns to the previous (filtered) recipe list. Uses browser history so the
// home page's URL filters are preserved; falls back to "/" for direct entry.
export default function BackLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button type="button" onClick={goBack} className={className}>
      {children}
    </button>
  );
}
