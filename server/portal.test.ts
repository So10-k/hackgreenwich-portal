import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(userOverrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    registrationStep: 3,
    devpostUsername: "testuser",
    devpostVerified: true,
    portalAccessGranted: true,
    skills: ["React", "TypeScript"],
    interests: ["Web Development", "AI"],
    experienceLevel: "intermediate",
    bio: "Test bio",
    githubUrl: null,
    linkedinUrl: null,
    portfolioUrl: null,
    avatarUrl: null,
    lookingForTeam: true,
    projectPreferences: null,
    ...userOverrides,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createAdminContext(): TrpcContext {
  return createTestContext({ role: "admin", id: 999 });
}

describe("Profile Management", () => {
  it("should get current user profile", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const profile = await caller.profile.get();

    expect(profile).toBeDefined();
    expect(profile?.name).toBe("Test User");
    expect(profile?.email).toBe("test@example.com");
  });

  it("should update user profile", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.update({
      bio: "Updated bio",
      githubUrl: "https://github.com/testuser",
    });

    expect(result).toBeDefined();
  });
});

describe("Registration Flow", () => {
  it("should get registration status", async () => {
    const ctx = createTestContext({ registrationStep: 2 });
    const caller = appRouter.createCaller(ctx);

    const status = await caller.registration.getStatus();

    expect(status).toBeDefined();
    expect(status.step).toBe(2);
    expect(status.devpostVerified).toBe(true);
    expect(status.portalAccessGranted).toBe(true);
  });

  it("should complete registration with profile data", async () => {
    const ctx = createTestContext({ registrationStep: 1 });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.completeRegistration({
      devpostUsername: "newuser",
      bio: "New user bio",
      skills: ["Python", "JavaScript"],
      interests: ["Data Science"],
      experienceLevel: "beginner",
    });

    expect(result).toBeDefined();
  });
});

describe("Teammate Finder", () => {
  it("should list teammates for users with portal access", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const teammates = await caller.teammates.list();

    expect(teammates).toBeDefined();
    expect(Array.isArray(teammates)).toBe(true);
  });

  it("should reject teammate listing without portal access", async () => {
    const ctx = createTestContext({ portalAccessGranted: false });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.teammates.list()).rejects.toThrow("Portal access not granted yet");
  });

  it("should send connection request", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teammates.sendConnectionRequest({
      receiverId: 2,
      message: "Let's team up!",
    });

    expect(result).toBeDefined();
    expect(result.requestId).toBeDefined();
  });
});

describe("Team Management", () => {
  it("should create a team", async () => {
    const ctx = createTestContext({ id: 999 });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teams.create({
      name: "Test Team",
      description: "A test team",
      projectIdea: "Build something cool",
      maxMembers: 4,
    });

    expect(result).toBeDefined();
    expect(result.teamId).toBeDefined();
  });

  it("should reject team creation without portal access", async () => {
    const ctx = createTestContext({ portalAccessGranted: false });
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.teams.create({
        name: "Test Team",
        maxMembers: 4,
      })
    ).rejects.toThrow("Portal access not granted yet");
  });

  it("should get user's team", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const team = await caller.teams.getMyTeam();

    // Team may or may not exist, just verify the call works
    expect(team === null || typeof team === "object").toBe(true);
  });

  it("should list all teams", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const teams = await caller.teams.list();

    expect(teams).toBeDefined();
    expect(Array.isArray(teams)).toBe(true);
  });
});

describe("Resources", () => {
  it("should list resources for users with portal access", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const resources = await caller.resources.list();

    expect(resources).toBeDefined();
    expect(Array.isArray(resources)).toBe(true);
  });

  it("should reject resource listing without portal access", async () => {
    const ctx = createTestContext({ portalAccessGranted: false });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.resources.list()).rejects.toThrow("Portal access not granted yet");
  });

  it("should filter resources by category", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const resources = await caller.resources.list({ category: "api" });

    expect(resources).toBeDefined();
    expect(Array.isArray(resources)).toBe(true);
  });
});

describe("Announcements", () => {
  it("should list announcements for users with portal access", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const announcements = await caller.announcements.list();

    expect(announcements).toBeDefined();
    expect(Array.isArray(announcements)).toBe(true);
  });

  it("should reject announcement listing without portal access", async () => {
    const ctx = createTestContext({ portalAccessGranted: false });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.announcements.list()).rejects.toThrow("Portal access not granted yet");
  });
});

describe("Admin Panel", () => {
  it("should allow admin to view all users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const users = await caller.admin.getAllUsers();

    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  });

  it("should reject non-admin from viewing all users", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getAllUsers()).rejects.toThrow("Admin access required");
  });

  it("should allow admin to approve portal access", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.approvePortalAccess({ userId: 2 });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should reject non-admin from approving portal access", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.approvePortalAccess({ userId: 2 })).rejects.toThrow(
      "Admin access required"
    );
  });

  it("should allow admin to create announcements", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.announcements.create({
      title: "Test Announcement",
      content: "This is a test announcement",
      category: "general",
      isPinned: false,
    });

    expect(result).toBeDefined();
    expect(result.announcementId).toBeDefined();
  });

  it("should allow admin to create resources", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resources.create({
      title: "Test API",
      description: "A test API resource",
      category: "api",
      url: "https://example.com/api",
    });

    expect(result).toBeDefined();
    expect(result.resourceId).toBeDefined();
  });
});

describe("Authentication", () => {
  it("should return current user for authenticated requests", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.name).toBe("Test User");
  });

  it("should handle logout", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});
