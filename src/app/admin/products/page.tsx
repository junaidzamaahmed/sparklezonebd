import { Suspense } from "react";
import { ProductsTable } from "./_components/products-table";
import { ProductsTableSkeleton } from "./_components/products-table-skeleton";

export default async function ProductsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}
