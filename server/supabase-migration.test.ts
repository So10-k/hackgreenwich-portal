import { describe, it, expect } from "vitest";
import { supabaseAdmin } from "./supabase-admin";

describe("Supabase Migration", () => {
  it("should connect to Supabase and verify credentials", async () => {
    // Test that we can connect to Supabase
    const { data, error } = await supabaseAdmin.from("users").select("count", { count: "exact", head: true });

    if (error) {
      console.error("Supabase connection error:", error);
      throw error;
    }

    expect(data).toBeDefined();
    console.log("✓ Supabase connection successful");
  });

  it("should verify auth is enabled", async () => {
    // Test that auth is working
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    expect(data).toBeDefined();
    expect(data.users).toBeDefined();
    console.log("✓ Supabase auth is working");
  });
});
