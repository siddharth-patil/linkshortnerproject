# shadcn/ui Component Standards

## Overview

This project **exclusively uses shadcn/ui components** for all UI elements. Do not create custom components—always prefer shadcn/ui. This ensures consistency, accessibility, and maintainability across the application.

> **GOLDEN RULE**: "I need a button" → `import { Button } from '@/components/ui/button'`. Never build custom.

## Why shadcn/ui?

- **Type-Safe**: Full TypeScript support
- **Accessible**: Built on Radix UI (a11y-first)
- **Themeable**: Tailwind CSS + CSS variables
- **Composable**: Utilities for combining components
- **Predictable**: Consistent API across all components

## Import Pattern

All shadcn/ui components are in `/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

## Common Components

| Component | Use Case | Import |
|-----------|----------|--------|
| `Button` | Any button (primary, secondary, ghost, etc.) | `@/components/ui/button` |
| `Input` | Text, email, password fields | `@/components/ui/input` |
| `Card` | Content containers | `@/components/ui/card` |
| `Dialog` | Modal dialogs | `@/components/ui/dialog` |
| `Dropdown Menu` | Context/action menus | `@/components/ui/dropdown-menu` |
| `Form` | Form handling + validation | `@/components/ui/form` |
| `Select` | Dropdown selectors | `@/components/ui/select` |
| `Textarea` | Multi-line text input | `@/components/ui/textarea` |
| `Toast` | Notifications | `@/components/ui/toast` |
| `Table` | Data tables | `@/components/ui/table` |
| `Tabs` | Tab navigation | `@/components/ui/tabs` |
| `Label` | Form labels | `@/components/ui/label` |
| `Badge` | Tags/labels | `@/components/ui/badge` |
| `Alert` | Alert messages | `@/components/ui/alert` |

## Usage Examples

### Simple Button

```typescript
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Button onClick={() => alert("Clicked!")}>
      Click me
    </Button>
  );
}
```

### Form with Validation

```typescript
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

export function LinkForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          rule={{ required: "URL is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter URL..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
```

### Card with Content

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LinkCard({ link }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{link.originalUrl}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Short code: {link.shortCode}</p>
      </CardContent>
    </Card>
  );
}
```

### Dialog Modal

```typescript
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmDelete() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogContent>
    </Dialog>
  );
}
```

## Button Variants

shadcn/ui Button has multiple variants for different contexts:

```typescript
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>
```

## Adding a New Component

If you need a component that doesn't exist in `/components/ui/`:

1. Check the [shadcn/ui component registry](https://ui.shadcn.com/docs/components) to see if it exists
2. Use the CLI to add it:
   ```bash
   npx shadcn-ui@latest add <component-name>
   ```
   Example: `npx shadcn-ui@latest add dialog`
3. Import and use it in your code

## Styling & Customization

All components use **Tailwind CSS** via className. Override styles with Tailwind classes:

```typescript
import { Button } from "@/components/ui/button";

export function MyButton() {
  return (
    <Button className="w-full bg-blue-600 hover:bg-blue-700">
      Full-width Button
    </Button>
  );
}
```

## Accessibility

shadcn/ui components are built on Radix UI with accessibility baked in:
- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

Always maintain this by:
- Using semantic HTML
- Providing labels for form inputs
- Including alt text for images
- Testing with keyboard navigation

## Anti-Patterns

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| Building a custom button | Use `<Button>` from shadcn/ui |
| Styling with inline styles | Use Tailwind className |
| Hardcoding colors | Use Tailwind color utilities |
| Creating custom form fields | Use shadcn/ui `Form` + `Input` |
| Skipping labels on inputs | Always add `<Label>` + input |
| Using `<div>` as modal | Use shadcn/ui `<Dialog>` |

## Integration with Next.js & Clerk

When using shadcn/ui with Clerk and Next.js:

```typescript
// ✅ Client Component with shadcn/ui
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export function SignOutButton() {
  const { user } = useUser();

  return (
    <Button variant="outline" onClick={() => signOut()}>
      Sign out {user?.firstName}
    </Button>
  );
}
```

---

**Key Takeaway**: When in doubt, reach for shadcn/ui. It's the canonical component library for this project. Never reinvent the wheel with custom CSS or unstyled HTML.
