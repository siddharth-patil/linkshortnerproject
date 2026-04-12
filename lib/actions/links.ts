"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createLink as createLinkInDb,
  updateLink as updateLinkInDb,
  deleteLink as deleteLinkInDb,
} from "@/lib/db/links";
import { revalidatePath } from "next/cache";

export async function createLink(url: string): Promise<{
  success: boolean;
  shortCode?: string;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return { success: false, error: "Invalid URL format" };
  }

  try {
    const link = await createLinkInDb(userId, url);
    revalidatePath("/dashboard");
    return { success: true, shortCode: link.shortCode };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, error: "Failed to create link. Please try again." };
  }
}

export async function updateLink(
  linkId: number,
  url: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return { success: false, error: "Invalid URL format" };
  }

  try {
    await updateLinkInDb(userId, linkId, url);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link. Please try again." };
  }
}

export async function deleteLink(linkId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await deleteLinkInDb(userId, linkId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link. Please try again." };
  }
}
