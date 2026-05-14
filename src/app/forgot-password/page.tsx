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

export default function ForgotPasswordPage() {
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
      setError("Digite seu email.");
      return;
    }

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));
        setMessage(
          "Se existir uma conta com esse email, voce recebera instrucoes para redefinir a senha."
        );
      } catch {
        setError("Erro ao solicitar redefinicao.");
      }
    });
  }

  return (
    <AuthShell
      badge="Recovery Link"
      title="Recupere o acesso sem sair do fluxo."
      subtitle="Um fluxo mais claro, seguro e imersivo para voltar rapido ao seu espaco Yotei."
      backHref="/login"
      backLabel="Voltar para login"
      formIntro="Digite seu email e enviaremos as instrucoes de redefinicao caso a conta exista."
      statusChips={["Password Reset", "Secure Flow", "Inbox Ready"]}
      footer={
        <AuthFooterLinks
          links={[
            { href: "/login", label: "Voltar para login" },
            { href: "/register", label: "Criar conta nova" },
          ]}
        />
      }
    >
      <AuthForm onSubmit={handleSubmit}>
        <AuthField
          name="email"
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          required
          autoComplete="email"
        />

        <AuthAlert tone="error" message={error} />
        <AuthAlert tone="success" message={message} />
        <SubmitButton
          idleLabel="Enviar instrucoes"
          pendingLabel="Enviando..."
          pending={isPending}
        />
      </AuthForm>
    </AuthShell>
  );
}
