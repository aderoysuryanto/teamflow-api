import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedSubscriptionPlans() {
  const plans = [
    {
      id: "free",
      name: "Free",
      maxProjects: 3,
      maxUsers: 5,
      priorityEnabled: false
    },
    {
      id: "pro",
      name: "Pro",
      maxProjects: 999,
      maxUsers: 999,
      priorityEnabled: true
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        maxProjects: plan.maxProjects,
        maxUsers: plan.maxUsers,
        priorityEnabled: plan.priorityEnabled
      },
      create: plan
    });
  }

  console.log("Subscription plans seeded");
}

async function main() {
  console.log("Start seeding");
  
  await seedSubscriptionPlans();

  console.log("Seeding completed");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
