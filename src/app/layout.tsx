import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { SessionProvider } from "next-auth/react";

// Load Roboto font with variable to prevent hydration issues
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Include common font weights
  display: "swap", // Add display swap for better performance
  variable: "--font-roboto", // Use CSS variable approach instead of className
});

export const metadata: Metadata = {
  title: "Decant Perfumes | Premium Fragrance Collection",
  description:
    "Shop premium decant perfumes and fragrances at affordable prices. Experience luxury scents without the full bottle commitment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${roboto.variable}`}>
      <body
        className="font-sans antialiased bg-background text-foreground min-h-screen"
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
