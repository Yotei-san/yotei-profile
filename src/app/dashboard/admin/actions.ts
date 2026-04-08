"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId, createAdminAuditLog, getRequestIp } from "@/app/lib/admin-auth";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export async function banUser(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);
  const headerStore = await headers();
  const ipAddress = getRequestIp(headerStore);

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const reason = String(formData.get("reason") ?? "").trim();

  if (!username) {
    redirect("/dashboard/admin/users?error=invalid-input");
  }

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true, status: true },
  });

  if (!target) {
    redirect("/dashboard/admin/users?error=user-not-found");
  }

  if (target.role === "admin") {
    redirect(`/dashboard/admin/users/${username}?error=admin-protected`);
  }

  await prisma.user.update({
    where: { id: target.id },
    data: {
      status: "banned",
      banReason: reason || "Sem motivo informado.",
      bannedAt: new Date(),
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: target.id,
    action: "ban_user",
    ipAddress,
    details: `Banned @${target.username}. Reason: ${reason || "Sem motivo informado."}`,
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect(`/dashboard/admin/users/${username}?success=user-banned`);
}

export async function unbanUser(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);
  const headerStore = await headers();
  const ipAddress = getRequestIp(headerStore);

  const username = normalizeUsername(String(formData.get("username") ?? ""));

  if (!username) {
    redirect("/dashboard/admin/users?error=invalid-input");
  }

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true },
  });

  if (!target) {
    redirect("/dashboard/admin/users?error=user-not-found");
  }

  await prisma.user.update({
    where: { id: target.id },
    data: {
      status: "active",
      banReason: null,
      bannedAt: null,
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: target.id,
    action: "unban_user",
    ipAddress,
    details: `Unbanned @${target.username}`,
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect(`/dashboard/admin/users/${username}?success=user-unbanned`);
}

export async function promoteAdmin(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);
  const headerStore = await headers();
  const ipAddress = getRequestIp(headerStore);

  const username = normalizeUsername(String(formData.get("username") ?? ""));

  if (!username) {
    redirect("/dashboard/admin/users?error=invalid-input");
  }

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });

  if (!target) {
    redirect("/dashboard/admin/users?error=user-not-found");
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { role: "admin" },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: target.id,
    action: "promote_admin",
    ipAddress,
    details: `Promoted @${target.username} to admin`,
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect(`/dashboard/admin/users/${username}?success=promoted-admin`);
}

export async function demoteAdmin(formData: FormData) {
  const sessionUser = await requireUser();
  const admin = await requireAdminByUserId(sessionUser.id);
  const headerStore = await headers();
  const ipAddress = getRequestIp(headerStore);

  const username = normalizeUsername(String(formData.get("username") ?? ""));

  if (!username) {
    redirect("/dashboard/admin/users?error=invalid-input");
  }

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });

  if (!target) {
    redirect("/dashboard/admin/users?error=user-not-found");
  }

  if (target.id === admin.id) {
    redirect(`/dashboard/admin/users/${username}?error=self-demote-blocked`);
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { role: "user" },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: target.id,
    action: "demote_admin",
    ipAddress,
    details: `Demoted @${target.username} to user`,
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${username}`);
  redirect(`/dashboard/admin/users/${username}?success=demoted-admin`);
}
