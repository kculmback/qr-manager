import { authRouter } from "./router/auth";
import { codeRouter } from "./router/code";
import { postRouter } from "./router/post";
import { taxonomyRouter } from "./router/taxonomy";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  code: codeRouter,
  post: postRouter,
  taxonomy: taxonomyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
