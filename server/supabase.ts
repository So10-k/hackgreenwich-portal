import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Sync user data to Supabase
 */
export async function syncUserToSupabase(userData: {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  registrationStep: number;
  devpostUsername: string | null;
  devpostVerified: boolean;
  portalAccessGranted: boolean;
  skills?: string[] | null;
  interests?: string[] | null;
  experienceLevel?: string | null;
  bio?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  lookingForTeam?: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const { data, error } = await supabase
    .from('hackgreenwich_users')
    .upsert({
      user_id: userData.id,
      open_id: userData.openId,
      name: userData.name,
      email: userData.email,
      registration_step: userData.registrationStep,
      devpost_username: userData.devpostUsername,
      devpost_verified: userData.devpostVerified,
      portal_access_granted: userData.portalAccessGranted,
      skills: userData.skills,
      interests: userData.interests,
      experience_level: userData.experienceLevel,
      bio: userData.bio,
      github_url: userData.githubUrl,
      linkedin_url: userData.linkedinUrl,
      portfolio_url: userData.portfolioUrl,
      looking_for_team: userData.lookingForTeam,
      created_at: userData.createdAt.toISOString(),
      updated_at: userData.updatedAt.toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error syncing to Supabase:', error);
    throw error;
  }

  return data;
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('hackgreenwich_users')
      .select('count')
      .limit(1);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
