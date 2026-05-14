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
import { loginUser } from "./actions";

export default function LoginPage() {
  const { error, isPending, submit } = useAuthSubmit(loginUser);

  return (
    <AuthShell
      badge="Access Node"
      title="Entrar no seu espaco Yotei."
      subtitle="Volte para sua identidade digital com uma entrada mais estavel, limpa e premium."
      backHref="/"
      backLabel="Voltar para a home"
      formIntro="Use email ou username para acessar seu dashboard. Sua sessao pode continuar ativa neste dispositivo."
      statusChips={["Secure Session", "Dashboard Access", "Identity Ready"]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/forgot-password", label: "Esqueci minha senha" },
            { href: "/register", label: "Criar conta" },
          ]}
        />
      }
    >
      <AuthForm onSubmit={submit}>
        <AuthField
          name="identifier"
          label="Email ou username"
          type="text"
          placeholder="seu email ou username"
          required
          autoComplete="username"
        />

        <PasswordField
          name="password"
          label="Senha"
          placeholder="digite sua senha"
          autoComplete="current-password"
        />

        <RememberField />
        <AuthAlert tone="error" message={error} />
        <SubmitButton
          idleLabel="Entrar"
          pendingLabel="Entrando..."
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
