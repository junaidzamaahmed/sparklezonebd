"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Product } from "@/app/types/product";
import { Category } from "@prisma/client";
type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  filteredProducts: Product[];
  filterProducts: (filters: FilterOptions) => void;
  categories: (Category & {
    subCategories: Category[];
    parentCategory: Category | null;
  })[];
  priceRange: { min: number; max: number };
};

type FilterOptions = {
  category?: Category & {
    subCategories: Category[];
    parentCategory: Category | null;
  };
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sort?: "featured" | "price-low" | "price-high" | "rating" | "newest";
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize derived data
  const categories = useMemo(() => {
    const uniqueCategories = products.map((p) => ({
      ...p.category,
      description: p.category.description || null,
      parentCategoryId: p.category.parentCategoryId || null,
      parentCategory: p.category.parentCategory || null,
      subCategories: p.category.subCategories || [],
    }));

    const allCategory: Category & {
      subCategories: Category[];
      parentCategory: Category | null;
    } = {
      id: "all",
      name: "All",
      description: null,
      parentCategoryId: null,
      subCategories: [],
      parentCategory: null,
    };

    return [allCategory, ...uniqueCategories];
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    return {
      min: Math.min(...products.map((p) => p.regularPrice)),
      max: Math.max(...products.map((p) => p.regularPrice)),
    };
  }, [products]);

  const filterProducts = (filters: FilterOptions) => {
    let filtered = [...products];

    if (filters.category && filters.category.id !== "all") {
      filtered = filtered.filter((p) => p.category.id === filters.category?.id);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (p) =>
          p.regularPrice >= (filters.minPrice || 0) &&
          p.regularPrice <= (filters.maxPrice || Infinity)
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating!);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case "price-low":
            return a.regularPrice - b.regularPrice;
          case "price-high":
            return b.regularPrice - a.regularPrice;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  };

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
      setFilteredProducts(data);
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
        filteredProducts,
        filterProducts,
        categories,
        priceRange,
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
