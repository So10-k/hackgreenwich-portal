import { eq, and, or, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, teams, teamMembers, teamInvitations, 
  connectionRequests, resources, announcements,
  InsertTeam, InsertTeamMember, InsertTeamInvitation,
  InsertConnectionRequest, InsertResource, InsertAnnouncement
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { syncUserToSupabase } from './supabase';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "devpostUsername", "bio", "projectPreferences", "githubUrl", "linkedinUrl", "portfolioUrl", "avatarUrl"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    
    // Handle registration fields
    if (user.registrationStep !== undefined) {
      values.registrationStep = user.registrationStep;
      updateSet.registrationStep = user.registrationStep;
    }
    if (user.devpostVerified !== undefined) {
      values.devpostVerified = user.devpostVerified;
      updateSet.devpostVerified = user.devpostVerified;
    }
    if (user.portalAccessGranted !== undefined) {
      values.portalAccessGranted = user.portalAccessGranted;
      updateSet.portalAccessGranted = user.portalAccessGranted;
    }
    if (user.lookingForTeam !== undefined) {
      values.lookingForTeam = user.lookingForTeam;
      updateSet.lookingForTeam = user.lookingForTeam;
    }
    if (user.experienceLevel !== undefined) {
      values.experienceLevel = user.experienceLevel;
      updateSet.experienceLevel = user.experienceLevel;
    }
    if (user.skills !== undefined) {
      values.skills = user.skills;
      updateSet.skills = user.skills;
    }
    if (user.interests !== undefined) {
      values.interests = user.interests;
      updateSet.interests = user.interests;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
    
    // Sync to Supabase after successful database update
    const updatedUser = await getUserByOpenId(user.openId);
    if (updatedUser) {
      try {
        await syncUserToSupabase(updatedUser);
      } catch (error) {
        console.error("[Supabase] Failed to sync user:", error);
        // Don't throw - we don't want to fail the whole operation if Supabase sync fails
      }
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, updates: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(updates).where(eq(users.id, userId));
  
  // Sync to Supabase
  const updatedUser = await getUserById(userId);
  if (updatedUser) {
    try {
      await syncUserToSupabase(updatedUser);
    } catch (error) {
      console.error("[Supabase] Failed to sync user:", error);
    }
  }
  
  return updatedUser;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}

export async function getUsersForTeammateFinder(filters?: {
  skills?: string[];
  interests?: string[];
  experienceLevel?: string;
  lookingForTeam?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(users.portalAccessGranted, true)];

  if (filters?.lookingForTeam !== undefined) {
    conditions.push(eq(users.lookingForTeam, filters.lookingForTeam));
  }
  if (filters?.experienceLevel) {
    conditions.push(eq(users.experienceLevel, filters.experienceLevel as any));
  }

  return await db.select().from(users).where(and(...conditions));
}

// Team operations
export async function createTeam(team: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(teams).values(team);
  const teamId = Number(result[0].insertId);

  // Add creator as team leader
  await db.insert(teamMembers).values({
    teamId,
    userId: team.createdById,
    role: 'leader'
  });

  return teamId;
}

export async function getTeamById(teamId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: teamMembers.id,
      teamId: teamMembers.teamId,
      userId: teamMembers.userId,
      role: teamMembers.role,
      joinedAt: teamMembers.joinedAt,
      user: users
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));
}

export async function getUserTeam(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select({ team: teams })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0].team : undefined;
}

export async function getAllTeams() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(teams);
}

// Team invitations
export async function createTeamInvitation(invitation: InsertTeamInvitation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(teamInvitations).values(invitation);
  return Number(result[0].insertId);
}

export async function getTeamInvitationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      invitation: teamInvitations,
      team: teams,
      invitedBy: users
    })
    .from(teamInvitations)
    .innerJoin(teams, eq(teamInvitations.teamId, teams.id))
    .innerJoin(users, eq(teamInvitations.invitedByUserId, users.id))
    .where(and(
      eq(teamInvitations.invitedUserId, userId),
      eq(teamInvitations.status, 'pending')
    ));
}

export async function updateTeamInvitationStatus(invitationId: number, status: 'accepted' | 'declined') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teamInvitations).set({ status }).where(eq(teamInvitations.id, invitationId));
}

export async function addTeamMember(teamId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(teamMembers).values({ teamId, userId, role: 'member' });
}

// Connection requests
export async function createConnectionRequest(request: InsertConnectionRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(connectionRequests).values(request);
  return Number(result[0].insertId);
}

export async function getConnectionRequestsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      request: connectionRequests,
      sender: users
    })
    .from(connectionRequests)
    .innerJoin(users, eq(connectionRequests.senderId, users.id))
    .where(and(
      eq(connectionRequests.receiverId, userId),
      eq(connectionRequests.status, 'pending')
    ));
}

export async function getUserConnections(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      connection: connectionRequests,
      user: users
    })
    .from(connectionRequests)
    .innerJoin(users, or(
      eq(connectionRequests.senderId, users.id),
      eq(connectionRequests.receiverId, users.id)
    ))
    .where(and(
      or(
        eq(connectionRequests.senderId, userId),
        eq(connectionRequests.receiverId, userId)
      ),
      eq(connectionRequests.status, 'accepted')
    ));
}

export async function updateConnectionRequestStatus(requestId: number, status: 'accepted' | 'declined') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(connectionRequests).set({ status }).where(eq(connectionRequests.id, requestId));
}

// Resources
export async function createResource(resource: InsertResource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(resources).values(resource);
  return Number(result[0].insertId);
}

export async function getAllResources() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(resources);
}

export async function getResourcesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(resources).where(eq(resources.category, category as any));
}

export async function deleteResource(resourceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(resources).where(eq(resources.id, resourceId));
}

// Announcements
export async function createAnnouncement(announcement: InsertAnnouncement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(announcements).values(announcement);
  return Number(result[0].insertId);
}

export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(announcements).orderBy(sql`${announcements.isPinned} DESC, ${announcements.createdAt} DESC`);
}

export async function updateAnnouncement(announcementId: number, updates: Partial<InsertAnnouncement>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(announcements).set(updates).where(eq(announcements.id, announcementId));
}

export async function deleteAnnouncement(announcementId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(announcements).where(eq(announcements.id, announcementId));
}
