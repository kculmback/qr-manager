import { authRouter } from "./router/auth";
import { codeRouter } from "./router/code";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  code: codeRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
