import { useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, QrCode, SearchX } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { z } from "zod/v4";

import type { FilterQuery } from "@qr-manager/ui/components/reui/filters/filters-types";
import { Badge } from "@qr-manager/ui/components/badge";
import { Button } from "@qr-manager/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@qr-manager/ui/components/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@qr-manager/ui/components/item";
import { createFilterQuery } from "@qr-manager/ui/components/reui/filters/filters-query";
import { Skeleton } from "@qr-manager/ui/components/skeleton";
import { CODE_TYPES } from "@qr-manager/validators";

import {
  filterQuerySchema,
  hasFilterRules,
  toCodeFilter,
} from "~/components/codes/code-filter";
import { CodeFilters } from "~/components/codes/code-filters";
import { CodeTaxonomy } from "~/components/codes/code-taxonomy";
import { CodesPagination } from "~/components/codes/codes-pagination";
import { useTRPC } from "~/lib/trpc";

/**
 * Which page, filtered how. In the URL rather than in component state because
 * a narrowed list is a place: it should survive the back button, and it should
 * be the thing a shared link opens on.
 *
 * Both keys are optional and absent at their defaults, so the plain list stays
 * at a plain `/codes`.
 */
interface CodesSearch {
  page?: number;
  filter?: FilterQuery;
}

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  filter: filterQuerySchema.optional(),
});

/**
 * The filter is the bar's own query tree, so it round-trips whatever the bar
 * was showing -- a half-built rule included. `toCodeFilter` is what decides
 * which of it the server is asked about.
 */
export const Route = createFileRoute("/_app/codes/")({
  validateSearch: (search: Record<string, unknown>): CodesSearch => {
    const parsed = searchSchema.safeParse(search);
    // A hand-edited or stale link falls back to the plain list rather than
    // failing the route: nothing here is worth an error page.
    if (!parsed.success) return {};

    return {
      page: parsed.data.page,
      // Validated structurally above. zod infers `value` as an optional key
      // where `FilterRule` declares it required-and-possibly-undefined, a
      // distinction TypeScript draws and JSON does not.
      filter: parsed.data.filter as FilterQuery | undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient, trpc }, deps }) =>
    Promise.all([
      queryClient.ensureQueryData(trpc.code.list.queryOptions(listInput(deps))),
      // The filter bar's options. Fetched with the list rather than after it,
      // so the attributes are not briefly offered with nothing to pick.
      queryClient.ensureQueryData(trpc.taxonomy.all.queryOptions()),
    ]),
  component: CodesPage,
});

/**
 * What the bar is controlled by when the URL carries no filter. A constant so
 * an unfiltered list does not hand it a new tree on every render.
 */
const NO_FILTER = createFilterQuery();

function listInput(search: CodesSearch) {
  return { page: search.page ?? 1, filter: toCodeFilter(search.filter) };
}

function CodesPage() {
  const trpc = useTRPC();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isPending } = useQuery({
    ...trpc.code.list.queryOptions(listInput(search)),
    // Every page and every filter is its own query. Without this the list
    // would blank back to skeletons on each one, which reads as the page
    // reloading rather than as the same list moving.
    placeholderData: keepPreviousData,
  });

  const setQuery = useCallback(
    (filter: FilterQuery) => {
      void navigate({
        // `page` is dropped on purpose: narrowing the list changes what page 3
        // holds, and there may no longer be one.
        search: { filter: hasFilterRules(filter) ? filter : undefined },
        // Building a rule takes several edits -- field, operator, value -- and
        // they are one act, not three steps to walk back through.
        replace: true,
      });
    },
    [navigate],
  );

  const clearFilters = useCallback(() => {
    void navigate({ search: {} });
  }, [navigate]);

  const codes = data?.codes;
  const filtered = hasFilterRules(search.filter);

  // Shown while there is something to narrow, and while a filter is on even
  // though there is not -- that is exactly when the bar has to be reachable,
  // since clearing it is the way out.
  const showFilters = (data !== undefined && data.total > 0) || filtered;

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Codes</h1>
          <p className="text-muted-foreground text-sm text-pretty">
            Everything you have created, newest first.
          </p>
        </div>

        <Button nativeButton={false} render={<Link to="/codes/new" />}>
          <Plus />
          New code
        </Button>
      </header>

      {showFilters && (
        <CodeFilters
          query={search.filter ?? NO_FILTER}
          onQueryChange={setQuery}
          className="pb-6"
        />
      )}

      {isPending && (
        <ItemGroup className="gap-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-24 w-full rounded-3xl" />
          ))}
        </ItemGroup>
      )}

      {data?.total === 0 && !filtered && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>No codes yet</EmptyTitle>
            <EmptyDescription>
              Create one and you will get a QR code you can print, plus a short
              link you can point somewhere else later.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link to="/codes/new" />}>
              <Plus />
              New code
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Distinct from having no codes at all: the fix here is to change the
          filters, not to create something. */}
      {data?.total === 0 && filtered && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No codes match</EmptyTitle>
            <EmptyDescription>
              Nothing here is filed the way these filters ask for.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {codes && codes.length > 0 && (
        <ItemGroup className="gap-3">
          {codes.map((code) => (
            <Item
              key={code.id}
              variant="outline"
              render={<Link to="/codes/$codeId" params={{ codeId: code.id }} />}
            >
              <ItemMedia>
                {/* The bare SVG rather than `QrPreview`: the preview also
                    mounts an offscreen 1024px export canvas, which is wasted
                    work once per row. */}
                <div className="rounded-xl bg-white p-1.5">
                  <QRCodeSVG
                    value={code.encodedValue}
                    size={56}
                    marginSize={2}
                    level="M"
                    title={`QR code for ${code.name}`}
                  />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{code.name}</ItemTitle>
                <ItemDescription>
                  {code.mode === "dynamic" ? code.shortUrl : "Static code"}
                </ItemDescription>
                <CodeTaxonomy
                  category={code.category}
                  tags={code.tags}
                  className="pt-1"
                />
              </ItemContent>
              <Badge variant="outline">{CODE_TYPES[code.type].label}</Badge>
              {code.mode === "dynamic" && <Badge>Dynamic</Badge>}
            </Item>
          ))}
        </ItemGroup>
      )}

      {data && data.total > 0 && (
        <footer className="flex flex-col items-center gap-3 pt-6">
          <CodesPagination page={data.page} pageCount={data.pageCount} />
          <p className="text-muted-foreground text-sm">
            {/* The range, not just the count: on page four "76-100 of 137" is
                what says where you are. */}
            {data.total === codes?.length
              ? `${data.total} ${data.total === 1 ? "code" : "codes"}`
              : `${(data.page - 1) * data.perPage + 1}-${
                  (data.page - 1) * data.perPage + (codes?.length ?? 0)
                } of ${data.total}`}
          </p>
        </footer>
      )}
    </div>
  );
}
