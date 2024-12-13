import { useQuery } from '@tanstack/react-query';
import { Apptype } from '@/app/api/[[...route]]/route';
import { hc } from 'hono/client';
export const client = hc<Apptype>(process.env.NEXT_PUBLIC_APP_URL!);
// creating a hono client and binding it to be of the apptype exported from the routes.ts file

export const useGetImages = () => {
  const query = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await client.api.images.$get();
      // no need of using try catch here .. usequery ka khud ka hi error handling mechanism hai..and its not due to hono..

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
