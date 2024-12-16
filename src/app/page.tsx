import Head from 'next/head';
import { auth } from '@/auth';
import { protectServer } from '@/features/auth/utils';
export default async function Home() {

  await protectServer();
  return (
    <>
          <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <div className="min-h-screen flex items-center justify-center">
     You are logged in
    </div>
    </>
   
  );
}
