import NextAuth from 'next-auth';
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub], // reads the github id and github secret from the .env file
});
