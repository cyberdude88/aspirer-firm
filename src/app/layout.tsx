import type { Metadata } from "next";
import { Poppins, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealScripts } from "@/components/RevealScripts";
import { FloatingBackgroundLogo } from "@/components/FloatingBackgroundLogo";
import { LogoIntroDriver } from "@/components/LogoIntroDriver";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["200", "300", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aspirer Firm — Mindset Coaching for Entrepreneurs",
  description: "Helping founders build unbreakable resilience, overcome self-doubt, and grow with confidence. 1:1 mindset coaching by Marie Cook, Licensed Mental Health Professional.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

// Synchronous boot script: stamps html[data-intro] before first paint
// so the wipe animation (on the header LogoMark) and the wordmark
// slide-in start in the right state with no FOUC.
//   homepage load  → "armed"  (LogoIntroDriver advances to "playing")
//   other routes / reduce → "done"
const INTRO_BOOT = `
try {
  var d = document.documentElement;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.setAttribute('data-intro','done');
  } else if (window.location && window.location.pathname === '/') {
    d.setAttribute('data-intro','armed');
  } else {
    d.setAttribute('data-intro','done');
  }
} catch(e) { document.documentElement.setAttribute('data-intro','done'); }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
      </head>
      <body className={`${poppins.variable} ${jetbrains.variable} ${montserrat.variable}`}>
        <div className="stage-bg" />
        <div className="stage-glow" aria-hidden />
        <FloatingBackgroundLogo />
        <div className="stage-grain" aria-hidden />
        <div className="site-shell">
          <Header />
          {children}
          <Footer />
          <RevealScripts />
          <LogoIntroDriver />
        </div>
      </body>
    </html>
  );
}
