"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brand } from "@prisma/client";

export function BrandForm({ brand }: { brand?: Brand }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const brandData = Object.fromEntries(formData);

      const url = brand ? `/api/brands/${brand.id}` : "/api/brands";
      const method = brand ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });

      setLoading(false);

      if (response.ok) {
        router.push("/admin/brands");
        router.refresh();
      } else {
        // Handle error
        console.error("Failed to save brand");
      }
    } catch (error) {
      console.error("Error saving brand", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={brand?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={brand?.description || ""}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Brand"}
      </Button>
    </form>
  );
}
