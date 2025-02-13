"use client";
import { Hero } from "./_components/hero";
import Products from "@/components/products/Products";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Products />
      {/* Add more sections here as needed */}
    </main>
  );
}
