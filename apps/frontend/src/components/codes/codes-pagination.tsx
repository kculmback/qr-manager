import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@qr-manager/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@qr-manager/ui/components/pagination";

/** How many pages either side of the current one stay on the bar. */
const WINDOW = 1;

/**
 * The page numbers to draw, with `"gap"` standing in for the ones elided.
 *
 * The first and last are always offered, so however deep the list goes the
 * ends stay one click away. Everything in between collapses to a window around
 * where the reader is.
 */
function pageItems(page: number, pageCount: number): (number | "gap")[] {
  const shown = new Set<number>([1, pageCount]);

  for (let offset = -WINDOW; offset <= WINDOW; offset++) {
    const candidate = page + offset;
    if (candidate >= 1 && candidate <= pageCount) shown.add(candidate);
  }

  const items: (number | "gap")[] = [];
  let previous = 0;

  for (const value of [...shown].sort((a, b) => a - b)) {
    if (previous !== 0 && value - previous > 1) items.push("gap");
    items.push(value);
    previous = value;
  }

  return items;
}

/**
 * The pager under the codes list.
 *
 * Links rather than buttons, and `to="."` so the current search params carry
 * over: the page is one key in a URL that also holds the filter, and paging
 * must not silently drop the other. That also makes every page openable in a
 * new tab, which a click handler would not.
 *
 * `page` comes from the response, not the URL. The server clamps a page past
 * the end, so the two can differ for exactly one render after the list shrinks
 * under a bookmarked link -- and what is on screen is the honest answer.
 */
export function CodesPagination({
  page,
  pageCount,
  className,
}: {
  page: number;
  pageCount: number;
  className?: string;
}) {
  // One page is not a choice, so there is nothing to offer.
  if (pageCount <= 1) return null;

  const search = (next: number) => (previous: Record<string, unknown>) => ({
    ...previous,
    // Page 1 is the default, and a URL should not carry what it already means.
    page: next > 1 ? next : undefined,
  });

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go to previous page"
            disabled={page <= 1}
            nativeButton={page <= 1}
            render={
              page <= 1 ? undefined : <Link to="." search={search(page - 1)} />
            }
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>

        {pageItems(page, pageCount).map((item, index) =>
          item === "gap" ? (
            // Nothing identifies a gap but where it sits, and the list is
            // rebuilt whole on every page change.
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Button
                variant={item === page ? "outline" : "ghost"}
                size="icon"
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? "page" : undefined}
                nativeButton={false}
                render={<Link to="." search={search(item)} />}
              >
                {item}
              </Button>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go to next page"
            disabled={page >= pageCount}
            nativeButton={page >= pageCount}
            render={
              page >= pageCount ? undefined : (
                <Link to="." search={search(page + 1)} />
              )
            }
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
