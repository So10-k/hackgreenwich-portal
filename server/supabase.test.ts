import { describe, expect, it } from "vitest";
import { testSupabaseConnection } from "./supabase";

describe("Supabase Integration", () => {
  it("should successfully connect to Supabase with provided credentials", async () => {
    const result = await testSupabaseConnection();
    
    if (!result.success) {
      console.error("Supabase connection failed:", result.error);
      throw new Error(`Supabase connection failed: ${result.error}`);
    }
    
    expect(result.success).toBe(true);
  });
});
