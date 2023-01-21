import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ account }) {
      if (!account?.providerAccountId) return false;
      const authorizedEmails = env.AUTHORIZED_EMAILS?.split(",");
      if (authorizedEmails?.includes(account?.providerAccountId)) return true;
      return false;
    },
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);
