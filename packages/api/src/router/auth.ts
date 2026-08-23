import type { TRPCRouterRecord } from "@trpc/server";

import { getRegistrationStatus } from "@qr-manager/auth/registration";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  /**
   * What the sign-up surfaces should offer: whether this instance still needs
   * its first (admin) account, and whether self-registration is open.
   *
   * Public on purpose — the sign-in page reads it before anyone is signed in.
   * It leaks only whether the instance has been claimed and whether sign-up is
   * open, both of which a visitor discovers by looking at the page anyway.
   */
  registrationStatus: publicProcedure.query(({ ctx }) => {
    return getRegistrationStatus({
      db: ctx.db,
      allowRegistration: ctx.allowRegistration,
    });
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
