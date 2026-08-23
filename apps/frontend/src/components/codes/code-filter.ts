import { z } from "zod/v4";

import type {
  FilterGroupNode,
  FilterNode,
  FilterQuery,
  FilterRule,
} from "@qr-manager/ui/components/reui/filters/filters-types";
import type {
  CodeFilter,
  CodeFilterField,
  CodeFilterNode,
  CodeFilterOperatorFor,
  CodeFilterRule,
} from "@qr-manager/validators";
import {
  isFilterGroup,
  isFilterRuleComplete,
} from "@qr-manager/ui/components/reui/filters/filters-query";
import {
  CODE_FILTER_OPERATOR_ARITY,
  CODE_FILTER_OPERATORS,
} from "@qr-manager/validators";

/**
 * Translates between the filter bar's query and the one the API accepts.
 *
 * Two different trees for one filter, because they answer to different things.
 * The bar's is an editing state: it holds a rule the moment a field is picked,
 * before there is an operator or a value, and it carries the ids the chips are
 * keyed by. The API's is a finished question, checked against an allowlist
 * because it compiles to SQL.
 *
 * `toCodeFilter` is the crossing. It drops whatever states no constraint --
 * a half-built rule, an attribute the server does not know, an operator with
 * nothing to compare against -- so that a filter still being typed narrows
 * nothing rather than narrowing wrongly.
 */

/* -------------------------------------------------------------------------- */
/*                              The bar's query                               */
/* -------------------------------------------------------------------------- */

/**
 * The bar's query as it survives a round trip through the URL.
 *
 * Structural only: `operator` and `value` are deliberately unconstrained,
 * because an incomplete rule is a legitimate state here and `toCodeFilter`
 * is what decides whether a rule means anything. This exists so a hand-edited
 * or stale link degrades to "no filter" instead of throwing on render.
 */
const filterRuleSchema = z.object({
  id: z.string(),
  type: z.literal("rule"),
  path: z.array(z.string()),
  operator: z.string(),
  value: z.unknown(),
  negated: z.boolean().optional(),
});

export const filterQuerySchema = z.object({
  id: z.string(),
  type: z.literal("group"),
  combinator: z.enum(["and", "or"]),
  get rules(): z.ZodType<unknown[]> {
    return z.array(z.union([filterRuleSchema, filterQuerySchema]));
  },
});

/** Whether the bar is narrowing anything, which is what decides if it shows. */
export function hasFilterRules(query: FilterQuery | undefined): boolean {
  return query !== undefined && query.rules.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                             The API's filter                               */
/* -------------------------------------------------------------------------- */

function isCodeFilterField(
  field: string | undefined,
): field is CodeFilterField {
  return field !== undefined && field in CODE_FILTER_OPERATORS;
}

/**
 * The operator, if this field accepts it.
 *
 * The cast is the whole point of the guard: `CODE_FILTER_OPERATORS` is the
 * table the server's discriminated union is built from, so membership in it is
 * exactly the proposition the type states -- and the server re-checks it
 * anyway, since nothing here is trusted there.
 */
function toOperator<F extends CodeFilterField>(
  field: F,
  operator: string,
): CodeFilterOperatorFor<F> | null {
  const accepted: readonly string[] = CODE_FILTER_OPERATORS[field];
  return accepted.includes(operator)
    ? (operator as CodeFilterOperatorFor<F>)
    : null;
}

/**
 * A rule's value normalised to the array the API takes, dropping blanks.
 *
 * `value` is singular and shaped by the operator's arity -- a scalar for `is`,
 * an array for `is_any_of` -- so every read starts by flattening it.
 */
function toValues(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  const list: unknown[] = Array.isArray(value) ? value : [value];
  return list.filter(
    (entry): entry is string => typeof entry === "string" && entry !== "",
  );
}

function toRule(rule: FilterRule): CodeFilterRule | null {
  // A rule the user has not finished building must not filter anything out.
  // The bar keeps it, drawn dashed, rather than dropping it on Escape.
  if (!isFilterRuleComplete(rule)) return null;

  const field = rule.path[0];
  if (!isCodeFilterField(field)) return null;

  const operator = toOperator(field, rule.operator);
  if (operator === null) return null;

  const arity = CODE_FILTER_OPERATOR_ARITY[operator];
  const values = toValues(rule.value);

  // `empty` and `not_empty` filter on presence, so anything the editor left
  // behind is noise the server would reject. Every other operator needs
  // something to compare against, and states nothing without it.
  if (arity === "none") values.length = 0;
  else if (values.length === 0) return null;
  else if (arity === "one") values.length = 1;

  return {
    type: "rule",
    field,
    operator,
    values,
    ...(rule.negated ? { negated: true } : {}),
    // Field and operator were checked against each other above;
    // TypeScript cannot carry that pairing through a union-typed `field`.
  } as CodeFilterRule;
}

function toNode(node: FilterNode): CodeFilterNode | null {
  return isFilterGroup(node) ? toGroup(node) : toRule(node);
}

/**
 * Constraining nodes are collected before they are combined, so a half-built
 * rule cannot make an `or` group vacuously true. A group that constrains
 * nothing is `null` in turn, and its parent leaves it out the same way.
 */
function toGroup(group: FilterGroupNode): CodeFilter | null {
  const rules = group.rules
    .map(toNode)
    .filter((node): node is CodeFilterNode => node !== null);

  if (rules.length === 0) return null;

  return { type: "group", combinator: group.combinator, rules };
}

/**
 * The bar's query as the API's filter, or `undefined` where it narrows nothing.
 *
 * Walks the tree rather than reading `flattenFilterConditions`, which is lossy
 * on purpose -- it reads `a AND (b OR c)` back as a flat conjunction. The bar
 * is in basic mode, where the tree happens to be flat, but honouring the
 * combinators costs a few lines and means switching to the advanced builder
 * needs nothing here.
 */
export function toCodeFilter(
  query: FilterQuery | undefined,
): CodeFilter | undefined {
  if (query === undefined) return undefined;
  return toGroup(query) ?? undefined;
}
