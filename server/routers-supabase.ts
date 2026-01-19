import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc-supabase";
import { TRPCError } from "@trpc/server";
import * as db from "./db-supabase";
import { systemRouter } from "./_core/systemRouter";

export const appRouterSupabase = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),

    signup: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
          name: z.string().min(2),
        })
      )
      .mutation(async ({ input }) => {
        const { signUpWithEmail } = await import("./auth-supabase");
        const result = await signUpWithEmail(input.email, input.password, input.name);
        return {
          user: result.user,
          userProfile: result.userProfile,
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      // Logout is handled on the frontend by clearing the token
      return { success: true };
    }),
  }),

  profile: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await db.getUserProfile(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          bio: z.string().optional(),
          skills: z.array(z.string()).optional(),
          interests: z.array(z.string()).optional(),
          experienceLevel: z.string().optional(),
          githubUrl: z.string().optional(),
          linkedinUrl: z.string().optional(),
          portfolioUrl: z.string().optional(),
          lookingForTeam: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        return await db.updateUserProfile(ctx.user.id, {
          name: input.name,
          bio: input.bio,
          skills: input.skills,
          interests: input.interests,
          experience_level: input.experienceLevel,
          github_url: input.githubUrl,
          linkedin_url: input.linkedinUrl,
          portfolio_url: input.portfolioUrl,
          looking_for_team: input.lookingForTeam,
        });
      }),

    verifyDevpost: protectedProcedure
      .input(z.object({ devpostUsername: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        return await db.updateUserProfile(ctx.user.id, {
          devpost_username: input.devpostUsername,
          devpost_verified: true,
          registration_step: 2,
        });
      }),
  }),

  teammates: router({
    list: protectedProcedure
      .input(
        z.object({
          skills: z.array(z.string()).optional(),
          interests: z.array(z.string()).optional(),
          experienceLevel: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await db.getUsersForTeammateFinder(ctx.user.id, input);
      }),

    sendRequest: protectedProcedure
      .input(z.object({ toUserId: z.number(), message: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await db.sendConnectionRequest(ctx.user.id, input.toUserId, input.message);
      }),

    getRequests: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await db.getConnectionRequests(ctx.user.id);
    }),

    acceptRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await db.acceptConnectionRequest(input.requestId);
      }),
  }),

  teams: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          projectIdea: z.string().optional(),
          maxMembers: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const existingTeam = await db.getUserTeam(ctx.user.id);
        if (existingTeam) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "You are already in a team" });
        }

        return await db.createTeam(
          input.name,
          ctx.user.id,
          input.description,
          input.projectIdea,
          input.maxMembers || 4
        );
      }),

    getMyTeam: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const team = await db.getUserTeam(ctx.user.id);
      if (!team) return null;
      return await db.getTeamWithMembers(team.id);
    }),

    list: publicProcedure.query(async () => {
      return await db.getAllTeams();
    }),

    getInvitations: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      return await db.getTeamInvitations(ctx.user.id);
    }),

    acceptInvitation: protectedProcedure
      .input(z.object({ invitationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await db.acceptTeamInvitation(input.invitationId);
      }),

    inviteMember: protectedProcedure
      .input(z.object({ teamId: z.number(), userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await db.inviteToTeam(input.teamId, input.userId, ctx.user.id);
      }),
  }),

  announcements: router({
    list: publicProcedure.query(async () => {
      return await db.getAnnouncements();
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string(),
          category: z.string().optional(),
          isPinned: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create announcements" });
        }

        return await db.createAnnouncement(
          input.title,
          input.content,
          ctx.user.id,
          input.category,
          input.isPinned
        );
      }),
  }),

  resources: router({
    list: publicProcedure.query(async () => {
      return await db.getResources();
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          category: z.string(),
          description: z.string().optional(),
          url: z.string().optional(),
          fileKey: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create resources" });
        }

        return await db.createResource(
          input.title,
          input.category,
          ctx.user.id,
          input.description,
          input.url,
          input.fileKey
        );
      }),
  }),

  admin: router({
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view all users" });
      }

      return await db.getAllUsers();
    }),

    approvePortalAccess: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can approve portal access" });
        }

        return await db.approvePortalAccess(input.userId);
      }),
  }),

  schedule: router({
    list: publicProcedure.query(async () => {
      return await db.getScheduleEvents();
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          eventType: z.string(),
          startTime: z.date(),
          endTime: z.date(),
          location: z.string().optional(),
          isImportant: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create schedule events" });
        }
        return await db.createScheduleEvent(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          eventType: z.string().optional(),
          startTime: z.date().optional(),
          endTime: z.date().optional(),
          location: z.string().optional(),
          isImportant: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update schedule events" });
        }
        return await db.updateScheduleEvent(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete schedule events" });
        }
        return await db.deleteScheduleEvent(input.id);
      }),
  }),

  sponsors: router({
    list: publicProcedure.query(async () => {
      return await db.getSponsors();
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          logoUrl: z.string().optional(),
          websiteUrl: z.string().optional(),
          tier: z.string(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create sponsors" });
        }
        return await db.createSponsor(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          logoUrl: z.string().optional(),
          websiteUrl: z.string().optional(),
          tier: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update sponsors" });
        }
        return await db.updateSponsor(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete sponsors" });
        }
        return await db.deleteSponsor(input.id);
      }),
  }),

  submissions: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          demoUrl: z.string().optional(),
          githubUrl: z.string().optional(),
          fileKey: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const team = await db.getUserTeam(ctx.user.id);
        if (!team) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "You must be in a team to submit a project" });
        }

        return await db.createProjectSubmission(
          team.id,
          input.title,
          input.description,
          input.demoUrl,
          input.githubUrl,
          input.fileKey
        );
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view submissions" });
      }

      return await db.getProjectSubmissions();
    }),
  }),
});

export type AppRouterSupabase = typeof appRouterSupabase;
