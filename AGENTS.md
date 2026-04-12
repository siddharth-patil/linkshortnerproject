# Link Shortener Project - Agent Instructions

⚠️ **READ THIS FIRST** ⚠️

**MANDATORY: ALWAYS READ THE RELEVANT DOCUMENTATION FILES IN `/docs/` DIRECTORY BEFORE GENERATING ANY CODE.** This is non-negotiable. No exceptions. Every single code generation must be preceded by reading the appropriate `.md` files from the `/docs` directory.

For detailed guidelines on specific topics, refer to the modular documentations in the '/docs' directory. **ALWAYS refer to the relevant .md file BEFORE generating any code:**

## Overview

This is a **Link Shortener** application built with **Next.js 16.2.2**, **React 19.2.4**, **TypeScript 5**, and **Drizzle ORM** on a **Neon Postgres** database. User authentication is managed by **Clerk**.

> **CRITICAL**: This uses Next.js App Router with Server Components as the default. Many patterns differ significantly from older Next.js versions. Before writing code, consult the [React & Next.js Standards](./docs/react-nextjs.md) guide.


## Quick Reference

### Tech Stack
- **Framework**: Next.js 16.2.2 (App Router)
- **Runtime**: React 19.2.4
- **Language**: TypeScript 5 (strict mode)
- **Database**: Drizzle ORM + Neon Postgres
- **Auth**: Clerk (@clerk/nextjs 7.0.8)
- **Styling**: Tailwind CSS 4 + shadcn/ui (see [shadcn/ui Standards](./docs/shadcn-ui.md))
- **Icons**: Lucide React
- **Linting**: ESLint 9

### Key Principles

1. **Server Components by Default**
   - All components in `/app` are Server Components unless explicitly marked with `"use client"`
   - Fetch data on the server; keep client components for interactivity only

2. **Type Safety First**
   - Strict TypeScript mode enabled
   - Never use `any`; always infer or define types explicitly
   - Use `import type` for TypeScript-only imports

3. **Database-First Design**
   - All database operations use Drizzle ORM with type safety
   - Always verify user ownership before deleting/updating records
   - Use Server Actions or API routes for mutations (never fetch on client)

4. **Authentication Every Time**
   - User ID comes from Clerk (`@clerk/nextjs`)
   - Every database operation that touches user data must verify `userId`
   - Use `auth()` in Server Components, `useUser()` in Client Components
   - See [Authentication & Clerk](./docs/authentication.md) guide for complete details

5. **Security by Default**
   - Never expose secrets in client code
   - Validate and sanitize all user input
   - Verify user authorization on the server, not the client

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React Components | PascalCase | `LinkCard.tsx`, `ShortenerForm.tsx` |
| Hooks | camelCase + `use` prefix | `useLinks.ts`, `useClerkAuth.ts` |
| Utilities | camelCase | `generateCode.ts`, `validateUrl.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_URL_LENGTH`, `REGEX_PATTERNS` |
| Database Ops | camelCase | `links.ts`, `operations.ts` |
| Server Actions | camelCase + `.ts` | `createLink.ts`, `deleteLink.ts` |
| Tests | `*.test.ts` or `*.spec.ts` | `links.test.ts`, `Button.test.tsx` |
| Types | `types.ts` or `schema.ts` | Define in `lib/types/` or `db/schema.ts` |

## Directory Organization

```
.
├── app/                    # Next.js App Router (Server Components)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/            # Route groups for auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/         # Protected routes
│   └── api/               # API endpoints
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   └── (feature)/         # Feature-specific components
├── db/                    # Database layer
│   ├── index.ts           # Drizzle instance export
│   ├── schema.ts          # Table definitions
│   └── operations/        # CRUD operations (organize by feature)
├── lib/                   # Utilities & helpers
│   ├── db/                # Database utilities
│   ├── actions/           # Server Actions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   ├── utils.ts           # General utilities
│   └── constants.ts       # App constants
├── public/                # Static assets
└── docs/                  # Agent instruction files (THIS)
```

## Common Workflows

### Creating a New Link
1. Create a Server Component in `/app` to show the form
2. Wrap form inputs in a Client Component (`LinkForm.tsx`)
3. Use a Server Action (`createLink()`) for form submission
4. Verify user is authenticated with `auth().userId`
5. Insert into database using Drizzle ORM (type-safe)
6. Return result or error to client

### Fetching User Links
1. In a Server Component, call `await auth()` to get `userId`
2. Query database with Drizzle: `db.select().from(links).where(eq(links.userId, userId))`
3. Pass data as props to Client Components for interactivity
4. Use `Suspense` for slow queries

### Protecting a Route
1. **⚠️ NEVER use `middleware.ts` — it is deprecated in Next.js 16.2.2.** Use `proxy.ts` instead for Clerk authentication.
2. Set up Clerk auth in `proxy.ts` to handle redirects and session verification
3. In Server Components, call `await auth()` to get `userId`
4. Throw error if not authenticated

### Adding a New Database Table
1. Define schema in `db/schema.ts`
2. Run `npx drizzle-kit generate --name=descriptive_name`
3. Run `npx drizzle-kit push` to apply migration
4. Create query functions in `db/operations/`
5. Use in Server Components or Server Actions

## ⚠️ MANDATORY: Before You Write Code

**YOU MUST COMPLETE THESE STEPS BEFORE GENERATING ANY CODE.** This is a hard requirement, not optional.

- [ ] **ALWAYS** Read the **Architecture** guide to understand the folder structure
- [ ] **ALWAYS** Read the **TypeScript Standards** guide for type safety
- [ ] **ALWAYS** Read the **React & Next.js Standards** guide for component patterns
- [ ] **ALWAYS** Read the **Code Style** guide for formatting and conventions
- [ ] If working with database: **MUST READ** the **Database & Drizzle ORM** guide
- [ ] If building components: **MUST READ** the [shadcn/ui Standards](./docs/shadcn-ui.md) guide ← **All UI uses shadcn/ui, no custom components**
- [ ] If building components: **MUST READ** the **Component Standards** guide
- [ ] If implementing auth: **MUST READ** the [Authentication & Clerk](./docs/authentication.md) guide ← **Clerk-only auth, protected /dashboard, modal flows**
- [ ] If writing tests: **MUST READ** the **Testing Standards** guide

**DO NOT SKIP THIS STEP. DO NOT GENERATE CODE WITHOUT READING THE RELEVANT FILES.**

## 🚫 Non-Negotiable Rules

1. **ALWAYS read the relevant `/docs/*.md` files BEFORE generating any code.** No exceptions.
2. **Never generate code without consulting the appropriate documentation guide first.**
3. **TypeScript strict mode is mandatory** — no `any` types allowed.
4. **User authentication must be verified on the server** — never trust client-side user IDs.
5. **Database operations must verify user ownership** — prevent cross-user access bugs.
6. **Server Components by default** — use `"use client"` only for interactive features.
7. **All UI components must use shadcn/ui** — no custom button/input components.
8. **🚨 NEVER use `middleware.ts`** — it is deprecated in Next.js 16.2.2. Use `proxy.ts` for Clerk authentication and route protection instead.

## Anti-Patterns to Avoid

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| `useEffect` + `fetch()` in Server Component | Direct `async/await` in component body |
| Passing user ID from client | Get from `auth()` on the server |
| Client-side database queries | Use Server Actions or API routes |
| Inline function definitions in JSX | Extract to separate function or Server Action |
| Prop drilling 5+ levels deep | Use Server Components composition or context |
| Using `any` type | Infer or explicitly define with `type` |
| Hardcoded secrets | Use environment variables |
| Trusting all user input | Validate and sanitize everything |
| No error handling in try/catch | Return meaningful error messages |
| `.map()` without keys | Always provide stable `key` prop |

## Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:password@host/database

# Optional: Clerk redirects
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Commands

```bash
# Development
npm run dev                    # Start dev server

# Linting
npm run lint                   # Check for ESLint violations

# Building
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx drizzle-kit generate      # Generate migrations
npx drizzle-kit push          # Apply migrations

# Testing
npm run test                   # Run unit tests
npm run test:watch            # Watch mode
npm run test:e2e              # Run E2E tests
```

## Code Review Checklist

Every PR should pass:
- [ ] `npm run lint` passes with no errors
- [ ] All TypeScript types are explicit (no `any`)
- [ ] Server/Client component boundaries are clear
- [ ] User authentication is verified for protected data
- [ ] Database operations verify user ownership
- [ ] Error messages are meaningful (not just generic)
- [ ] No console.logs in production code
- [ ] Components are reasonably small (<300 lines)
- [ ] Tests are included for new features

---

**Last Updated**: April 4, 2026  
**Framework**: Next.js 16.2.2 with App Router  
**Language**: TypeScript 5 (strict mode)
