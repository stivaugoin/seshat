import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { type AppRouter } from "../server/trpc/router";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }),
        loggerLink({ enabled: () => process.env.NODE_ENV === "development" }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
