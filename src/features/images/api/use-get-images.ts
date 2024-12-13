import { useQuery } from '@tanstack/react-query';
import { Apptype } from '@/app/api/[[...route]]/route';
import { hc } from 'hono/client';
export const client = hc<Apptype>(process.env.NEXT_PUBLIC_APP_URL!);

export const useGetImages = () => {
  const query = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await client.api.images.$get();
        // cant use try catch blocks here.. 
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const {data}=await response.json();
      return data;
    },
  });

  return query;
};
