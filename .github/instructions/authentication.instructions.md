---
name: authentication
description: "Use when: implementing Clerk authentication, protecting routes, verifying user identity, working with access control, or handling authenticated data. Covers Clerk setup, server-side auth verification, user ID retrieval, and route protection patterns."
applyTo: ["**/auth*.ts", "**/auth*.tsx", "**/*middleware*.ts", "**/*proxy*.ts", "**/page.tsx", "**/layout.tsx", "app/dashboard/**"]
---

# Authentication & Clerk Standards

## Overview

All authentication in this project is handled by **Clerk** (`@clerk/nextjs 7.0.8`). User ID always comes from Clerk on the server—never trust `userId` from client code, form submissions, or URL parameters.

## Key Principles

1. **User ID verification on server only**
   - Never pass user ID from client to server in request bodies
   - Always retrieve via `auth()` in Server Components or API routes
   - Verify user ownership for database operations

2. **Route protection**
   - Use `proxy.ts` for Clerk authentication and redirects (middleware is deprecated in Next.js 16.2.2)
   - Call `await auth()` in Server Components to check `userId`
   - Redirect to home if not authenticated

3. **Clerk API usage**
   - `auth()` in Server Components to get `{ userId }`
   - `useUser()` hook in Client Components to get user data
   - Never expose Clerk secret key in client code

## Environment Variables

```env
# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Custom redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Common Patterns

### Get User ID in Server Component

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");  // Redirect if not authenticated
  }

  // Use userId for database queries
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return <div>{userLinks.length} links</div>;
}
```

### Get User Data in Client Component

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return <p>Welcome, {user?.firstName}!</p>;
}
```

### Server Action with Auth Verification

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(url: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // Proceed with database operation
  const result = await db.insert(links).values({
    userId,
    url,
  });

  return { success: true, data: result };
}
```

### Database Operation with Ownership Verification

```typescript
export async function deleteLink(linkId: number, userId: string) {
  // ALWAYS verify user owns this link
  const deleted = await db
    .delete(links)
    .where(
      and(
        eq(links.id, linkId),
        eq(links.userId, userId)  // Ownership check
      )
    );

  if (!deleted.rowCount) {
    throw new Error("Link not found or unauthorized");
  }

  return deleted;
}
```

### Protected Route with Redirect

```typescript
export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <Dashboard />;
}
```

## Anti-Patterns to Avoid

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| Trust `req.body.userId` from client | Use `auth().userId` on server |
| Store userId in state without verification | Get userId from `auth()` or Clerk API |
| Skip ownership checks on delete/update | Always verify `eq(links.userId, userId)` |
| Pass userId as URL param only | Verify on server even if in URL |
| Use client-side auth for protected data | Verify on server before returning data |

## 🚨 Critical Rules

1. **NEVER use `middleware.ts`** — it is deprecated in Next.js 16.2.2. Use `proxy.ts` instead.
2. **ALWAYS verify user ownership** before database mutations (delete, update).
3. **NEVER trust client-provided user IDs** — retrieve from `auth()` server-side.
4. **ALWAYS check `userId` exists** before using it in queries.

---

**Last Updated**: April 12, 2026  
**Auth Provider**: Clerk (@clerk/nextjs 7.0.8)  
**Framework**: Next.js 16.2.2 (App Router)
