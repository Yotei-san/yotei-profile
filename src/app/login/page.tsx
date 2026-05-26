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
import { loginUser } from "./actions";

export default function LoginPage() {
  const { error, isPending, submit } = useAuthSubmit(loginUser);
  const { t } = useI18n();

  return (
    <AuthShell
      badge={t("auth.login.badge")}
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
      backHref="/"
      backLabel={t("auth.login.backLabel")}
      formIntro={t("auth.login.formIntro")}
      statusChips={[
        t("auth.login.statusSecureSession"),
        t("auth.login.statusDashboardAccess"),
        t("auth.login.statusIdentityReady"),
      ]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/forgot-password", label: t("auth.login.forgotPassword") },
            { href: "/register", label: t("auth.login.createAccount") },
          ]}
        />
      }
    >
      <AuthForm onSubmit={submit}>
        <AuthField
          name="identifier"
          label={t("auth.login.identifierLabel")}
          type="text"
          placeholder={t("auth.login.identifierPlaceholder")}
          required
          autoComplete="username"
        />

        <PasswordField
          name="password"
          label={t("auth.login.passwordLabel")}
          placeholder={t("auth.login.passwordPlaceholder")}
          autoComplete="current-password"
        />

        <RememberField />
        <AuthAlert tone="error" message={error} />
        <SubmitButton
          idleLabel={t("auth.login.submitIdle")}
          pendingLabel={t("auth.login.submitPending")}
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
