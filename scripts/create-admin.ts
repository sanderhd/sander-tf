import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const email = process.env.ADMIN_EMAIL || "admin@localhost";

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role === "ADMIN") {
        console.log("❌ Er bestaat al een admin user met email:", email);
        console.log("   Gebruik 'npm run reset-admin-password' om het wachtwoord te resetten.");
        return;
      } else {
        console.log("ℹ️  User met email", email, "bestaat al.");
        console.log("🔄 Updating user to ADMIN role...");
        
        const passwordHash = await bcrypt.hash(password, 10);
        
        const admin = await prisma.user.update({
          where: { email },
          data: {
            passwordHash,
            role: "ADMIN",
          },
        });

        console.log("✅ User updated to ADMIN successfully!");
        console.log("   ID:", admin.id);
        console.log("   Email:", admin.email);
        console.log("   Password:", password);
        console.log("");
        console.log("⚠️  Bewaar dit wachtwoord veilig!");
        return;
      }
    }

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
