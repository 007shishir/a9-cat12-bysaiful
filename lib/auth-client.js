import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // DO NOT point this to your backend server URL!
  // Leaving baseURL empty or setting it to your frontend domain makes it target Next.js internal api routes
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, 
});