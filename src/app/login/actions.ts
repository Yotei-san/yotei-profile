"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUserSession } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type AuthActionResult = {
  error?: string;
};

export async function loginUser(
  formData: FormData
): Promise<AuthActionResult | void> {
  const identifier = String(formData.get("identifier") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const rememberSession = parseRememberSession(formData.get("rememberSession"));

  if (!identifier || !password) {
    return { error: "Preencha seu email ou username e a senha." };
  }

  try {
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
      return { error: "Email, username ou senha invalidos." };
    }

    if (user.status !== "active") {
      return { error: "Esta conta esta temporariamente indisponivel." };
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return { error: "Email, username ou senha invalidos." };
    }

    await createUserSession(user.id, { remember: rememberSession });
  } catch (error) {
    logServerError("auth.login", error, {
      identifier,
    });
    return {
      error:
        "Nao foi possivel entrar agora. Tente novamente em instantes.",
    };
  }

  redirect("/dashboard");
}

function parseRememberSession(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return false;
  }

  return value === "1" || value === "true" || value === "on";
}
