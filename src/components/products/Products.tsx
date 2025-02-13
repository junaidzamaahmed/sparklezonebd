"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const categories = ["All", "Skincare", "Makeup", "Hair Care", "Body Care"];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "All" || product.category.id === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.regularPrice - b.regularPrice;
      case "price-high":
        return b.regularPrice - a.regularPrice;
      case "rating":
        return (
          Math.floor(
            (b.reviews?.reduce((acc, curr) => acc + curr.rating, 0) || 0) /
              (b.reviews?.length || 1)
          ) -
          Math.floor(
            (a.reviews?.reduce((acc, curr) => acc + curr.rating, 0) || 0) /
              (a.reviews?.length || 1)
          )
        );
      default:
        return 0;
    }
  });

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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
