"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useId,
  useState,
  useTransition,
} from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { useI18n } from "@/app/components/I18nProvider";
import YoteiBrandMark from "@/app/components/YoteiBrandMark";

type AuthShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  formIntro: string;
  statusChips: string[];
  footer: ReactNode;
  children: ReactNode;
};

type PasswordFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
};

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  pending: boolean;
};

type RememberFieldProps = {
  defaultChecked?: boolean;
};

export function AuthShell({
  badge,
  title,
  subtitle,
  backHref,
  backLabel,
  formIntro,
  statusChips,
  footer,
  children,
}: AuthShellProps) {
  const { t } = useI18n();

  return (
    <main style={mainStyle}>
      <style>{authCss}</style>

      <div className="auth-atmosphere auth-atmosphere-a" />
      <div className="auth-atmosphere auth-atmosphere-b" />
      <div className="auth-grid" />
      <div className="auth-vignette" />

      <section className="auth-shell">
        <aside className="auth-hero">
          <div className="auth-brand">
            <YoteiBrandMark
              animated={false}
              className="auth-brand-mark"
              intensity="calm"
              size={44}
            />
            <div className="auth-brand-copy">
              <strong>Yotei Identity</strong>
              <span>{t("auth.identitySystem")}</span>
            </div>
          </div>

          <div className="auth-kicker">
            <LuSparkles size={14} />
            {badge}
          </div>

          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          <div className="auth-chip-row">
            {statusChips.map((chip) => (
              <span key={chip} className="auth-chip">
                {chip}
              </span>
            ))}
          </div>

          <div className="auth-orb" aria-hidden>
            <div className="auth-orb-ring auth-orb-ring-outer" />
            <div className="auth-orb-ring auth-orb-ring-middle" />
            <div className="auth-orb-ring auth-orb-ring-inner" />
            <div className="auth-orb-core">
              <YoteiBrandMark
                animated={false}
                className="auth-orb-core-mark"
                intensity="calm"
                size={104}
              />
            </div>
          </div>

          <div className="auth-hero-note">
            <LuShieldCheck size={15} />
            {t("auth.heroNote")}
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-panel-glow" />
          <div className="auth-panel-inner">
            <div className="auth-panel-top">
              <Link href={backHref} className="auth-back-link">
                <LuArrowLeft size={14} />
                {backLabel}
              </Link>

              <div className="auth-panel-badge">{t("auth.secureAccess")}</div>
            </div>

            <div className="auth-form-header">
              <div className="auth-form-badge">{t("auth.identityBadge")}</div>
              <p className="auth-form-intro">{formIntro}</p>
            </div>

            {children}

            <div className="auth-footer">{footer}</div>
          </div>
        </section>
      </section>
    </main>
  );
}

export function AuthForm({
  onSubmit,
  children,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      {children}
    </form>
  );
}

export function AuthField({
  name,
  label,
  type,
  placeholder,
  required = false,
  autoComplete,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const fieldId = useId();

  return (
    <label htmlFor={fieldId} className="auth-label">
      <span className="auth-label-text">{label}</span>
      <div className="auth-input-shell">
        <input
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="auth-input"
        />
      </div>
    </label>
  );
}

export function PasswordField({
  name,
  label,
  placeholder,
  autoComplete,
}: PasswordFieldProps) {
  const fieldId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useI18n();

  return (
    <label htmlFor={fieldId} className="auth-label">
      <span className="auth-label-text">{label}</span>
      <div className="auth-input-shell auth-input-shell-password">
        <input
          id={fieldId}
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          className="auth-input auth-input-password"
        />
        <button
          type="button"
          className="auth-password-toggle"
          aria-label={isVisible ? t("auth.hidePassword") : t("auth.showPassword")}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </button>
      </div>
    </label>
  );
}

export function RememberField({ defaultChecked = true }: RememberFieldProps) {
  const { t } = useI18n();

  return (
    <label className="auth-remember">
      <input
        type="checkbox"
        name="rememberSession"
        value="1"
        defaultChecked={defaultChecked}
      />
      <span>{t("auth.rememberMe")}</span>
    </label>
  );
}

export function AuthAlert({
  tone,
  message,
}: {
  tone: "error" | "success";
  message: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div className={tone === "error" ? "auth-alert auth-alert-error" : "auth-alert auth-alert-success"}>
      {message}
    </div>
  );
}

export function SubmitButton({
  idleLabel,
  pendingLabel,
  pending,
}: SubmitButtonProps) {
  return (
    <button type="submit" disabled={pending} className="auth-submit">
      {pending ? <span className="auth-submit-spinner" aria-hidden /> : <LuArrowRight size={16} />}
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export function AuthFooterLinks({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="auth-footer-links">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="auth-text-link">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function useAuthSubmit<
  T extends (...args: never[]) => Promise<{ error?: string; success?: string } | void>,
>(action: T) {
  const { t } = useI18n();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = (await action(formData as never)) as
          | { error?: string; success?: string }
          | void;

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.success) {
          setSuccess(result.success);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t("auth.unexpectedError");

        if (message.includes("NEXT_REDIRECT")) {
          throw err;
        }

        setError(message);
      }
    });
  }

  return {
    error,
    success,
    isPending,
    setError,
    setSuccess,
    submit,
  };
}

const mainStyle: CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflowX: "clip",
  padding: "24px",
  display: "grid",
  placeItems: "center",
  boxSizing: "border-box",
  background:
    "linear-gradient(180deg, #06070b 0%, #05060a 100%)",
  color: "#f8faff",
  fontFamily:
    '"Manrope", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const authCss = `
  * {
    box-sizing: border-box;
  }

  .auth-atmosphere,
  .auth-grid,
  .auth-vignette {
    position: absolute;
    pointer-events: none;
  }

  .auth-atmosphere-a {
    top: -180px;
    left: -140px;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(135, 118, 255, 0.22) 0%, rgba(135, 118, 255, 0.08) 34%, rgba(135, 118, 255, 0) 74%);
    filter: blur(20px);
  }

  .auth-atmosphere-b {
    right: -160px;
    bottom: -120px;
    width: 480px;
    height: 480px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255, 110, 168, 0.18) 0%, rgba(90, 169, 255, 0.08) 34%, rgba(255, 110, 168, 0) 74%);
    filter: blur(22px);
  }

  .auth-grid {
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
    background-size: 72px 72px;
    opacity: 0.22;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.12));
  }

  .auth-vignette {
    inset: 0;
    background:
      radial-gradient(circle at top, rgba(69, 28, 68, 0.18), transparent 20%),
      linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 4, 8, 0.34) 100%);
  }

  .auth-shell {
    position: relative;
    z-index: 1;
    width: min(1080px, 100%);
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
    gap: 22px;
    align-items: stretch;
  }

  .auth-hero,
  .auth-panel {
    min-width: 0;
    width: 100%;
  }

  .auth-hero {
    position: relative;
    padding: 34px;
    border-radius: 32px;
    overflow: hidden;
    background:
      radial-gradient(circle at top right, rgba(135, 118, 255, 0.18), transparent 30%),
      radial-gradient(circle at bottom left, rgba(255, 110, 168, 0.12), transparent 26%),
      linear-gradient(180deg, rgba(17, 16, 27, 0.96), rgba(10, 10, 16, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 30px 60px rgba(0, 0, 0, 0.24);
  }

  .auth-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .auth-brand-mark {
    flex-shrink: 0;
  }

  .auth-brand-copy {
    display: grid;
    gap: 3px;
    min-width: 0;
  }

  .auth-brand-copy strong {
    font-size: 15px;
    letter-spacing: -0.03em;
  }

  .auth-brand-copy span {
    color: #97a4c0;
    font-size: 12px;
    line-height: 1.5;
  }

  .auth-kicker {
    margin-top: 26px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    color: #ffe0ee;
    background: rgba(255, 110, 168, 0.1);
    border: 1px solid rgba(255, 110, 168, 0.18);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .auth-title {
    margin: 22px 0 0;
    max-width: 12ch;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 0.94;
    letter-spacing: -0.07em;
    font-weight: 950;
    text-wrap: balance;
  }

  .auth-subtitle {
    margin: 18px 0 0;
    max-width: 54ch;
    color: #bac5dc;
    font-size: 16px;
    line-height: 1.75;
  }

  .auth-chip-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .auth-chip {
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    color: #d9e5ff;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .auth-orb {
    position: relative;
    width: min(360px, 82%);
    aspect-ratio: 1 / 1;
    margin-top: 34px;
    display: grid;
    place-items: center;
  }

  .auth-orb-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .auth-orb-ring-outer {
    border-color: rgba(135, 118, 255, 0.18);
  }

  .auth-orb-ring-middle {
    inset: 13%;
    border-color: rgba(255, 110, 168, 0.16);
    transform: rotate(14deg);
  }

  .auth-orb-ring-inner {
    inset: 25%;
    border-color: rgba(90, 169, 255, 0.16);
    transform: rotate(-12deg);
  }

  .auth-orb-core {
    width: 44%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.24), transparent 18%),
      linear-gradient(145deg, rgba(135, 118, 255, 0.36), rgba(255, 110, 168, 0.22) 54%, rgba(90, 169, 255, 0.18) 100%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 18px 36px rgba(6, 8, 18, 0.22);
  }

  .auth-orb-core-mark {
    width: 76% !important;
    height: auto !important;
  }

  .auth-hero-note {
    margin-top: 28px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    max-width: 32ch;
    color: #d8e2f4;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.65;
  }

  .auth-panel {
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    background:
      linear-gradient(180deg, rgba(18, 17, 28, 0.98), rgba(8, 8, 14, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 30px 60px rgba(0, 0, 0, 0.28);
  }

  .auth-panel-glow {
    position: absolute;
    top: -12%;
    right: -8%;
    width: 220px;
    height: 220px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(135, 118, 255, 0.2) 0%, rgba(135, 118, 255, 0) 72%);
    pointer-events: none;
  }

  .auth-panel-inner {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 18px;
    min-width: 0;
    width: 100%;
    padding: 28px;
  }

  .auth-panel-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .auth-back-link,
  .auth-text-link {
    text-decoration: none;
    transition:
      color 180ms ease,
      transform 180ms ease,
      border-color 180ms ease,
      background 180ms ease;
  }

  .auth-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #aeb9d2;
    font-size: 14px;
    font-weight: 800;
  }

  .auth-back-link:focus-visible,
  .auth-text-link:focus-visible {
    color: #ffffff;
    transform: translateY(-1px);
  }

  .auth-panel-badge,
  .auth-form-badge {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    color: #dce8ff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .auth-form-header {
    display: grid;
    gap: 10px;
  }

  .auth-form-intro {
    margin: 0;
    color: #aeb9d2;
    font-size: 14px;
    line-height: 1.7;
  }

  .auth-form {
    display: grid;
    gap: 14px;
    min-width: 0;
    width: 100%;
  }

  .auth-label {
    display: grid;
    gap: 8px;
    min-width: 0;
    width: 100%;
  }

  .auth-label-text {
    color: #edf2ff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .auth-input-shell {
    position: relative;
    min-width: 0;
    width: 100%;
    overflow: hidden;
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
      rgba(12, 13, 18, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      background 180ms ease;
  }

  .auth-input-shell:focus-within {
    border-color: rgba(135, 118, 255, 0.32);
    box-shadow: 0 0 0 3px rgba(135, 118, 255, 0.08);
    background:
      linear-gradient(180deg, rgba(135, 118, 255, 0.06), rgba(255, 255, 255, 0.02)),
      rgba(12, 13, 18, 0.96);
  }

  .auth-input {
    width: 100%;
    min-width: 0;
    display: block;
    border: 0;
    outline: 0;
    background: transparent;
    color: #ffffff;
    padding: 15px 16px;
    font-size: 15px;
    line-height: 1.4;
    font-family: inherit;
  }

  .auth-input::placeholder {
    color: #73809b;
  }

  .auth-input-shell-password {
    padding-right: 46px;
  }

  .auth-input-password {
    padding-right: 0;
  }

  .auth-password-toggle {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.04);
    color: #cdd8ee;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .auth-remember {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    color: #c8d2e6;
    font-size: 13px;
    font-weight: 700;
  }

  .auth-remember input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #8a76ff;
    flex-shrink: 0;
  }

  .auth-alert {
    width: 100%;
    min-width: 0;
    padding: 12px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .auth-alert-error {
    color: #fecaca;
    background: rgba(127, 29, 29, 0.18);
    border: 1px solid rgba(239, 68, 68, 0.24);
  }

  .auth-alert-success {
    color: #bbf7d0;
    background: rgba(20, 83, 45, 0.18);
    border: 1px solid rgba(34, 197, 94, 0.24);
  }

  .auth-submit {
    width: 100%;
    min-width: 0;
    min-height: 56px;
    padding: 0 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background:
      linear-gradient(135deg, rgba(135, 118, 255, 0.98), rgba(255, 110, 168, 0.94)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
    color: #ffffff;
    font-size: 15px;
    font-weight: 900;
    font-family: inherit;
    cursor: pointer;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 18px 34px rgba(109, 91, 255, 0.2);
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      opacity 180ms ease;
  }

  .auth-submit:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }

  .auth-submit-spinner {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.28);
    border-top-color: #ffffff;
    animation: auth-spin 0.9s linear infinite;
    flex-shrink: 0;
  }

  .auth-footer {
    min-width: 0;
    width: 100%;
  }

  .auth-footer-links {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .auth-text-link {
    color: #aeb9d2;
    font-size: 14px;
    font-weight: 800;
  }

  @keyframes auth-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 980px) {
    .auth-shell {
      grid-template-columns: 1fr;
    }

    .auth-hero {
      padding: 28px;
    }

    .auth-orb {
      width: min(300px, 72%);
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 640px) {
    .auth-shell {
      gap: 16px;
    }

    .auth-hero,
    .auth-panel {
      border-radius: 24px;
    }

    .auth-hero,
    .auth-panel-inner {
      padding: 22px;
    }

    .auth-title {
      font-size: clamp(34px, 11vw, 48px);
    }

    .auth-subtitle,
    .auth-form-intro {
      font-size: 14px;
      line-height: 1.65;
    }

    .auth-orb {
      width: min(240px, 74%);
    }

    .auth-chip-row {
      gap: 8px;
    }

    .auth-chip,
    .auth-panel-badge,
    .auth-form-badge {
      font-size: 10px;
    }

    .auth-footer-links {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 420px) {
    .auth-panel-inner,
    .auth-hero {
      padding: 18px;
    }

    .auth-input {
      padding: 14px;
      font-size: 14px;
    }

    .auth-submit {
      min-height: 54px;
      font-size: 14px;
    }

    .auth-orb {
      width: min(210px, 76%);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .auth-back-link:hover,
    .auth-text-link:hover {
      color: #ffffff;
      transform: translateY(-1px);
    }

    .auth-password-toggle:hover {
      border-color: rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .auth-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 22px 40px rgba(109, 91, 255, 0.24);
    }
  }
`;
