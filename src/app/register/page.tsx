"use client";

import {
  AuthAlert,
  AuthField,
  AuthFooterLinks,
  AuthForm,
  AuthShell,
  PasswordField,
  RememberField,
  SubmitButton,
  useAuthSubmit,
} from "@/app/components/AuthExperience";
import { useI18n } from "@/app/components/I18nProvider";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const { error, isPending, submit } = useAuthSubmit(registerUser);
  const { t } = useI18n();

  return (
    <AuthShell
      badge={t("auth.register.badge")}
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
      backHref="/"
      backLabel={t("auth.register.backLabel")}
      formIntro={t("auth.register.formIntro")}
      statusChips={[
        t("auth.register.statusPremiumOnboarding"),
        t("auth.register.statusPersistentSession"),
        t("auth.register.statusCreatorReady"),
      ]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/login", label: t("auth.register.alreadyHaveAccount") },
            { href: "/forgot-password", label: t("auth.register.forgotPassword") },
          ]}
        />
      }
    >
      <AuthForm onSubmit={submit}>
        <AuthField
          name="displayName"
          label={t("auth.register.displayNameLabel")}
          type="text"
          placeholder={t("auth.register.displayNamePlaceholder")}
          autoComplete="nickname"
        />

        <AuthField
          name="username"
          label={t("auth.register.usernameLabel")}
          type="text"
          placeholder={t("auth.register.usernamePlaceholder")}
          required
          autoComplete="username"
        />

        <AuthField
          name="email"
          label={t("auth.register.emailLabel")}
          type="email"
          placeholder={t("auth.register.emailPlaceholder")}
          required
          autoComplete="email"
        />

        <PasswordField
          name="password"
          label={t("auth.register.passwordLabel")}
          placeholder={t("auth.register.passwordPlaceholder")}
          autoComplete="new-password"
        />

        <RememberField />
        <AuthAlert tone="error" message={error} />
        <SubmitButton
          idleLabel={t("auth.register.submitIdle")}
          pendingLabel={t("auth.register.submitPending")}
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
