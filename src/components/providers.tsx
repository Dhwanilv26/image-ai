'use client';
// this doesnt make anything a client component
// it is a method to inject server components inside existing client components

import { QueryProvider } from './query-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};


// exporting all the providers here.. query provider is one of them