import Link from "next/link";
import { requireUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  updateDisplayName,
  updatePassword,
  updateUsername,
} from "./actions";

type SettingsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getMessageFromCode(
  type: "success" | "error",
  code: string | undefined
) {
  if (!code) return null;

  if (type === "success") {
    switch (code) {
      case "username-updated":
        return "Username atualizado com sucesso.";
      case "display-name-updated":
        return "Display name atualizado com sucesso.";
      case "password-updated":
        return "Senha atualizada com sucesso.";
      default:
        return "Ação concluída com sucesso.";
    }
  }

  switch (code) {
    case "invalid-username":
      return "Username inválido. Use 3 a 20 caracteres com letras, números, _ ou -.";
    case "username-taken":
      return "Esse username já está em uso.";
    case "same-username":
      return "Esse já é o seu username atual.";
    case "empty-display-name":
      return "O display name não pode ficar vazio.";
    case "wrong-password":
      return "Senha atual incorreta.";
    case "password-too-short":
      return "A nova senha precisa ter pelo menos 8 caracteres.";
    case "password-mismatch":
      return "A confirmação da nova senha não confere.";
    case "same-password":
      return "A nova senha não pode ser igual à senha atual.";
    case "user-not-found":
      return "Usuário não encontrado.";
    default:
      return "Não foi possível concluir a ação.";
  }
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const authUser = await requireUser();
  const params = (await searchParams) ?? {};

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      username: true,
      displayName: true,
      email: true,
      plan: true,
      premiumUntil: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const successMessage = getMessageFromCode("success", params.success);
  const errorMessage = getMessageFromCode("error", params.error);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(236,72,153,0.08), transparent 28%), #070707",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <aside
            style={{
              backgroundColor: "#0b0b0b",
              border: "1px solid #1f1f1f",
              borderRadius: "22px",
              padding: "20px",
              position: "sticky",
              top: "24px",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "6px" }}>
              Yotei
            </div>
            <div style={{ color: "#a3a3a3", marginBottom: "20px" }}>
              Área da conta
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <Link href="/dashboard" style={navLinkStyle}>
                Dashboard
              </Link>
              <Link href="/dashboard/settings" style={activeNavLinkStyle}>
                Settings
              </Link>
              <Link href={`/${user.username}`} target="_blank" style={navLinkStyle}>
                Ver perfil público
              </Link>
            </div>

            <div
              style={{
                marginTop: "22px",
                paddingTop: "18px",
                borderTop: "1px solid #1f1f1f",
                display: "grid",
                gap: "10px",
              }}
            >
              <div style={{ color: "#d4d4d4", fontSize: "14px" }}>Conta atual</div>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                {user.displayName || user.username}
              </div>
              <div style={{ color: "#a3a3a3", fontSize: "14px" }}>@{user.username}</div>
              <div style={{ color: "#f9a8d4", fontSize: "14px" }}>
                Plano: {user.plan === "premium" ? "Premium" : "Free"}
              </div>
            </div>
          </aside>

          <section>
            <div
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1f1f1f",
                borderRadius: "22px",
                padding: "20px 22px",
                marginBottom: "20px",
              }}
            >
              <div style={{ color: "#f9a8d4", fontSize: "14px", marginBottom: "8px" }}>
                Dashboard &gt; Account &gt; Settings
              </div>
              <h1 style={{ margin: 0, fontSize: "40px" }}>Configurações da conta</h1>
              <p style={{ color: "#a3a3a3", marginTop: "10px", marginBottom: 0 }}>
                Atualize username, display name e senha em uma área separada do
                dashboard principal.
              </p>
            </div>

            {successMessage && <div style={successBoxStyle}>{successMessage}</div>}
            {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <section style={cardStyle}>
                <h2 style={cardTitleStyle}>Username</h2>
                <p style={cardTextStyle}>
                  Troque o seu username público. Permitido: letras, números, _
                  e -. Máximo de 20 caracteres.
                </p>

                <form action={updateUsername} style={formStyle}>
                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Novo username</label>
                    <input
                      name="username"
                      type="text"
                      defaultValue={user.username}
                      maxLength={20}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <button type="submit" style={primaryButtonStyle}>
                    Atualizar username
                  </button>
                </form>
              </section>

              <section style={cardStyle}>
                <h2 style={cardTitleStyle}>Senha</h2>
                <p style={cardTextStyle}>
                  Troque sua senha com confirmação da senha atual.
                </p>

                <form action={updatePassword} style={formStyle}>
                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Senha atual</label>
                    <input
                      name="currentPassword"
                      type="password"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Nova senha</label>
                    <input
                      name="newPassword"
                      type="password"
                      minLength={8}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Confirmar nova senha</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      minLength={8}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <button type="submit" style={primaryButtonStyle}>
                    Alterar senha
                  </button>
                </form>
              </section>

              <section style={cardStyle}>
                <h2 style={cardTitleStyle}>Display Name</h2>
                <p style={cardTextStyle}>
                  Nome exibido no seu perfil, separado do username.
                </p>

                <form action={updateDisplayName} style={formStyle}>
                  <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Display name</label>
                    <input
                      name="displayName"
                      type="text"
                      defaultValue={user.displayName ?? user.username}
                      maxLength={32}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <button type="submit" style={primaryButtonStyle}>
                    Atualizar display name
                  </button>
                </form>
              </section>

              <section style={cardStyle}>
                <h2 style={cardTitleStyle}>Resumo da conta</h2>
                <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Username" value={`@${user.username}`} />
                  <InfoRow
                    label="Display Name"
                    value={user.displayName || user.username}
                  />
                  <InfoRow
                    label="Plano"
                    value={user.plan === "premium" ? "Premium" : "Free"}
                  />
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "#101010",
        border: "1px solid #1f1f1f",
        borderRadius: "14px",
        padding: "14px 16px",
      }}
    >
      <div style={{ color: "#f9a8d4", fontSize: "13px", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ color: "#ffffff" }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#0b0b0b",
  border: "1px solid #1f1f1f",
  borderRadius: "22px",
  padding: "22px",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  color: "#f9a8d4",
};

const cardTextStyle: React.CSSProperties = {
  color: "#a3a3a3",
  marginTop: "10px",
  marginBottom: "18px",
  lineHeight: 1.7,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const fieldGroupStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #2a2a2a",
  backgroundColor: "#0f0f0f",
  color: "#ffffff",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(236,72,153,0.22)",
  backgroundColor: "rgba(236,72,153,0.12)",
  color: "#f9a8d4",
  fontWeight: "bold",
  cursor: "pointer",
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#d4d4d4",
  backgroundColor: "#121212",
  border: "1px solid #1f1f1f",
  borderRadius: "14px",
  padding: "12px 14px",
};

const activeNavLinkStyle: React.CSSProperties = {
  ...navLinkStyle,
  color: "#f9a8d4",
  border: "1px solid rgba(236,72,153,0.22)",
  backgroundColor: "rgba(236,72,153,0.08)",
};

const successBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(34,197,94,0.10)",
  border: "1px solid rgba(34,197,94,0.22)",
  color: "#86efac",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};

const errorBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(239,68,68,0.10)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#fca5a5",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "18px",
};
