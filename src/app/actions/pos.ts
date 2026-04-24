"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createSale(
  items: { productId: number; quantity: number; price: number }[],
  customerData: { customerName: string; customerPhone: string; customerAddress: string; paymentMethod: string }
) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.price * item.quantity;
  }

  // Transaction to ensure stock is updated correctly
  const sale = await prisma.$transaction(async (tx) => {
    // 1. Create the sale
    const newSale = await tx.sale.create({
      data: {
        totalAmount,
        userId: session.user.id,
        customerName: customerData.customerName,
        customerPhone: customerData.customerPhone,
        customerAddress: customerData.customerAddress,
        paymentMethod: customerData.paymentMethod,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Decrease product stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newSale;
  });

  revalidatePath("/pos");
  revalidatePath("/admin");
  return sale;
}
