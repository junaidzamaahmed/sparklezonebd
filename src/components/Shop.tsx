"use client";
import React, { useState, useCallback } from "react";
import { Star, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./products/ProductCard";
import { useProducts } from "@/context/ProductsContext";
// Filter types
type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

const ratings = [5, 4, 3, 2, 1];

export default function Shop() {
  const { filteredProducts, filterProducts, categories, priceRange, loading } =
    useProducts();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState({
    min: priceRange.min,
    max: priceRange.max,
  });

  // Get filters from URL
  const category = searchParams.get("category") || "All";
  const minRating = Number(searchParams.get("rating")) || 0;
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const search = searchParams.get("search") || "";

  // Update filters using the context
  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      const selectedCategory = categories.find(
        (c) => c.name === (newParams.get("category") || "All")
      );

      const filters = {
        category: selectedCategory,
        minPrice: Number(newParams.get("minPrice")) || 0,
        maxPrice: Number(newParams.get("maxPrice")) || priceRange.max,
        minRating: Number(newParams.get("rating")) || 0,
        search: newParams.get("search") || "",
        sort: (newParams.get("sort") as SortOption) || "featured",
      };

      filterProducts(filters);
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams, filterProducts, priceRange.max, categories]
  );

  // Reset all filters
  const resetFilters = () => {
    router.replace(`${pathname}`);
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.regularPrice - b.regularPrice;
      case "price-high":
        return b.regularPrice - a.regularPrice;
      case "rating":
        return (b.rating || 0) - (a.rating || 0); // Fixed rating sort
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  // Update the price range inputs without immediate filtering
  const handlePriceChange = (type: "min" | "max", value: number) => {
    setLocalPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // New apply filters function
  const applyFilters = () => {
    updateFilters({
      minPrice: localPriceRange.min.toString(),
      maxPrice: localPriceRange.max.toString(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <p className="text-gray-600 mt-1">
              {sortedProducts.length} products found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>

            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(category !== "All" ||
          minRating > 0 ||
          search ||
          minPrice > 0 ||
          maxPrice < 10000) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {category !== "All" && (
              <button
                onClick={() => updateFilters({ category: "All" })}
                className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm"
              >
                Category: {category}
                <X className="h-4 w-4 ml-2" />
              </button>
            )}
            {minRating > 0 && (
              <button
                onClick={() => updateFilters({ rating: "" })}
                className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm"
              >
                Rating: {minRating}+{" "}
                <Star className="h-4 w-4 ml-1 fill-current" />
                <X className="h-4 w-4 ml-2" />
              </button>
            )}
            {search && (
              <button
                onClick={() => updateFilters({ search: "" })}
                className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm"
              >
                Search: {search}
                <X className="h-4 w-4 ml-2" />
              </button>
            )}
            {(minPrice > 0 || maxPrice < 10000) && (
              <button
                onClick={() => {
                  updateFilters({ minPrice: "", maxPrice: "" });
                }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm"
              >
                Price: &#2547;{minPrice} - &#2547;{maxPrice}
                <X className="h-4 w-4 ml-2" />
              </button>
            )}
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`
              md:w-64 space-y-6 bg-white p-6 rounded-lg shadow-sm
              ${
                isMobileFiltersOpen
                  ? "fixed inset-0 z-40 md:relative md:inset-auto"
                  : "hidden md:block"
              }
            `}
          >
            {/* Mobile header */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters({ category: cat.name })}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                      category === cat.name
                        ? "bg-orange-100 text-orange-800"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="px-3">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>&#2547;{localPriceRange.min}</span>
                  <span>&#2547;{localPriceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={localPriceRange.min}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={localPriceRange.max}
                  onChange={(e) =>
                    handlePriceChange("max", Number(e.target.value))
                  }
                  className="w-full mb-4"
                />
                <button
                  onClick={applyFilters}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilters({ rating: rating.toString() })}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                      minRating === rating
                        ? "bg-orange-100 text-orange-800"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      <span className="ml-2">& Up</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-orange-600 hover:text-orange-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
