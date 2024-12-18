import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.projects)[':id']['$patch'],
  200
>; // explicilty converting all response types to a success message even if they contain errors for the corresponding mutation to handle onsucess and onerror
type RequestType = InferRequestType<
  (typeof client.api.projects)[':id']['$patch']
>['json'];

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['project', { id }],
    mutationFn: async (json) => {
      const response = await client.api.projects[':id'].$patch({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to update projectt');
      }
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', { id }] });
      //Invalidate the query to ensure the UI fetches and displays the latest project data after the mutation, maintaining consistency between client and server
      // voh query stale ho jaayega, fresh query generate hoga with latest and correct data
      // (ofc on success only)

      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Failed to update project', {
        style: {
          backgroundColor: '#f8d7da',
          color: '#721c24',
        },
        duration: 3000,
        position: 'top-right',
      });
    },
  });
  return mutation;
};
