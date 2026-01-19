import { describe, expect, it } from "vitest";
import { supabaseAdmin } from "./supabase-admin";

describe("Profile functionality", () => {
  const supabase = supabaseAdmin;

  describe("User profile table structure", () => {
    it("should have users table accessible", async () => {
      // Query the table structure
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .limit(0);

      // If no error, the table exists and is accessible
      expect(error).toBeNull();
    });

    it("should have teams table accessible", async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });

    it("should have announcements table accessible", async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });

    it("should have resources table accessible", async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });

    it("should have connection_requests table accessible", async () => {
      const { data, error } = await supabase
        .from("connection_requests")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });

    it("should have team_members table accessible", async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });

    it("should have team_invitations table accessible", async () => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("*")
        .limit(0);

      expect(error).toBeNull();
    });
  });

  describe("Profile query capabilities", () => {
    it("should be able to query users looking for team", async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, skills, interests, experience_level, looking_for_team")
        .eq("looking_for_team", true)
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("should be able to query users with specific skills", async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, skills")
        .contains("skills", ["React"])
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("should be able to query users with specific interests", async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, interests")
        .contains("interests", ["AI/Machine Learning"])
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("should be able to query users by experience level", async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, experience_level")
        .eq("experience_level", "intermediate")
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("Team query capabilities", () => {
    it("should be able to query teams looking for members", async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, description, looking_for_members")
        .eq("looking_for_members", true)
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("Announcements query capabilities", () => {
    it("should be able to query announcements ordered by date", async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, content, is_pinned, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("should be able to query pinned announcements", async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, is_pinned")
        .eq("is_pinned", true)
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("Resources query capabilities", () => {
    it("should be able to query resources by category", async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, category, url")
        .eq("category", "api")
        .limit(10);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
