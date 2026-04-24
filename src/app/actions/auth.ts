"use server";

import prisma from "@/lib/prisma";
import { login, logout } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function authenticate(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Invalid credentials." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid credentials." };
  }

  await login({ id: user.id, username: user.username, role: user.role });

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/pos");
  }
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

export async function registerAccount(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "CASHIER"; // Default to cashier for safety

  if (!username || !password || username.length < 3 || password.length < 6) {
    return { error: "Username must be at least 3 chars and password at least 6 chars." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "Username already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "CASHIER",
    }
  });

  await login({ id: user.id, username: user.username, role: user.role });

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/pos");
  }
}
