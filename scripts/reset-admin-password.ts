import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      console.log("❌ Geen admin user gevonden. Maak eerst een admin aan met:");
      console.log("   npm run create-admin");
      return;
    }

    const newPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    console.log("🔐 Resetting admin password...");
    console.log("   Admin email:", admin.email);
    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    console.log("✅ Admin password reset successfully!");
    console.log("   Email:", admin.email);
    console.log("   New password:", newPassword);
    console.log("");
    console.log("⚠️  Bewaar dit wachtwoord veilig!");
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
