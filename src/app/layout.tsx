import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display" });

// Card design fonts, loaded once so previews render instantly.
const CARD_FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Bebas+Neue&family=Cormorant:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Bricolage+Grotesque:wght@400;600;700&family=Instrument+Serif&family=Geist:wght@400;500;700&family=Lato:wght@400;700&display=swap";

export const metadata: Metadata = {
  title: {
    default: "CardDrop — Digital business cards that live in your wallet",
    template: "%s · CardDrop",
  },
  description:
    "Design a beautiful digital business card, share it with a QR code, and add it to Apple Wallet or Google Wallet.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={CARD_FONTS_CSS} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
