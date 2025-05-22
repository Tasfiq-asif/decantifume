import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";

// Load Inter font with variable to prevent hydration issues
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Add display swap for better performance
  variable: '--font-inter', // Use CSS variable approach instead of className
});

export const metadata: Metadata = {
  title: "Decant Perfumes | Premium Fragrance Collection",
  description: "Shop premium decant perfumes and fragrances at affordable prices. Experience luxury scents without the full bottle commitment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
