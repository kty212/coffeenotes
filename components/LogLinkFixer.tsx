"use client";

import { useEffect } from "react";

/**
 * The log's internal links use clean permalinks (/, /2026, /2026-014) that are
 * rewritten to /log/* by proxy.ts — but only on the real `log.` subdomain.
 * On any other host (local dev, Vercel preview) the log is served under /log,
 * so those bare links 404. This runs client-side and, when NOT on the log
 * subdomain, rewrites log links to their /log-prefixed form so previews work.
 * Production (log.coffeenotes.fyi) is untouched and keeps clean URLs.
 */
const isLogPath = (p: string) => p === "/" || /^\/\d{4}(-\d{3})?$/.test(p);

export default function LogLinkFixer() {
  useEffect(() => {
    if (window.location.hostname.startsWith("log.")) return;
    for (const a of Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'),
    )) {
      const href = a.getAttribute("href");
      if (href && isLogPath(href)) {
        a.setAttribute("href", href === "/" ? "/log" : `/log${href}`);
      }
    }
  });

  return null;
}
