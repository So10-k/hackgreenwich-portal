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
    .select("*, team(*), invited_by:invited_by_id(name, email)")
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
