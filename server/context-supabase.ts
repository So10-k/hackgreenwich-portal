import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifySupabaseToken } from "./auth-supabase";

export type User = {
  id: number;
  authId: string;
  email: string;
  name?: string;
  role: string;
  portalAccessGranted: boolean;
  registrationStep: number;
};

export type TrpcContextSupabase = {
  user: User | null;
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
};

export async function createContextSupabase({
  req,
  res,
}: CreateExpressContextOptions): Promise<TrpcContextSupabase> {
  let user: User | null = null;

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    user = await verifySupabaseToken(token);
  }

  return {
    user,
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContextSupabase>;
