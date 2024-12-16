'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
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

import { useSignUp } from '../hooks/use-sign-up';

// import { signIn } from '@/auth';
// sign in from auth is only used for server components and not client components

import { signIn } from 'next-auth/react';
import { useState } from 'react';
export const SignUpCard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useSignUp();

  const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          signIn('credentials', {
            email,
            password,
            callbackUrl: '/',
          });
        },
      },
    );
  };

  const onProviderSignUp = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 ">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="space-y-2.5">
          <Input
            disabled={mutation.isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            minLength={3}
            maxLength={20}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={mutation.isPending}
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp('google')}
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Google
          </Button>
          <Button
            disabled={mutation.isPending}
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp('github')}
          >
            <FaGithub className="mr-2 size-5 top-3 left-2.5 absolute" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <Link href="/sign-in" className="text-sky-700 hover:underline">
            <span>Log In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
