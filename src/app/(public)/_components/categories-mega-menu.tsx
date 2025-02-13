"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Category = {
  name: string;
  icon: string;
  subcategories: (string | Category)[];
};

const categories: Category[] = [
  {
    name: "Electronics",
    icon: "🖥️",
    subcategories: [
      "Smartphones",
      {
        name: "Computers",
        icon: "💻",
        subcategories: ["Laptops", "Desktops", "Tablets"],
      },
      "Accessories",
      {
        name: "Audio",
        icon: "🎧",
        subcategories: ["Headphones", "Speakers", "Microphones"],
      },
    ],
  },
  {
    name: "Clothing",
    icon: "👕",
    subcategories: [
      {
        name: "Men",
        icon: "👔",
        subcategories: ["Shirts", "Pants", "Shoes"],
      },
      {
        name: "Women",
        icon: "👗",
        subcategories: ["Dresses", "Tops", "Skirts", "Shoes"],
      },
      "Kids",
      "Accessories",
    ],
  },
  {
    name: "Home & Garden",
    icon: "🏡",
    subcategories: ["Furniture", "Decor", "Kitchen", "Outdoor"],
  },
  {
    name: "Sports & Outdoors",
    icon: "⚽",
    subcategories: ["Fitness", "Camping", "Bikes", "Team Sports"],
  },
  {
    name: "Beauty & Personal Care",
    icon: "💄",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"],
  },
  {
    name: "Books & Stationery",
    icon: "📚",
    subcategories: ["Fiction", "Non-fiction", "Academic", "Office Supplies"],
  },
];

function SubcategoryMenu({
  items,
  parentPath = "",
}: {
  items: (string | Category)[];
  parentPath?: string;
}) {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );

  return (
    <ul className="py-2">
      {items.map((item, index) => {
        const isCategory = typeof item !== "string";
        const name = isCategory ? item.name : item;
        const path = `${parentPath}/${name.toLowerCase().replace(/ /g, "-")}`;

        return (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setActiveSubcategory(name)}
            onMouseLeave={() => setActiveSubcategory(null)}
          >
            <Link
              href={path}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              <span className="flex items-center">
                {isCategory && <span className="mr-2">{item.icon}</span>}
                {name}
              </span>
              {isCategory && item.subcategories.length > 0 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
            {isCategory &&
              item.subcategories.length > 0 &&
              activeSubcategory === name && (
                <div className="absolute top-0 left-full w-48 bg-white shadow-md rounded-md z-10">
                  <SubcategoryMenu
                    items={item.subcategories}
                    parentPath={path}
                  />
                </div>
              )}
          </li>
        );
      })}
    </ul>
  );
}

export function CategoriesMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="relative bg-white shadow-md rounded-md">
      <ul className="py-2">
        {categories.map((category) => (
          <li
            key={category.name}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              href={`/category/${category.name
                .toLowerCase()
                .replace(/ /g, "-")}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              <span className="flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            {activeCategory === category.name && (
              <div className="absolute top-0 left-full w-48 bg-white shadow-md rounded-md z-10">
                <SubcategoryMenu
                  items={category.subcategories}
                  parentPath={`/category/${category.name
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
