import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouterSupabase } from "../../../server/routers-supabase";

export const trpc = createTRPCReact<AppRouterSupabase>();

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        transformer: superjson,
        async headers() {
          // Get the token from Supabase
          const { supabase } = await import("./supabase");
          const {
            data: { session },
          } = await supabase.auth.getSession();

          return {
            authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
          };
        },
      }),
    ],
  });
}
