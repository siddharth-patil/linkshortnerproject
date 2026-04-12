---
name: ui-components
description: "Use when: building UI components, creating forms, styling interfaces, designing dialogs or modals, working with buttons/inputs, or any visual elements. Enforces shadcn/ui for all UI components—no custom implementations."
applyTo: ["components/**/*.tsx", "app/**/*.tsx", "**/*.tsx"]
---

# shadcn/ui Component Standards

## Overview

This project **exclusively uses shadcn/ui components** for all UI elements. Never build custom components—always prefer shadcn/ui. This ensures consistency, accessibility, and maintainability across the application.

**Golden Rule**: "I need a button" → `import { Button } from '@/components/ui/button'`. Never build custom.

## Why shadcn/ui?

- **Type-Safe**: Full TypeScript support
- **Accessible**: Built on Radix UI with WCAG compliance
- **Themeable**: Tailwind CSS + CSS variables for easy customization
- **Composable**: Regular utilities for combining components
- **Predictable**: Consistent API across all components

## Import Pattern

All shadcn/ui components are in `/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
```

## Common Components

| Component | Use Case | Path |
|-----------|----------|------|
| `Button` | Any button (primary, secondary, ghost, etc.) | `@/components/ui/button` |
| `Input` | Text, email, password fields | `@/components/ui/input` |
| `Card` | Content containers | `@/components/ui/card` |
| `Dialog` | Modal dialogs | `@/components/ui/dialog` |
| `Select` | Dropdown selectors | `@/components/ui/select` |
| `Badge` | Tags and labels | `@/components/ui/badge` |
| `Label` | Form labels | `@/components/ui/label` |
| `Textarea` | Multi-line text input | `@/components/ui/textarea` |
| `Form` | Form handling + validation | `@/components/ui/form` |
| `Alert` | Alert messages | `@/components/ui/alert` |

## Usage Examples

### Simple Button

```typescript
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div className="flex gap-2">
      <Button>Click me</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
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
        <p className="text-sm text-gray-500">
          Short code: {link.shortCode}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Form with Validation

```typescript
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

export function LinkForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input 
                  type="url"
                  placeholder="https://example.com" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create Link</Button>
      </form>
    </Form>
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

export function DeleteLinkDialog({ linkId, onDelete }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The link will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive" onClick={() => onDelete(linkId)}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Badge Component

```typescript
import { Badge } from "@/components/ui/badge";

export function LinkStatus({ status }) {
  return (
    <div className="flex gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
```

## Button Variants

shadcn/ui Button supports multiple variants for different contexts:

```typescript
<Button variant="default">Default (Primary)</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete (Red)</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
```

## Badge Variants

```typescript
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Styling & Customization

All components use **Tailwind CSS** via `className`. Override or extend styles:

```typescript
import { Button } from "@/components/ui/button";

export function CustomButton() {
  return (
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      Full-width Custom Button
    </Button>
  );
}
```

## Adding a New Component

If you need a component that doesn't exist in `/components/ui/`:

1. Check the [shadcn/ui registry](https://ui.shadcn.com/docs/components)
2. Install via CLI:
   ```bash
   npx shadcn@latest add <component-name>
   ```
   Example: `npx shadcn@latest add dialog`
3. Import and use in your code

## Accessibility Best Practices

shadcn/ui components are built on Radix UI with accessibility first:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

Always maintain this by:
- Using semantic HTML
- Providing descriptive labels
- Testing with keyboard navigation
- Checking color contrast ratios

## Anti-Patterns to Avoid

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| Build custom button | Import `Button` from `@/components/ui/button` |
| Inline `<input>` | Use `Input` from `@/components/ui/input` |
| Custom dialog HTML | Use `Dialog` from `@/components/ui/dialog` |
| `<div>` for cards | Use `Card`, `CardHeader`, `CardContent` |
| Unstructured forms | Use `Form` with `FormField` and validation |
| Missing labels | Always pair inputs with `Label` component |

## 🚨 Critical Rules

1. **NEVER build custom components** — always check shadcn/ui first
2. **ALWAYS use shadcn/ui** for buttons, inputs, cards, dialogs, and all UI elements
3. **MAINTAIN accessibility** — use semantic components and proper ARIA
4. **EXTEND via className** — use Tailwind CSS for customization, not inline styles

---

**Last Updated**: April 12, 2026  
**Component Library**: shadcn/ui 4.2.0  
**Styling**: Tailwind CSS 4  
**Accessibility**: Radix UI based (WCAG compliant)
