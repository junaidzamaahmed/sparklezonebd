"use client";

import { Navbar } from "@/components/global/navbar";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";

export default function LayoutComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProductsProvider>
      <CartProvider>
        <Navbar />
        <div className="overflow-hidden">
          <div className="mt-20 md:mt-28">{children}</div>
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}
