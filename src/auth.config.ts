/* eslint-disable @typescript-eslint/no-unused-vars */
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from './db/drizzle';
import { z } from 'zod';
import { JWT } from 'next-auth/jwt';

import type { NextAuthConfig } from 'next-auth';

import bcrypt from 'bcryptjs';

import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// Zod schema for validation
const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Extending the JWT module for additional properties
declare module 'next-auth/jwt' {
  interface JWT {
    id: string | undefined;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string | undefined;
  }
}

export default {
  adapter: DrizzleAdapter(db), // Connect Drizzle ORM
  providers: [
    // Credentials Provider
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        // Check if the user exists in the database
        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        if (!user || !user.password) {
          return null;
        }

        // Verify the password
        const isPasswordsMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordsMatch) {
          return null;
        }

        return user; // Return user if authenticated
      },
    }),

    GitHub,
    Google,
  ],

  // Custom sign-in and error pages
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  // Use JWT-based sessions
  session: {
    strategy: 'jwt',
  },

  // Callbacks for extending JWT and session
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
