import "dotenv/config";
import { prisma } from "../src/app/lib/prisma";
import { ensureDefaultBadges } from "../src/app/lib/badges";

async function main() {
  console.log("Seed iniciado.");
  await ensureDefaultBadges();
  console.log("Seed finalizado.");
}

main()
  .catch((error) => {
    console.error("Erro ao rodar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
