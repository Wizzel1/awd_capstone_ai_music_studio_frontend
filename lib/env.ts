import { z } from "zod";

/**
 * Environment Variables Configuration
 */

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

function createEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errorTree = z.treeifyError(parsed.error);
    throw new Error(JSON.stringify(errorTree.properties, null, 2));
  }

  return parsed.data;
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
