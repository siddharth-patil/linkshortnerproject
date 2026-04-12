import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Link, LinkInsert } from "@/db/schema";

function generateShortCode(): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function getUserLinks(userId: string): Promise<Link[]> {
  if (!userId) {
    throw new Error("userId is required");
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return userLinks;
}

export async function createLink(
  userId: string,
  url: string
): Promise<Link> {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!url) {
    throw new Error("URL is required");
  }

  const shortCode = generateShortCode();

  const result = await db
    .insert(links)
    .values({
      userId,
      url,
      shortCode,
    } as LinkInsert)
    .returning();

  return result[0];
}

export async function updateLink(
  userId: string,
  linkId: number,
  url: string
): Promise<Link> {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!url) {
    throw new Error("URL is required");
  }

  const result = await db
    .update(links)
    .set({
      url,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  if (!result.length) {
    throw new Error("Link not found or unauthorized");
  }

  return result[0];
}

export async function deleteLink(
  userId: string,
  linkId: number
): Promise<void> {
  if (!userId) {
    throw new Error("userId is required");
  }

  const result = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  if (!result.length) {
    throw new Error("Link not found or unauthorized");
  }
}

export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  if (!shortCode) {
    throw new Error("shortCode is required");
  }

  const result = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return result.length ? result[0] : null;
}
