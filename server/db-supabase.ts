import { supabaseAdmin } from "./supabase-admin";

export async function getUserByAuthId(authId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data || null;
}

export async function createOrUpdateUser(authId: string, email: string, name?: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        auth_id: authId,
        email,
        name: name || email.split("@")[0],
        registration_step: 1,
      },
      { onConflict: "auth_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }

  return data;
}

export async function getUserProfile(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId: number, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data || [];
}

export async function getAllParticipants() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, skills, github_url, linkedin_url, portfolio_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }

  // Extract username/handle from social URLs
  const participants = data?.map(user => {
    let github_username = null;
    if (user.github_url) {
      // Extract username from various GitHub URL formats
      const githubMatch = user.github_url.match(/github\.com\/([^\/\?#]+)/);
      github_username = githubMatch ? githubMatch[1] : null;
    }

    return {
      ...user,
      github_username,
      // Ensure URLs have proper protocol
      github_url: user.github_url && user.github_url.startsWith('http') ? user.github_url : user.github_url ? `https://${user.github_url}` : null,
      linkedin_url: user.linkedin_url && user.linkedin_url.startsWith('http') ? user.linkedin_url : user.linkedin_url ? `https://${user.linkedin_url}` : null,
      portfolio_url: user.portfolio_url && user.portfolio_url.startsWith('http') ? user.portfolio_url : user.portfolio_url ? `https://${user.portfolio_url}` : null,
    };
  }) || [];

  return participants;
}

export async function approvePortalAccess(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ portal_access_granted: true, registration_step: 3 })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error approving portal access:", error);
    throw error;
  }

  return data;
}

export async function getUserTeam(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user team:", error);
    throw error;
  }

  if (!data) return null;

  const { data: team, error: teamError } = await supabaseAdmin
    .from("teams")
    .select("*")
    .eq("id", data.team_id)
    .single();

  if (teamError) {
    console.error("Error fetching team:", teamError);
    throw teamError;
  }

  return team;
}

export async function createTeam(
  name: string,
  createdById: number,
  description?: string,
  projectIdea?: string,
  maxMembers: number = 4
) {
  const { data: team, error: teamError } = await supabaseAdmin
    .from("teams")
    .insert({
      name,
      description,
      project_idea: projectIdea,
      max_members: maxMembers,
      created_by_id: createdById,
    })
    .select()
    .single();

  if (teamError) {
    console.error("Error creating team:", teamError);
    throw teamError;
  }

  // Add creator as team leader
  const { error: memberError } = await supabaseAdmin
    .from("team_members")
    .insert({
      team_id: team.id,
      user_id: createdById,
      role: "leader",
    });

  if (memberError) {
    console.error("Error adding creator to team:", memberError);
    throw memberError;
  }

  return team;
}

export async function getTeamWithMembers(teamId: number) {
  const { data: team, error: teamError } = await supabaseAdmin
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (teamError) {
    console.error("Error fetching team:", teamError);
    throw teamError;
  }

  const { data: members, error: membersError } = await supabaseAdmin
    .from("team_members")
    .select("*, users(*)")
    .eq("team_id", teamId);

  if (membersError) {
    console.error("Error fetching team members:", membersError);
    throw membersError;
  }

  return { team, members: members || [] };
}

export async function getAllTeams() {
  const { data, error } = await supabaseAdmin
    .from("teams")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }

  return data || [];
}

export async function getAnnouncements() {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("*, users(name, email)")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }

  return data || [];
}

export async function createAnnouncement(
  title: string,
  content: string,
  postedById: number,
  category?: string,
  isPinned: boolean = false
) {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .insert({
      title,
      content,
      category,
      is_pinned: isPinned,
      posted_by_id: postedById,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }

  return data;
}

export async function getResources() {
  const { data, error } = await supabaseAdmin
    .from("resources")
    .select("*, users(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }

  return data || [];
}

export async function createResource(
  title: string,
  category: string,
  uploadedById: number,
  description?: string,
  url?: string,
  fileKey?: string
) {
  const { data, error } = await supabaseAdmin
    .from("resources")
    .insert({
      title,
      description,
      category,
      url,
      file_key: fileKey,
      uploaded_by_id: uploadedById,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating resource:", error);
    throw error;
  }

  return data;
}

export async function sendConnectionRequest(fromUserId: number, toUserId: number, message?: string) {
  const { data, error } = await supabaseAdmin
    .from("connection_requests")
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending connection request:", error);
    throw error;
  }

  return data;
}

export async function getConnectionRequests(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("connection_requests")
    .select("*, from_user:from_user_id(name, email), to_user:to_user_id(name, email)")
    .eq("to_user_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching connection requests:", error);
    throw error;
  }

  return data || [];
}

export async function acceptConnectionRequest(requestId: number) {
  const { data, error } = await supabaseAdmin
    .from("connection_requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    console.error("Error accepting connection request:", error);
    throw error;
  }

  return data;
}

export async function inviteToTeam(teamId: number, invitedUserId: number, invitedById: number) {
  const { data, error } = await supabaseAdmin
    .from("team_invitations")
    .insert({
      team_id: teamId,
      invited_user_id: invitedUserId,
      invited_by_id: invitedById,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error inviting to team:", error);
    throw error;
  }

  return data;
}

export async function getTeamInvitations(userId: number) {
  const { data, error } = await supabaseAdmin
    .from("team_invitations")
    .select("*, teams(*), invited_by:invited_by_id(name, email)")
    .eq("invited_user_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching team invitations:", error);
    throw error;
  }

  return data || [];
}

export async function acceptTeamInvitation(invitationId: number) {
  const { data: invitation, error: invError } = await supabaseAdmin
    .from("team_invitations")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (invError) {
    console.error("Error fetching invitation:", invError);
    throw invError;
  }

  // Update invitation status
  const { error: updateError } = await supabaseAdmin
    .from("team_invitations")
    .update({ status: "accepted" })
    .eq("id", invitationId);

  if (updateError) {
    console.error("Error updating invitation:", updateError);
    throw updateError;
  }

  // Add user to team
  const { data: member, error: memberError } = await supabaseAdmin
    .from("team_members")
    .insert({
      team_id: invitation.team_id,
      user_id: invitation.invited_user_id,
      role: "member",
    })
    .select()
    .single();

  if (memberError) {
    console.error("Error adding user to team:", memberError);
    throw memberError;
  }

  return member;
}

export async function getUsersForTeammateFinder(userId: number, filters?: any) {
  let query = supabaseAdmin
    .from("users")
    .select("*")
    .eq("portal_access_granted", true)
    .neq("id", userId);

  if (filters?.skills && filters.skills.length > 0) {
    query = query.contains("skills", filters.skills);
  }

  if (filters?.interests && filters.interests.length > 0) {
    query = query.contains("interests", filters.interests);
  }

  if (filters?.experienceLevel) {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users for teammate finder:", error);
    throw error;
  }

  return data || [];
}

export async function createProjectSubmission(
  teamId: number,
  title: string,
  description?: string,
  demoUrl?: string,
  githubUrl?: string,
  fileKey?: string
) {
  const { data, error } = await supabaseAdmin
    .from("project_submissions")
    .insert({
      team_id: teamId,
      title,
      description,
      demo_url: demoUrl,
      github_url: githubUrl,
      file_key: fileKey,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project submission:", error);
    throw error;
  }

  return data;
}

export async function getProjectSubmissions() {
  const { data, error } = await supabaseAdmin
    .from("project_submissions")
    .select("*, teams(name, description)")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching project submissions:", error);
    throw error;
  }

  return data || [];
}


// ===== Schedule Events =====

export async function getScheduleEvents() {
  const { data, error } = await supabaseAdmin
    .from("schedule_events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching schedule events:", error);
    throw error;
  }

  return data || [];
}

export async function createScheduleEvent(event: {
  title: string;
  description?: string;
  eventType: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isImportant?: boolean;
}) {
  const { data, error } = await supabaseAdmin
    .from("schedule_events")
    .insert({
      title: event.title,
      description: event.description,
      event_type: event.eventType,
      start_time: event.startTime.toISOString(),
      end_time: event.endTime.toISOString(),
      location: event.location,
      is_important: event.isImportant || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating schedule event:", error);
    throw error;
  }

  return data;
}

export async function updateScheduleEvent(
  id: number,
  updates: {
    title?: string;
    description?: string;
    eventType?: string;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    isImportant?: boolean;
  }
) {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.eventType !== undefined) updateData.event_type = updates.eventType;
  if (updates.startTime !== undefined) updateData.start_time = updates.startTime.toISOString();
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime.toISOString();
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.isImportant !== undefined) updateData.is_important = updates.isImportant;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("schedule_events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating schedule event:", error);
    throw error;
  }

  return data;
}

export async function deleteScheduleEvent(id: number) {
  const { error } = await supabaseAdmin.from("schedule_events").delete().eq("id", id);

  if (error) {
    console.error("Error deleting schedule event:", error);
    throw error;
  }

  return { success: true };
}

// ===== Sponsors =====

export async function getSponsors() {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching sponsors:", error);
    throw error;
  }

  return data || [];
}

export async function createSponsor(sponsor: {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  tier: string;
  displayOrder?: number;
}) {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .insert({
      name: sponsor.name,
      description: sponsor.description,
      logo_url: sponsor.logoUrl,
      website_url: sponsor.websiteUrl,
      tier: sponsor.tier,
      display_order: sponsor.displayOrder || 0,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating sponsor:", error);
    throw error;
  }

  return data;
}

export async function updateSponsor(
  id: number,
  updates: {
    name?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    tier?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl;
  if (updates.websiteUrl !== undefined) updateData.website_url = updates.websiteUrl;
  if (updates.tier !== undefined) updateData.tier = updates.tier;
  if (updates.displayOrder !== undefined) updateData.display_order = updates.displayOrder;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating sponsor:", error);
    throw error;
  }

  return data;
}

export async function deleteSponsor(id: number) {
  const { error } = await supabaseAdmin.from("sponsors").delete().eq("id", id);

  if (error) {
    console.error("Error deleting sponsor:", error);
    throw error;
  }

  return { success: true };
}

// ===== Additional CRUD Operations =====

export async function declineTeamInvitation(invitationId: number) {
  const { error } = await supabaseAdmin
    .from("team_invitations")
    .update({ status: "declined" })
    .eq("id", invitationId);

  if (error) {
    console.error("Error declining team invitation:", error);
    throw error;
  }

  return { success: true };
}

export async function declineConnectionRequest(requestId: number) {
  const { error } = await supabaseAdmin
    .from("connection_requests")
    .update({ status: "declined" })
    .eq("id", requestId);

  if (error) {
    console.error("Error declining connection request:", error);
    throw error;
  }

  return { success: true };
}

export async function deleteResource(id: number) {
  const { error } = await supabaseAdmin
    .from("resources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }

  return { success: true };
}

export async function updateAnnouncement(id: number, updates: {
  title?: string;
  content?: string;
  category?: string;
  is_pinned?: boolean;
}) {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }

  return data;
}

export async function deleteAnnouncement(id: number) {
  const { error } = await supabaseAdmin
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }

  return { success: true };
}

// ============================================
// Judge Functions
// ============================================

export async function getAllParticipantsForJudges() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, skills, bio, github_url, linkedin_url, portfolio_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching participants for judges:", error);
    throw error;
  }

  // Extract username/handle from social URLs
  const participants = data?.map(user => {
    let github_username = null;
    if (user.github_url) {
      const githubMatch = user.github_url.match(/github\.com\/([^\/\?]+)/i);
      if (githubMatch) github_username = githubMatch[1];
    }

    let linkedin_username = null;
    if (user.linkedin_url) {
      const linkedinMatch = user.linkedin_url.match(/linkedin\.com\/in\/([^\/\?]+)/i);
      if (linkedinMatch) linkedin_username = linkedinMatch[1];
    }

    return {
      ...user,
      github_username,
      linkedin_username,
      portfolio_url: user.portfolio_url,
    };
  }) || [];

  return participants;
}

export async function getJudgeAnnouncements() {
  const { data, error } = await supabaseAdmin
    .from("judge_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching judge announcements:", error);
    throw error;
  }

  return data || [];
}

export async function createJudgeAnnouncement(title: string, content: string, postedById: number) {
  const { data, error } = await supabaseAdmin
    .from("judge_announcements")
    .insert({
      title,
      content,
      posted_by_id: postedById,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating judge announcement:", error);
    throw error;
  }

  return data;
}

// ============================================
// Winners Functions
// ============================================

export async function getAllWinners() {
  const { data, error } = await supabaseAdmin
    .from("winners")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching winners:", error);
    throw error;
  }

  return data || [];
}

export async function createWinner(winnerData: {
  teamName: string;
  projectTitle: string;
  projectDescription: string;
  prizeCategory: string;
  prizeAmount?: string;
  projectImageUrl?: string;
  devpostUrl?: string;
  githubUrl?: string;
  teamMembers?: string[];
  displayOrder?: number;
}) {
  const { data, error} = await supabaseAdmin
    .from("winners")
    .insert({
      team_name: winnerData.teamName,
      project_title: winnerData.projectTitle,
      project_description: winnerData.projectDescription,
      prize_category: winnerData.prizeCategory,
      prize_amount: winnerData.prizeAmount,
      project_image_url: winnerData.projectImageUrl,
      devpost_url: winnerData.devpostUrl,
      github_url: winnerData.githubUrl,
      team_members: winnerData.teamMembers || [],
      display_order: winnerData.displayOrder || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating winner:", error);
    throw error;
  }

  return data;
}

export async function updateWinner(id: number, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("winners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating winner:", error);
    throw error;
  }

  return data;
}

export async function deleteWinner(id: number) {
  const { error } = await supabaseAdmin
    .from("winners")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting winner:", error);
    throw error;
  }

  return { success: true };
}
