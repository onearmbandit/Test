import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextAuthOptions, User, TokenSet } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { boolean } from "zod";
import _ from "lodash";
import { AdapterUser } from "next-auth/adapters";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ExtendedUser = (User | AdapterUser) & { code: any };
type ExtendedToken = TokenSet & { code: { user: any } };

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
      httpOptions: {
        timeout: 10000,
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profile(profile, tokens) {
        // console.log({ tokens, profile });
        const name = profile.name.split(" ");
        return {
          ...profile,
          id: profile.sub,
          firstName: name[0],
          lastName: name[-1],
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

          if (!res?.status) {
            console.log("err", res.message);
            throw new Error(res.message);
          }

          // console.log("ress => ", res);
          return res.data;
        } catch (error: any) {
          console.log(error);
          throw new Error(error || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, account, trigger }) {
      if (trigger == "update" && session.orgs) {
        (token.code as ExtendedToken) = {
          ...(token.code as ExtendedToken),
          user: {
            ...((token.code as ExtendedToken).user as ExtendedToken),
            organizations: session.orgs,
          },
        };
      }

      // console.log("jwt ==> ", { token });
      return { ...token, ...user };
    },
    async signIn({ user, account, email, credentials, profile }) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-signup`;

      if (account?.provider != "credentials") {
        try {
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
          (user as ExtendedUser).code = userD.data;

          return true;
        } catch (err: any) {
          console.log({ err });
          throw new Error(err);
        }
      }
      return true;
    },
    async session({ session, token, trigger, user, newSession }) {
      const loginData: any = _.cloneDeep(token.code);

      return { ...session, ...token, ...loginData };
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

export const formatAddress = (address: any) => {
  // Split the address into components
  let addressComponents = address?.split(",");

  // Extract components
  let streetAddress = addressComponents[0]?.trim();
  let floor = addressComponents[1]?.trim();
  let cityStateZip = addressComponents[2]?.trim();
  let country = addressComponents[addressComponents.length - 1].trim();

  // Construct formatted address
  let formattedAddress = `${streetAddress},\n${floor},\n${cityStateZip},\n${country}`;

  return formattedAddress;
};

export const isSuperAdmin = (rolesArray: any, roleName: string) => {
  return rolesArray?.some((role: any) => role.name === roleName);
};
