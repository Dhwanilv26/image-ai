import Head from 'next/head';
import { auth } from '@/auth';
export default async function Home() {

  const session=await auth();
  return (
    <>
          <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <div className="min-h-screen flex items-center justify-center">
     {JSON.stringify(session)}
    </div>
    </>
   
  );
}
