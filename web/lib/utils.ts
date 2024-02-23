import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextAuthOptions, User, TokenSet } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { boolean } from "zod";
import dayjs from "dayjs";
import _ from "lodash";
import { AdapterUser } from "next-auth/adapters";
import { url } from "inspector";

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
      httpOptions: {
        timeout: 10000,
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
        console.log(credentials, "nwwe", { req });
        const formBody = new FormData();
        formBody.append("email", credentials?.email as string);
        formBody.append("password", credentials?.password as string);
        try {
          let res = null;
          if (req.body?.isInvited && req.body?.isInvited == "true") {
            console.log("if block");
            const formData = {
              email: credentials?.email,
              password: credentials?.password,
              registrationStep: 1,
              invitedUser: true,
            };
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/register`;
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            res = await response.json();
          } else {
            console.log("else block");
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`;
            const response = await fetch(url, {
              method: "POST",
              body: formBody,
            });

            res = await response.json();
          }

          if (!res?.status) {
            console.log("err", res);
            if (res.errors) {
              throw new Error(res.errors.message);
            } else {
              throw new Error(res.message);
            }
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

export const formatReportingPeriod = (from: string, to: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  const fromFormatted = new Intl.DateTimeFormat("en-US", options).format(
    new Date(from)
  );
  const toFormatted = new Intl.DateTimeFormat("en-US", options).format(
    new Date(to)
  );

  return `${fromFormatted} - ${toFormatted}`;
};

export const converPeriodToString = (period: any) => {
  return `${dayjs(period.reporting_period_from).format("MMM YYYY")} - ${dayjs(
    period.reporting_period_to
  ).format("MMM YYYY")}`;
};

export const convertDateToString = (date: any) => {
  return dayjs(date).format("MM/DD/YYYY");
};

export const separateIntoChunks = (arr: any, chunkSize: number) => {
  var chunkSize = chunkSize;
  var chunks = [];
  for (var i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

export const calculateTotals = (projects: any) => {
  const totals: Record<string, number> = {
    tCO2e: 0,
    "Gallons of water": 0,
    "Metric tonnes of waste": 0,
  };

  {
    projects &&
      projects.length > 0 &&
      projects?.forEach((item: any) => {
        const { emission_reductions, emission_unit } = item;
        totals[emission_unit] += emission_reductions;
      });
  }

  return totals;
};

export const formatUrl = (url: string) => {
  if (url) {
    // Remove leading and trailing whitespace
    url = url.trim();
    // Check if the URL starts with 'http://' or 'https://'
    if (!/^https?:\/\//i.test(url)) {
      // If not, assume it's just the domain, so prepend 'http://'
      return "http://" + url;
    }
  }
  return url;
};
