"use server";

import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();

  const bio = formData.get("bio")?.toString().trim() || "";
  const avatarUrl = formData.get("avatarUrl")?.toString().trim() || "";
  const themeColor = formData.get("themeColor")?.toString().trim() || "zinc";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      themeColor,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${user.username}`);
}