import { Suspense } from "react";
import { BrandForm } from "./_components/brand-form";
import { BrandsTableSkeleton } from "./_components/brands-table-skeleton";
import { BrandsTable } from "./_components/brands-table";

export default function BrandsPage() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Brands</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add New Brand</h3>
          <BrandForm />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Existing Brands</h3>
          <Suspense fallback={<BrandsTableSkeleton />}>
            <BrandsTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
