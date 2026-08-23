import { Folder, Tag as TagIcon } from "lucide-react";

import { Badge } from "@qr-manager/ui/components/badge";
import { cn } from "@qr-manager/ui/lib/utils";

interface TaxonomyRef {
  id: string;
  name: string;
}

/**
 * How a code is filed, as badges. Renders nothing when it is filed nowhere,
 * so an untagged code costs no vertical space in the list.
 *
 * The category leads and carries a folder icon; tags follow in a lighter
 * variant. The two are different kinds of thing -- one place versus many
 * labels -- and looking identical would invite reading them as one list.
 */
export function CodeTaxonomy({
  category,
  tags,
  className,
}: {
  category: TaxonomyRef | null;
  tags: TaxonomyRef[];
  className?: string;
}) {
  if (!category && tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {category && (
        <Badge variant="outline">
          <Folder />
          {category.name}
        </Badge>
      )}
      {tags.map((tag) => (
        <Badge key={tag.id} variant="ghost">
          <TagIcon />
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
