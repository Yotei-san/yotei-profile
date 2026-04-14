"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createUserSession } from "@/app/lib/auth";

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();

  if (!email || !username || !password) {
    throw new Error("Preencha email, username e senha.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Email ou username já estão em uso.");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      displayName: displayName || username,
    },
    select: {
      id: true,
      username: true,
    },
  });

  await createUserSession(user.id);
  redirect("/dashboard");
}