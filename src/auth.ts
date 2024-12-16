import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from './db/drizzle';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  // redirects everyone to sign in first and overrides the default sign in page
});
