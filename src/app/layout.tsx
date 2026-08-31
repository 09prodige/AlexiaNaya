import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import BackgroundLogo from "@/components/BackgroundLogo";

// Syne font: high impact, editorial, bold design font
const syne = Syne({ 
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Alexia D'Oliveira | Portfolio",
  description: "Graphic design studio specialized in art direction, photography and illustration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${syne.className} bg-[#FDFDFD] text-black antialiased relative`}>
        <BackgroundLogo />
        <CustomCursor />
        <Preloader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
