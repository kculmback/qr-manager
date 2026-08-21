# syntax=docker/dockerfile:1
#
# Build context is the REPO ROOT, not apps/backend:
#   docker build -f apps/backend/Dockerfile .

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# --- dependencies -----------------------------------------------------------
# Only manifests are copied first, so this layer stays cached until a
# package.json or the lockfile actually changes.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/
COPY packages/ui/package.json packages/ui/
COPY packages/validators/package.json packages/validators/
COPY tooling/eslint/package.json tooling/eslint/
COPY tooling/github/package.json tooling/github/
COPY tooling/prettier/package.json tooling/prettier/
COPY tooling/tailwind/package.json tooling/tailwind/
COPY tooling/typescript/package.json tooling/typescript/
# `--ignore-scripts` skips the root `postinstall` (a network `pnpm dlx`) and any
# dependency install hooks; the native deps in use ship prebuilt binaries.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# --- build ------------------------------------------------------------------
FROM deps AS build
COPY . .
RUN pnpm --filter @qr-manager/backend build

# --- runtime ----------------------------------------------------------------
# tsdown bundles the workspace packages and dependencies into dist/, so the
# final image needs neither node_modules nor the TypeScript sources.
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/packages/db/drizzle ./dist/drizzle

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
