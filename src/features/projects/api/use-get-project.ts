import { useQuery } from '@tanstack/react-query';
import { Apptype } from '@/app/api/[[...route]]/route';
import { hc, InferResponseType } from 'hono/client';
export const client = hc<Apptype>(process.env.NEXT_PUBLIC_APP_URL!);

export type ResponseType=InferResponseType<typeof client.api.projects[':id']['$get'],200>


export const useGetProject = (id: string) => {
  const query = useQuery({
    enabled: !!id, // converting into boolean
    queryKey: ['project/', { id }],
    queryFn: async () => {
      const response = await client.api.projects[':id'].$get({
        param: {
          id,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
