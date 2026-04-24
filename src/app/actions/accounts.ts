"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function deleteAccount(id: number) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  if (session.user.id === id) {
    return { success: false, error: "Cannot delete your own account." };
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
    revalidatePath("/admin/accounts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete account. They might have associated sales records." };
  }
}
