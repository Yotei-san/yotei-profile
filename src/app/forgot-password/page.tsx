"use client";

import { type FormEvent, useState, useTransition } from "react";
import {
  AuthAlert,
  AuthField,
  AuthFooterLinks,
  AuthForm,
  AuthShell,
  SubmitButton,
} from "@/app/components/AuthExperience";
import { useI18n } from "@/app/components/I18nProvider";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setError(t("auth.forgotPassword.emailRequired"));
      return;
    }

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));
        setMessage(t("auth.forgotPassword.success"));
      } catch {
        setError(t("auth.forgotPassword.error"));
      }
    });
  }

  return (
    <AuthShell
      badge={t("auth.forgotPassword.badge")}
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
      backHref="/login"
      backLabel={t("auth.forgotPassword.backLabel")}
      formIntro={t("auth.forgotPassword.formIntro")}
      statusChips={[
        t("auth.forgotPassword.statusPasswordReset"),
        t("auth.forgotPassword.statusSecureFlow"),
        t("auth.forgotPassword.statusInboxReady"),
      ]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/login", label: t("auth.forgotPassword.backToLogin") },
            { href: "/register", label: t("auth.forgotPassword.createNewAccount") },
          ]}
        />
      }
    >
      <AuthForm onSubmit={handleSubmit}>
        <AuthField
          name="email"
          label={t("auth.forgotPassword.emailLabel")}
          type="email"
          placeholder={t("auth.forgotPassword.emailPlaceholder")}
          required
          autoComplete="email"
        />

        <AuthAlert tone="error" message={error} />
        <AuthAlert tone="success" message={message} />
        <SubmitButton
          idleLabel={t("auth.forgotPassword.submitIdle")}
          pendingLabel={t("auth.forgotPassword.submitPending")}
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
