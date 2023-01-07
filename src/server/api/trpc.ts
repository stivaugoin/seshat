import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { prisma } from "../db";

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = async (_opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  return await createInnerTRPCContext({});
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
