import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await hash("password", 12),
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", adminUser);

  // Create editor user
  const editorUser = await prisma.user.upsert({
    where: { email: "editor@example.com" },
    update: {},
    create: {
      email: "editor@example.com",
      password: await hash("password", 12),
      name: "Editor User",
      role: "EDITOR",
    },
  });

  console.log("✅ Editor user created:", editorUser);

  // Create some demo categories and tags
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "announcements" },
      update: {},
      create: {
        name: "Announcements",
        slug: "announcements",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tutorials" },
      update: {},
      create: {
        name: "Tutorials",
        slug: "tutorials",
      },
    }),
  ]);

  console.log("✅ Categories created:", categories);

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "web3" },
      update: {},
      create: {
        name: "Web3",
        slug: "web3",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "blockchain" },
      update: {},
      create: {
        name: "Blockchain",
        slug: "blockchain",
      },
    }),
  ]);

  console.log("✅ Tags created:", tags);

  console.log("✨ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
