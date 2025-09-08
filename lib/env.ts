function createEnv() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!NEXT_PUBLIC_API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return { NEXT_PUBLIC_API_URL };
}

export const ENV = createEnv();

/**
 * Helper function to get API endpoint URLs
 */
type Version = "v1" | "v2";
export const getApiUrl = (endpoint: string, version: Version = "v1") => {
  const baseUrl = ENV.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}/api/${version}${cleanEndpoint}`;
};
