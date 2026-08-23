import { z } from "zod/v4";

/**
 * What the codes list endpoint accepts: one page of codes, narrowed by a
 * filter.
 *
 * Both halves are here because they are one decision. The list is paginated,
 * so a page is some rows out of however many the account has -- which means
 * narrowing has to happen before the LIMIT rather than after it, and the
 * filter the bar builds in the browser has to survive the trip to the server.
 *
 * A filter that compiles to SQL is an allowlist or it is nothing: every field,
 * every operator and the number of values each one takes is enumerated below,
 * and anything else fails validation rather than reaching the query builder
 * with a decision left to make.
 */

/**
 * One page. Small enough that the QR previews on the page stay cheap to
 * render, large enough that most accounts never touch the pager.
 */
export const CODES_PER_PAGE = 25;

/* -------------------------------------------------------------------------- */
/*                              Fields & operators                            */
/* -------------------------------------------------------------------------- */

/** The attributes a code can be narrowed by. */
export const CODE_FILTER_FIELDS = ["name", "category", "tags"] as const;
export type CodeFilterField = (typeof CODE_FILTER_FIELDS)[number];

/** A name is required, so `empty` / `not_empty` would be rows that match all. */
export const CODE_NAME_OPERATORS = [
  "contains",
  "not_contains",
  "is",
  "is_not",
  "starts_with",
  "ends_with",
] as const;

export const CODE_CATEGORY_OPERATORS = [
  "is",
  "is_not",
  "is_any_of",
  "is_none_of",
  "empty",
  "not_empty",
] as const;

export const CODE_TAG_OPERATORS = [
  "has_any_of",
  "has_all_of",
  "has_none_of",
  "empty",
  "not_empty",
] as const;

/** Which operators each field accepts, as a lookup the filter bar shares. */
export const CODE_FILTER_OPERATORS = {
  name: CODE_NAME_OPERATORS,
  category: CODE_CATEGORY_OPERATORS,
  tags: CODE_TAG_OPERATORS,
} as const satisfies Record<CodeFilterField, readonly string[]>;

export type CodeFilterOperatorFor<F extends CodeFilterField> =
  (typeof CODE_FILTER_OPERATORS)[F][number];

export type CodeFilterOperator = CodeFilterOperatorFor<CodeFilterField>;

/**
 * How many values each operator reads.
 *
 * `"none"` is the pair that filters on presence alone -- it is the only way to
 * ask for a code with no category, since a code has at most one and an absent
 * one is the null case rather than a sentinel option. The bar reads the same
 * table for its own arity, so what it can build and what the server accepts
 * cannot drift apart.
 */
export const CODE_FILTER_OPERATOR_ARITY = {
  contains: "one",
  not_contains: "one",
  is: "one",
  is_not: "one",
  starts_with: "one",
  ends_with: "one",
  is_any_of: "many",
  is_none_of: "many",
  has_any_of: "many",
  has_all_of: "many",
  has_none_of: "many",
  empty: "none",
  not_empty: "none",
} as const satisfies Record<CodeFilterOperator, "one" | "many" | "none">;

export type CodeFilterArity =
  (typeof CODE_FILTER_OPERATOR_ARITY)[CodeFilterOperator];

/* -------------------------------------------------------------------------- */
/*                                   Limits                                   */
/* -------------------------------------------------------------------------- */

/**
 * Bounds on the work one request can ask for, not product limits -- the bar
 * cannot build anything near either. A tag rule becomes one subquery per
 * value, so the two multiply.
 */
export const MAX_FILTER_VALUES = 50;
export const MAX_FILTER_RULES = 25;

/**
 * Free text is capped well above `Code.name`'s 120 characters: a longer needle
 * simply matches nothing, and failing the whole request over a long paste is a
 * worse answer than an empty list.
 */
const filterText = z.string().min(1).max(500);

/** Category and tag rules carry row ids -- what the bar's options hold. */
const filterId = z.uuid();

/* -------------------------------------------------------------------------- */
/*                                 Query tree                                 */
/* -------------------------------------------------------------------------- */

/**
 * `values` is always an array, whatever the operator's arity, so one check
 * covers every field and the SQL compiler never re-derives a shape.
 */
const ruleBase = {
  type: z.literal("rule"),
  /** Flips the rule's meaning. The bar sets it for operators with no inverse. */
  negated: z.boolean().optional(),
};

const codeFilterRuleSchema = z.discriminatedUnion("field", [
  z.object({
    ...ruleBase,
    field: z.literal("name"),
    operator: z.enum(CODE_NAME_OPERATORS),
    values: z.array(filterText).max(MAX_FILTER_VALUES),
  }),
  z.object({
    ...ruleBase,
    field: z.literal("category"),
    operator: z.enum(CODE_CATEGORY_OPERATORS),
    values: z.array(filterId).max(MAX_FILTER_VALUES),
  }),
  z.object({
    ...ruleBase,
    field: z.literal("tags"),
    operator: z.enum(CODE_TAG_OPERATORS),
    values: z.array(filterId).max(MAX_FILTER_VALUES),
  }),
]);

export type CodeFilterRule = z.infer<typeof codeFilterRuleSchema>;

/**
 * A tree rather than a flat list of conditions, because the filter bar's own
 * query is one. The bar runs in basic mode, where the tree happens to be flat,
 * but carrying the combinators costs a few lines and means switching to the
 * advanced builder needs nothing on this side.
 */
export interface CodeFilterGroup {
  type: "group";
  combinator: "and" | "or";
  rules: CodeFilterNode[];
}

export type CodeFilterNode = CodeFilterRule | CodeFilterGroup;

/** The whole filter. Always a group, so flat and nested are one code path. */
export type CodeFilter = CodeFilterGroup;

/**
 * The getter is how zod expresses recursion, and the return annotation is what
 * keeps it from being inferred in a circle -- which is also why the group's
 * type above is written out rather than inferred back off the schema.
 */
const codeFilterGroupSchema = z.object({
  type: z.literal("group"),
  combinator: z.enum(["and", "or"]),
  get rules(): z.ZodType<CodeFilterNode[]> {
    return z
      .array(
        z.discriminatedUnion("type", [
          codeFilterRuleSchema,
          codeFilterGroupSchema,
        ]),
      )
      .max(MAX_FILTER_RULES);
  },
});

export function isCodeFilterGroup(
  node: CodeFilterNode,
): node is CodeFilterGroup {
  return node.type === "group";
}

/** Every rule in the tree, depth first. */
function flattenRules(group: CodeFilterGroup): CodeFilterRule[] {
  return group.rules.flatMap((node) =>
    isCodeFilterGroup(node) ? flattenRules(node) : [node],
  );
}

const ARITY_MESSAGE = {
  none: "takes no value",
  one: "takes exactly one value",
  many: "needs at least one value",
} as const satisfies Record<CodeFilterArity, string>;

/**
 * Arity is checked here rather than per branch because a refinement on a
 * `discriminatedUnion` member costs the union its discriminator, and the rule
 * union has to stay nestable inside the node union above. The whole-tree walk
 * also bounds the rule count, which no per-rule check can see.
 */
export const codeFilterSchema = codeFilterGroupSchema.superRefine(
  (group, ctx) => {
    const rules = flattenRules(group);

    if (rules.length > MAX_FILTER_RULES) {
      ctx.addIssue({
        code: "custom",
        message: `Use at most ${MAX_FILTER_RULES} filters.`,
      });
    }

    for (const rule of rules) {
      const arity = CODE_FILTER_OPERATOR_ARITY[rule.operator];
      const count = rule.values.length;
      const ok =
        arity === "none"
          ? count === 0
          : arity === "one"
            ? count === 1
            : count > 0;

      if (!ok) {
        ctx.addIssue({
          code: "custom",
          message: `"${rule.operator}" ${ARITY_MESSAGE[arity]}.`,
          path: ["rules"],
        });
      }
    }
  },
);

/* -------------------------------------------------------------------------- */
/*                                    Input                                   */
/* -------------------------------------------------------------------------- */

export const codeListInputSchema = z.object({
  page: z.int().min(1).default(1),
  /**
   * Client-settable but capped: the page size belongs to whatever is rendering
   * the rows, and the ceiling is what stops one request asking for the table.
   */
  perPage: z.int().min(1).max(100).default(CODES_PER_PAGE),
  filter: codeFilterSchema.optional(),
});

export type CodeListInput = z.infer<typeof codeListInputSchema>;
