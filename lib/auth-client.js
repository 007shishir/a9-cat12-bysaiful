import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use the NEXT_PUBLIC_BETTER_AUTH_URL environment variable if set, otherwise default to relative path
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined
});