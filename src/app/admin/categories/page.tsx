import { Suspense } from "react";
import { CategoryForm } from "./_components/category-form";
import { CategoriesTable } from "./_components/categories-table";
import { CategoriesTableSkeleton } from "./_components/categories-table-skeleton";

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
          <CategoryForm />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
          <Suspense fallback={<CategoriesTableSkeleton />}>
            <CategoriesTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
