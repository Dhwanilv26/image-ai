import { useInfiniteQuery } from '@tanstack/react-query';
import { Apptype } from '@/app/api/[[...route]]/route';
import { hc, InferResponseType } from 'hono/client';
export const client = hc<Apptype>(process.env.NEXT_PUBLIC_APP_URL!);

export type ResponseType = InferResponseType<
  (typeof client.api.projects)['$get'],
  200
>;

export const useGetProjects = () => {
  const query = useInfiniteQuery<ResponseType, Error>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: ['projects'],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.projects.$get({
        query: {
          page: (pageParam as number).toString(),
          limit: '5',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return response.json();
    },
  });

  return query;
};
