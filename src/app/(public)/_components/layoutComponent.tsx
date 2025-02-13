"use client";

import { Navbar } from "@/components/global/navbar";
import { CartProvider } from "@/context/CartContext";

export default function LayoutComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <div className="overflow-hidden">
        <div className="md:mt-28">{children}</div>
      </div>
    </CartProvider>
  );
}
