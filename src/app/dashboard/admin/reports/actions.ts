"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { requireAdminByUserId, createAdminAuditLog, getRequestIp } from "@/app/lib/admin-auth";
import { getReportLabel } from "@/app/lib/moderation";

export async function markReportReviewing(formData: FormData) {
  const admin = await requireUser();
  await requireAdminByUserId(admin.id);

  const reportId = String(formData.get("reportId") || "").trim();
  if (!reportId) redirect("/dashboard/admin/reports?error=missing-id");

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "reviewing" },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    action: "report.reviewing",
    details: `Report ${reportId} marcada como reviewing.`,
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/dashboard/admin/reports");
  revalidatePath(`/dashboard/admin/reports/${reportId}`);
  redirect("/dashboard/admin/reports?success=report-reviewing");
}

export async function resolveReport(formData: FormData) {
  const admin = await requireUser();
  await requireAdminByUserId(admin.id);

  const reportId = String(formData.get("reportId") || "").trim();
  const adminNote = String(formData.get("adminNote") || "").trim();
  if (!reportId) redirect("/dashboard/admin/reports?error=missing-id");

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, targetUserId: true, linkId: true, reason: true },
  });
  if (!report) redirect("/dashboard/admin/reports?error=not-found");

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "resolved",
      reviewerUserId: admin.id,
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: report.targetUserId ?? undefined,
    action: "report.resolved",
    details: `Report ${report.id} resolvida. Categoria: ${getReportLabel(report)}. Motivo: ${report.reason}. Nota: ${adminNote || "-"}.`,
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/dashboard/admin/reports");
  revalidatePath(`/dashboard/admin/reports/${reportId}`);
  redirect(`/dashboard/admin/reports/${reportId}?success=resolved`);
}

export async function rejectReport(formData: FormData) {
  const admin = await requireUser();
  await requireAdminByUserId(admin.id);

  const reportId = String(formData.get("reportId") || "").trim();
  const adminNote = String(formData.get("adminNote") || "").trim();
  if (!reportId) redirect("/dashboard/admin/reports?error=missing-id");

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, targetUserId: true, linkId: true, reason: true },
  });
  if (!report) redirect("/dashboard/admin/reports?error=not-found");

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "rejected",
      reviewerUserId: admin.id,
    },
  });

  await createAdminAuditLog({
    actorUserId: admin.id,
    targetUserId: report.targetUserId ?? undefined,
    action: "report.rejected",
    details: `Report ${report.id} rejeitada. Categoria: ${getReportLabel(report)}. Motivo: ${report.reason}. Nota: ${adminNote || "-"}.`,
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/dashboard/admin/reports");
  revalidatePath(`/dashboard/admin/reports/${reportId}`);
  redirect(`/dashboard/admin/reports/${reportId}?success=rejected`);
}
