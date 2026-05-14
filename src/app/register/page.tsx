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
import { registerUser } from "./actions";

export default function RegisterPage() {
  const { error, isPending, submit } = useAuthSubmit(registerUser);

  return (
    <AuthShell
      badge="Identity Creation"
      title="Crie sua conta e entre no Yotei."
      subtitle="Monte sua presenca digital com uma experiencia de cadastro mais forte, limpa e pronta para durar."
      backHref="/"
      backLabel="Voltar para a home"
      formIntro="Configure seu acesso inicial. O Yotei ja entra com sessao persistente moderna para evitar logins repetidos."
      statusChips={["Premium Onboarding", "Persistent Session", "Creator Ready"]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/login", label: "Ja tenho conta" },
            { href: "/forgot-password", label: "Esqueci minha senha" },
          ]}
        />
      }
    >
      <AuthForm onSubmit={submit}>
        <AuthField
          name="displayName"
          label="Nome de exibicao"
          type="text"
          placeholder="como seu nome aparece"
          autoComplete="nickname"
        />

        <AuthField
          name="username"
          label="Username"
          type="text"
          placeholder="seu username"
          required
          autoComplete="username"
        />

        <AuthField
          name="email"
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          required
          autoComplete="email"
        />

        <PasswordField
          name="password"
          label="Senha"
          placeholder="crie uma senha segura"
          autoComplete="new-password"
        />

        <RememberField />
        <AuthAlert tone="error" message={error} />
        <SubmitButton
          idleLabel="Criar conta"
          pendingLabel="Criando conta..."
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
