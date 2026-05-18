"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUserSession } from "@/app/lib/auth";
import { createAndSendEmailVerification } from "@/app/lib/email-verification";
import { prisma } from "@/app/lib/prisma";
import { logServerError } from "@/app/lib/server-log";

type AuthActionResult = {
  error?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value: string) {
  return /^[a-z0-9_-]{3,20}$/.test(value);
}

export async function registerUser(
  formData: FormData
): Promise<AuthActionResult | void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();
  const rememberSession = parseRememberSession(formData.get("rememberSession"));

  if (!email || !username || !password) {
    return { error: "Preencha email, username e senha." };
  }

  if (!isValidEmail(email)) {
    return { error: "Digite um email valido." };
  }

  if (!isValidUsername(username)) {
    return {
      error:
        "Use um username com 3 a 20 caracteres, apenas letras minusculas, numeros, _ ou -.",
    };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (existingUser?.email === email) {
      return { error: "Este email ja esta em uso." };
    }

    if (existingUser?.username === username) {
      return { error: "Este username ja esta em uso." };
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
      },
    });

    await createAndSendEmailVerification(
      {
        userId: user.id,
        email,
        username,
      },
      {
        allowEmailDeliveryFailure: true,
      }
    );

    await createUserSession(user.id, { remember: rememberSession });
  } catch (error) {
    logServerError("auth.register", error, {
      email,
      username,
    });
    return {
      error:
        "Nao foi possivel criar sua conta agora. Tente novamente em instantes.",
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
