"use client";
import { useProducts } from "@/context/ProductsContext";
import { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CategoryWithSub = Category & {
  subCategories: Category[];
};

export function Hero() {
  const { categories } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  return (
    <div className="relative bg-[#f8f8f8] min-h-[600px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories Mega Menu */}
          <div className="max-lg:hidden lg:col-span-3 relative z-20">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="bg-orange-400 py-3 px-4">
                <h2 className="text-white font-semibold text-lg">
                  BROWSE CATEGORIES
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((category: CategoryWithSub) => (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(category.name)}
                    onMouseLeave={() => {
                      setActiveCategory(null);
                      setActiveSubcategory(null);
                    }}
                  >
                    <button
                      className={`w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:text-orange-500 transition-colors duration-200 ${
                        activeCategory === category.name
                          ? "bg-orange-50 text-orange-500"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-opacity duration-200 ${
                          activeCategory === category.name
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      />
                    </button>

                    {/* First Level Flyout */}
                    {activeCategory === category.id && (
                      <div
                        className="absolute left-full top-0 w-56 bg-white shadow-xl rounded-r-lg overflow z-20"
                        style={{ marginLeft: "1px" }}
                      >
                        <div className="py-2">
                          {category.subCategories.map(
                            (subcategory: Category) => (
                              <div
                                key={subcategory.id}
                                className="relative"
                                onMouseEnter={() =>
                                  setActiveSubcategory(subcategory.id)
                                }
                                onMouseLeave={() => setActiveSubcategory(null)}
                              >
                                <Link
                                  href="#"
                                  className={`px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 flex items-center justify-between ${
                                    activeSubcategory === subcategory.name
                                      ? "bg-orange-50 text-orange-500"
                                      : ""
                                  }`}
                                >
                                  {subcategory.name}
                                  <ChevronRight
                                    className={`h-4 w-4 transition-opacity duration-200 ${
                                      activeSubcategory === subcategory.name
                                        ? "opacity-100"
                                        : "opacity-50"
                                    }`}
                                  />
                                </Link>

                                {/* Second Level Flyout
                              {activeSubcategory === subcategory.name && (
                                <div
                                  className="absolute left-full top-0 w-56 bg-white shadow-xl rounded-r-lg overflow z-20"
                                  style={{ marginLeft: "1px" }}
                                >
                                  <div className="py-2">
                                      {subcategory.products.map((product:Product) => (
                                      <Link
                                        key={product.id}
                                        href="#"
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
                                      >
                                        {product.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )} */}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-3">
                <div className="text-orange-400 font-semibold text-2xl">
                  BEAUTY
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  REVOLUTION
                  <br />
                  BEAUTY
                </h1>
                <p className="text-lg text-gray-600 max-w-md mb-5">
                  Get your favorite REVOLUTION products from us today!
                </p>
                <Link
                  href={"/shop"}
                  className="inline-block bg-orange-400 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-orange-500 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100 rounded-full opacity-20" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-100 rounded-full opacity-20" />
                <Image
                  width={200}
                  height={200}
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Beauty Products"
                  className="relative z-10 w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
    </div>
  );
}
