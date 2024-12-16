'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

// import { signIn } from '@/auth';
// sign in from auth is only used for server components and not client components

import { signIn } from 'next-auth/react';
export const SignInCard = () => {
  const onproviderSignIn = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 ">
        <CardTitle>Login in to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onproviderSignIn('google')}
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onproviderSignIn('github')}
          >
            <FaGithub className="mr-2 size-5 top-3 left-2.5 absolute" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <Link href="/sign-up" className="text-sky-700 hover:underline">
            <span>Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
