import type { Metadata } from "next";
import { EB_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
  title: "Coffee Notes",
  description: "Personal pour-over recipe reference",
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
        <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-border">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-display text-xl text-text-primary">
              Coffee Notes
            </a>
            <nav className="flex items-center gap-4">
              <a href="/" className="text-sm font-label text-text-secondary hover:text-accent transition-colors">Recipes</a>
              <a href="/grind" className="text-sm font-label text-text-secondary hover:text-accent transition-colors">Grind</a>
              <a href="/filters" className="text-sm font-label text-text-secondary hover:text-accent transition-colors">Filters</a>
            </nav>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
