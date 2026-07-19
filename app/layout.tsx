import type { Metadata } from "next";
import { EB_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import "./globals.css";

const displayFont = EB_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const labelFont = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["300", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coffeenotes.fyi"),
  title: {
    default: "Coffee Notes — Pour-Over Coffee Recipes & Brew Guides",
    template: "%s — Coffee Notes",
  },
  description:
    "Curated pour-over coffee recipes for V60, Orea, April, and more. Step-by-step brewing guides with grind sizes, pouring schedules, and tasting notes.",
  openGraph: {
    type: "website",
    siteName: "Coffee Notes",
    title: "Coffee Notes — Pour-Over Coffee Recipes & Brew Guides",
    description:
      "Curated pour-over coffee recipes with step-by-step pouring schedules, grind guides, and filter comparisons.",
  },
  twitter: {
    card: "summary",
    title: "Coffee Notes — Pour-Over Coffee Recipes & Brew Guides",
    description:
      "Curated pour-over coffee recipes with step-by-step pouring schedules, grind guides, and filter comparisons.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${labelFont.variable} h-full antialiased`}
    >
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-Q6XZJCD9RL"
      />
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Q6XZJCD9RL');`,
        }}
      />
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NNLWCVHR');`,
        }}
      />
      <body className="min-h-full font-sans bg-bg text-text-primary">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NNLWCVHR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
