import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";
import UploadField from "./UploadField";
import LinkSorter from "./LinkSorter";
import BlockSorter from "./BlockSorter";
import PlanBannerActions from "./PlanBannerActions";
import PricingQuickActions from "./PricingQuickActions";
import {
  applySavedPreset,
  createLink,
  deletePreset,
  logoutAction,
  savePreset,
  updateProfile,
} from "./actions";

type DashboardPageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

function getReactionCount(type: string, reactions: { type: string; count: number }[]) {
  return reactions.find((item) => item.type === type)?.count ?? 0;
}

function getPeriodStart(period: string) {
  const now = new Date();

  if (period === "24h") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (period === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return null;
}

function groupViewsByBucket(dates: Date[], period: string) {
  const map = new Map<string, number>();

  for (const dateValue of dates) {
    const date = new Date(dateValue);

    const key =
      period === "24h"
        ? date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function formatPeriodLabel(period: string) {
  if (period === "24h") return "Últimas 24 horas";
  if (period === "7d") return "Últimos 7 dias";
  if (period === "30d") return "Últimos 30 dias";
  return "Todo o período";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = (await searchParams) ?? {};
  const period =
    resolvedSearchParams.period === "24h" ||
    resolvedSearchParams.period === "7d" ||
    resolvedSearchParams.period === "30d"
      ? resolvedSearchParams.period
      : "all";

  const [links, presets, dashboardUser] = await Promise.all([
    prisma.link.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.preset.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      include: {
        reactions: true,
        profileViews: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  if (!dashboardUser) throw new Error("Usuário não encontrado.");

  const premium = isPremiumPlan(dashboardUser);
  const periodStart = getPeriodStart(period);
  const filteredViews = periodStart
    ? dashboardUser.profileViews.filter((item) => new Date(item.createdAt) >= periodStart)
    : dashboardUser.profileViews;

  const totalClicks = links.reduce((acc, link) => acc + link._count.clicks, 0);
  const totalLinks = links.length;
  const totalViews = filteredViews.length;
  const totalLikes = getReactionCount("like", dashboardUser.reactions);
  const totalDislikes = getReactionCount("dislike", dashboardUser.reactions);
  const score = totalLikes - totalDislikes;

  const viewsByBucket = groupViewsByBucket(
    filteredViews.map((item) => item.createdAt),
    period
  );
  const maxViews = Math.max(...viewsByBucket.map((item) => item.value), 1);

  const deviceCounts = filteredViews.reduce<Record<string, number>>((acc, item) => {
    const key = item.deviceType || "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const countryCounts = filteredViews.reduce<Record<string, number>>((acc, item) => {
    const key = item.country || "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const chartData = links.map((link) => {
    let fallbackName = link.url;
    try {
      fallbackName = new URL(link.url).hostname.replace("www.", "");
    } catch {}

    return {
      name: link.title ? link.title.slice(0, 10) : fallbackName,
      clicks: link._count.clicks,
    };
  });

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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            background: premium
              ? "linear-gradient(90deg, rgba(91,33,182,0.18), rgba(236,72,153,0.18))"
              : "linear-gradient(90deg, rgba(34,34,34,1), rgba(18,18,18,1))",
            border: premium
              ? "1px solid rgba(236,72,153,0.22)"
              : "1px solid #222",
            borderRadius: "18px",
            padding: "18px 20px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", color: premium ? "#f9a8d4" : "#d4d4d4" }}>
              Plano atual
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>
              {premium ? "Premium" : "Free"}
            </div>
            <div style={{ color: "#a3a3a3", marginTop: "6px" }}>
              {premium
                ? "Todos os recursos avançados estão liberados."
                : "Recursos premium bloqueados: vídeo de fundo, badges, presets salvos, layouts avançados, mais mídia e mais links."}
            </div>
          </div>

          <PlanBannerActions
            premium={premium}
            topLinkStyle={topLinkStyle}
            dangerButtonStyle={dangerButtonStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: "bold", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: "#a3a3a3", marginTop: "8px" }}>
              Overview premium do seu perfil
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href={`/${dashboardUser.username}`} target="_blank" style={topLinkStyle}>
              Ver perfil público
            </Link>

            <Link href="/leaderboard" style={topLinkStyle}>
              Leaderboard
            </Link>

            <form action={logoutAction}>
              <button type="submit" style={logoutButtonStyle}>
                Sair
              </button>
            </form>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#0c0c0c",
            border: "1px solid #1f1f1f",
            borderRadius: "18px",
            padding: "16px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#d4d4d4", fontWeight: "bold" }}>
            Período: {formatPeriodLabel(period)}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <FilterLink label="24h" value="24h" active={period === "24h"} />
            <FilterLink label="7d" value="7d" active={period === "7d"} />
            <FilterLink label="30d" value="30d" active={period === "30d"} />
            <FilterLink label="All" value="all" active={period === "all"} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <MetricCard label="Plano" value={premium ? "Premium" : "Free"} />
          <MetricCard label="Profile Views" value={String(totalViews)} />
          <MetricCard label="Link Clicks" value={String(totalClicks)} />
          <MetricCard label="Links usados" value={`${totalLinks}/${premium ? 999 : 5}`} />
          <MetricCard label="Likes" value={String(totalLikes)} />
          <MetricCard label="Score" value={String(score)} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <section style={panelStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <h2 style={panelTitleStyle}>Profile Views</h2>
              <div style={badgePillStyle}>{formatPeriodLabel(period)}</div>
            </div>

            {viewsByBucket.length === 0 ? (
              <div style={emptyBoxStyle}>Nenhuma visualização nesse período.</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: "10px",
                  minHeight: "260px",
                  marginTop: "20px",
                }}
              >
                {viewsByBucket.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "56px",
                        height: `${Math.max(24, (item.value / maxViews) * 190)}px`,
                        background:
                          "linear-gradient(180deg, rgba(236,72,153,0.95), rgba(131,24,67,1))",
                        borderRadius: "18px 18px 8px 8px",
                        boxShadow: "0 12px 30px rgba(236,72,153,0.20)",
                      }}
                    />
                    <span style={{ color: "#d1d5db", fontSize: "12px" }}>{item.label}</span>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Visitor Devices</h2>

            <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
              {Object.keys(deviceCounts).length === 0 ? (
                <div style={emptyBoxStyle}>Sem dados de device ainda.</div>
              ) : (
                Object.entries(deviceCounts).map(([device, count]) => (
                  <ProgressCard
                    key={device}
                    label={device}
                    value={count}
                    total={Math.max(totalViews, 1)}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Top Countries</h2>

            <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
              {topCountries.length === 0 ? (
                <div style={emptyBoxStyle}>Sem dados de país ainda.</div>
              ) : (
                topCountries.map((item) => (
                  <ProgressCard
                    key={item.country}
                    label={item.country}
                    value={item.count}
                    total={Math.max(totalViews, 1)}
                    suffix=" views"
                  />
                ))
              )}
            </div>
          </section>

          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Link Clicks</h2>
            <div style={{ marginTop: "20px" }}>
              <MiniClicksChart data={chartData} />
            </div>
          </section>
        </div>

        <section style={{ ...panelStyle, marginBottom: "24px" }}>
          <h2 style={panelTitleStyle}>Pricing rápido</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={planCardStyle(false)}>
              <div style={planTagStyle(false)}>Starter</div>
              <h3 style={planTitleStyle}>Free</h3>
              <p style={planDescriptionStyle}>
                Ideal para começar e testar sua presença online.
              </p>

              <div style={featureListStyle}>
                <div>• Até 5 links</div>
                <div>• Até 2 imagens na galeria</div>
                <div>• Analytics básico</div>
                <div>• Reações públicas</div>
              </div>

              <PricingQuickActions
                premium={premium}
                variant="free"
                topLinkStyle={topLinkStyle}
                secondaryButtonWideStyle={secondaryButtonWideStyle}
                primaryButtonWideStyle={primaryButtonWideStyle}
                currentPlanBoxStyle={currentPlanBoxStyle}
              />
            </div>

            <div style={planCardStyle(true)}>
              <div style={planTagStyle(true)}>Mais popular</div>
              <h3 style={planTitleStyle}>Premium</h3>
              <p style={planDescriptionStyle}>
                Libera vídeo no fundo, badges, presets salvos, layouts avançados e muito mais.
              </p>

              <div style={featureListStyle}>
                <div>• Links ilimitados</div>
                <div>• Galeria completa</div>
                <div>• Vídeo de fundo</div>
                <div>• Badges premium</div>
                <div>• Presets salvos</div>
                <div>• Layouts avançados</div>
              </div>

              <PricingQuickActions
                premium={premium}
                variant="premium"
                topLinkStyle={topLinkStyle}
                secondaryButtonWideStyle={secondaryButtonWideStyle}
                primaryButtonWideStyle={primaryButtonWideStyle}
                currentPlanBoxStyle={currentPlanBoxStyle}
              />
            </div>
          </div>
        </section>

        <section style={{ ...panelStyle, marginBottom: "24px" }}>
          <h2 style={panelTitleStyle}>Presets salvos</h2>

          {!premium && (
            <div style={lockedBoxStyle}>
              Recurso premium. No plano Free você não pode salvar presets personalizados.
            </div>
          )}

          <form action={savePreset} style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
            <input
              name="presetName"
              type="text"
              placeholder={premium ? "Nome do preset" : "Premium necessário"}
              style={inputStyle}
              disabled={!premium}
            />

            <input type="hidden" name="themeColor" value={dashboardUser.themeColor ?? "#2563eb"} readOnly />
            <input type="hidden" name="textColor" value={dashboardUser.textColor ?? "#ffffff"} readOnly />
            <input type="hidden" name="cardOpacity" value={String(dashboardUser.cardOpacity ?? 72)} readOnly />
            <input type="hidden" name="cardBlur" value={String(dashboardUser.cardBlur ?? 16)} readOnly />
            <input type="hidden" name="backgroundStyle" value={dashboardUser.backgroundStyle ?? "gradient"} readOnly />
            <input type="hidden" name="buttonStyle" value={dashboardUser.buttonStyle ?? "solid"} readOnly />
            <input type="hidden" name="glowIntensity" value={String(dashboardUser.glowIntensity ?? 35)} readOnly />
            <input type="hidden" name="presetTheme" value={dashboardUser.presetTheme ?? "custom"} readOnly />
            <input type="hidden" name="layoutStyle" value={dashboardUser.layoutStyle ?? "stacked"} readOnly />
            <input type="hidden" name="containerWidth" value={dashboardUser.containerWidth ?? "normal"} readOnly />
            <input type="hidden" name="avatarPosition" value={dashboardUser.avatarPosition ?? "center"} readOnly />
            <input type="hidden" name="linksStyle" value={dashboardUser.linksStyle ?? "rounded"} readOnly />
            <input type="hidden" name="blocksOrder" value={dashboardUser.blocksOrder ?? "stats,about,gallery,music,reactions,links"} readOnly />

            <button type="submit" style={primaryButtonStyle} disabled={!premium}>
              Salvar preset atual
            </button>
          </form>

          <div style={{ display: "grid", gap: "12px" }}>
            {presets.length === 0 ? (
              <div style={emptyBoxStyle}>Você ainda não salvou nenhum preset.</div>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #242424",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>{preset.name}</div>
                    <div style={{ color: "#a3a3a3", fontSize: "14px", marginTop: "4px" }}>
                      {preset.presetTheme || "custom"} • {preset.layoutStyle || "stacked"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <form action={applySavedPreset}>
                      <input type="hidden" name="presetId" value={preset.id} />
                      <button type="submit" style={secondaryButtonStyle} disabled={!premium}>
                        Aplicar
                      </button>
                    </form>

                    <form action={deletePreset}>
                      <input type="hidden" name="presetId" value={preset.id} />
                      <button type="submit" style={dangerButtonStyle} disabled={!premium}>
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "start",
            marginBottom: "24px",
          }}
        >
          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Adicionar link</h2>

            {!premium && (
              <div style={infoBoxStyle}>
                Plano Free: até 5 links.
              </div>
            )}

            <form action={createLink} style={{ display: "grid", gap: "12px" }}>
              <input name="title" type="text" placeholder="Título do link" style={inputStyle} />
              <input name="url" type="text" placeholder="https://seulink.com" required style={inputStyle} />
              <button type="submit" style={primaryButtonStyle}>Salvar link</button>
            </form>
          </section>

          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Tema e layout</h2>

            {!premium && (
              <div style={infoBoxStyle}>
                Free: layouts avançados, estilos de link especiais e vídeo de fundo são premium.
              </div>
            )}

            <form action={updateProfile} style={{ display: "grid", gap: "12px" }}>
              <input name="displayName" type="text" defaultValue={dashboardUser.displayName ?? ""} placeholder="Nome de exibição" style={inputStyle} />
              <textarea
                name="bio"
                defaultValue={dashboardUser.bio ?? ""}
                placeholder="Sua bio"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <UploadField label="Avatar" name="avatarUrl" initialValue={dashboardUser.avatarUrl} />
              <UploadField label="Banner" name="bannerUrl" initialValue={dashboardUser.bannerUrl} />
              <UploadField label="Fundo" name="backgroundUrl" initialValue={dashboardUser.backgroundUrl} />
              <UploadField label="Vídeo de fundo (Premium)" name="videoBgUrl" initialValue={premium ? dashboardUser.videoBgUrl : null} />

              <select
              name="backgroundStyle"
              defaultValue={dashboardUser.backgroundStyle ?? "gradient"}
              style={inputStyle}
>
              <option value="gradient">Gradient</option>
              <option value="solid">Solid</option>
              <option value="image">Imagem de fundo</option>
              <option value="banner-soft">Banner soft</option>
</select>

              <select name="presetTheme" defaultValue={dashboardUser.presetTheme ?? "custom"} style={inputStyle}>
                <option value="custom">Custom</option>
                <option value="minimal">Minimal</option>
                <option value="dark-glass">Dark Glass (Premium)</option>
                <option value="neon-blue">Neon Blue (Premium)</option>
                <option value="crimson">Crimson (Premium)</option>
                <option value="cyber">Cyber (Premium)</option>
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input name="themeColor" type="text" defaultValue={dashboardUser.themeColor ?? "#2563eb"} placeholder="#2563eb" style={inputStyle} />
                <input name="textColor" type="text" defaultValue={dashboardUser.textColor ?? "#ffffff"} placeholder="#ffffff" style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <select name="layoutStyle" defaultValue={dashboardUser.layoutStyle ?? "stacked"} style={inputStyle}>
                  <option value="stacked">Stacked</option>
                  <option value="compact">Compact (Premium)</option>
                  <option value="wide">Wide (Premium)</option>
                </select>

                <select name="containerWidth" defaultValue={dashboardUser.containerWidth ?? "normal"} style={inputStyle}>
                  <option value="normal">Normal</option>
                  <option value="narrow">Narrow (Premium)</option>
                  <option value="wide">Wide (Premium)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <select name="avatarPosition" defaultValue={dashboardUser.avatarPosition ?? "center"} style={inputStyle}>
                  <option value="center">Avatar no centro</option>
                  <option value="left">Avatar à esquerda (Premium)</option>
                  <option value="right">Avatar à direita (Premium)</option>
                </select>

                <select name="linksStyle" defaultValue={dashboardUser.linksStyle ?? "rounded"} style={inputStyle}>
                  <option value="rounded">Links rounded</option>
                  <option value="square">Links square (Premium)</option>
                  <option value="pill">Links pill (Premium)</option>
                </select>
              </div>

              <button type="submit" style={primaryButtonStyle}>
                Salvar tema e layout
              </button>
            </form>
          </section>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Ordem dos blocos</h2>

            <form action={updateProfile} style={{ display: "grid", gap: "12px" }}>
              <BlockSorter initialOrder={dashboardUser.blocksOrder ?? "stats,about,gallery,music,reactions,links"} />
              <button type="submit" style={primaryButtonStyle}>
                Salvar ordem dos blocos
              </button>
            </form>
          </section>

          <section style={panelStyle}>
            <h2 style={panelTitleStyle}>Conteúdo extra</h2>

            {!premium && (
              <div style={infoBoxStyle}>
                Free: badges premium e recursos extras avançados ficam bloqueados.
              </div>
            )}

            <form action={updateProfile} style={{ display: "grid", gap: "12px" }}>
              <input name="aboutTitle" type="text" defaultValue={dashboardUser.aboutTitle ?? ""} placeholder="Título da seção sobre" style={inputStyle} />
              <textarea
                name="aboutText"
                defaultValue={dashboardUser.aboutText ?? ""}
                placeholder="Texto sobre você"
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <input
                name="badge1"
                type="text"
                defaultValue={premium ? dashboardUser.badge1 ?? "" : ""}
                placeholder={premium ? "Badge 1" : "Badge 1 (Premium)"}
                style={inputStyle}
              />
              <input
                name="badge2"
                type="text"
                defaultValue={premium ? dashboardUser.badge2 ?? "" : ""}
                placeholder={premium ? "Badge 2" : "Badge 2 (Premium)"}
                style={inputStyle}
              />
              <input
                name="badge3"
                type="text"
                defaultValue={premium ? dashboardUser.badge3 ?? "" : ""}
                placeholder={premium ? "Badge 3" : "Badge 3 (Premium)"}
                style={inputStyle}
              />

              <button type="submit" style={primaryButtonStyle}>
                Salvar conteúdo extra
              </button>
            </form>
          </section>
        </div>

        <section style={panelStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              Ordenar links
            </h2>

            <span style={{ color: "#a3a3a3", fontSize: "14px" }}>
              {totalLinks} {totalLinks === 1 ? "link" : "links"}
            </span>
          </div>

          {links.length === 0 ? (
            <div style={emptyBoxStyle}>Você ainda não criou nenhum link.</div>
          ) : (
            <LinkSorter
              items={links.map((link) => ({
                id: link.id,
                title: link.title || link.url,
                url: link.url,
                clicks: link._count.clicks,
              }))}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function FilterLink({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <Link
      href={value === "all" ? "/dashboard" : `/dashboard?period=${value}`}
      style={{
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: "12px",
        border: active ? "1px solid rgba(236,72,153,0.35)" : "1px solid #2a2a2a",
        backgroundColor: active ? "rgba(236,72,153,0.12)" : "#111111",
        color: active ? "#f9a8d4" : "#fff",
        fontWeight: "bold",
        fontSize: "14px",
      }}
    >
      {label}
    </Link>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(48,16,31,1), rgba(26,12,18,1))",
        border: "1px solid rgba(236,72,153,0.22)",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 14px 34px rgba(236,72,153,0.08)",
      }}
    >
      <div style={{ color: "#f9a8d4", fontSize: "14px", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "34px", fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  total,
  suffix = "",
}: {
  label: string;
  value: number;
  total: number;
  suffix?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#101010",
        border: "1px solid #242424",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          gap: "10px",
        }}
      >
        <span>{label}</span>
        <strong>
          {value}
          {suffix}
        </strong>
      </div>

      <div
        style={{
          height: "10px",
          borderRadius: "999px",
          backgroundColor: "#1b1b1b",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(value / Math.max(total, 1)) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #ec4899, #7c053d)",
          }}
        />
      </div>
    </div>
  );
}

function MiniClicksChart({
  data,
}: {
  data: {
    name: string;
    clicks: number;
  }[];
}) {
  const max = Math.max(...data.map((item) => item.clicks), 1);

  if (data.length === 0) {
    return <div style={emptyBoxStyle}>Sem cliques ainda.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        gap: "10px",
        minHeight: "220px",
      }}
    >
      {data.map((item) => (
        <div
          key={`${item.name}-${item.clicks}`}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "56px",
              height: `${Math.max(20, (item.clicks / max) * 170)}px`,
              background: "linear-gradient(180deg, #ec4899, #7c053d)",
              borderRadius: "18px 18px 8px 8px",
            }}
          />
          <span style={{ color: "#d1d5db", fontSize: "12px", textAlign: "center" }}>
            {item.name}
          </span>
          <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
            {item.clicks}
          </span>
        </div>
      ))}
    </div>
  );
}

const topLinkStyle = {
  textDecoration: "none",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
} as const;

const logoutButtonStyle = {
  backgroundColor: "#7f1d1d",
  border: "1px solid #991b1b",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
} as const;

const panelStyle = {
  backgroundColor: "#0b0b0b",
  border: "1px solid #242424",
  borderRadius: "18px",
  padding: "20px",
} as const;

const panelTitleStyle = {
  marginTop: 0,
  marginBottom: "18px",
  fontSize: "24px",
} as const;

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #303030",
  backgroundColor: "#0f0f0f",
  color: "#fff",
  outline: "none",
} as const;

const primaryButtonStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#db2777",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const primaryButtonStyleCompact = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#db2777",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const primaryButtonWideStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#db2777",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const secondaryButtonWideStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #374151",
  backgroundColor: "#1f2937",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
} as const;

const dangerButtonStyle = {
  backgroundColor: "#7f1d1d",
  border: "1px solid #991b1b",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
} as const;

const badgePillStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(236,72,153,0.10)",
  border: "1px solid rgba(236,72,153,0.22)",
  color: "#f9a8d4",
  fontSize: "13px",
  fontWeight: "bold",
} as const;

const planTitleStyle = {
  fontSize: "30px",
  margin: "12px 0 8px 0",
} as const;

const planDescriptionStyle = {
  color: "#d4d4d4",
  lineHeight: 1.7,
  margin: 0,
} as const;

const featureListStyle = {
  display: "grid",
  gap: "10px",
  marginTop: "16px",
  color: "#fff",
} as const;

function planCardStyle(featured: boolean): React.CSSProperties {
  return {
    background: featured
      ? "linear-gradient(180deg, rgba(48,16,31,1), rgba(26,12,18,1))"
      : "#101010",
    border: featured
      ? "1px solid rgba(236,72,153,0.22)"
      : "1px solid #242424",
    borderRadius: "18px",
    padding: "20px",
  };
}

function planTagStyle(featured: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: featured ? "rgba(236,72,153,0.12)" : "#1a1a1a",
    border: featured ? "1px solid rgba(236,72,153,0.22)" : "1px solid #2a2a2a",
    color: featured ? "#f9a8d4" : "#d4d4d4",
    fontSize: "13px",
    fontWeight: "bold",
  };
}

const currentPlanBoxStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  textAlign: "center" as const,
  fontWeight: "bold",
} as const;

const lockedBoxStyle = {
  marginBottom: "16px",
  padding: "14px 16px",
  borderRadius: "12px",
  backgroundColor: "rgba(236,72,153,0.08)",
  border: "1px solid rgba(236,72,153,0.18)",
  color: "#f9a8d4",
} as const;

const infoBoxStyle = {
  marginBottom: "16px",
  padding: "14px 16px",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid #242424",
  color: "#d4d4d4",
} as const;

const emptyBoxStyle = {
  border: "1px dashed #3a3a3a",
  borderRadius: "12px",
  padding: "32px",
  textAlign: "center" as const,
  color: "#a3a3a3",
} as const;