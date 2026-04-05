# Authentication & Clerk

## Overview

All authentication in this project is handled by **Clerk** (`@clerk/nextjs 7.0.8`). No other authentication methods are used or permitted.

Clerk provides:
- User sign-in and sign-up flows (modals)
- Session management
- User data access (email, name, avatar, etc.)
- Protected routes via middleware

> **CRITICAL**: User ID always comes from Clerk. Never trust `userId` from client code, form submissions, or URL parameters. Always retrieve it server-side using `auth()` or middleware.

### Key Files
- `app/layout.tsx` — ClerkProvider setup + header buttons
- `middleware.ts` — Route protection and redirects (needs to be created)
- Environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

---

## Environment Setup

Add these to your `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Optional: Custom redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

---

## Architecture

### ClerkProvider Wrapper

The root layout must wrap your entire app with `<ClerkProvider>`:

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### Sign In / Sign Up (Modal)

Use Clerk's `<SignInButton>` and `<SignUpButton>` components to launch modals:

```typescript
// ✅ Launches a modal when clicked
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function AuthButtons() {
  return (
    <div className="flex gap-2">
      <SignInButton />
      <SignUpButton />
    </div>
  );
}
```

**Key options**:
```typescript
<SignInButton
  mode="modal"              // Modal mode (default)
  redirectUrl="/dashboard"  // Redirect after sign-in
  signUpUrl="/sign-up"      // Custom sign-up URL for modal
/>
```

### Conditional Rendering (Show Component)

Show content based on auth state:

```typescript
import { Show } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <Show when="signed-out">
        {/* Only visible when logged out */}
        <SignInButton />
        <SignUpButton />
      </Show>

      <Show when="signed-in">
        {/* Only visible when logged in */}
        <UserButton />
      </Show>
    </header>
  );
}
```

---

## Getting User ID

### In Server Components

Use `auth()` from `@clerk/nextjs`:

```typescript
// ✅ Server Component
import { auth } from "@clerk/nextjs";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Use userId for database queries
  const links = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId));

  return <div>{links.length} links</div>;
}
```

### In Client Components

Use `useUser()` hook:

```typescript
// ✅ Client Component
"use client";

import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return <div>Welcome, {user.firstName}</div>;
}
```

### In Server Actions

Get `userId` from `auth()` at the start:

```typescript
// ✅ Server Action
"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(url: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Safe to use userId now
  await db.insert(links).values({
    userId,
    originalUrl: url,
    shortCode: generateShortCode(),
  });
}
```

---

## Protected Routes

### Dashboard (/dashboard)

The `/dashboard` route is **protected** — only logged-in users can access it.

**Structure**:
```
app/
  dashboard/
    page.tsx
    layout.tsx
```

**Implementation** (`app/dashboard/page.tsx`):
```typescript
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  return <div>Dashboard Content</div>;
}
```

Or use middleware for centralized protection (see below).

---

## Middleware Setup

Create `middleware.ts` in the root to:
1. Protect `/dashboard` route
2. Redirect logged-in users from `/` to `/dashboard`

**Create** `middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId } = auth();

  // Protect /dashboard
  if (isProtectedRoute(req)) {
    if (!userId) {
      return auth().redirectToSignIn();
    }
  }

  // Redirect logged-in users from home to dashboard
  if (req.nextUrl.pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Include everything except:
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always include API routes
    "/(api|trpc)(.*)",
  ],
};
```

### What This Does

1. **Protected Routes**: `/dashboard` and sub-routes (e.g., `/dashboard/statistics`) require login
2. **Redirect to Sign-In**: Unauthenticated users trying to access `/dashboard` are redirected to sign-in
3. **Homepage Redirect**: Logged-in users accessing `/` are redirected to `/dashboard`
4. **Sign-In Modal**: Redirects use Clerk's built-in modal flow

---

## UserButton Component

The `<UserButton />` component displays the logged-in user's avatar and opens a menu:

```typescript
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <UserButton />
    </header>
  );
}
```

**Customize it**:
```typescript
<UserButton
  appearance={{
    elements: {
      avatarBox: "w-10 h-10 rounded-full",
    },
  }}
  afterSignOutUrl="/"  // Redirect after sign-out
  userProfileMode="modal"  // Open profile in modal
/>
```

---

## Common Patterns

### Verify User Owns a Resource

Always check `userId` matches before deleting/updating:

```typescript
// ❌ WRONG - doesn't verify ownership
await db.delete(links).where(eq(links.id, linkId));

// ✅ CORRECT - verifies user owns the link
const { userId } = await auth();
await db
  .delete(links)
  .where(
    and(
      eq(links.id, linkId),
      eq(links.userId, userId)  // Ownership check
    )
  );
```

### Fetch User Data in Server Component

```typescript
import { currentUser } from "@clerk/nextjs";

export default async function Profile() {
  const user = await currentUser();

  if (!user) throw new Error("Not authenticated");

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddresses[0].emailAddress}</p>
      {user.profileImageUrl && (
        <img src={user.profileImageUrl} alt="Profile" />
      )}
    </div>
  );
}
```

### Combine with Database Operations

```typescript
import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Fetch user's links
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return (
    <div>
      <h1>Your Links</h1>
      <ul>
        {userLinks.map((link) => (
          <li key={link.id}>{link.originalUrl}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API Routes

Protect API routes using `auth()`:

```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's links...
  return NextResponse.json({ links: [] });
}
```

---

## Session & Tokens

### Accessing Session Data

```typescript
import { auth } from "@clerk/nextjs";

export default async function Component() {
  const { userId, sessionId } = await auth();

  return <div>User: {userId}, Session: {sessionId}</div>;
}
```

### JWT Token

Get the user's JWT for calling external APIs:

```typescript
const { getToken } = await auth();
const token = await getToken();

// Use token to call external API
const response = await fetch("https://api.example.com", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## Testing

When testing, mock Clerk's `auth()`:

```typescript
// ✅ Mock auth() for tests
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn(() => ({
    userId: "user_test123",
    sessionId: "session_test123",
  })),
}));

describe("Dashboard", () => {
  it("shows user links", async () => {
    const { userId } = await auth();
    expect(userId).toBe("user_test123");
  });
});
```

---

## Troubleshooting

### Sign-In Button Not Working

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. Ensure `ClerkProvider` wraps the entire app in `layout.tsx`
3. Check that you're NOT using `redirect()` in a Client Component

### User ID is Undefined

```typescript
// ❌ WRONG - calling from client
const { userId } = await auth(); // undefined!

// ✅ CORRECT - call from server component or action
"use server";
const { userId } = await auth(); // works!
```

### Infinite Redirects on Homepage

1. Check middleware logic — ensure `/dashboard` redirect only happens for logged-in users
2. Make sure `/sign-in` and `/sign-up` are NOT in the protected routes list
3. Verify `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard` (optional but recommended)

---

## Anti-Patterns

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| Trust `userId` from `req.body` | Get from `auth()` server-side |
| Use `useUser()` for database queries | Fetch server-side in `auth()` |
| Hardcode user ID in components | Always retrieve from `auth()` |
| Skip ownership checks on delete | Always verify `userId` matches |
| Redirect in Client Component | Use `redirect()` in Server Components or middleware |
| Store secrets in client code | Use environment variables for `CLERK_SECRET_KEY` |

---

## Quick Reference

| Task | Code |
|------|------|
| Get User ID | `const { userId } = await auth();` (Server) |
| Get User Object | `const user = await currentUser();` (Server) |
| Check if Logged In | `const { userId } = await auth(); if (!userId) { ... }` |
| Show Content When Signed Out | `<Show when="signed-out">...</Show>` |
| Show Content When Signed In | `<Show when="signed-in">...</Show>` |
| Launch Sign-In Modal | `<SignInButton mode="modal" />` |
| Protect a Route | Use `middleware.ts` with `clerkMiddleware()` |
| Verify User Owns Resource | `where(and(eq(id, resourceId), eq(userId, userId)))` |
| Redirect After Auth | Set `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` env var |

---

## References

- [Clerk Docs: Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Docs: Middleware](https://clerk.com/docs/references/nextjs/clerkMiddleware)
- [Clerk Docs: Auth Context](https://clerk.com/docs/references/nextjs/auth)
- [Clerk Docs: useUser Hook](https://clerk.com/docs/references/react/use-user)

---

**Last Updated**: April 4, 2026  
**Tech Stack**: Clerk @clerk/nextjs 7.0.8
