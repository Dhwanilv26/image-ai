import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.users)['$post']>;
type RequestType = InferRequestType<(typeof client.api.users)['$post']>['json'];

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.users.$post({ json });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success('User created', {
        style: {
          backgroundColor: '#d4edda',
          color: '#155724',
        },
        duration: 3000,
        position:'top-right'
      });
    },
    onError: () => {
      toast.error('Duplicate login credentials', {
        style: { 
          backgroundColor: '#f8d7da',
          color: '#721c24',
        },
        duration: 3000,
        position:'top-right'
        
      });
    },
  });
  return mutation;
};
