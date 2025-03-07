import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sparkle Zone BD",
  description:
    "Bangladesh's no.1 online store for all your beauty needs. Buy authentic makeup, skincare, haircare, fragrances, bath & body products and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className}  antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
