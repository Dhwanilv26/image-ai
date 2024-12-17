import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.projects)['$post'],
  200
>; // explicilty converting all response types to a success message even if they contain errors for the corresponding mutation to handle onsucess and onerror 
type RequestType = InferRequestType<
  (typeof client.api.projects)['$post']
>['json'];

export const useCreateProject = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.projects.$post({ json });

      if (!response.ok) {
        throw new Error('Someting went wrong');
      }
      return await response.json();
    },

    onSuccess: () => {
      toast.success('Project created', {
        style: {
          backgroundColor: '#d4edda',
          color: '#155724',
        },
        duration: 3000,
        position: 'top-right',
      });

      // todo : invalidate "projects" query
    },
    onError: () => {
      toast.error('Failed to create project', {
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
