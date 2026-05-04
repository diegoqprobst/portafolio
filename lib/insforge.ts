import { createClient } from "@insforge/sdk";

let _client: ReturnType<typeof createClient> | null = null;

export function getInsforge() {
  if (!_client) {
    const baseUrl = process.env.INSFORGE_URL;
    const anonKey = process.env.INSFORGE_ANON_KEY;
    if (!baseUrl) throw new Error("INSFORGE_URL is not set");
    _client = createClient({ baseUrl, anonKey });
  }
  return _client;
}

export const insforge = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getInsforge()[prop as keyof ReturnType<typeof createClient>];
  },
});
