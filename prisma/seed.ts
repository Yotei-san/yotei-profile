import "dotenv/config";
import { prisma } from "../src/app/lib/prisma";

async function main() {
  console.log("Seed iniciado.");

  // Se quiser seedar badges depois, colocamos aqui.
  // Por enquanto, deixamos seguro para não quebrar o build da Vercel.

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