import { getSessionUser } from "@/lib/auth";
import { LandingClient } from "./landing-client";

export default async function LandingPage() {
  const user = await getSessionUser();
  return <LandingClient signedIn={Boolean(user)} />;
}
