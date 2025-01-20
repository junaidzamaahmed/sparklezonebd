"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Category } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2Icon } from "lucide-react";

export function CategoriesTable() {
  const [categories, setCategories] = useState<
    (Category & { parentCategory: Category | null })[]
  >([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  }

  async function deleteCategory(id: string) {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <ScrollArea className="h-[60vh] w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description?.slice(0, 20)}</TableCell>
                  <TableCell>
                    {category.parentCategory?.name || "None"}
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
}
