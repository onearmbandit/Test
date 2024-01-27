import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** User's ID. */
      id: string;
      /** User's first name. */
      first_name: string;
      /** User's last name. */
      last_name: string;
      /** User's slug. */
      slug: string;
      /** User's email. */
      email: string;
      /** Timestamp when the email was verified. */
      email_verified_at: string | null;
      /** Token for email verification. */
      email_verify_token: string;
      /** User's status. */
      user_status: number;
      /** Token for user authentication. */
      remember_token: string | null;
      /** Timestamp when the remember token expires. */
      remember_token_expires: string | null;
      /** User's timezone. */
      timezone: string | null;
      /** Type of login used by the user. */
      login_type: string | null;
      /** Token for social login. */
      social_login_token: string | null;
      /** Registration step. */
      registration_step: string;
      /** Timestamp when the user was created. */
      created_at: string;
      /** Timestamp when the user was last updated. */
      updated_at: string;
      /** User's roles. */
      roles: {
        id: string;
        name: string;
      }[];
      /** User's organizations. */
      organizations: {
        id: string;
        name: string;
      }[];
    };
    token: {
      type: string;
      token: string;
      expires_at: string;
    };
    iat: number;
    exp: number;
    jti: string;
  }
}
