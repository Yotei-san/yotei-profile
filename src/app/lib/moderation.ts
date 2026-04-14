import { prisma } from "@/app/lib/prisma";

export function getReportLabel(type: string) {
  if (type === "profile") return "Perfil";
  if (type === "decoration") return "Decoration";
  if (type === "link") return "Link";
  return "Outro";
}

export function getReportStatusColor(status: string) {
  if (status === "resolved") return "#86efac";
  if (status === "rejected") return "#fca5a5";
  if (status === "reviewing") return "#fde68a";
  return "#c4b5fd";
}

export async function createReport(input: {
  reporterUserId: string;
  targetUserId?: string | null;
  decorationId?: string | null;
  linkId?: string | null;
  type: string;
  reason: string;
}) {
  return prisma.report.create({
    data: {
      reporterUserId: input.reporterUserId,
      targetUserId: input.targetUserId ?? null,
      decorationId: input.decorationId ?? null,
      linkId: input.linkId ?? null,
      type: input.type,
      reason: input.reason.trim(),
      status: "pending",
    },
  });
}
