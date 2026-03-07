import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Controleer of er al een admin bestaat
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("❌ Er bestaat al een admin user met email:", existingAdmin.email);
      console.log("   Wil je het wachtwoord resetten? Verwijder eerst de bestaande admin.");
      return;
    }

    // Vraag om wachtwoord (of gebruik een standaard voor development)
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const email = process.env.ADMIN_EMAIL || "admin@localhost";

    console.log("🔐 Creating admin user...");
    console.log("   Email:", email);
    
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("   ID:", admin.id);
    console.log("   Email:", admin.email);
    console.log("   Password:", password);
    console.log("");
    console.log("⚠️  Bewaar dit wachtwoord veilig!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
