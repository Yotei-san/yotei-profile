"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { createReport } from "@/app/lib/moderation";

export async function reportProfile(formData: FormData) {
  const reporter = await requireUser();

  const username = String(formData.get("username") || "").trim().toLowerCase();
  const reason = String(formData.get("reason") || "").trim();

  if (!username || !reason) {
    redirect(`/${username}?error=missing-report-fields`);
  }

  const targetUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true },
  });

  if (!targetUser) {
    redirect(`/${username}?error=user-not-found`);
  }

  if (targetUser.id === reporter.id) {
    redirect(`/${username}?error=self-report`);
  }

  await createReport({
    createdByUserId: reporter.id,
    targetUserId: targetUser.id,
    reason,
  });

  redirect(`/${username}?success=report-sent`);
}
