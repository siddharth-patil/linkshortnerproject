"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { DeleteLinkDialog } from "@/components/DeleteLinkDialog";
import type { Link } from "@/db/schema";

interface LinksListProps {
  links: Link[];
}

export function LinksList({ links }: LinksListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No links created yet. Start by shortening your first link!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <Card key={link.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-base truncate">{link.url}</CardTitle>
              <Badge variant="secondary">{link.shortCode}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500">
              Created {new Date(link.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <EditLinkDialog link={link} />
              <DeleteLinkDialog link={link} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
