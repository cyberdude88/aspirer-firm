import type { Metadata } from "next";
import { Poppins, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealScripts } from "@/components/RevealScripts";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${jetbrains.variable} ${montserrat.variable}`}>
        <div className="stage-bg" />
        <div className="stage-glow" aria-hidden />
        <div className="slashes" aria-hidden>
          <div className="slash s1" />
          <div className="slash s2" />
          <div className="slash s3" />
        </div>
        <div className="stage-grain" aria-hidden />
        <Header />
        {children}
        <Footer />
        <RevealScripts />
      </body>
    </html>
  );
}
