import type { Metadata } from "next";
import { Lora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S Prasanna | Full-Stack & Cloud-Native Developer",
  description: "Portfolio of S Prasanna - Full-Stack Developer & Cloud-Native Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${spaceGrotesk.variable} dark scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#030617] text-[#94A3B8] font-serif antialiased selection:bg-[#6366F1]/30 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
