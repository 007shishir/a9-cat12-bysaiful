import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Force the client to look inside your Next.js application, not the standalone server
  baseURL: "https://a9-cat12-bysaiful.vercel.app"
});