"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUserSession } from "@/app/lib/auth";
import { createAndSendEmailVerification } from "@/app/lib/email-verification";
import { prisma } from "@/app/lib/prisma";

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();
  const rememberSession = parseRememberSession(formData.get("rememberSession"));

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
    throw new Error("Email ou username ja estao em uso.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

  await createAndSendEmailVerification({
    userId: user.id,
    email,
    username,
  });

  await createUserSession(user.id, { remember: rememberSession });
  redirect("/dashboard");
}

function parseRememberSession(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return false;
  }

  return value === "1" || value === "true" || value === "on";
}
