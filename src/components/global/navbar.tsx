"use client";
import React, { useState } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import Cart from "./cart";
import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";
import User from "../auth/user";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Phones", "Laptops", "Tablets", "Accessories"],
  },
  { name: "Fashion", subcategories: ["Men", "Women", "Kids", "Accessories"] },
  {
    name: "Home & Living",
    subcategories: ["Furniture", "Decor", "Kitchen", "Bath"],
  },
  {
    name: "Sports",
    subcategories: ["Equipment", "Clothing", "Shoes", "Accessories"],
  },
];

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="fixed w-full bg-white shadow-md z-[100]">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/">
              <div className="ml-4 font-bold text-2xl text-orange-500">
                <Image height={50} src={logo} alt="Logo" />
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <User />
            <Cart />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex space-x-8 py-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <span>{category.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeCategory === category.name && (
                <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1 mt-[-10px]">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-white transform transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-xl text-orange-500">
                Categories
              </span>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href="#"
                        className="block text-gray-600 hover:text-gray-900"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
