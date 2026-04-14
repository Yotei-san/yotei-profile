"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createUserSession } from "@/app/lib/auth";

export async function loginUser(formData: FormData) {
  const identifier = String(formData.get("identifier") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").trim();

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
    throw new Error("Usuário ou senha inválidos.");
  }

  if (user.status !== "active") {
  throw new Error("Conta desativada.");
}

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Usuário ou senha inválidos.");
  }

  await createUserSession(user.id);
  redirect("/dashboard");
}