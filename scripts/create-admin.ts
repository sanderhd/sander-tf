import bcrypt from "bcryptjs";
import { getSupabaseAdminClient } from "../lib/supabase";

async function createAdmin() {
  try {
    const supabase = getSupabaseAdminClient();
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const email = process.env.ADMIN_EMAIL || "admin@localhost";

    const { data: existingUser, error: existingUserError } = await supabase
      .from("User")
      .select("id,email,role")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      if (existingUser.role === "ADMIN") {
        console.log("❌ Er bestaat al een admin user met email:", email);
        console.log("   Gebruik 'npm run reset-admin-password' om het wachtwoord te resetten.");
        return;
      } else {
        console.log("ℹ️  User met email", email, "bestaat al.");
        console.log("🔄 Updating user to ADMIN role...");
        
        const passwordHash = await bcrypt.hash(password, 10);
        
        const { data: admin, error: updateError } = await supabase
          .from("User")
          .update({
            passwordHash,
            role: "ADMIN",
          })
          .eq("email", email)
          .select("id,email")
          .single();

        if (updateError || !admin) {
          throw updateError ?? new Error("Failed to update admin");
        }

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

    const { data: admin, error: createError } = await supabase
      .from("User")
      .insert({
        email,
        passwordHash,
        role: "ADMIN",
      })
      .select("id,email")
      .single();

    if (createError || !admin) {
      throw createError ?? new Error("Failed to create admin");
    }

    console.log("✅ Admin user created successfully!");
    console.log("   ID:", admin.id);
    console.log("   Email:", admin.email);
    console.log("   Password:", password);
    console.log("");
    console.log("⚠️  Bewaar dit wachtwoord veilig!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

createAdmin();
