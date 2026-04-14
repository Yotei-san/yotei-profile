"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function saveProfileSettings(formData: FormData) {
  const sessionUser = await requireUser();

  const displayName = String(formData.get("displayName") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const themeColor =
    String(formData.get("themeColor") || "").trim() || "#f472b6";

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      displayName: displayName || null,
      bio: bio || null,
      themeColor,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath(`/${sessionUser.username}`);

  redirect("/dashboard/profile?success=saved");
}