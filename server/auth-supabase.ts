import { supabaseAdmin } from "./supabase-admin";
import { getUserByAuthId, createOrUpdateUser } from "./db-supabase";

export async function verifySupabaseToken(token: string) {
  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Get or create user profile
    let userProfile = await getUserByAuthId(user.id);

    if (!userProfile) {
      userProfile = await createOrUpdateUser(user.id, user.email || "", user.user_metadata?.name);
    }

    return {
      id: userProfile.id,
      authId: user.id,
      email: user.email || "",
      name: userProfile.name,
      role: userProfile.role,
      portalAccessGranted: userProfile.portal_access_granted,
      registrationStep: userProfile.registration_step,
    };
  } catch (error) {
    console.error("Error verifying Supabase token:", error);
    return null;
  }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("User creation failed");
    }

    // Create user profile
    const userProfile = await createOrUpdateUser(data.user.id, email, name);

    return {
      user: data.user,
      userProfile,
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export async function updatePassword(userId: string, password: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}
