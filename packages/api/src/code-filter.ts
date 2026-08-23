import type { SQL } from "@qr-manager/db";
import type { Reader } from "@qr-manager/db/client";
import type {
  CodeFilter,
  CodeFilterNode,
  CodeFilterRule,
} from "@qr-manager/validators";
import {
  and,
  eq,
  exists,
  ilike,
  inArray,
  isNotNull,
  isNull,
  ne,
  not,
  notExists,
  notInArray,
  or,
  sql,
} from "@qr-manager/db";
import { Code, CodeTag } from "@qr-manager/db/schema";
import { isCodeFilterGroup } from "@qr-manager/validators";

/**
 * Compiles the codes list's filter into a `WHERE` fragment.
 *
 * The counterpart to `codeFilterSchema`, which has already reduced the tree to
 * an allowlist of field/operator/arity combinations -- so every switch below is
 * total over what can actually arrive, and nothing here has to decide what an
 * unknown operator means. Values reach the query as bind parameters.
 *
 * `undefined` where the filter constrains nothing, which is what `and()` wants
 * so the caller can compose it with the ownership check unconditionally.
 */
export function compileCodeFilter(
  db: Reader,
  filter: CodeFilter,
): SQL | undefined {
  return compileGroup(db, filter);
}

function compileGroup(db: Reader, group: CodeFilter): SQL | undefined {
  const parts = group.rules
    .map((node) => compileNode(db, node))
    .filter((part): part is SQL => part !== undefined);

  // A group that constrains nothing is left out entirely rather than folded to
  // TRUE or FALSE -- either constant would change what its parent means.
  if (parts.length === 0) return undefined;

  return group.combinator === "or" ? or(...parts) : and(...parts);
}

function compileNode(db: Reader, node: CodeFilterNode): SQL | undefined {
  return isCodeFilterGroup(node)
    ? compileGroup(db, node)
    : compileRule(db, node);
}

function compileRule(db: Reader, rule: CodeFilterRule): SQL | undefined {
  const condition =
    rule.field === "name"
      ? compileName(rule)
      : rule.field === "category"
        ? compileCategory(rule)
        : compileTags(db, rule);

  if (condition === undefined) return undefined;

  // `negated` flips the meaning without changing the operator, which is how the
  // bar negates an operator that declares no `inverse`.
  return rule.negated ? not(condition) : condition;
}

/* -------------------------------------------------------------------------- */
/*                                    Name                                    */
/* -------------------------------------------------------------------------- */

/**
 * Escapes what `LIKE` reads as syntax, so a name containing `%` or `_` is
 * searched for rather than acting as a wildcard. Backslash is `LIKE`'s default
 * escape character, so no `ESCAPE` clause is needed.
 */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/**
 * `ILIKE` throughout, including for `is`: nobody filtering a list of their own
 * codes means "lobby" to miss "Lobby". With no wildcards left after escaping,
 * an `ILIKE` with a bare pattern *is* case-insensitive equality.
 */
function compileName(
  rule: Extract<CodeFilterRule, { field: "name" }>,
): SQL | undefined {
  // Every name operator takes exactly one value.
  const [value] = rule.values;
  if (value === undefined) return undefined;

  const needle = escapeLike(value);

  switch (rule.operator) {
    case "contains":
      return ilike(Code.name, `%${needle}%`);
    case "not_contains":
      return not(ilike(Code.name, `%${needle}%`));
    case "starts_with":
      return ilike(Code.name, `${needle}%`);
    case "ends_with":
      return ilike(Code.name, `%${needle}`);
    case "is":
      return ilike(Code.name, needle);
    case "is_not":
      return not(ilike(Code.name, needle));
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Category                                  */
/* -------------------------------------------------------------------------- */

/**
 * A code sits in at most one category, so "lack of" is the null case rather
 * than a sentinel option.
 *
 * The negative operators have to say so explicitly: `category_id <> $1` is NULL
 * for an uncategorised code, and a NULL is not a match, so `<>` alone would
 * silently drop exactly the rows the user asked to see.
 */
function compileCategory(
  rule: Extract<CodeFilterRule, { field: "category" }>,
): SQL | undefined {
  switch (rule.operator) {
    case "empty":
      return isNull(Code.categoryId);
    case "not_empty":
      return isNotNull(Code.categoryId);
    default:
      break;
  }

  const [first] = rule.values;
  if (first === undefined) return undefined;

  switch (rule.operator) {
    case "is":
      return eq(Code.categoryId, first);
    case "is_not":
      return or(isNull(Code.categoryId), ne(Code.categoryId, first));
    case "is_any_of":
      return inArray(Code.categoryId, rule.values);
    case "is_none_of":
      return or(
        isNull(Code.categoryId),
        notInArray(Code.categoryId, rule.values),
      );
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Tags                                    */
/* -------------------------------------------------------------------------- */

/**
 * Tag rules are `EXISTS` subqueries rather than a join: a code has many tags,
 * so joining `code_tag` into the list query would multiply the rows and turn
 * the LIMIT into a lie about how many codes a page holds.
 */
function taggedWith(db: Reader, tagIds?: string[]) {
  return db
    .select({ one: sql`1` })
    .from(CodeTag)
    .where(
      and(
        eq(CodeTag.codeId, Code.id),
        tagIds ? inArray(CodeTag.tagId, tagIds) : undefined,
      ),
    );
}

function compileTags(
  db: Reader,
  rule: Extract<CodeFilterRule, { field: "tags" }>,
): SQL | undefined {
  switch (rule.operator) {
    case "empty":
      return notExists(taggedWith(db));
    case "not_empty":
      return exists(taggedWith(db));
    default:
      break;
  }

  if (rule.values.length === 0) return undefined;

  switch (rule.operator) {
    case "has_any_of":
      return exists(taggedWith(db, rule.values));
    case "has_none_of":
      return notExists(taggedWith(db, rule.values));
    // One `EXISTS` per tag rather than a counted subquery: each one is a
    // primary-key probe on `code_tag`, and repeats in the value list cannot
    // make the count come out short.
    case "has_all_of":
      return and(
        ...rule.values.map((tagId) => exists(taggedWith(db, [tagId]))),
      );
  }
}
