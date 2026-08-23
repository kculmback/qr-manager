import { parseArgs } from "node:util";

import type { CodeContent, CodeMode, CodeType } from "@qr-manager/validators";
import { and, eq, inArray, sql } from "@qr-manager/db";
import { createDb } from "@qr-manager/db/client";
import { Category, Code, CodeTag, Tag, user } from "@qr-manager/db/schema";
import {
  CODE_TYPES,
  codeContentSchema,
  generateSlug,
  supportsDynamic,
  taxonomyKey,
} from "@qr-manager/validators";

import { env } from "./env.js";

/**
 * Fills an account with plausible codes, categories and tags.
 *
 * For working on the list, filter and detail screens without hand-creating
 * fifty codes through the form. Everything it writes goes through the same
 * validators the API uses, so seeded rows cannot be shapes the app would have
 * refused -- a payload that fails `codeContentSchema` is a bug in this file,
 * not data to keep.
 *
 *   pnpm db:seed --user you@example.com --count 50
 *
 * Re-running adds another batch to the same account; `--clear` wipes the
 * account's codes first. Categories and tags are reused across runs, since
 * they are matched case-insensitively the same way the API matches them.
 */

/** Rows per INSERT. Well under Postgres' 65,535 bound parameters per statement. */
const BATCH_SIZE = 500;

/** Fresh slugs to draw for the codes a batch failed to insert. */
const SLUG_ATTEMPTS = 5;

/** How far back seeded codes are dated, so the list has something to order by. */
const BACKDATE_DAYS = 90;

const CATEGORY_NAMES = [
  "Storefront",
  "Events",
  "Office",
  "Packaging",
  "Marketing",
  "Field kit",
];

const TAG_NAMES = [
  "print",
  "poster",
  "menu",
  "guest wifi",
  "trade show",
  "business card",
  "flyer",
  "seasonal",
  "internal",
  "experiment",
];

/** Share of codes filed under no category at all. */
const NO_CATEGORY_SHARE = 0.25;
/** Share of codes carrying no tags. Independent of the above, so some have neither. */
const NO_TAGS_SHARE = 0.3;
const MAX_TAGS = 4;

interface Random {
  /** Uniform in [0, 1). */
  next: () => number;
  int: (maxExclusive: number) => number;
  pick: <T>(values: readonly T[]) => T;
  chance: (probability: number) => boolean;
}

/**
 * mulberry32 -- small, fast, and seedable, which `Math.random` is not.
 *
 * A fixed `--seed` makes a run reproducible, so a screenshot or a bug report
 * about the fiftieth row can be regenerated exactly. Slugs still come from
 * `generateSlug`, which is deliberately unguessable and therefore not seeded.
 */
function createRandom(seed: number): Random {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (maxExclusive: number) => Math.floor(next() * maxExclusive);

  return {
    next,
    int,
    pick: (values) => {
      // Only reachable if a pool is empty, which would otherwise surface much
      // later as an `undefined` payload field the schema rejects.
      const value = values[int(values.length)];
      if (value === undefined) throw new Error("Nothing to pick from.");
      return value;
    },
    chance: (probability) => next() < probability,
  };
}

// --- content ---------------------------------------------------------------

const COMPANIES = [
  "Northwind Coffee",
  "Harbour Books",
  "Cedar & Pine",
  "Blue Line Cycles",
  "Ridgeway Studio",
  "Marlowe Bakery",
  "Atlas Hardware",
  "Fernhill Clinic",
];

const PLACES = [
  "Lobby",
  "Front counter",
  "Table tent",
  "Window",
  "Stockroom",
  "Booth 14",
  "Loading bay",
  "Break room",
];

const FIRST_NAMES = ["Ada", "Rosa", "Kai", "Ines", "Noor", "Theo", "Mila"];
const LAST_NAMES = ["Okafor", "Lindqvist", "Moreau", "Barnes", "Ferreira"];

/** A hostname-safe form of a display name, for the fake URLs below. */
function hostnameOf(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * One code's user-visible name and its validated content.
 *
 * The generators below return the content untyped-by-construction and it is
 * parsed on the way out, so a payload that drifts out of step with its schema
 * fails here rather than becoming a row the UI cannot render.
 */
interface CodeDraft {
  name: string;
  content: CodeContent;
}

type Generator = (r: Random) => CodeDraft;

const GENERATORS: Record<CodeType, Generator> = {
  url: (r) => {
    const company = r.pick(COMPANIES);
    const page = r.pick(["menu", "book", "shop", "hours", "support", "review"]);
    return {
      name: `${company} — ${page}`,
      content: {
        type: "url",
        payload: { url: `https://${hostnameOf(company)}.example.com/${page}` },
      },
    };
  },

  vcard: (r) => {
    const firstName = r.pick(FIRST_NAMES);
    const lastName = r.pick(LAST_NAMES);
    const company = r.pick(COMPANIES);
    return {
      name: `${firstName} ${lastName} — contact card`,
      content: {
        type: "vcard",
        payload: {
          firstName,
          lastName,
          organization: company,
          title: r.pick(["Owner", "Technician", "Designer", "Manager"]),
          phone: `+1 555 ${100 + r.int(900)} ${1000 + r.int(9000)}`,
          email: `${firstName.toLowerCase()}@${hostnameOf(company)}.example.com`,
          url: `https://${hostnameOf(company)}.example.com`,
        },
      },
    };
  },

  wifi: (r) => {
    const company = r.pick(COMPANIES);
    const open = r.chance(0.2);
    return {
      name: `${company} guest Wi-Fi`,
      content: {
        type: "wifi",
        payload: {
          ssid: `${hostnameOf(company)}-guest`,
          security: open ? "nopass" : "WPA",
          ...(open ? {} : { password: `guest-${1000 + r.int(9000)}` }),
          hidden: r.chance(0.1),
        },
      },
    };
  },

  text: (r) => {
    const place = r.pick(PLACES);
    return {
      name: `${place} notice`,
      content: {
        type: "text",
        payload: {
          text: `${place}: ${r.pick([
            "ring the bell for service",
            "deliveries before 11am",
            "asset tag " + (10000 + r.int(90000)),
            "wipe down after use, thanks",
          ])}`,
        },
      },
    };
  },

  email: (r) => {
    const company = r.pick(COMPANIES);
    return {
      name: `${company} — email us`,
      content: {
        type: "email",
        payload: {
          to: `hello@${hostnameOf(company)}.example.com`,
          subject: r.pick(["Booking enquiry", "Repair request", "Feedback"]),
          body: "Hi, I scanned the code at your counter and wanted to ask about",
        },
      },
    };
  },

  sms: (r) => ({
    name: `${r.pick(PLACES)} — text the desk`,
    content: {
      type: "sms",
      payload: {
        phone: `+1 555 ${100 + r.int(900)} ${1000 + r.int(9000)}`,
        message: r.pick(["I'd like to order", "Please call me back", "Help"]),
      },
    },
  }),

  geo: (r) => ({
    name: `${r.pick(PLACES)} — meet here`,
    content: {
      type: "geo",
      payload: {
        // Roughly Europe, rounded the way a map pin would be.
        latitude: Number((48 + r.next() * 8).toFixed(5)),
        longitude: Number((-4 + r.next() * 16).toFixed(5)),
      },
    },
  }),
};

/**
 * How often each type comes up. Links dominate a real account by a wide
 * margin, and a seeded account that is one-seventh Wi-Fi codes gives a
 * misleading picture of the list screen.
 */
const TYPE_WEIGHTS: Record<CodeType, number> = {
  url: 40,
  vcard: 12,
  wifi: 12,
  text: 12,
  email: 8,
  sms: 8,
  geo: 8,
};

const WEIGHT_TOTAL = Object.values(TYPE_WEIGHTS).reduce((a, b) => a + b, 0);

function pickType(r: Random): CodeType {
  let roll = r.next() * WEIGHT_TOTAL;
  for (const [type, weight] of Object.entries(TYPE_WEIGHTS)) {
    roll -= weight;
    if (roll < 0) return type as CodeType;
  }
  return "url";
}

/**
 * Static unless the type can do better, and then usually whatever the type
 * defaults to -- with a minority the other way, so both branches of every
 * mode-dependent screen have rows to show.
 */
function pickMode(r: Random, type: CodeType): CodeMode {
  if (!supportsDynamic(type)) return "static";
  const dynamicShare = CODE_TYPES[type].defaultMode === "dynamic" ? 0.85 : 0.35;
  return r.chance(dynamicShare) ? "dynamic" : "static";
}

// --- persistence -----------------------------------------------------------

type Db = ReturnType<typeof createDb>;

interface TaxonomyRef {
  id: string;
  name: string;
}

/**
 * Inserts the names that are missing and reads every one of them back.
 *
 * Same insert-then-select shape the API's `resolveNames` uses: the unique index
 * is on `lower(name)`, so a second run that spells a category differently
 * reuses the existing row instead of failing.
 */
async function resolveNames(
  db: Db,
  table: typeof Category | typeof Tag,
  userId: string,
  names: string[],
): Promise<TaxonomyRef[]> {
  await db
    .insert(table)
    .values(names.map((name) => ({ userId, name })))
    .onConflictDoNothing();

  return db
    .select({ id: table.id, name: table.name })
    .from(table)
    .where(
      and(
        eq(table.userId, userId),
        inArray(sql`lower(${table.name})`, names.map(taxonomyKey)),
      ),
    );
}

type CodeInsert = typeof Code.$inferInsert & { id: string };

/**
 * Inserts codes in batches, redrawing a slug for any row a batch dropped.
 *
 * Ids are generated here rather than by the database so the rows that came
 * back can be matched against the rows that went in -- `onConflictDoNothing`
 * returns only what landed, and without an id there would be no way to tell
 * which of five hundred codes lost its slug to a collision. Two draws out of
 * ~31^8 landing on the same slug is vanishingly unlikely; this exists so that
 * when it happens the seed is one code short of nothing at all.
 */
async function insertCodes(db: Db, rows: CodeInsert[]): Promise<string[]> {
  const inserted: string[] = [];
  let pending = rows;

  for (
    let attempt = 0;
    attempt < SLUG_ATTEMPTS && pending.length > 0;
    attempt++
  ) {
    if (attempt > 0) {
      pending = pending.map((row) => ({ ...row, slug: generateSlug() }));
    }

    const landed = new Set<string>();

    for (let start = 0; start < pending.length; start += BATCH_SIZE) {
      const batch = pending.slice(start, start + BATCH_SIZE);
      const returned = await db
        .insert(Code)
        .values(batch)
        .onConflictDoNothing({ target: Code.slug })
        .returning({ id: Code.id });

      for (const { id } of returned) landed.add(id);
    }

    inserted.push(...landed);
    pending = pending.filter((row) => !landed.has(row.id));
  }

  if (pending.length > 0) {
    console.warn(
      `Gave up on ${pending.length} code(s) after ${SLUG_ATTEMPTS} slug collisions each.`,
    );
  }

  return inserted;
}

async function insertCodeTags(
  db: Db,
  links: (typeof CodeTag.$inferInsert)[],
): Promise<void> {
  for (let start = 0; start < links.length; start += BATCH_SIZE) {
    await db
      .insert(CodeTag)
      .values(links.slice(start, start + BATCH_SIZE))
      .onConflictDoNothing();
  }
}

// --- entry point -----------------------------------------------------------

const { values } = parseArgs({
  options: {
    user: { type: "string" },
    count: { type: "string", default: "25" },
    seed: { type: "string" },
    clear: { type: "boolean", default: false },
  },
});

const count = Number(values.count);
if (!Number.isInteger(count) || count < 1) {
  throw new Error(`--count must be a positive integer, got "${values.count}".`);
}

const randomSeed = values.seed ? Number(values.seed) : Date.now() & 0xffffffff;
if (!Number.isFinite(randomSeed)) {
  throw new Error(`--seed must be a number, got "${values.seed}".`);
}

const db = createDb(env.POSTGRES_URL);

try {
  if (!values.user) {
    const accounts = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .limit(20);

    throw new Error(
      `Pass --user <email or id>. Accounts on this database:\n` +
        (accounts.length === 0
          ? "  (none -- sign up first)"
          : accounts.map((a) => `  ${a.email}  ${a.id}`).join("\n")),
    );
  }

  // Email or id, whichever was handed over: the email is what a human knows,
  // the id is what another script would have.
  const [owner] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(
      values.user.includes("@")
        ? eq(user.email, values.user)
        : eq(user.id, values.user),
    );

  if (!owner) throw new Error(`No user matches "${values.user}".`);

  if (values.clear) {
    // Tag links cascade with the codes. Categories and tags are removed too --
    // they only exist by being named on a code, so leaving them behind would
    // leave the account's filters full of labels that file nothing.
    const removed = await db
      .delete(Code)
      .where(eq(Code.userId, owner.id))
      .returning({ id: Code.id });
    await db.delete(Tag).where(eq(Tag.userId, owner.id));
    await db.delete(Category).where(eq(Category.userId, owner.id));

    console.log(
      `Cleared ${removed.length} existing code(s) for ${owner.email}.`,
    );
  }

  const r = createRandom(randomSeed);

  const [categories, tags] = await Promise.all([
    resolveNames(db, Category, owner.id, CATEGORY_NAMES),
    resolveNames(db, Tag, owner.id, TAG_NAMES),
  ]);

  const now = Date.now();
  const rows: CodeInsert[] = [];
  const links: (typeof CodeTag.$inferInsert)[] = [];

  for (let i = 0; i < count; i++) {
    const type = pickType(r);
    const draft = GENERATORS[type](r);

    // The same gate the API applies on every write, so a generator that drifts
    // out of step with its schema fails the seed rather than the app.
    const content = codeContentSchema.parse(draft.content);

    const id = crypto.randomUUID();
    const category = r.chance(NO_CATEGORY_SHARE) ? null : r.pick(categories);

    rows.push({
      id,
      userId: owner.id,
      name: draft.name,
      medium: "qr",
      mode: pickMode(r, type),
      type: content.type,
      payload: content.payload,
      categoryId: category?.id ?? null,
      slug: generateSlug(),
      createdAt: new Date(now - r.next() * BACKDATE_DAYS * 86_400_000),
    });

    if (r.chance(NO_TAGS_SHARE)) continue;

    // Draw with repeats and let the set collapse them: the composite primary
    // key would reject a duplicate link anyway, and this keeps most codes on
    // the low end of the range, which is where real ones sit.
    const tagIds = new Set<string>();
    for (let n = 0; n <= r.int(MAX_TAGS); n++) tagIds.add(r.pick(tags).id);

    for (const tagId of tagIds) links.push({ codeId: id, tagId });
  }

  const insertedIds = new Set(await insertCodes(db, rows));
  await insertCodeTags(
    db,
    links.filter((link) => insertedIds.has(link.codeId)),
  );

  // What the account actually holds now, seeded or not -- more useful than
  // echoing back the numbers this run intended.
  const [totals] = await db
    .select({
      codes: sql<number>`count(distinct ${Code.id})::int`,
      categorised: sql<number>`(count(distinct ${Code.id}) filter (where ${Code.categoryId} is not null))::int`,
      tagged: sql<number>`count(distinct ${CodeTag.codeId})::int`,
    })
    .from(Code)
    .leftJoin(CodeTag, eq(CodeTag.codeId, Code.id))
    .where(eq(Code.userId, owner.id));

  console.log(
    `Seeded ${insertedIds.size} code(s) for ${owner.email} (random seed ${randomSeed}).\n` +
      `Account now holds ${totals?.codes ?? 0} code(s): ` +
      `${totals?.categorised ?? 0} categorised, ${totals?.tagged ?? 0} tagged.`,
  );
} finally {
  await db.$client.end();
}
