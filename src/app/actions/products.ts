"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: { name: string; description: string; price: number; stock: number; imageUrl: string }) {
  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
    }
  });
  revalidatePath("/admin/products");
  revalidatePath("/pos");
}

export async function updateProduct(id: number, data: { name: string; description: string; price: number; stock: number; imageUrl: string }) {
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
    }
  });
  revalidatePath("/admin/products");
  revalidatePath("/pos");
}

export async function deleteProduct(id: number) {
  // Wait, if it has related sales/purchases, deletion might fail due to foreign key constraints if onDelete is not Cascade.
  // In our schema, SaleItem and PurchaseItem have onDelete: Cascade or default Restrict.
  // Let's just try to delete, if it fails because it's referenced, we can catch it or we need to update the schema to cascade.
  // The schema has: sale Sale @relation(..., onDelete: Cascade) for SaleItem. Wait, the relation from Product is default (Restrict).
  // So deleting a product with sales will throw an error. For simplicity, we just delete it.
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/products");
    revalidatePath("/pos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Cannot delete product because it has associated sales or purchases." };
  }
}
