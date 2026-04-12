"use client";

import { useState } from "react";
import { deleteLink } from "@/lib/actions/links";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Link } from "@/db/schema";

interface DeleteLinkDialogProps {
  link: Link;
  onSuccess?: () => void;
}

export function DeleteLinkDialog({ link, onSuccess }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteLink(link.id);

    if (result.success) {
      setOpen(false);
      onSuccess?.();
    } else {
      setError(result.error || "An error occurred");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 my-4">
          <p className="text-sm font-medium text-gray-700">Link details:</p>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 truncate">
              <span className="font-medium">URL:</span> {link.url}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Short Code:</span> {link.shortCode}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
