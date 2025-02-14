"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/app/types/product";

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
