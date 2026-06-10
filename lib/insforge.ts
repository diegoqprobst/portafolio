import { createClient } from "@insforge/sdk";

let _client: ReturnType<typeof createClient> | null = null;

export function getInsforge() {
  if (!_client) {
    const baseUrl = process.env.INSFORGE_URL;
    // Server-only client. We send the full-access admin key (project_admin role,
    // which bypasses RLS) instead of the public anon key, because every DB access
    // is server-side and already gated by our own admin/JWT auth. With RLS enabled
    // and the anon role denied, an exposed anon key can no longer read or write.
    // The SDK puts whatever token we pass here in `Authorization: Bearer …`, so
    // the admin key goes in the `anonKey` slot. Fall back to the anon key so the
    // app keeps working before INSFORGE_API_KEY is provisioned.
    const key = process.env.INSFORGE_API_KEY || process.env.INSFORGE_ANON_KEY;
    if (!baseUrl) throw new Error("INSFORGE_URL is not set");
    _client = createClient({ baseUrl, anonKey: key });
  }
  return _client;
}

export const insforge = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getInsforge()[prop as keyof ReturnType<typeof createClient>];
  },
});
