import { z } from "zod";

/**
 * Environment Variables Configuration
 */

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3001"),
});

function createEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
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
