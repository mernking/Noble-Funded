// Seed script to create admin users
// Run with: node backend/db/seed.js

import { config } from "dotenv";
import path from "path";

// Load env from backend directory
config({ path: path.join(process.cwd(), "backend", ".env") });

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Admin users to create
const ADMIN_USERS = [
  { email: "super_admin@example.com", fullName: "Super Admin", role: "super_admin" },
  { email: "compliance@example.com", fullName: "Compliance Officer", role: "compliance" },
  { email: "support@example.com", fullName: "Support Agent", role: "support" },
  { email: "marketing@example.com", fullName: "Marketing Team", role: "marketing" },
  { email: "developer@example.com", fullName: "Developer", role: "developer" },
];

const PASSWORD = "123456";

async function seed() {
  // Connect to database
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL not set. Using Supabase for seeding.");
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("SUPABASE_URL or SUPABASE_SERVICE_KEY not set!");
      process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Hash password
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    
    // Create users using Supabase Auth
    for (const user of ADMIN_USERS) {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email);
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${user.email} already exists, updating...`);
        
        // Update existing user
        const { error: updateError } = await supabase
          .from("users")
          .update({
            fullName: user.fullName,
            role: user.role,
            passwordHash: passwordHash,
            status: "active",
            emailVerified: true,
          })
          .eq("email", user.email);
        
        if (updateError) {
          console.error(`Error updating ${user.email}:`, updateError);
        } else {
          console.log(`Updated ${user.email} with role: ${user.role}`);
        }
      } else {
        // Create new user
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            passwordHash: passwordHash,
            status: "active",
            emailVerified: true,
            provider: "email",
          });
        
        if (insertError) {
          console.error(`Error creating ${user.email}:`, insertError);
        } else {
          console.log(`Created ${user.email} with role: ${user.role}`);
        }
      }
    }
    
    console.log("\n✅ Admin users seeded successfully!");
    console.log("\nLogin credentials:");
    console.log("Email: super_admin@example.com | Password: 123456 | Role: super_admin");
    console.log("Email: compliance@example.com | Password: 123456 | Role: compliance");
    console.log("Email: support@example.com | Password: 123456 | Role: support");
    console.log("Email: marketing@example.com | Password: 123456 | Role: marketing");
    console.log("Email: developer@example.com | Password: 123456 | Role: developer");
    
    return;
  }
  
  // Direct PostgreSQL connection
  const { Client } = await import("pg");
  const client = new Client({ connectionString: databaseUrl });
  
  await client.connect();
  
  // Hash password
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  
  for (const user of ADMIN_USERS) {
    // Check if user exists
    const existingResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [user.email]
    );
    
    if (existingResult.rows.length > 0) {
      // Update existing user
      await client.query(
        `UPDATE users SET 
          full_name = $1, 
          role = $2, 
          password_hash = $3, 
          status = 'active', 
          email_verified = true,
          updated_at = NOW()
        WHERE email = $4`,
        [user.fullName, user.role, passwordHash, user.email]
      );
      console.log(`Updated ${user.email} with role: ${user.role}`);
    } else {
      // Create new user
      await client.query(
        `INSERT INTO users (email, password_hash, full_name, role, status, email_verified, provider) 
        VALUES ($1, $2, $3, $4, 'active', true, 'email')`,
        [user.email, passwordHash, user.fullName, user.role]
      );
      console.log(`Created ${user.email} with role: ${user.role}`);
    }
  }
  
  await client.end();
  
  console.log("\n✅ Admin users seeded successfully!");
  console.log("\nLogin credentials:");
  console.log("Email: super_admin@example.com | Password: 123456 | Role: super_admin");
  console.log("Email: compliance@example.com | Password: 123456 | Role: compliance");
  console.log("Email: support@example.com | Password: 123456 | Role: support");
  console.log("Email: marketing@example.com | Password: 123456 | Role: marketing");
  console.log("Email: developer@example.com | Password: 123456 | Role: developer");
}

seed().catch(console.error);
