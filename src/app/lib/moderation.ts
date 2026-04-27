import { prisma } from "@/app/lib/prisma";

type ReportKindInput = {
  linkId?: string | null;
  targetUserId?: string | null;
};

export function getReportLabel(input: ReportKindInput) {
  if (input.linkId) return "Link";
  if (input.targetUserId) return "Perfil";
  return "Outro";
}

export function getReportStatusColor(status: string) {
  if (status === "resolved") return "#86efac";
  if (status === "rejected") return "#fca5a5";
  if (status === "reviewing") return "#fde68a";
  return "#c4b5fd";
}

export async function createReport(input: {
  createdByUserId: string;
  targetUserId?: string | null;
  linkId?: string | null;
  reason: string;
}) {
  return prisma.report.create({
    data: {
      createdByUserId: input.createdByUserId,
      targetUserId: input.targetUserId ?? null,
      linkId: input.linkId ?? null,
      reason: input.reason.trim(),
      status: "pending",
    },
  });
}
