import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// Syne font: high impact, editorial, bold design font
const syne = Syne({ 
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Alexia D'Oliveira | Portfolio",
  description: "Graphic design studio specialized in art direction, photography and illustration.",
  icons: {
    icon: "/assets/Affiche/ANIMAT LOGO ALEXIA NAYA .png",
    shortcut: "/assets/Affiche/ANIMAT LOGO ALEXIA NAYA .png",
    apple: "/assets/Affiche/ANIMAT LOGO ALEXIA NAYA .png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${syne.className} bg-[#111111] text-white antialiased relative`}>
        {/* Background Textures & Details */}
        <div className="bg-grid" />
        <div className="vintage-noise" />
        <div className="film-scratch-layer" />
        <div className="film-scratch-layer-2" />
        <div className="vignette" />
        
        <CustomCursor />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
