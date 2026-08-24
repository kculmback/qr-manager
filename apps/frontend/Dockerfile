# syntax=docker/dockerfile:1
#
# Build context is the REPO ROOT, not apps/frontend:
#   docker build -f apps/frontend/Dockerfile .

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# --- dependencies -----------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/
COPY packages/ui/package.json packages/ui/
COPY packages/validators/package.json packages/validators/
COPY tooling/eslint/package.json tooling/eslint/
COPY tooling/github/package.json tooling/github/
COPY tooling/prettier/package.json tooling/prettier/
COPY tooling/typescript/package.json tooling/typescript/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# --- build ------------------------------------------------------------------
FROM deps AS build
# Vite inlines client-side env at BUILD time. Leaving this empty makes the
# bundle call the backend on its own origin, which keeps the image portable —
# set it only when the backend lives on a different domain than the frontend.
ARG VITE_BACKEND_URL=""
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
COPY . .
RUN pnpm --filter @qr-manager/frontend build

# --- runtime ----------------------------------------------------------------
# Nitro emits a self-contained server bundle: no node_modules needed. That
# holds only because `ssr.noExternal` in vite.config.ts inlines the
# dependencies -- without it the server starts and 500s on every page.
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

COPY --from=build /app/apps/frontend/.output ./.output

USER node
EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
