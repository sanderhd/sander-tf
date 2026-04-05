import bcrypt from "bcryptjs";
import { getSupabaseAdminClient } from "../lib/supabase";

async function resetAdminPassword() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: admin, error: adminError } = await supabase
      .from("User")
      .select("id,email")
      .eq("role", "ADMIN")
      .limit(1)
      .maybeSingle();

    if (adminError) {
      throw adminError;
    }

    if (!admin) {
      console.log("❌ Geen admin user gevonden. Maak eerst een admin aan met:");
      console.log("   npm run create-admin");
      return;
    }

    const newPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    console.log("🔐 Resetting admin password...");
    console.log("   Admin email:", admin.email);
    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("User")
      .update({ passwordHash })
      .eq("id", admin.id);

    if (updateError) {
      throw updateError;
    }

    console.log("✅ Admin password reset successfully!");
    console.log("   Email:", admin.email);
    console.log("   New password:", newPassword);
    console.log("");
    console.log("⚠️  Bewaar dit wachtwoord veilig!");
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  }
}

resetAdminPassword();
