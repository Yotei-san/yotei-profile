require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

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

async function main() {
  const username = process.argv[2];

  if (!username) {
    console.error("Uso: node scripts/make-admin.js SEU_USERNAME");
    process.exit(1);
  }

  const normalizedUsername = username.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      username: normalizedUsername,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    console.error(`Usuário não encontrado: ${normalizedUsername}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: "admin",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  console.log("Usuário promovido com sucesso:");
  console.log(updated);
}

main()
  .catch((error) => {
    console.error("Erro ao promover usuário:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });