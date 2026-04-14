"use server";

import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function usernameIsValid(value: string) {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(value);
}

export async function updateUsername(formData: FormData) {
  const sessionUser = await requireUser();
  const rawUsername = String(formData.get("username") ?? "").trim();
  const username = rawUsername.toLowerCase();

  if (!usernameIsValid(username)) {
    redirect("/dashboard/settings?error=invalid-username");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, username: true },
  });

  if (!user) {
    redirect("/dashboard/settings?error=user-not-found");
  }

  if (username === user.username) {
    redirect("/dashboard/settings?error=same-username");
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existing) {
    redirect("/dashboard/settings?error=username-taken");
  }

  const oldUsername = user.username;

  await prisma.user.update({
    where: { id: user.id },
    data: { username },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/${oldUsername}`);
  revalidatePath(`/${username}`);

  redirect("/dashboard/settings?success=username-updated");
}

export async function updateDisplayName(formData: FormData) {
  const sessionUser = await requireUser();
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!displayName) {
    redirect("/dashboard/settings?error=empty-display-name");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, username: true },
  });

  if (!user) {
    redirect("/dashboard/settings?error=user-not-found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { displayName },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/${user.username}`);

  redirect("/dashboard/settings?success=display-name-updated");
}

export async function updatePassword(formData: FormData) {
  const sessionUser = await requireUser();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    redirect("/dashboard/settings?error=password-too-short");
  }

  if (newPassword !== confirmPassword) {
    redirect("/dashboard/settings?error=password-mismatch");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    redirect("/dashboard/settings?error=user-not-found");
  }

  const passwordMatches = await bcryptjs.compare(
    currentPassword,
    user.passwordHash
  );

  if (!passwordMatches) {
    redirect("/dashboard/settings?error=wrong-password");
  }

  const samePassword = await bcryptjs.compare(newPassword, user.passwordHash);

  if (samePassword) {
    redirect("/dashboard/settings?error=same-password");
  }

  const newPasswordHash = await bcryptjs.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?success=password-updated");
}
