"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createUserSession } from "@/app/lib/auth";

function slugifyUsername(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const usernameRaw = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  const username = slugifyUsername(usernameRaw);

  if (!email || !username || !password) {
    redirect("/register");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    redirect("/register");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    redirect("/register");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      displayName: displayName || username,
      bio: "Meu perfil no Yotei Profile",
    },
  });

  await createUserSession(user.id);

  redirect("/dashboard");
}