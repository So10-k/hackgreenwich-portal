import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db-supabase";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User profile management
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    
    update: protectedProcedure
      .input(z.object({
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        projectPreferences: z.string().optional(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        portfolioUrl: z.string().optional(),
        avatarUrl: z.string().optional(),
        lookingForTeam: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updated = await db.updateUserProfile(ctx.user.id, input);
        return updated;
      }),
    
    completeRegistration: protectedProcedure
      .input(z.object({
        devpostUsername: z.string().min(1),
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updated = await db.updateUserProfile(ctx.user.id, {
          ...input,
          registrationStep: 2,
        });
        return updated;
      }),
  }),

  // Registration flow
  registration: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return {
        step: ctx.user.registrationStep,
        devpostVerified: ctx.user.devpostVerified,
        portalAccessGranted: ctx.user.portalAccessGranted,
      };
    }),
    
    submitDevpostUsername: protectedProcedure
      .input(z.object({ devpostUsername: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, {
          devpostUsername: input.devpostUsername,
          registrationStep: 2,
        });
        return { success: true };
      }),
    
    confirmDevpostRegistration: protectedProcedure
      .mutation(async ({ ctx }) => {
        await db.updateUserProfile(ctx.user.id, {
          devpostVerified: true,
          registrationStep: 3,
        });
        return { success: true };
      }),
  }),

  // Teammate finder
  teammates: router({
    list: protectedProcedure
      .input(z.object({
        experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        lookingForTeam: z.boolean().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (!ctx.user.portalAccessGranted) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'Portal access not granted yet' 
          });
        }
        
        const users = await db.getUsersForTeammateFinder(ctx.user.id, input);
        return users;
      }),
    
    sendConnectionRequest: protectedProcedure
      .input(z.object({
        receiverId: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const request = await db.sendConnectionRequest(ctx.user.id, input.receiverId, input.message);
        return { requestId: request.id };
      }),
    
    getConnectionRequests: protectedProcedure.query(async ({ ctx }) => {
      return await db.getConnectionRequests(ctx.user.id);
    }),
    
    respondToConnectionRequest: protectedProcedure
      .input(z.object({
        requestId: z.number(),
        accept: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (input.accept) {
          await db.acceptConnectionRequest(input.requestId);
        } else {
          await db.declineConnectionRequest(input.requestId);
        }
        return { success: true };
      }),
    
    getConnections: protectedProcedure.query(async ({ ctx }) => {
      // TODO: Add getUserConnections function
      return [];
    }),
  }),

  // Team management
  teams: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        projectIdea: z.string().optional(),
        maxMembers: z.number().min(2).max(10).default(4),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.portalAccessGranted) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'Portal access not granted yet' 
          });
        }
        
        // Check if user already has a team
        const existingTeam = await db.getUserTeam(ctx.user.id);
        if (existingTeam) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'You are already in a team' 
          });
        }
        
        const team = await db.createTeam(
          input.name,
          ctx.user.id,
          input.description,
          input.projectIdea,
          input.maxMembers
        );
        
        return { teamId: team.id };
      }),
    
    getMyTeam: protectedProcedure.query(async ({ ctx }) => {
      const team = await db.getUserTeam(ctx.user.id);
      if (!team) return null;
      
      return await db.getTeamWithMembers(team.id);
    }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.portalAccessGranted) {
        throw new TRPCError({ 
          code: 'FORBIDDEN', 
          message: 'Portal access not granted yet' 
        });
      }
      return await db.getAllTeams();
    }),
    
    getAllTeamsWithMembers: adminProcedure.query(async ({ ctx }) => {
      const teams = await db.getAllTeams();
      const teamsWithMembers = await Promise.all(
        teams.map(async (team) => db.getTeamWithMembers(team.id))
      );
      return teamsWithMembers;
    }),
    
    inviteMember: protectedProcedure
      .input(z.object({
        teamId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify user is in the team
        const team = await db.getUserTeam(ctx.user.id);
        if (!team || team.id !== input.teamId) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'You are not in this team' 
          });
        }
        
        // Check team size
        const teamWithMembers = await db.getTeamWithMembers(input.teamId);
        if (teamWithMembers.members.length >= team.max_members) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Team is full' 
          });
        }
        
        const invitation = await db.inviteToTeam(input.teamId, input.userId, ctx.user.id);
        
        return { invitationId: invitation.id };
      }),
    
    getInvitations: protectedProcedure.query(async ({ ctx }) => {
      const invitations = await db.getTeamInvitations(ctx.user.id);
      return invitations.map(inv => ({
        invitation: { id: inv.id, status: inv.status, createdAt: inv.created_at },
        team: (inv as any).teams, // Supabase returns 'teams' not 'team'
        invitedBy: inv.invited_by
      }));
    }),
    
    respondToInvitation: protectedProcedure
      .input(z.object({
        invitationId: z.number(),
        accept: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (input.accept) {
          // Check if user already has a team
          const existingTeam = await db.getUserTeam(ctx.user.id);
          if (existingTeam) {
            throw new TRPCError({ 
              code: 'BAD_REQUEST', 
              message: 'You are already in a team' 
            });
          }
          
          // Accept invitation (adds user to team and updates status)
          await db.acceptTeamInvitation(input.invitationId);
        } else {
          await db.declineTeamInvitation(input.invitationId);
        }
        
        return { success: true };
      }),
  }),

  // Resources
  resources: router({
    list: protectedProcedure
      .input(z.object({
        category: z.enum(['api', 'tutorial', 'tool', 'dataset', 'other']).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (!ctx.user.portalAccessGranted) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'Portal access not granted yet' 
          });
        }
        
        // TODO: Add category filtering
        return await db.getResources();
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.enum(['api', 'tutorial', 'tool', 'dataset', 'other']),
        url: z.string().optional(),
        fileKey: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const resource = await db.createResource(
          input.title,
          input.category,
          ctx.user.id,
          input.description,
          input.url,
          input.fileKey
        );
        return { resourceId: resource.id };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteResource(input.id);
        return { success: true };
      }),
  }),

  // Announcements
  announcements: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.portalAccessGranted) {
        throw new TRPCError({ 
          code: 'FORBIDDEN', 
          message: 'Portal access not granted yet' 
          });
      }
      return await db.getAnnouncements();
    }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.string().optional(),
        isPinned: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const announcement = await db.createAnnouncement(
          input.title,
          input.content,
          ctx.user.id,
          input.category,
          input.isPinned
        );
        return { announcementId: announcement.id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        isPinned: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        const updatedFields: any = {};
        if (updates.title) updatedFields.title = updates.title;
        if (updates.content) updatedFields.content = updates.content;
        if (updates.category) updatedFields.category = updates.category;
        if (updates.isPinned !== undefined) updatedFields.is_pinned = updates.isPinned;
        
        await db.updateAnnouncement(id, updatedFields);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAnnouncement(input.id);
        return { success: true };
      }),
  }),

  // Sponsors
  sponsors: router({ list: publicProcedure.query(async () => {
      return await db.getSponsors();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getSponsors();
    }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        tier: z.enum(['platinum', 'gold', 'silver', 'bronze', 'partner']),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        description: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const sponsor = await db.createSponsor({
          name: input.name,
          tier: input.tier,
          logoUrl: input.logoUrl,
          websiteUrl: input.websiteUrl,
          description: input.description,
          displayOrder: input.displayOrder,
        });
        return { sponsorId: sponsor.id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        tier: z.enum(['platinum', 'gold', 'silver', 'bronze', 'partner']).optional(),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        description: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        const updatedFields: any = {};
        if (updates.name) updatedFields.name = updates.name;
        if (updates.tier) updatedFields.tier = updates.tier;
        if (updates.logoUrl !== undefined) updatedFields.logo_url = updates.logoUrl;
        if (updates.websiteUrl !== undefined) updatedFields.website_url = updates.websiteUrl;
        if (updates.description !== undefined) updatedFields.description = updates.description;
        if (updates.displayOrder !== undefined) updatedFields.display_order = updates.displayOrder;
        if (updates.isActive !== undefined) updatedFields.is_active = updates.isActive;
        
        await db.updateSponsor(id, updatedFields);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSponsor(input.id);
        return { success: true };
      }),
  }),

  // Schedule
  schedule: router({
    list: publicProcedure.query(async () => {
      return await db.getScheduleEvents();
    }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        eventType: z.enum(['workshop', 'keynote', 'meal', 'activity', 'deadline', 'ceremony', 'other']),
        startTime: z.string(),
        endTime: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const event = await db.createScheduleEvent({
          title: input.title,
          eventType: input.eventType,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime),
          description: input.description,
          location: input.location,
          isImportant: input.isFeatured,
        });
        return { eventId: event.id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        eventType: z.enum(['workshop', 'keynote', 'meal', 'activity', 'deadline', 'ceremony', 'other']).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        const updatedFields: any = {};
        if (updates.title) updatedFields.title = updates.title;
        if (updates.eventType) updatedFields.event_type = updates.eventType;
        if (updates.startTime) updatedFields.start_time = updates.startTime;
        if (updates.endTime) updatedFields.end_time = updates.endTime;
        if (updates.description !== undefined) updatedFields.description = updates.description;
        if (updates.location !== undefined) updatedFields.location = updates.location;
        if (updates.isFeatured !== undefined) updatedFields.is_featured = updates.isFeatured;
        
        await db.updateScheduleEvent(id, updatedFields);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteScheduleEvent(input.id);
        return { success: true };
      }),
  }),

  // Admin panel
  admin: router({
    getAllUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    approvePortalAccess: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateUserProfile(input.userId, {
          devpostVerified: true,
          portalAccessGranted: true,
          registrationStep: 3,
        });
        return { success: true };
      }),
    
    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(['user', 'admin']),
      }))
      .mutation(async ({ input }) => {
        await db.updateUserProfile(input.userId, { role: input.role });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
