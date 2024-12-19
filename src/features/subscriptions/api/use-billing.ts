import { useMutation } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.billing)['$post'],
  200
>;

export const useBilling = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.subscriptions.billing.$post();

      if (!response.ok) {
        throw new Error('Failed to create a session');
      }
      return await response.json();
    },

    onSuccess: ({ data }) => {
      window.location.href = data;
    },
    onError: () => {
      toast.error('Failed to create session', {
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
