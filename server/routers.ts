import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

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
        
        const users = await db.getUsersForTeammateFinder(input);
        // Filter out current user
        return users.filter(u => u.id !== ctx.user.id);
      }),
    
    sendConnectionRequest: protectedProcedure
      .input(z.object({
        receiverId: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const requestId = await db.createConnectionRequest({
          senderId: ctx.user.id,
          receiverId: input.receiverId,
          message: input.message,
          status: 'pending',
        });
        return { requestId };
      }),
    
    getConnectionRequests: protectedProcedure.query(async ({ ctx }) => {
      return await db.getConnectionRequestsForUser(ctx.user.id);
    }),
    
    respondToConnectionRequest: protectedProcedure
      .input(z.object({
        requestId: z.number(),
        accept: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateConnectionRequestStatus(
          input.requestId,
          input.accept ? 'accepted' : 'declined'
        );
        return { success: true };
      }),
    
    getConnections: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConnections(ctx.user.id);
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
        
        const teamId = await db.createTeam({
          ...input,
          createdById: ctx.user.id,
          lookingForMembers: true,
        });
        
        return { teamId };
      }),
    
    getMyTeam: protectedProcedure.query(async ({ ctx }) => {
      const team = await db.getUserTeam(ctx.user.id);
      if (!team) return null;
      
      const members = await db.getTeamMembers(team.id);
      return { team, members };
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
        const members = await db.getTeamMembers(input.teamId);
        if (members.length >= team.maxMembers) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Team is full' 
          });
        }
        
        const invitationId = await db.createTeamInvitation({
          teamId: input.teamId,
          invitedUserId: input.userId,
          invitedByUserId: ctx.user.id,
          status: 'pending',
        });
        
        return { invitationId };
      }),
    
    getInvitations: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTeamInvitationsForUser(ctx.user.id);
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
          
          // Get invitation details
          const invitations = await db.getTeamInvitationsForUser(ctx.user.id);
          const invitation = invitations.find(inv => inv.invitation.id === input.invitationId);
          
          if (!invitation) {
            throw new TRPCError({ 
              code: 'NOT_FOUND', 
              message: 'Invitation not found' 
            });
          }
          
          // Add user to team
          await db.addTeamMember(invitation.invitation.teamId, ctx.user.id);
        }
        
        await db.updateTeamInvitationStatus(
          input.invitationId,
          input.accept ? 'accepted' : 'declined'
        );
        
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
        
        if (input?.category) {
          return await db.getResourcesByCategory(input.category);
        }
        return await db.getAllResources();
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
        const resourceId = await db.createResource({
          ...input,
          uploadedById: ctx.user.id,
        });
        return { resourceId };
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
      return await db.getAllAnnouncements();
    }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.string().optional(),
        isPinned: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const announcementId = await db.createAnnouncement({
          ...input,
          postedById: ctx.user.id,
        });
        return { announcementId };
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
        await db.updateAnnouncement(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAnnouncement(input.id);
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
