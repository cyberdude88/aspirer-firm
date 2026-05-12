import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

type GoogleJwt = JWT & {
  googleAccessToken?: string;
  googleRefreshToken?: string;
};

type GoogleSession = Session & {
  googleAccessToken?: string;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  providers: [
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
  ],
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
