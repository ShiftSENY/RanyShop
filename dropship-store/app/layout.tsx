import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RanyShop — Online Store",
  description: "Curated wellness and skincare essentials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${outfit.variable}`}>
      <body className="min-h-full flex flex-col antialiased text-gray-900 bg-[#FAFAF7]">
        {children}
      </body>
    </html>
  );
}
