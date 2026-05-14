"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUserSession } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function loginUser(formData: FormData) {
  const identifier = String(formData.get("identifier") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const rememberSession = parseRememberSession(formData.get("rememberSession"));

  if (!identifier || !password) {
    throw new Error("Preencha seu email ou username e a senha.");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    select: {
      id: true,
      password: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("Usuario ou senha invalidos.");
  }

  if (user.status !== "active") {
    throw new Error("Conta desativada.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Usuario ou senha invalidos.");
  }

  await createUserSession(user.id, { remember: rememberSession });
  redirect("/dashboard");
}

function parseRememberSession(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return false;
  }

  return value === "1" || value === "true" || value === "on";
}
