import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const [{ syncManyUserAuras }, { prisma }] = await Promise.all([
    import("../src/app/lib/aura-server"),
    import("../src/app/lib/prisma"),
  ]);
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  await syncManyUserAuras(users.map((user) => user.id));
  console.log(`Aura synced for ${users.length} users.`);
}

main()
  .catch((error) => {
    console.error("Failed to recalculate aura.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("../src/app/lib/prisma");
    await prisma.$disconnect();
  });
