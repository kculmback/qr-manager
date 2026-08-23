import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaseSensitive, Folder, Tag as TagIcon } from "lucide-react";

import type {
  FilterField,
  FilterQuery,
} from "@qr-manager/ui/components/reui/filters/filters-types";
import type {
  CodeFilterField,
  CodeFilterOperatorFor,
} from "@qr-manager/validators";
import { Filters } from "@qr-manager/ui/components/reui/filters/filters";
import { CODE_FILTER_OPERATOR_ARITY } from "@qr-manager/validators";

import { useTRPC } from "~/lib/trpc";

/**
 * Wording per field rather than through `operatorLabels`, which reaches every
 * field at once. The three read as sentences beside their own label -- "Tags
 * include any of", "Category is not set" -- and no two of them would share one
 * wording for `empty`.
 *
 * Which operators exist, and how many values each takes, is not decided here:
 * the server compiles these rules into SQL, so it owns the allowlist. Only the
 * labels are local, and an operator the server would reject fails to compile.
 */
interface CodeOperator<F extends CodeFilterField> {
  value: CodeFilterOperatorFor<F>;
  label: string;
  /** The opposite operator. Negate flips to it, else sets `rule.negated`. */
  inverse?: CodeFilterOperatorFor<F>;
}

/**
 * One attribute, with its arity stamped on from the shared table.
 *
 * Restating arity here is how the bar would come to build a rule the API
 * rejects -- a `many` operator offered as `one` sends a scalar where the
 * schema wants a list -- so it is read rather than written.
 */
function codeFilterField<F extends CodeFilterField>(
  field: F,
  definition: Omit<FilterField, "id" | "operators"> & {
    operators: CodeOperator<F>[];
  },
): FilterField {
  return {
    ...definition,
    id: field,
    operators: definition.operators.map((operator) => ({
      ...operator,
      arity: CODE_FILTER_OPERATOR_ARITY[operator.value],
    })),
  };
}

/** A name is required, so `empty` / `not_empty` would be rows that match all. */
const NAME_OPERATORS: CodeOperator<"name">[] = [
  { value: "contains", label: "contains", inverse: "not_contains" },
  { value: "not_contains", label: "does not contain", inverse: "contains" },
  { value: "is", label: "is", inverse: "is_not" },
  { value: "is_not", label: "is not", inverse: "is" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
];

const CATEGORY_OPERATORS: CodeOperator<"category">[] = [
  { value: "is", label: "is", inverse: "is_not" },
  { value: "is_not", label: "is not", inverse: "is" },
  { value: "is_any_of", label: "is any of", inverse: "is_none_of" },
  { value: "is_none_of", label: "is none of", inverse: "is_any_of" },
  // "Or lack of": a code sits in at most one category, so an absent one is the
  // null case and needs no sentinel option to stand for it.
  { value: "empty", label: "is not set", inverse: "not_empty" },
  { value: "not_empty", label: "is set", inverse: "empty" },
];

const TAG_OPERATORS: CodeOperator<"tags">[] = [
  { value: "has_any_of", label: "include any of", inverse: "has_none_of" },
  { value: "has_all_of", label: "include all of" },
  { value: "has_none_of", label: "include none of", inverse: "has_any_of" },
  { value: "empty", label: "are not set", inverse: "not_empty" },
  { value: "not_empty", label: "are set", inverse: "empty" },
];

/**
 * The attribute schema, with the user's own categories and tags as options.
 *
 * Options carry the row *id*, not its name: the rule outlives the popover it
 * was built in -- it survives in the URL -- and an id is the stable handle on
 * a row the user can rename.
 */
function useCodeFilterFields(): FilterField[] {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.taxonomy.all.queryOptions());

  return useMemo(
    () => [
      codeFilterField("name", {
        label: "Name",
        icon: <CaseSensitive />,
        type: "text",
        operators: NAME_OPERATORS,
        placeholder: "Poster in the lobby",
      }),
      codeFilterField("category", {
        label: "Category",
        icon: <Folder />,
        type: "select",
        operators: CATEGORY_OPERATORS,
        options: (data?.categories ?? []).map((category) => ({
          value: category.id,
          label: category.name,
        })),
        placeholder: "Search categories...",
      }),
      codeFilterField("tags", {
        label: "Tags",
        icon: <TagIcon />,
        type: "multiselect",
        operators: TAG_OPERATORS,
        options: (data?.tags ?? []).map((tag) => ({
          value: tag.id,
          label: tag.name,
        })),
        // A tag list grows without limit, so keep the picks above the fold.
        pinSelected: true,
        placeholder: "Search tags...",
      }),
    ],
    [data],
  );
}

/**
 * The filter bar over the codes list.
 *
 * Basic chrome: a flat chip row joined by AND, which is what a toolbar over a
 * list wants. The query is a tree either way, so nothing here changes if the
 * advanced builder is ever wanted.
 */
export function CodeFilters({
  query,
  onQueryChange,
  className,
}: {
  query: FilterQuery;
  onQueryChange: (query: FilterQuery) => void;
  className?: string;
}) {
  const fields = useCodeFilterFields();

  return (
    <Filters
      fields={fields}
      query={query}
      onQueryChange={onQueryChange}
      variant="basic"
      size="sm"
      showClear
      className={className}
    />
  );
}
