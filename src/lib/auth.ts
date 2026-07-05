import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

const SESSION_COOKIE = "carddrop_session";
const SESSION_DAYS = 30;

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");
}

export type SessionUser = {
  id: string;
  email: string;
  username: string | null;
};

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const userId = payload.sub;
    if (!userId) return null;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError();
  return user;
}

export class AuthError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/** Derive a unique username from an email address. */
export async function deriveUsername(email: string): Promise<string> {
  const base =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24) || "user";
  let candidate = base;
  for (let i = 0; i < 20; i++) {
    const existing = await db.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${base}${randomBytes(2).toString("hex")}`;
  }
  return `${base}${randomBytes(4).toString("hex")}`;
}

export async function findOrCreateUser(email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) return existing;
  const username = await deriveUsername(normalized);
  return db.user.create({ data: { email: normalized, username } });
}
