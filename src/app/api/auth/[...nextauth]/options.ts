import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getAuthSecret } from "@/lib/auth-secret";
import { isValidAdminCredential } from "@/lib/admin-auth";

type GoogleJwt = JWT & {
  googleAccessToken?: string;
  googleRefreshToken?: string;
};

type GoogleSession = Session & {
  googleAccessToken?: string;
};

const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const providers: NextAuthOptions["providers"] = [];

if (hasGoogle) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  );
}

providers.push(
  Credentials({
    id: "admin-password",
    name: "Admin password",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const adminEmail = isValidAdminCredential(credentials?.username, credentials?.password);
      if (!adminEmail) return null;
      return { id: adminEmail, email: adminEmail, name: "Admin" };
    },
  }),
);

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  pages: {
    signIn: "/signin",
  },
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      const nextToken = token as GoogleJwt;
      if (account?.access_token) nextToken.googleAccessToken = account.access_token;
      if (account?.refresh_token) nextToken.googleRefreshToken = account.refresh_token;
      return nextToken;
    },
    async session({ session, token }) {
      const nextSession = session as GoogleSession;
      nextSession.googleAccessToken = (token as GoogleJwt).googleAccessToken;
      return nextSession;
    },
  },
};
