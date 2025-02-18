"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/context/ProductsContext";

export default function Products() {
  const { products, categories, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-low" | "price-high" | "rating"
  >("featured");

  // Use the products directly and apply filtering
  const displayProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category.id === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.regularPrice - b.regularPrice;
        case "price-high":
          return b.regularPrice - a.regularPrice;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    })
    .slice(0, 8); // Show only first 8 products for featured section

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our curated selection of beauty essentials
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
