"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brand } from "@prisma/client";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { X } from "lucide-react";

export function BrandForm({ brand }: { brand?: Brand }) {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(brand?.image || "");
  const router = useRouter();

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    setImagePreview("");
    setUploadedFile(null);
  }

  async function uploadImageToFirebase(): Promise<string | null> {
    if (!uploadedFile) {
      // If no new file is uploaded, return the existing image URL or null
      return imagePreview || null;
    }

    const storageRef = ref(
      storage,
      `brands/${Date.now()}-${uploadedFile.name}`
    );
    const snapshot = await uploadBytes(storageRef, uploadedFile);
    return getDownloadURL(snapshot.ref);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const brandData = Object.fromEntries(formData);

      // Upload image to Firebase and get URL
      const imageUrl = await uploadImageToFirebase();

      const url = brand ? `/api/brands/${brand.id}` : "/api/brands";
      const method = brand ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...brandData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/brands");
        router.refresh();
      } else {
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
      <div className="space-y-2">
        <Label htmlFor="image">Brand Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {imagePreview && (
        <div className="space-y-2">
          <Label className="block">Preview Image</Label>
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Brand Image"
              className="w-40 h-40 object-cover rounded-md"
              width={160}
              height={160}
            />
            <Button
              type="button"
              onClick={removeImage}
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Brand"}
      </Button>
    </form>
  );
}
