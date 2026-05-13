"use client";

import { useMemo, useState } from "react";
import TemplateCard, { type TemplateCardData } from "@/app/dashboard/components/TemplateCard";
import TemplatePreviewModal from "@/app/dashboard/components/TemplatePreviewModal";

type Props = {
  templates: TemplateCardData[];
  currentUserId: string;
  currentTab: "all" | "mine" | "premium";
  canUsePremium: boolean;
  applyAction: (formData: FormData) => Promise<void>;
};

export default function TemplateGallery({
  templates,
  currentUserId,
  currentTab,
  canUsePremium,
  applyAction,
}: Props) {
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) ?? null,
    [activeTemplateId, templates]
  );

  return (
    <>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          currentUserId={currentUserId}
          currentTab={currentTab}
          canUsePremium={canUsePremium}
          applyAction={applyAction}
          onOpenPreview={() => setActiveTemplateId(template.id)}
        />
      ))}

      <TemplatePreviewModal
        template={activeTemplate}
        currentTab={currentTab}
        canUsePremium={canUsePremium}
        applyAction={applyAction}
        onClose={() => setActiveTemplateId(null)}
      />
    </>
  );
}
