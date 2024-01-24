import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile, tokens) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
          socialLoginToken: tokens.id_token,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },
      async authorize(credentials, req) {
        const formBody = new FormData();
        formBody.append("email", credentials?.email as string);
        formBody.append("password", credentials?.password as string);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`;
        try {
          const response = await fetch(url, {
            method: "POST",
            body: formBody,
          });

          const res = await response.json();

          console.log("ress => ", res);
          if (!res?.status) {
            console.log("err", res.message);
            throw new Error(res.message);
          }

          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, account }) {
      console.log({ token, user, session });
      if (user) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-signup`;
        if (account?.provider != "credentials") {
          console.log("tttokenk =====> ", user);
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              ...user,
              loginType:
                account?.provider == "azure-ad"
                  ? "microsoft"
                  : account?.provider,
            }),
          });

          const userD = await res.json();
          console.log(userD);
        }
      }

      return { ...token, ...user };
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
