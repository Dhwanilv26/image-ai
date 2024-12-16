import Head from 'next/head';
import { auth } from '@/auth';
import { protectServer } from '@/features/auth/utils';
// credential login always expects json web tokens to grant sessions
export default async function Home() {

  await protectServer();

  const session=await auth();

  return (
    <>
          <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <div className="min-h-screen flex items-center justify-center">
    {JSON.stringify(session)};
    </div>
    </>
   
  );
}
