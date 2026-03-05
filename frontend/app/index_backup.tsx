import { Redirect } from "expo-router";

/**
 * Root Redirect
 * GourmetFlow starts with Tenant Discovery.
 * We redirect / to /auth to enter the SaaS onboarding flow.
 */
export default function Index() {
  return <Redirect href="/auth" />;
}
