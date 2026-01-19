import { describe, it, expect } from "vitest";
import * as db from "./db-supabase";

describe("Supabase Database Functions", () => {
  describe("User Functions", () => {
    it("should get all users", async () => {
      const users = await db.getAllUsers();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("Team Functions", () => {
    it("should get all teams", async () => {
      const teams = await db.getAllTeams();
      expect(teams).toBeDefined();
      expect(Array.isArray(teams)).toBe(true);
    });
  });

  describe("Announcement Functions", () => {
    it("should get announcements", async () => {
      const announcements = await db.getAnnouncements();
      expect(announcements).toBeDefined();
      expect(Array.isArray(announcements)).toBe(true);
    });
  });

  describe("Resource Functions", () => {
    it("should get resources", async () => {
      const resources = await db.getResources();
      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
    });
  });

  describe("Supabase Connection", () => {
    it("should successfully query the database", async () => {
      const users = await db.getAllUsers();
      expect(users).toBeDefined();
      // If we can get users, Supabase connection is working
    });
  });
});
