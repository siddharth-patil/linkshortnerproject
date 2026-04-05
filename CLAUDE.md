# Coding Standards for Link Shortener Project

## 📋 How to Use These Instructions

This document and the `/docs` folder contain comprehensive coding standards and best practices for this project. They are designed to guide LLMs (like Claude Copilot) in adhering to consistent, high-quality code patterns.

### Start Here: AGENTS.md

Read [AGENTS.md](./AGENTS.md) for the complete project overview and quick reference. It points to specific domain guides below.

### Domain-Specific Guides

Each guide covers a specific aspect of the project in depth:

1. **[Architecture](./docs/architecture.md)** — Project structure, tech stack, directory layout
2. **[TypeScript Standards](./docs/typescript-standards.md)** — Type safety, compiler settings, naming
3. **[React & Next.js](./docs/react-nextjs.md)** — Components, Server/Client boundaries, data fetching
4. **[Database & Drizzle ORM](./docs/database.md)** — Schema, queries, migrations, best practices
5. **[Components](./docs/components.md)** — shadcn/ui, forms, styling, accessibility
6. **[Authentication & Clerk](./docs/authentication.md)** — User auth, protected routes, middleware
7. **[Code Style](./docs/code-style.md)** — Formatting, imports, comments, security
8. **[Testing](./docs/testing.md)** — Unit, integration, and E2E test strategies

---

## 🚀 Quick Start for Developers

### Before Coding
1. Read [AGENTS.md](./AGENTS.md) - gives you the full picture
2. Based on your task, read the relevant domain guide(s)
3. Check the anti-patterns section to avoid common mistakes

### When You Get Stuck
- **Need to write a component?** → Read [Components](./docs/components.md)
- **Database operation?** → Read [Database & Drizzle ORM](./docs/database.md)
- **TypeScript types?** → Read [TypeScript Standards](./docs/typescript-standards.md)
- **Auth integration?** → Read [Authentication & Clerk](./docs/authentication.md)
- **Need to format code?** → Read [Code Style](./docs/code-style.md)
- **Writing tests?** → Read [Testing Standards](./docs/testing.md)

---

## 🎯 Key Principles (TL;DR)

### 1. Server Components First
In `/app`, everything is a **Server Component** by default. Use `"use client"` only for interactive features.

```typescript
// ✅ Server Component (default) - fetches data
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Component - handles interaction
"use client";
export function Button() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Type Safety Always
TypeScript strict mode is enabled. No `any` types.

```typescript
// ✅ Explicit types
interface Link {
  id: number;
  originalUrl: string;
  shortCode: string;
}

// ✅ Function return types
function createLink(url: string): Promise<Link> { ... }

// ❌ Never do this
async function getData(): any { ... }
```

### 3. Verify User ID on Server
Always get user ID from `auth()`, never trust the client.

```typescript
// ✅ Server Component or Action
const { userId } = await auth();
if (!userId) throw new Error('Not authenticated');

const links = await db
  .select()
  .from(links_table)
  .where(eq(links_table.userId, userId));

// ❌ WRONG - trusting client
const userId = req.body.userId; // NEVER do this
```

### 4. Database with Drizzle ORM
Type-safe queries with Drizzle, always verify ownership.

```typescript
// ✅ Type-safe, with ownership check
await db
  .delete(links)
  .where(and(
    eq(links.id, linkId),
    eq(links.userId, userId)  // Prevent cross-user access
  ));

// ❌ WRONG - no ownership check
await db.delete(links).where(eq(links.id, linkId));
```

### 5. Use Shadcn/UI Components
Don't build custom buttons/inputs; use shadcn/ui.

```typescript
// ✅ Use shadcn/ui
import { Button } from "@/components/ui/button";
<Button onClick={handleClick}>Click me</Button>

// ❌ Don't build custom
<button className="...">Click me</button>
```

---

## 📦 Tech Stack

- **Next.js 16.2.2** — Full-stack React framework (App Router)
- **React 19.2.4** — UI library
- **TypeScript 5** — Type safety (strict mode)
- **Drizzle ORM** — Type-safe database queries
- **Neon Postgres** — Serverless database
- **Clerk** — User authentication
- **Tailwind CSS 4** — Styling
- **shadcn/ui** — Component library
- **ESLint 9** — Code linting

---

## 🔑 Environment Setup

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

---

## 📝 Common Code Patterns

### Create a Link (Full Flow)

**Server Component** (`app/create-link/page.tsx`):
```typescript
import { LinkForm } from "@/components/LinkForm";

export default function CreateLinkPage() {
  return (
    <div>
      <h1>Shorten Your Link</h1>
      <LinkForm />
    </div>
  );
}
```

**Client Component** (`components/LinkForm.tsx`):
```typescript
"use client";

import { createLink } from "@/lib/actions/links";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createLink(url);
      if (result.success) {
        alert("Link created!");
        setUrl("");
      } else {
        alert(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        type="url"
        placeholder="https://example.com"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Shorten"}
      </Button>
    </form>
  );
}
```

**Server Action** (`lib/actions/links.ts`):
```typescript
"use server";

import { auth } from "@clerk/nextjs";
import { createLinkInDB } from "@/lib/db/links";

export async function createLink(
  url: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  if (!isValidUrl(url)) {
    return { success: false, error: "Invalid URL" };
  }

  try {
    await createLinkInDB(userId, url);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create link" };
  }
}
```

**Database Operation** (`lib/db/links.ts`):
```typescript
import { db } from "@/db";
import { links } from "@/db/schema";
import { generateShortCode } from "@/lib/utils";
import type { Link } from "@/db/schema";

export async function createLinkInDB(
  userId: string,
  originalUrl: string
): Promise<Link> {
  const shortCode = generateShortCode();

  const result = await db
    .insert(links)
    .values({
      userId,
      originalUrl,
      shortCode,
    })
    .returning();

  return result[0];
}
```

---

## ✅ Code Review Checklist

Before committing:
- [ ] `npm run lint` passes
- [ ] No `any` types
- [ ] User ID verified on server (not trusted from client)
- [ ] Database operations check user ownership
- [ ] Error handling is present
- [ ] Components are Server/Client separated correctly
- [ ] Comments explain "why", not "what"
- [ ] No console.logs in production code
- [ ] Tests included for critical functions
- [ ] Imports are alphabetized

---

## 🚫 Never Do This

| Don't | Do |
|------|-----|
| `const data: any = ...` | `const data: LinkData = ...` |
| Trust `req.body.userId` | Use `auth().userId` on server |
| Client-side fetch to database | Use Server Actions or API routes |
| `useEffect` in Server Component | Direct `async` in component |
| Hard-code secrets | Use environment variables |
| Skip error handling | Return meaningful error messages |
| Unvalidated user input | Validate and sanitize |
| Prop drill 7+ levels | Compose components or use context |
| Custom button component | Import from `@/components/ui/button` |

---

## 📚 Full Documentation

For deep dives into any topic, see the `/docs` folder:
- [Architecture](./docs/architecture.md)
- [TypeScript Standards](./docs/typescript-standards.md)
- [React & Next.js](./docs/react-nextjs.md)
- [Database & Drizzle ORM](./docs/database.md)
- [Components](./docs/components.md)
- [Authentication & Clerk](./docs/authentication.md)
- [Code Style](./docs/code-style.md)
- [Testing](./docs/testing.md)

---

**Last Updated**: April 4, 2026  
**Project**: Link Shortener  
**Framework**: Next.js 16.2.2 (App Router)  
**Language**: TypeScript 5 (strict mode)
