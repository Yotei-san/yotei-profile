import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function upsertBadge(input: {
  slug: string;
  name: string;
  icon: string;
  description?: string;
}) {
  await prisma.badge.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      icon: input.icon,
      description: input.description ?? null,
    },
    create: {
      slug: input.slug,
      name: input.name,
      icon: input.icon,
      description: input.description ?? null,
    },
  });
}

async function upsertDecoration(input: {
  slug: string;
  name: string;
  imageUrl: string;
  previewUrl?: string | null;
  posterUrl?: string | null;
  mediaType?: string | null;
  overlayScale?: number | null;
  overlayOffsetY?: number | null;
  sortOrder?: number | null;
  isPublic?: boolean | null;
}) {
  await prisma.decoration.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      imageUrl: input.imageUrl,
      previewUrl: input.previewUrl ?? input.imageUrl,
      posterUrl: input.posterUrl ?? null,
      mediaType: input.mediaType ?? "image",
      overlayScale: input.overlayScale ?? 100,
      overlayOffsetY: input.overlayOffsetY ?? 0,
      sortOrder: input.sortOrder ?? 0,
      isPublic: input.isPublic ?? true,
    },
    create: {
      slug: input.slug,
      name: input.name,
      imageUrl: input.imageUrl,
      previewUrl: input.previewUrl ?? input.imageUrl,
      posterUrl: input.posterUrl ?? null,
      mediaType: input.mediaType ?? "image",
      overlayScale: input.overlayScale ?? 100,
      overlayOffsetY: input.overlayOffsetY ?? 0,
      sortOrder: input.sortOrder ?? 0,
      isPublic: input.isPublic ?? true,
    },
  });
}

async function seedBadges() {
  const badges = [
    {
      slug: "owner",
      name: "Owner",
      icon: "👑",
      description: "Criador oficial da plataforma Yotei.",
    },
    {
      slug: "admin",
      name: "Admin",
      icon: "🛡️",
      description: "Administrador oficial da plataforma.",
    },
    {
      slug: "premium",
      name: "Premium",
      icon: "✦",
      description: "Usuário com plano premium ativo.",
    },
    {
      slug: "verified",
      name: "Verified",
      icon: "✔️",
      description: "Conta verificada pela equipe.",
    },
    {
      slug: "popular",
      name: "Popular",
      icon: "🔥",
      description: "Perfil em destaque pela comunidade.",
    },
    {
      slug: "beta-tester",
      name: "Beta Tester",
      icon: "🧪",
      description: "Participou das fases iniciais do Yotei.",
    },
    {
      slug: "top10",
      name: "Top 10",
      icon: "🏆",
      description: "Chegou ao top 10 da plataforma.",
    },
    {
      slug: "complete-profile",
      name: "Complete Profile",
      icon: "🎨",
      description: "Completou o perfil com alto nível de personalização.",
    },
    {
      slug: "click-master",
      name: "Click Master",
      icon: "⚡",
      description: "Recebeu um grande volume de cliques no perfil.",
    },
  ];

  for (const badge of badges) {
    await upsertBadge(badge);
  }
}

async function seedDecorations() {
  const decorations = [
    {
      slug: "neon-ring",
      name: "Neon Ring",
      imageUrl: "https://i.imgur.com/8Km9tLL.png",
      previewUrl: "https://i.imgur.com/8Km9tLL.png",
      mediaType: "image",
      overlayScale: 165,
      overlayOffsetY: 0,
      sortOrder: 1,
      isPublic: true,
    },
    {
      slug: "pink-aura",
      name: "Pink Aura",
      imageUrl: "https://i.imgur.com/1Xq9biB.png",
      previewUrl: "https://i.imgur.com/1Xq9biB.png",
      mediaType: "image",
      overlayScale: 170,
      overlayOffsetY: 0,
      sortOrder: 2,
      isPublic: true,
    },
    {
      slug: "gold-crown",
      name: "Golden Crown",
      imageUrl: "https://i.imgur.com/Qp7Z4wK.png",
      previewUrl: "https://i.imgur.com/Qp7Z4wK.png",
      mediaType: "image",
      overlayScale: 175,
      overlayOffsetY: -15,
      sortOrder: 3,
      isPublic: true,
    },
    {
      slug: "fire-ring",
      name: "Fire Ring",
      imageUrl: "https://i.imgur.com/jWZ3X6R.png",
      previewUrl: "https://i.imgur.com/jWZ3X6R.png",
      mediaType: "image",
      overlayScale: 168,
      overlayOffsetY: 0,
      sortOrder: 4,
      isPublic: true,
    },
    {
      slug: "blue-glow",
      name: "Blue Glow",
      imageUrl: "https://i.imgur.com/9z3ZQkR.png",
      previewUrl: "https://i.imgur.com/9z3ZQkR.png",
      mediaType: "image",
      overlayScale: 165,
      overlayOffsetY: 0,
      sortOrder: 5,
      isPublic: true,
    },
  ];

  for (const decoration of decorations) {
    await upsertDecoration(decoration);
  }
}

async function main() {
  await seedBadges();
  await seedDecorations();
  console.log("✅ Seed concluído com sucesso.");
}

main()
  .catch((error) => {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });